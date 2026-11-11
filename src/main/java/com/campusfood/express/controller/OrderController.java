package com.campusfood.express.controller;

import com.campusfood.express.dto.ApiResponse;
import com.campusfood.express.dto.CreateOrderRequest;
import com.campusfood.express.entity.Order;
import com.campusfood.express.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    // API Tạo đơn hàng
    @PostMapping
    public ResponseEntity<ApiResponse<Order>> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        Order order = orderService.createOrder(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đặt hàng thành công!", order));
    }

    // API Xem lịch sử đơn hàng của Sinh viên
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Order>>> getMyOrders(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersByUser(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách đơn hàng thành công", orders));
    }

    // API Hủy đơn hàng
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<ApiResponse<Order>> cancelOrder(@PathVariable Long orderId, @RequestParam Long userId) {
        try {
            Order order = orderService.cancelOrder(orderId, userId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Hủy đơn hàng thành công!", order));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}