package com.github.rishiraj1337.momentum.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record UpdateUserRequest(
        @NotBlank(message = "Name is required")
        String name,

        @Email(message = "Invalid email format")
        String email,

        String goalType,

        @Positive(message = "Target value must be positive")
        Double targetValue
) {
}
