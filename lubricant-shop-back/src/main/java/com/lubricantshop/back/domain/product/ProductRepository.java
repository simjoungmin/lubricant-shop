package com.lubricantshop.back.domain.product;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsByProductName(String productName);

    List<Product> findByDeletedFalseOrderByProductIdAsc();
}
