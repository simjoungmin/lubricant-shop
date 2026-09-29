package com.lubricantshop.back.domain.cart;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.lubricantshop.back.domain.cart.dto.CartAddRequest;
import com.lubricantshop.back.domain.cart.dto.CartQuantityUpdateRequest;
import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.repository.MemberRepository;
import com.lubricantshop.back.domain.product.Product;
import com.lubricantshop.back.domain.product.ProductRepository;
import com.lubricantshop.back.domain.product.ProductStatus;
import com.lubricantshop.back.global.exception.ConflictException;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private ProductRepository productRepository;

    private CartService cartService;

    @BeforeEach
    void setUp() {
        cartService = new CartService(cartRepository, memberRepository, productRepository);
    }

    @Test
    void addCartItemRejectsQuantityOverCurrentStock() {
        Member member = createMember();
        Product product = createProduct(ProductStatus.ON_SALE, 2);
        ReflectionTestUtils.setField(member, "memberId", 1L);
        ReflectionTestUtils.setField(product, "productId", 10L);

        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        when(cartRepository.findByMember_MemberIdAndProduct_ProductId(1L, 10L))
                .thenReturn(Optional.empty());

        ConflictException exception = assertThrows(
                ConflictException.class,
                () -> cartService.addCartItem(1L, new CartAddRequest(10L, 3))
        );

        assertEquals("장바구니 수량이 현재 재고보다 많습니다.", exception.getMessage());
        verify(cartRepository, never()).save(org.mockito.ArgumentMatchers.any(Cart.class));
    }

    @Test
    void updateQuantityRejectsStoppedProductInCart() {
        Member member = createMember();
        Product product = createProduct(ProductStatus.STOPPED, 10);
        Cart cart = new Cart(member, product, 1);
        ReflectionTestUtils.setField(member, "memberId", 1L);
        ReflectionTestUtils.setField(product, "productId", 10L);
        ReflectionTestUtils.setField(cart, "cartId", 100L);

        when(cartRepository.findById(100L)).thenReturn(Optional.of(cart));
        when(cartRepository.findByMember_MemberIdAndProduct_ProductId(1L, 10L))
                .thenReturn(Optional.of(cart));

        ConflictException exception = assertThrows(
                ConflictException.class,
                () -> cartService.updateQuantity(1L, 100L, new CartQuantityUpdateRequest(2))
        );

        assertEquals("현재 구매할 수 없는 상품입니다.", exception.getMessage());
    }

    private Member createMember() {
        return new Member(
                "cart-user@example.com",
                "cart-user",
                "encoded-password",
                "장바구니회원",
                "01012345678",
                "서울시 강남구",
                true,
                true,
                false,
                ""
        );
    }

    private Product createProduct(ProductStatus saleStatus, int stock) {
        return new Product(
                "테스트 엔진오일",
                "engine",
                "synthetic",
                "OIL MASTER",
                BigDecimal.valueOf(30000),
                stock,
                "장바구니 테스트 상품",
                "5W-30",
                "API SP",
                "1L",
                "/product-images/test.jpeg",
                saleStatus,
                null,
                BigDecimal.valueOf(1)
        );
    }
}
