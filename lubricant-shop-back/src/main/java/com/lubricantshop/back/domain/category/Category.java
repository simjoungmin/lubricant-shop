package com.lubricantshop.back.domain.category;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

// 상품을 엔진오일, 필터처럼 분류하기 위한 카테고리 엔티티입니다.
@Entity
@Table(name = "category")
public class Category {

    // 카테고리 고유 ID입니다.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    // 화면에 표시되는 카테고리명입니다.
    @Column(name = "category_name", nullable = false, length = 80)
    private String categoryName;

    // 상위 카테고리입니다. 값이 없으면 최상위 카테고리입니다.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

    // 같은 깊이의 카테고리끼리 정렬할 때 사용하는 순서입니다.
    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    // 카테고리 노출/사용 여부입니다.
    @Column(name = "is_active", nullable = false)
    private Boolean active = true;

    // 카테고리 생성 시각입니다.
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // 카테고리 마지막 수정 시각입니다.
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected Category() {
    }

    @PrePersist
    void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
