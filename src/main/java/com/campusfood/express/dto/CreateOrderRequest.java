package com.campusfood.express.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {
    @NotNull(message = "User ID không được để trống")
    private Long userId;

    @NotBlank(message = "Vui lòng chọn địa điểm nhận hàng")
    private String deliveryLocation;

    private String note;

    @NotBlank(message = "Vui lòng chọn phương thức thanh toán")
    private String paymentMethod; // COD hoặc QR Demo

    private String couponCode; // Có thể để trống nếu không dùng

    @NotEmpty(message = "Giỏ hàng không được để trống")
    @Valid
    private List<CartItemRequest> items;
}