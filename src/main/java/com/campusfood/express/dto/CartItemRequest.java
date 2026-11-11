package com.campusfood.express.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CartItemRequest {
    @NotNull(message = "Product ID không được để trống")
    private Long productId;

    @Min(value = 1, message = "Số lượng tối thiểu là 1")
    @Max(value = 999, message = "Số lượng tối đa là 99")
    private Integer quantity;
}