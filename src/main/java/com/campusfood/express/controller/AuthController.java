package com.campusfood.express.controller;

import com.campusfood.express.dto.ApiResponse;
import com.campusfood.express.dto.LoginRequest;
import com.campusfood.express.dto.RegisterRequest;
import com.campusfood.express.entity.User;
import com.campusfood.express.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Cho phép Frontend gọi API
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = authService.register(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Đăng ký tài khoản thành công!", user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<User>> login(@Valid @RequestBody LoginRequest request) {
        try {
            User user = authService.login(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Đăng nhập thành công!", user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}