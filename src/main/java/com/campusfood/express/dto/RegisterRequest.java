package com.campusfood.express.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Họ và tên không được để trống")
    private String fullName;

    @NotBlank(message = "Email không được để trống")
    @Pattern(
        regexp = "^[A-Za-z0-9._%+-]+@.*(edu\\.vn|vju\\.ac\\.vn)$", 
        message = "Email phải đúng định dạng sinh viên (*@edu.vn hoặc *@vju.ac.vn)"
    )
    private String email;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^[0-9]{10}$", message = "Số điện thoại phải đúng 10 chữ số")
    private String phone;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải chứa ít nhất 6 ký tự")
    private String password;
}