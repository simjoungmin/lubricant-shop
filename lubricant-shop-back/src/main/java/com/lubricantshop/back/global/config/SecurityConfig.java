package com.lubricantshop.back.global.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lubricantshop.back.global.exception.ApiExceptionHandler.ApiErrorResponse;
import com.lubricantshop.back.global.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter,
            AuthenticationEntryPoint authenticationEntryPoint,
            AccessDeniedHandler accessDeniedHandler
    ) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/display-sections/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/members/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/members/signup").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/members/email-exists").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/members/find-email").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/members/password/verification-code").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/members/password/reset").permitAll()
                        .requestMatchers("/api/auth/kakao/**", "/api/auth/naver/**").permitAll()
                        .requestMatchers("/api/admin/**", "/api/boards/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/cart/**", "/api/orders/**", "/api/boards/inquiries", "/api/boards/my/**").authenticated()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint(ObjectMapper objectMapper) {
        return (request, response, authException) -> writeError(
                response,
                HttpServletResponse.SC_UNAUTHORIZED,
                "UNAUTHORIZED",
                "로그인이 필요합니다.",
                objectMapper
        );
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler(ObjectMapper objectMapper) {
        return (request, response, accessDeniedException) -> writeError(
                response,
                HttpServletResponse.SC_FORBIDDEN,
                "FORBIDDEN",
                "접근 권한이 없습니다.",
                objectMapper
        );
    }

    private void writeError(
            HttpServletResponse response,
            int status,
            String code,
            String message,
            ObjectMapper objectMapper
    ) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        objectMapper.writeValue(response.getWriter(), new ApiErrorResponse(code, message));
    }
}
