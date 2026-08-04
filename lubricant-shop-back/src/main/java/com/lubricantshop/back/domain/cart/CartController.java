package com.lubricantshop.back.domain.cart;

import com.lubricantshop.back.domain.cart.dto.CartAddRequest;
import com.lubricantshop.back.domain.cart.dto.CartQuantityUpdateRequest;
import com.lubricantshop.back.domain.cart.dto.CartResponse;
import com.lubricantshop.back.global.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CookieValue;
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

    private static final String ACCESS_TOKEN_COOKIE_NAME = "access_token";

    private final CartService cartService;
    private final JwtTokenProvider jwtTokenProvider;

    public CartController(CartService cartService, JwtTokenProvider jwtTokenProvider) {
        this.cartService = cartService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @GetMapping
    public CartResponse findCart(
            @CookieValue(name = ACCESS_TOKEN_COOKIE_NAME, required = false) String accessToken
    ) {
        return cartService.findCart(jwtTokenProvider.getMemberId(accessToken));
    }

    @PostMapping("/items")
    public CartResponse addCartItem(
            @CookieValue(name = ACCESS_TOKEN_COOKIE_NAME, required = false) String accessToken,
            @Valid @RequestBody CartAddRequest request
    ) {
        return cartService.addCartItem(jwtTokenProvider.getMemberId(accessToken), request);
    }

    @PatchMapping("/items/{cartId}")
    public CartResponse updateQuantity(
            @CookieValue(name = ACCESS_TOKEN_COOKIE_NAME, required = false) String accessToken,
            @PathVariable Long cartId,
            @Valid @RequestBody CartQuantityUpdateRequest request
    ) {
        return cartService.updateQuantity(jwtTokenProvider.getMemberId(accessToken), cartId, request);
    }

    @DeleteMapping("/items/{cartId}")
    public CartResponse removeCartItem(
            @CookieValue(name = ACCESS_TOKEN_COOKIE_NAME, required = false) String accessToken,
            @PathVariable Long cartId
    ) {
        return cartService.removeCartItem(jwtTokenProvider.getMemberId(accessToken), cartId);
    }

    @DeleteMapping
    public CartResponse clearCart(
            @CookieValue(name = ACCESS_TOKEN_COOKIE_NAME, required = false) String accessToken
    ) {
        return cartService.clearCart(jwtTokenProvider.getMemberId(accessToken));
    }
}
