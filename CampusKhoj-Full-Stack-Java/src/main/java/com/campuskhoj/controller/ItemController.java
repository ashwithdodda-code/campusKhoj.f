package com.campuskhoj.controller;

import com.campuskhoj.dto.ApiResponseDto;
import com.campuskhoj.dto.ItemRequestDto;
import com.campuskhoj.model.FoundItem;
import com.campuskhoj.model.Item;
import com.campuskhoj.model.LostItem;
import com.campuskhoj.model.User;
import com.campuskhoj.model.enums.Category;
import com.campuskhoj.model.enums.ItemStatus;
import com.campuskhoj.service.LostFoundService;
import com.campuskhoj.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final LostFoundService lostFoundService;
    private final UserService userService;

    public ItemController(LostFoundService lostFoundService, UserService userService) {
        this.lostFoundService = lostFoundService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponseDto<List<Item>>> getAllItems(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) ItemStatus status,
            @RequestParam(required = false) String type) {
        List<Item> results;
        if (search == null && category == null && location == null && status == null && type == null) {
            results = lostFoundService.getAllItems();
        } else {
            results = lostFoundService.search(search, category, location, status, type);
        }
        return ResponseEntity.ok(ApiResponseDto.ok("Items retrieved", results));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDto<Item>> getItemById(@PathVariable String id) {
        Item item = lostFoundService.getItemOrThrow(id);
        return ResponseEntity.ok(ApiResponseDto.ok("Item retrieved", item));
    }

    @PostMapping("/lost")
    public ResponseEntity<ApiResponseDto<LostItem>> reportLost(
            @Valid @RequestBody ItemRequestDto request,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletRequest httpRequest) {
        User user = resolveUser(authHeader, httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponseDto.error("You must be logged in to report a lost item"));
        }

        LocalDate date = request.getIncidentDate() != null ? request.getIncidentDate() : LocalDate.now();
        LostItem item = lostFoundService.reportLostItem(
                request.getName(),
                request.getCategory(),
                request.getDescription(),
                request.getLocation(),
                date,
                user
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseDto.ok("Lost item reported successfully", item));
    }

    @PostMapping("/found")
    public ResponseEntity<ApiResponseDto<FoundItem>> registerFound(
            @Valid @RequestBody ItemRequestDto request,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletRequest httpRequest) {
        User user = resolveUser(authHeader, httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponseDto.error("You must be logged in to register a found item"));
        }

        LocalDate date = request.getIncidentDate() != null ? request.getIncidentDate() : LocalDate.now();
        FoundItem item = lostFoundService.registerFoundItem(
                request.getName(),
                request.getCategory(),
                request.getDescription(),
                request.getLocation(),
                date,
                user,
                request.getStorageLocation()
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseDto.ok("Found item registered successfully", item));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponseDto<List<Item>>> getMyItems(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletRequest httpRequest) {
        User user = resolveUser(authHeader, httpRequest);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponseDto.error("Authentication required"));
        }

        List<Item> myItems = lostFoundService.getAllItems().stream()
                .filter(i -> user.getUserId().equals(i.getReportedByUserId()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponseDto.ok("Your submitted items", myItems));
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
