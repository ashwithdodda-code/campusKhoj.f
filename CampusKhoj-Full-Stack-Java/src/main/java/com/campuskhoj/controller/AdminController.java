package com.campuskhoj.controller;

import com.campuskhoj.dto.ApiResponseDto;
import com.campuskhoj.dto.ClaimReviewDto;
import com.campuskhoj.model.Claim;
import com.campuskhoj.model.Item;
import com.campuskhoj.model.User;
import com.campuskhoj.model.enums.ClaimStatus;
import com.campuskhoj.model.enums.ItemStatus;
import com.campuskhoj.service.LostFoundService;
import com.campuskhoj.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final LostFoundService lostFoundService;
    private final UserService userService;

    public AdminController(LostFoundService lostFoundService, UserService userService) {
        this.lostFoundService = lostFoundService;
        this.userService = userService;
    }

    @GetMapping("/claims")
    public ResponseEntity<ApiResponseDto<List<Claim>>> getAllClaims(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletRequest httpRequest) {
        User user = requireAdmin(authHeader, httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponseDto.error("Administrator privileges required"));
        }
        return ResponseEntity.ok(ApiResponseDto.ok("All claims for admin review", lostFoundService.getAllClaims()));
    }

    @PostMapping("/claims/{claimId}/review")
    public ResponseEntity<ApiResponseDto<Claim>> reviewClaim(
            @PathVariable String claimId,
            @Valid @RequestBody ClaimReviewDto reviewDto,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletRequest httpRequest) {
        User admin = requireAdmin(authHeader, httpRequest);
        if (admin == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponseDto.error("Administrator privileges required to review claims"));
        }

        Claim updated = lostFoundService.reviewClaim(claimId, admin, reviewDto.getApprove(), reviewDto.getReason());
        return ResponseEntity.ok(ApiResponseDto.ok("Claim reviewed: " + updated.getStatus(), updated));
    }

    @PostMapping("/claims/{claimId}/handover")
    public ResponseEntity<ApiResponseDto<Claim>> confirmHandover(
            @PathVariable String claimId,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletRequest httpRequest) {
        User admin = requireAdmin(authHeader, httpRequest);
        if (admin == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponseDto.error("Administrator privileges required for handover confirmation"));
        }

        Claim updated = lostFoundService.confirmHandover(claimId, admin);
        return ResponseEntity.ok(ApiResponseDto.ok("Item handover confirmed. Status updated to RETURNED.", updated));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> getDashboardStats() {
        List<Item> items = lostFoundService.getAllItems();
        List<Claim> claims = lostFoundService.getAllClaims();
        List<User> users = userService.getAllUsers();

        long lostCount = items.stream().filter(i -> "LOST".equalsIgnoreCase(i.getType())).count();
        long foundCount = items.stream().filter(i -> "FOUND".equalsIgnoreCase(i.getType())).count();
        long returnedCount = items.stream().filter(i -> i.getStatus() == ItemStatus.RETURNED).count();
        long pendingClaims = claims.stream().filter(c -> c.getStatus() == ClaimStatus.PENDING).count();
        long approvedClaims = claims.stream().filter(c -> c.getStatus() == ClaimStatus.APPROVED).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", users.size());
        stats.put("totalLostItems", lostCount);
        stats.put("totalFoundItems", foundCount);
        stats.put("totalReturnedItems", returnedCount);
        stats.put("pendingClaims", pendingClaims);
        stats.put("approvedClaims", approvedClaims);
        stats.put("systemUptime", "Healthy");

        return ResponseEntity.ok(ApiResponseDto.ok("System statistics", stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponseDto<List<User>>> getRegisteredUsers(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletRequest httpRequest) {
        User user = requireAdmin(authHeader, httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponseDto.error("Administrator privileges required"));
        }
        return ResponseEntity.ok(ApiResponseDto.ok("Registered campus members", userService.getAllUsers()));
    }

    private User requireAdmin(String authHeader, HttpServletRequest request) {
        User user = resolveUser(authHeader, request);
        if (user != null && user.canApproveClaims()) {
            return user;
        }
        return null;
    }

    private User resolveUser(String authHeader, HttpServletRequest request) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            var opt = userService.getUserBySession(token);
            if (opt.isPresent()) return opt.get();
        }
        HttpSession session = request.getSession(false);
        if (session != null) {
            String uid = (String) session.getAttribute("USER_ID");
            if (uid != null) {
                return userService.findById(uid).orElse(null);
            }
        }
        return null;
    }
}
