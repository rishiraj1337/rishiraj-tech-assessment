package com.github.rishiraj1337.momentum.dto;

import java.time.LocalDate;

public record CreateWorkoutRequest(
        LocalDate workoutDate,
        String activity,
        Integer duration,
        Double valueAchieved,
        Long userId
) {
}