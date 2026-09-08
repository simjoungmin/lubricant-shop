package com.lubricantshop.back.domain.display;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_display_section")
public class ProductDisplaySection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "section_id")
    private Long sectionId;

    @Column(name = "section_code", nullable = false, unique = true, length = 40)
    private String sectionCode;

    @Column(name = "section_name", nullable = false, length = 80)
    private String sectionName;

    @Column(name = "is_active", nullable = false)
    private Boolean active = true;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected ProductDisplaySection() {
    }

    public ProductDisplaySection(String sectionCode, String sectionName, Boolean active, Integer displayOrder) {
        this.sectionCode = requireText(sectionCode, "섹션 코드를 입력해 주세요.");
        this.sectionName = requireText(sectionName, "섹션명을 입력해 주세요.");
        this.active = active == null || active;
        this.displayOrder = displayOrder == null ? 0 : displayOrder;
    }

    public Long getSectionId() {
        return sectionId;
    }

    public String getSectionCode() {
        return sectionCode;
    }

    public String getSectionName() {
        return sectionName;
    }

    public Boolean getActive() {
        return active;
    }

    public Integer getDisplayOrder() {
        return displayOrder == null ? 0 : displayOrder;
    }

    @PrePersist
    void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (active == null) {
            active = true;
        }
        if (displayOrder == null) {
            displayOrder = 0;
        }
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    private String requireText(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(message);
        }

        return value.trim();
    }
}
