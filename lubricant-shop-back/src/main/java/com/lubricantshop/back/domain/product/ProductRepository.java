package com.lubricantshop.back.domain.product;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsByProductName(String productName);

    List<Product> findByDeletedFalseOrderByProductIdAsc();

    @Query("""
            select p
            from Product p
            where p.deleted = false
              and p.saleStatus = :saleStatus
              and (:hasCategory = false or replace(replace(replace(lower(coalesce(p.basicInfo.category, '')), ' ', ''), '-', ''), '/', '') in :categories)
              and (:hasSubCategory = false
                   or (:isBrandSubCategory = true and p.basicInfo.brand is not null and trim(p.basicInfo.brand) <> '')
                   or replace(replace(replace(lower(coalesce(p.basicInfo.subCategory, '')), ' ', ''), '-', ''), '/', '') = :subCategory
                   or replace(replace(replace(lower(coalesce(p.basicInfo.viscosity, '')), ' ', ''), '-', ''), '/', '') = :subCategory
                   or replace(replace(replace(lower(coalesce(p.basicInfo.specification, '')), ' ', ''), '-', ''), '/', '') like :subCategoryKeyword
                   or replace(replace(replace(lower(coalesce(p.basicInfo.productName, '')), ' ', ''), '-', ''), '/', '') like :subCategoryKeyword
                   or replace(replace(replace(lower(concat(
                        coalesce(p.basicInfo.productName, ''), ' ',
                        coalesce(p.basicInfo.brand, ''), ' ',
                        coalesce(p.basicInfo.productDescription, ''), ' ',
                        coalesce(p.basicInfo.specification, ''), ' ',
                        coalesce(p.basicInfo.viscosity, '')
                   )), ' ', ''), '-', ''), '/', '') like :subCategoryKeyword1
                   or replace(replace(replace(lower(concat(
                        coalesce(p.basicInfo.productName, ''), ' ',
                        coalesce(p.basicInfo.brand, ''), ' ',
                        coalesce(p.basicInfo.productDescription, ''), ' ',
                        coalesce(p.basicInfo.specification, ''), ' ',
                        coalesce(p.basicInfo.viscosity, '')
                   )), ' ', ''), '-', ''), '/', '') like :subCategoryKeyword2
                   or replace(replace(replace(lower(concat(
                        coalesce(p.basicInfo.productName, ''), ' ',
                        coalesce(p.basicInfo.brand, ''), ' ',
                        coalesce(p.basicInfo.productDescription, ''), ' ',
                        coalesce(p.basicInfo.specification, ''), ' ',
                        coalesce(p.basicInfo.viscosity, '')
                   )), ' ', ''), '-', ''), '/', '') like :subCategoryKeyword3
                   or replace(replace(replace(lower(concat(
                        coalesce(p.basicInfo.productName, ''), ' ',
                        coalesce(p.basicInfo.brand, ''), ' ',
                        coalesce(p.basicInfo.productDescription, ''), ' ',
                        coalesce(p.basicInfo.specification, ''), ' ',
                        coalesce(p.basicInfo.viscosity, '')
                   )), ' ', ''), '-', ''), '/', '') like :subCategoryKeyword4
                   or replace(replace(replace(lower(concat(
                        coalesce(p.basicInfo.productName, ''), ' ',
                        coalesce(p.basicInfo.brand, ''), ' ',
                        coalesce(p.basicInfo.productDescription, ''), ' ',
                        coalesce(p.basicInfo.specification, ''), ' ',
                        coalesce(p.basicInfo.viscosity, '')
                   )), ' ', ''), '-', ''), '/', '') like :subCategoryKeyword5)
              and (:hasBrand = false or replace(replace(replace(lower(coalesce(p.basicInfo.brand, '')), ' ', ''), '-', ''), '/', '') = :brand)
              and (:hasKeyword = false
                   or replace(replace(replace(lower(concat(
                        coalesce(p.basicInfo.productName, ''), ' ',
                        coalesce(p.basicInfo.brand, ''), ' ',
                        coalesce(p.basicInfo.category, ''), ' ',
                        coalesce(p.basicInfo.productDescription, ''), ' ',
                        coalesce(p.basicInfo.viscosity, ''), ' ',
                        coalesce(p.basicInfo.specification, ''), ' ',
                        coalesce(p.basicInfo.volume, '')
                   )), ' ', ''), '-', ''), '/', '') like :keyword)
              and (:hasFuelType = false
                   or (:fuelType = 'gasoline' and (
                        lower(coalesce(p.basicInfo.productName, '')) like '%gasoline%'
                        or lower(coalesce(p.basicInfo.productDescription, '')) like '%gasoline%'
                        or lower(coalesce(p.basicInfo.specification, '')) like '%gasoline%'))
                   or (:fuelType = 'diesel' and (
                        lower(coalesce(p.basicInfo.productName, '')) like '%diesel%'
                        or lower(coalesce(p.basicInfo.productDescription, '')) like '%diesel%'
                        or lower(coalesce(p.basicInfo.specification, '')) like '%diesel%'))
                   or (:fuelType = 'hybrid' and (
                        lower(coalesce(p.basicInfo.productName, '')) like '%hybrid%'
                        or lower(coalesce(p.basicInfo.productDescription, '')) like '%hybrid%'
                        or lower(coalesce(p.basicInfo.specification, '')) like '%hybrid%'))
                   or (:fuelType = 'europe' and (
                        lower(coalesce(p.basicInfo.productName, '')) like '%acea%'
                        or lower(coalesce(p.basicInfo.productDescription, '')) like '%acea%'
                        or lower(coalesce(p.basicInfo.specification, '')) like '%acea%')))
              and (:hasViscosity = false or replace(replace(replace(lower(coalesce(p.basicInfo.viscosity, '')), ' ', ''), '-', ''), '/', '') = :viscosity)
              and (:hasStandard = false or replace(replace(replace(lower(coalesce(p.basicInfo.specification, '')), ' ', ''), '-', ''), '/', '') like :standard)
            """)
    List<Product> searchOnSaleProducts(
            @Param("saleStatus") ProductStatus saleStatus,
            @Param("hasCategory") boolean hasCategory,
            @Param("categories") List<String> categories,
            @Param("hasSubCategory") boolean hasSubCategory,
            @Param("isBrandSubCategory") boolean isBrandSubCategory,
            @Param("subCategory") String subCategory,
            @Param("subCategoryKeyword") String subCategoryKeyword,
            @Param("subCategoryKeyword1") String subCategoryKeyword1,
            @Param("subCategoryKeyword2") String subCategoryKeyword2,
            @Param("subCategoryKeyword3") String subCategoryKeyword3,
            @Param("subCategoryKeyword4") String subCategoryKeyword4,
            @Param("subCategoryKeyword5") String subCategoryKeyword5,
            @Param("hasBrand") boolean hasBrand,
            @Param("brand") String brand,
            @Param("hasKeyword") boolean hasKeyword,
            @Param("keyword") String keyword,
            @Param("hasFuelType") boolean hasFuelType,
            @Param("fuelType") String fuelType,
            @Param("hasViscosity") boolean hasViscosity,
            @Param("viscosity") String viscosity,
            @Param("hasStandard") boolean hasStandard,
            @Param("standard") String standard
    );

    @Query("""
            select distinct trim(p.basicInfo.brand)
            from Product p
            where p.deleted = false
              and p.saleStatus = :saleStatus
              and p.basicInfo.brand is not null
              and trim(p.basicInfo.brand) <> ''
              and (:hasCategory = false or replace(replace(replace(lower(coalesce(p.basicInfo.category, '')), ' ', ''), '-', ''), '/', '') in :categories)
              and (:hasSubCategory = false
                   or (:isBrandSubCategory = true and p.basicInfo.brand is not null and trim(p.basicInfo.brand) <> '')
                   or replace(replace(replace(lower(coalesce(p.basicInfo.subCategory, '')), ' ', ''), '-', ''), '/', '') = :subCategory
                   or replace(replace(replace(lower(coalesce(p.basicInfo.viscosity, '')), ' ', ''), '-', ''), '/', '') = :subCategory
                   or replace(replace(replace(lower(coalesce(p.basicInfo.specification, '')), ' ', ''), '-', ''), '/', '') like :subCategoryKeyword
                   or replace(replace(replace(lower(coalesce(p.basicInfo.productName, '')), ' ', ''), '-', ''), '/', '') like :subCategoryKeyword
                   or replace(replace(replace(lower(concat(
                        coalesce(p.basicInfo.productName, ''), ' ',
                        coalesce(p.basicInfo.brand, ''), ' ',
                        coalesce(p.basicInfo.productDescription, ''), ' ',
                        coalesce(p.basicInfo.specification, ''), ' ',
                        coalesce(p.basicInfo.viscosity, '')
                   )), ' ', ''), '-', ''), '/', '') like :subCategoryKeyword1
                   or replace(replace(replace(lower(concat(
                        coalesce(p.basicInfo.productName, ''), ' ',
                        coalesce(p.basicInfo.brand, ''), ' ',
                        coalesce(p.basicInfo.productDescription, ''), ' ',
                        coalesce(p.basicInfo.specification, ''), ' ',
                        coalesce(p.basicInfo.viscosity, '')
                   )), ' ', ''), '-', ''), '/', '') like :subCategoryKeyword2
                   or replace(replace(replace(lower(concat(
                        coalesce(p.basicInfo.productName, ''), ' ',
                        coalesce(p.basicInfo.brand, ''), ' ',
                        coalesce(p.basicInfo.productDescription, ''), ' ',
                        coalesce(p.basicInfo.specification, ''), ' ',
                        coalesce(p.basicInfo.viscosity, '')
                   )), ' ', ''), '-', ''), '/', '') like :subCategoryKeyword3
                   or replace(replace(replace(lower(concat(
                        coalesce(p.basicInfo.productName, ''), ' ',
                        coalesce(p.basicInfo.brand, ''), ' ',
                        coalesce(p.basicInfo.productDescription, ''), ' ',
                        coalesce(p.basicInfo.specification, ''), ' ',
                        coalesce(p.basicInfo.viscosity, '')
                   )), ' ', ''), '-', ''), '/', '') like :subCategoryKeyword4
                   or replace(replace(replace(lower(concat(
                        coalesce(p.basicInfo.productName, ''), ' ',
                        coalesce(p.basicInfo.brand, ''), ' ',
                        coalesce(p.basicInfo.productDescription, ''), ' ',
                        coalesce(p.basicInfo.specification, ''), ' ',
                        coalesce(p.basicInfo.viscosity, '')
                   )), ' ', ''), '-', ''), '/', '') like :subCategoryKeyword5)
              and (:hasKeyword = false
                   or replace(replace(replace(lower(concat(
                        coalesce(p.basicInfo.productName, ''), ' ',
                        coalesce(p.basicInfo.brand, ''), ' ',
                        coalesce(p.basicInfo.category, ''), ' ',
                        coalesce(p.basicInfo.productDescription, ''), ' ',
                        coalesce(p.basicInfo.viscosity, ''), ' ',
                        coalesce(p.basicInfo.specification, ''), ' ',
                        coalesce(p.basicInfo.volume, '')
                   )), ' ', ''), '-', ''), '/', '') like :keyword)
              and (:hasFuelType = false
                   or (:fuelType = 'gasoline' and (
                        lower(coalesce(p.basicInfo.productName, '')) like '%gasoline%'
                        or lower(coalesce(p.basicInfo.productDescription, '')) like '%gasoline%'
                        or lower(coalesce(p.basicInfo.specification, '')) like '%gasoline%'))
                   or (:fuelType = 'diesel' and (
                        lower(coalesce(p.basicInfo.productName, '')) like '%diesel%'
                        or lower(coalesce(p.basicInfo.productDescription, '')) like '%diesel%'
                        or lower(coalesce(p.basicInfo.specification, '')) like '%diesel%'))
                   or (:fuelType = 'hybrid' and (
                        lower(coalesce(p.basicInfo.productName, '')) like '%hybrid%'
                        or lower(coalesce(p.basicInfo.productDescription, '')) like '%hybrid%'
                        or lower(coalesce(p.basicInfo.specification, '')) like '%hybrid%'))
                   or (:fuelType = 'europe' and (
                        lower(coalesce(p.basicInfo.productName, '')) like '%acea%'
                        or lower(coalesce(p.basicInfo.productDescription, '')) like '%acea%'
                        or lower(coalesce(p.basicInfo.specification, '')) like '%acea%')))
              and (:hasViscosity = false or replace(replace(replace(lower(coalesce(p.basicInfo.viscosity, '')), ' ', ''), '-', ''), '/', '') = :viscosity)
              and (:hasStandard = false or replace(replace(replace(lower(coalesce(p.basicInfo.specification, '')), ' ', ''), '-', ''), '/', '') like :standard)
            order by trim(p.basicInfo.brand) asc
            """)
    List<String> findDistinctBrandsBySearch(
            @Param("saleStatus") ProductStatus saleStatus,
            @Param("hasCategory") boolean hasCategory,
            @Param("categories") List<String> categories,
            @Param("hasSubCategory") boolean hasSubCategory,
            @Param("isBrandSubCategory") boolean isBrandSubCategory,
            @Param("subCategory") String subCategory,
            @Param("subCategoryKeyword") String subCategoryKeyword,
            @Param("subCategoryKeyword1") String subCategoryKeyword1,
            @Param("subCategoryKeyword2") String subCategoryKeyword2,
            @Param("subCategoryKeyword3") String subCategoryKeyword3,
            @Param("subCategoryKeyword4") String subCategoryKeyword4,
            @Param("subCategoryKeyword5") String subCategoryKeyword5,
            @Param("hasKeyword") boolean hasKeyword,
            @Param("keyword") String keyword,
            @Param("hasFuelType") boolean hasFuelType,
            @Param("fuelType") String fuelType,
            @Param("hasViscosity") boolean hasViscosity,
            @Param("viscosity") String viscosity,
            @Param("hasStandard") boolean hasStandard,
            @Param("standard") String standard
    );
}
