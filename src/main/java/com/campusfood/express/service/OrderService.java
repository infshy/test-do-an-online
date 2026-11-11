package com.campusfood.express.service;

import com.campusfood.express.dto.CartItemRequest;
import com.campusfood.express.dto.CreateOrderRequest;
import com.campusfood.express.entity.*;
import com.campusfood.express.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        Order order = Order.builder()
                .userId(request.getUserId())
                .deliveryLocation(request.getDeliveryLocation())
                .note(request.getNote())
                .paymentMethod(request.getPaymentMethod())
                .status("Đang xử lý")
                .build();

        for (CartItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Món ăn không tồn tại ID: " + itemReq.getProductId()));

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .price(product.getPrice())
                    .build();

            orderItems.add(orderItem);
        }

        // Xử lý mã giảm giá (VD: SV2026 - Giảm 10%)
        if ("QR Demo".equals(request.getPaymentMethod())) {
            // Nội dung chuyển khoản QR lấy từ ghi chú
            String transferContent = request.getNote().isEmpty() ? null : request.getNote();
            order.setNote(transferContent.toUpperCase());
        }

        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            Coupon coupon = couponRepository.findByCodeAndIsActiveTrue(request.getCouponCode().trim())
                    .orElseThrow(() -> new RuntimeException("Mã giảm giá không hợp lệ hoặc đã hết hạn"));

            discountAmount = subtotal.multiply(BigDecimal.valueOf(coupon.getDiscountPercent()))
                    .divide(BigDecimal.valueOf(1000));
        }

        BigDecimal totalAmount = subtotal.subtract(discountAmount);

        order.setSubtotal(subtotal);
        order.setDiscountAmount(discountAmount);
        order.setTotalAmount(totalAmount);
        order.setOrderItems(orderItems);

        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền thao tác trên đơn hàng này");
        }

        // Ràng buộc nghiệp vụ SRS: Chỉ hủy được khi đơn ở trạng thái "Đang xử lý"
        if ("Đã hoàn thành".equalsIgnoreCase(order.getStatus()) || "Đã hủy".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Không thể hủy! Đơn hàng đã ở trạng thái: " + order.getStatus());
        }

        order.setStatus("Đã hủy");
        return orderRepository.save(order);
    }
}