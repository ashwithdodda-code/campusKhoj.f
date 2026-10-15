package com.campuskhoj.controller;

import com.campuskhoj.dto.ApiResponseDto;
import com.campuskhoj.dto.LoginRequestDto;
import com.campuskhoj.dto.UserRegisterDto;
import com.campuskhoj.model.User;
import com.campuskhoj.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> login(
            @Valid @RequestBody LoginRequestDto request,
            HttpServletRequest httpRequest) {
        User user = userService.login(request.getEmail(), request.getPassword());
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute("USER_ID", user.getUserId());
        session.setAttribute("USER_ROLE", user.getRole());

        String token = userService.createSession(user);

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("userId", user.getUserId());
        data.put("name", user.getName());
        data.put("email", user.getEmail());
        data.put("role", user.getRole());
        data.put("collegeId", user.getCollegeId());
        data.put("canApproveClaims", user.canApproveClaims());

        return ResponseEntity.ok(ApiResponseDto.ok("Authentication successful", data));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> register(
            @Valid @RequestBody UserRegisterDto request) {
        User user;
        if ("STAFF".equalsIgnoreCase(request.getRole())) {
            user = userService.registerStaff(
                    request.getName(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getCollegeId(),
                    request.getDepartment() != null ? request.getDepartment() : "General Staff",
                    "Campus Staff"
            );
        } else {
            // Default to Student
            int year = request.getYearOfStudy() != null ? request.getYearOfStudy() : 1;
            user = userService.registerStudent(
                    request.getName(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getCollegeId(),
                    request.getDepartment() != null ? request.getDepartment() : "Undergraduate",
                    year
            );
        }

        String token = userService.createSession(user);

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("userId", user.getUserId());
        data.put("name", user.getName());
        data.put("email", user.getEmail());
        data.put("role", user.getRole());
        data.put("collegeId", user.getCollegeId());
        data.put("canApproveClaims", user.canApproveClaims());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseDto.ok("Registration completed successfully", data));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> getCurrentUser(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletRequest request) {
        User user = resolveUser(authHeader, request);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponseDto.error("Not authenticated"));
        }

        Map<String, Object> data = new HashMap<>();
        data.put("userId", user.getUserId());
        data.put("name", user.getName());
        data.put("email", user.getEmail());
        data.put("role", user.getRole());
        data.put("collegeId", user.getCollegeId());
        data.put("department", user.getDepartmentOrBranch());
        data.put("canApproveClaims", user.canApproveClaims());

        return ResponseEntity.ok(ApiResponseDto.ok("User profile retrieved", data));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponseDto<Void>> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletRequest request) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            userService.invalidateSession(token);
        }
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok(ApiResponseDto.ok("Session invalidated", null));
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
