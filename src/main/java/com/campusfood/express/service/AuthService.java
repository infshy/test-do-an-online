package com.campusfood.express.service;

import com.campusfood.express.dto.LoginRequest;
import com.campusfood.express.dto.RegisterRequest;
import com.campusfood.express.entity.User;
import com.campusfood.express.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại trong hệ thống");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(request.getPassword()) // Lưu ý: thực tế nên mã hóa bằng PasswordEncoder
                .build();

        return userRepository.save(user);
    }

    public User login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Email hoặc mật khẩu không chính xác");
        }

        return user;
    }
}