package com.lubricantshop.back.domain.cart;

import com.lubricantshop.back.domain.cart.dto.CartAddRequest;
import com.lubricantshop.back.domain.cart.dto.CartQuantityUpdateRequest;
import com.lubricantshop.back.domain.cart.dto.CartResponse;
import com.lubricantshop.back.global.security.AuthenticatedMember;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public CartResponse findCart(
            @AuthenticationPrincipal AuthenticatedMember member
    ) {
        return cartService.findCart(member.memberId());
    }

    @PostMapping("/items")
    public CartResponse addCartItem(
            @AuthenticationPrincipal AuthenticatedMember member,
            @Valid @RequestBody CartAddRequest request
    ) {
        return cartService.addCartItem(member.memberId(), request);
    }

    @PatchMapping("/items/{cartId}")
    public CartResponse updateQuantity(
            @AuthenticationPrincipal AuthenticatedMember member,
            @PathVariable Long cartId,
            @Valid @RequestBody CartQuantityUpdateRequest request
    ) {
        return cartService.updateQuantity(member.memberId(), cartId, request);
    }

    @DeleteMapping("/items/{cartId}")
    public CartResponse removeCartItem(
            @AuthenticationPrincipal AuthenticatedMember member,
            @PathVariable Long cartId
    ) {
        return cartService.removeCartItem(member.memberId(), cartId);
    }

    @DeleteMapping
    public CartResponse clearCart(
            @AuthenticationPrincipal AuthenticatedMember member
    ) {
        return cartService.clearCart(member.memberId());
    }
}
