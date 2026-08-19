package com.github.rishiraj1337.momentum.dto;

import java.time.LocalDate;

public record WeeklySummaryResponse(
        Long userId,
        String goalType,
        Double targetValue,
        int totalWorkouts,
        double totalValueAchieved,
        double percentage,
        LocalDate weekStart,
        LocalDate weekEnd
) {
}