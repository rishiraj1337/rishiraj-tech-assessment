package com.github.rishiraj1337.momentum.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record WorkoutResponse(
        Long id,
        LocalDate workoutDate,
        String activity,
        Integer duration,
        Double valueAchieved,
        Long userId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}