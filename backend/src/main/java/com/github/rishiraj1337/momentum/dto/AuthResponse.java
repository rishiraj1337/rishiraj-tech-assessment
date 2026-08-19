package com.github.rishiraj1337.momentum.dto;

public record AuthResponse(
        String token,
        UserResponse user
) {
}