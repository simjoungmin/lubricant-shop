package com.lubricantshop.back.domain.cart;

import com.lubricantshop.back.domain.cart.dto.CartAddRequest;
import com.lubricantshop.back.domain.cart.dto.CartItemResponse;
import com.lubricantshop.back.domain.cart.dto.CartQuantityUpdateRequest;
import com.lubricantshop.back.domain.cart.dto.CartResponse;
import com.lubricantshop.back.domain.member.entity.Member;
import com.lubricantshop.back.domain.member.repository.MemberRepository;
import com.lubricantshop.back.domain.product.Product;
import com.lubricantshop.back.domain.product.ProductRepository;
import com.lubricantshop.back.domain.product.ProductStatus;
import com.lubricantshop.back.global.exception.ConflictException;
import com.lubricantshop.back.global.exception.ResourceNotFoundException;
import com.lubricantshop.back.global.exception.UnauthorizedException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final MemberRepository memberRepository;
    private final ProductRepository productRepository;

    public CartService(
            CartRepository cartRepository,
            MemberRepository memberRepository,
            ProductRepository productRepository
    ) {
        this.cartRepository = cartRepository;
        this.memberRepository = memberRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public CartResponse findCart(Long memberId) {
        List<CartItemResponse> items = cartRepository.findByMember_MemberIdOrderByCartIdAsc(memberId)
                .stream()
                .map(CartItemResponse::from)
                .toList();

        return CartResponse.from(items);
    }

    @Transactional
    public CartResponse addCartItem(Long memberId, CartAddRequest request) {
        Member member = findMember(memberId);
        Product product = findAvailableProduct(request.productId());
        int quantity = request.quantity();

        cartRepository.findByMember_MemberIdAndProduct_ProductId(memberId, product.getProductId())
                .ifPresentOrElse(cart -> {
                    int nextQuantity = cart.getQuantity() + quantity;
                    validateQuantityWithinStock(product, nextQuantity);
                    cart.increaseQuantity(quantity);
                }, () -> {
                    validateQuantityWithinStock(product, quantity);
                    cartRepository.save(new Cart(member, product, quantity));
                });

        return findCart(memberId);
    }

    @Transactional
    public CartResponse updateQuantity(Long memberId, Long cartId, CartQuantityUpdateRequest request) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("장바구니 상품을 찾을 수 없습니다."));

        if (!cartBelongsToMember(cart, memberId)) {
            throw new UnauthorizedException("장바구니를 수정할 권한이 없습니다.");
        }

        validateAvailableProduct(cart.getProduct());
        validateQuantityWithinStock(cart.getProduct(), request.quantity());
        cart.changeQuantity(request.quantity());
        return findCart(memberId);
    }

    @Transactional
    public CartResponse removeCartItem(Long memberId, Long cartId) {
        cartRepository.deleteByCartIdAndMember_MemberId(cartId, memberId);
        return findCart(memberId);
    }

    @Transactional
    public CartResponse clearCart(Long memberId) {
        cartRepository.deleteByMember_MemberId(memberId);
        return findCart(memberId);
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new UnauthorizedException("로그인이 필요합니다."));
    }

    private Product findAvailableProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("존재하지 않는 상품입니다."));
        validateAvailableProduct(product);
        return product;
    }

    private void validateAvailableProduct(Product product) {
        if (product.getSaleStatus() != ProductStatus.ON_SALE) {
            throw new ConflictException("현재 구매할 수 없는 상품입니다.");
        }

        if (product.getStock() <= 0) {
            throw new ConflictException("품절된 상품입니다.");
        }
    }

    private void validateQuantityWithinStock(Product product, int quantity) {
        if (quantity > product.getStock()) {
            throw new ConflictException("장바구니 수량이 현재 재고보다 많습니다.");
        }
    }

    private boolean cartBelongsToMember(Cart cart, Long memberId) {
        return cartRepository.findByMember_MemberIdAndProduct_ProductId(memberId, cart.getProduct().getProductId())
                .map(foundCart -> foundCart.getCartId().equals(cart.getCartId()))
                .orElse(false);
    }
}
