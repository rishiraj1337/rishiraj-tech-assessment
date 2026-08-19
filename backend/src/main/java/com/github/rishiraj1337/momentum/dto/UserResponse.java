package com.github.rishiraj1337.momentum.dto;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String email,
        String name,
        String goalType,
        Double targetValue,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}