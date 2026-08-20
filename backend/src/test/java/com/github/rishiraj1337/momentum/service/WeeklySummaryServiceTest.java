package com.github.rishiraj1337.momentum.service;

import com.github.rishiraj1337.momentum.dto.WeeklySummaryResponse;
import com.github.rishiraj1337.momentum.entity.User;
import com.github.rishiraj1337.momentum.entity.WorkoutLog;
import com.github.rishiraj1337.momentum.exception.ResourceNotFoundException;
import com.github.rishiraj1337.momentum.repository.UserRepository;
import com.github.rishiraj1337.momentum.repository.WorkoutRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WeeklySummaryServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private WorkoutRepository workoutRepository;

    @InjectMocks
    private WeeklySummaryService weeklySummaryService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setName("Alex Runner");
        sampleUser.setEmail("alex@example.com");
        sampleUser.setGoalType("running");
        sampleUser.setTargetValue(50.0);
    }

    @Test
    @DisplayName("Calculate weekly summary with standard workouts")
    void testGetWeeklySummary_Standard() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        WorkoutLog w1 = new WorkoutLog();
        w1.setValueAchieved(10.5);
        w1.setWorkoutDate(LocalDate.of(2026, 8, 18));

        WorkoutLog w2 = new WorkoutLog();
        w2.setValueAchieved(15.5);
        w2.setWorkoutDate(LocalDate.of(2026, 8, 19));

        when(workoutRepository.findByUserIdAndWorkoutDateBetween(eq(1L), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(List.of(w1, w2));

        WeeklySummaryResponse response = weeklySummaryService.getWeeklySummary(
                1L,
                LocalDate.of(2026, 8, 20),
                "UTC",
                DayOfWeek.MONDAY
        );

        assertNotNull(response);
        assertEquals(1L, response.userId());
        assertEquals("running", response.goalType());
        assertEquals(50.0, response.targetValue());
        assertEquals(2, response.totalWorkouts());
        assertEquals(26.0, response.totalValueAchieved());
        assertEquals(52.0, response.percentage());
        assertEquals(LocalDate.of(2026, 8, 17), response.weekStart());
        assertEquals(LocalDate.of(2026, 8, 23), response.weekEnd());
    }

    @Test
    @DisplayName("Calculate weekly summary with custom Sunday week start")
    void testGetWeeklySummary_SundayWeekStart() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(workoutRepository.findByUserIdAndWorkoutDateBetween(eq(1L), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(Collections.emptyList());

        WeeklySummaryResponse response = weeklySummaryService.getWeeklySummary(
                1L,
                LocalDate.of(2026, 8, 20),
                "UTC",
                DayOfWeek.SUNDAY
        );

        assertNotNull(response);
        assertEquals(LocalDate.of(2026, 8, 16), response.weekStart());
        assertEquals(LocalDate.of(2026, 8, 22), response.weekEnd());
        assertEquals(0, response.totalWorkouts());
        assertEquals(0.0, response.totalValueAchieved());
        assertEquals(0.0, response.percentage());
    }

    @Test
    @DisplayName("Edge Case: Handle user with null target value without dividing by zero")
    void testGetWeeklySummary_NullTargetValue() {
        sampleUser.setTargetValue(null);
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        WorkoutLog w1 = new WorkoutLog();
        w1.setValueAchieved(20.0);
        when(workoutRepository.findByUserIdAndWorkoutDateBetween(eq(1L), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(List.of(w1));

        WeeklySummaryResponse response = weeklySummaryService.getWeeklySummary(1L);

        assertNotNull(response);
        assertEquals(0.0, response.percentage());
        assertEquals(20.0, response.totalValueAchieved());
    }

    @Test
    @DisplayName("Edge Case: Handle user with zero or negative target value")
    void testGetWeeklySummary_ZeroTargetValue() {
        sampleUser.setTargetValue(0.0);
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        WorkoutLog w1 = new WorkoutLog();
        w1.setValueAchieved(15.0);
        when(workoutRepository.findByUserIdAndWorkoutDateBetween(eq(1L), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(List.of(w1));

        WeeklySummaryResponse response = weeklySummaryService.getWeeklySummary(1L);

        assertNotNull(response);
        assertEquals(0.0, response.percentage());
    }

    @Test
    @DisplayName("Edge Case: Ignore null and negative workout log values")
    void testGetWeeklySummary_IgnoreNullAndNegativeValues() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        WorkoutLog wValid = new WorkoutLog();
        wValid.setValueAchieved(12.0);

        WorkoutLog wNull = new WorkoutLog();
        wNull.setValueAchieved(null);

        WorkoutLog wNegative = new WorkoutLog();
        wNegative.setValueAchieved(-5.0);

        when(workoutRepository.findByUserIdAndWorkoutDateBetween(eq(1L), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(List.of(wValid, wNull, wNegative));

        WeeklySummaryResponse response = weeklySummaryService.getWeeklySummary(1L);

        assertNotNull(response);
        assertEquals(3, response.totalWorkouts());
        assertEquals(12.0, response.totalValueAchieved());
        assertEquals(24.0, response.percentage());
    }

    @Test
    @DisplayName("Edge Case: Invalid timezone string falls back gracefully to system default")
    void testGetWeeklySummary_InvalidTimezoneFallback() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(workoutRepository.findByUserIdAndWorkoutDateBetween(eq(1L), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(Collections.emptyList());

        WeeklySummaryResponse response = weeklySummaryService.getWeeklySummary(
                1L,
                null,
                "Invalid/Unknown_Timezone_123",
                null
        );

        assertNotNull(response);
        assertNotNull(response.weekStart());
        assertNotNull(response.weekEnd());
    }

    @Test
    @DisplayName("Throw ResourceNotFoundException when user does not exist")
    void testGetWeeklySummary_UserNotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> weeklySummaryService.getWeeklySummary(999L));
    }
}
