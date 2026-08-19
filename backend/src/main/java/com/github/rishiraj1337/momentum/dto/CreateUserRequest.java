package com.github.rishiraj1337.momentum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record CreateUserRequest(
        @NotBlank String name,
        @NotBlank String goalType,
        @Positive Double targetValue
) {
}