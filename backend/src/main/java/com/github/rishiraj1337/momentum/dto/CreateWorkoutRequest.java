package com.github.rishiraj1337.momentum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

public record CreateWorkoutRequest(
        @NotNull(message = "Workout date is required")
        LocalDate workoutDate,

        @NotBlank(message = "Activity is required")
        String activity,

        @NotNull(message = "Duration is required")
        @Positive(message = "Duration must be positive")
        Integer duration,

        @PositiveOrZero(message = "Value achieved must be positive or zero")
        Double valueAchieved,

        @NotNull(message = "User ID is required")
        Long userId
) {
}