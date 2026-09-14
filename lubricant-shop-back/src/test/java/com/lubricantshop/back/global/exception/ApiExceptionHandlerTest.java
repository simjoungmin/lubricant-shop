package com.lubricantshop.back.global.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.lubricantshop.back.global.exception.ApiExceptionHandler.ApiErrorResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

class ApiExceptionHandlerTest {

    private final ApiExceptionHandler apiExceptionHandler = new ApiExceptionHandler();

    @Test
    void illegalArgumentIsBadRequest() {
        ResponseEntity<ApiErrorResponse> response = apiExceptionHandler.handleIllegalArgument(
                new IllegalArgumentException("잘못된 요청입니다.")
        );

        assertErrorResponse(response, HttpStatus.BAD_REQUEST, "BAD_REQUEST", "잘못된 요청입니다.");
    }

    @Test
    void resourceNotFoundIsNotFound() {
        ResponseEntity<ApiErrorResponse> response = apiExceptionHandler.handleResourceNotFound(
                new ResourceNotFoundException("존재하지 않는 상품입니다.")
        );

        assertErrorResponse(response, HttpStatus.NOT_FOUND, "NOT_FOUND", "존재하지 않는 상품입니다.");
    }

    @Test
    void conflictIsConflict() {
        ResponseEntity<ApiErrorResponse> response = apiExceptionHandler.handleConflict(
                new ConflictException("이미 사용 중인 이메일입니다.")
        );

        assertErrorResponse(response, HttpStatus.CONFLICT, "CONFLICT", "이미 사용 중인 이메일입니다.");
    }

    private void assertErrorResponse(
            ResponseEntity<ApiErrorResponse> response,
            HttpStatus status,
            String code,
            String message
    ) {
        assertEquals(status, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(code, response.getBody().code());
        assertEquals(message, response.getBody().message());
    }
}
