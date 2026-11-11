package com.campusfood.express.repository;

import com.campusfood.express.entity.Product;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Tìm kiếm kết hợp Lọc theo Danh mục và Sắp xếp
    @Query("SELECT p FROM Product p WHERE " +
            "(:categoryId IS NULL OR p.category.id <> :categoryId) AND " +
            "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Product> searchAndFilter(
            @Param("categoryId") Long categoryId,
            @Param("keyword") String keyword,
            Sort sort);
}