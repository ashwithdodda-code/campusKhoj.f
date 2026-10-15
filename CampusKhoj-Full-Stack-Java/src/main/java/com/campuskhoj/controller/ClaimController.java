package com.campuskhoj.controller;

import com.campuskhoj.dto.ApiResponseDto;
import com.campuskhoj.dto.ClaimRequestDto;
import com.campuskhoj.model.Claim;
import com.campuskhoj.model.User;
import com.campuskhoj.service.LostFoundService;
import com.campuskhoj.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final LostFoundService lostFoundService;
    private final UserService userService;

    public ClaimController(LostFoundService lostFoundService, UserService userService) {
        this.lostFoundService = lostFoundService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<ApiResponseDto<Claim>> submitClaim(
            @Valid @RequestBody ClaimRequestDto request,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletRequest httpRequest) {
        User user = resolveUser(authHeader, httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponseDto.error("Authentication required to file a claim"));
        }

        Claim claim = lostFoundService.submitClaim(
                request.getItemId(),
                user,
                request.getProofDescription(),
                request.getContactPhone()
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseDto.ok("Claim submitted successfully. Under Admin Review.", claim));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponseDto<List<Claim>>> getMyClaims(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletRequest httpRequest) {
        User user = resolveUser(authHeader, httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponseDto.error("Authentication required"));
        }

        List<Claim> myClaims = lostFoundService.getClaimsForUser(user.getUserId());
        return ResponseEntity.ok(ApiResponseDto.ok("Your claims history", myClaims));
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
