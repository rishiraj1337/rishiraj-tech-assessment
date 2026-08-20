package com.github.rishiraj1337.momentum.service;

import com.github.rishiraj1337.momentum.dto.WeeklySummaryResponse;
import com.github.rishiraj1337.momentum.entity.User;
import com.github.rishiraj1337.momentum.entity.WorkoutLog;
import com.github.rishiraj1337.momentum.exception.ResourceNotFoundException;
import com.github.rishiraj1337.momentum.repository.UserRepository;
import com.github.rishiraj1337.momentum.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WeeklySummaryService {

    private final UserRepository userRepository;
    private final WorkoutRepository workoutRepository;

    @Transactional(readOnly = true)
    public WeeklySummaryResponse getWeeklySummary(Long userId) {
        return getWeeklySummary(userId, null, null, null);
    }

    @Transactional(readOnly = true)
    public WeeklySummaryResponse getWeeklySummary(Long userId, LocalDate date, String timezone, DayOfWeek weekStart) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        // Edge case 1: Resolve current date using user's timezone if specified
        ZoneId zoneId = resolveZoneId(timezone);
        LocalDate refDate = (date != null) ? date : LocalDate.now(zoneId);

        // Edge case 2: Calculate 7-day week window based on custom week start day (default: Monday)
        DayOfWeek startDay = (weekStart != null) ? weekStart : DayOfWeek.MONDAY;
        LocalDate calculatedWeekStart = refDate.with(TemporalAdjusters.previousOrSame(startDay));
        LocalDate calculatedWeekEnd = calculatedWeekStart.plusDays(6);

        // Fetch logs within week window
        List<WorkoutLog> workouts = workoutRepository.findByUserIdAndWorkoutDateBetween(userId, calculatedWeekStart, calculatedWeekEnd);

        // Edge case 3: Safely sum positive values and round to 2 decimal places
        int totalWorkouts = workouts.size();
        double totalValueAchieved = workouts.stream()
                .filter(w -> w.getValueAchieved() != null && w.getValueAchieved() > 0)
                .mapToDouble(WorkoutLog::getValueAchieved)
                .sum();
        totalValueAchieved = Math.round(totalValueAchieved * 100.0) / 100.0;

        // Edge case 4: Handle null, zero, negative targets and round percentage
        double percentage = 0.0;
        if (user.getTargetValue() != null && user.getTargetValue() > 0) {
            double rawPercentage = (totalValueAchieved / user.getTargetValue()) * 100.0;
            percentage = Math.round(rawPercentage * 100.0) / 100.0;
        }

        return new WeeklySummaryResponse(
                userId,
                user.getGoalType(),
                user.getTargetValue(),
                totalWorkouts,
                totalValueAchieved,
                percentage,
                calculatedWeekStart,
                calculatedWeekEnd
        );
    }

    // Safely parse timezone string, falling back to system default if invalid or null
    private ZoneId resolveZoneId(String timezone) {
        if (timezone == null || timezone.isBlank()) {
            return ZoneId.systemDefault();
        }
        try {
            return ZoneId.of(timezone.trim());
        } catch (Exception e) {
            return ZoneId.systemDefault();
        }
    }
}