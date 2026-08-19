package com.github.rishiraj1337.momentum.service;

import com.github.rishiraj1337.momentum.dto.WeeklySummaryResponse;
import com.github.rishiraj1337.momentum.entity.User;
import com.github.rishiraj1337.momentum.entity.WorkoutLog;
import com.github.rishiraj1337.momentum.exception.ResourceNotFoundException;
import com.github.rishiraj1337.momentum.repository.UserRepository;
import com.github.rishiraj1337.momentum.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WeeklySummaryService {

    private final UserRepository userRepository;
    private final WorkoutRepository workoutRepository;

    public WeeklySummaryResponse getWeeklySummary(Long userId) {
        // TODO: need to revisit later to handle edge cases (timezone, custom week start, mid-week goal changes)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate weekEnd = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        List<WorkoutLog> workouts = workoutRepository.findByUserIdAndWorkoutDateBetween(userId, weekStart, weekEnd);

        int totalWorkouts = workouts.size();
        double totalValueAchieved = workouts.stream()
                .filter(w -> w.getValueAchieved() != null)
                .mapToDouble(WorkoutLog::getValueAchieved)
                .sum();

        double percentage = 0.0;
        if (user.getTargetValue() != null && user.getTargetValue() > 0) {
            percentage = (totalValueAchieved / user.getTargetValue()) * 100;
        }

        return new WeeklySummaryResponse(
                userId,
                user.getGoalType(),
                user.getTargetValue(),
                totalWorkouts,
                totalValueAchieved,
                percentage,
                weekStart,
                weekEnd
        );
    }
}