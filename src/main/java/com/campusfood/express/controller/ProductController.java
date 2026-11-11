package com.campusfood.express.controller;

import com.campusfood.express.dto.ApiResponse;
import com.campusfood.express.entity.Category;
import com.campusfood.express.entity.Product;
import com.campusfood.express.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    // API Lấy danh sách danh mục (Cơm, Bún/Phở, Đồ uống, Ăn vặt)
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<Category>>> getCategories() {
        List<Category> categories = productService.getAllCategories();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh mục thành công", categories));
    }

    // API Lấy danh sách món ăn (Hỗ trợ Search, Filter, Sort)
    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sortBy // asc hoặc desc
    ) {
        List<Product> products = productService.getProducts(categoryId, keyword, sortBy);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách món ăn thành công", products));
    }
}