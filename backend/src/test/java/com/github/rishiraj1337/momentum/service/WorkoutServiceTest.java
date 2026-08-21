package com.github.rishiraj1337.momentum.service;

import com.github.rishiraj1337.momentum.dto.CreateWorkoutRequest;
import com.github.rishiraj1337.momentum.dto.WorkoutResponse;
import com.github.rishiraj1337.momentum.entity.User;
import com.github.rishiraj1337.momentum.entity.WorkoutLog;
import com.github.rishiraj1337.momentum.exception.ResourceNotFoundException;
import com.github.rishiraj1337.momentum.mapper.WorkoutMapper;
import com.github.rishiraj1337.momentum.repository.UserRepository;
import com.github.rishiraj1337.momentum.repository.WorkoutRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkoutServiceTest {

    @Mock
    private WorkoutRepository workoutRepository;

    @Mock
    private UserRepository userRepository;

    @Spy
    private WorkoutMapper workoutMapper = new WorkoutMapper();

    @InjectMocks
    private WorkoutService workoutService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setName("Alex Runner");
        sampleUser.setEmail("alex@example.com");
    }

    @Test
    @DisplayName("Create workout with explicit valueAchieved")
    void testCreateWorkout_ExplicitValue() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        CreateWorkoutRequest request = new CreateWorkoutRequest(
                LocalDate.of(2026, 8, 20),
                "Morning Run",
                45,
                10.5,
                1L
        );

        when(workoutRepository.save(any(WorkoutLog.class))).thenAnswer(invocation -> {
            WorkoutLog log = invocation.getArgument(0);
            log.setId(100L);
            return log;
        });

        WorkoutResponse response = workoutService.create(request);

        assertNotNull(response);
        assertEquals(100L, response.id());
        assertEquals("Morning Run", response.activity());
        assertEquals(45, response.duration());
        assertEquals(10.5, response.valueAchieved());
        assertEquals(1L, response.userId());
        verify(workoutRepository).save(any(WorkoutLog.class));
    }

    @Test
    @DisplayName("Create workout with null valueAchieved defaults to duration")
    void testCreateWorkout_NullValueAchievedDefaultsToDuration() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        CreateWorkoutRequest request = new CreateWorkoutRequest(
                LocalDate.of(2026, 8, 20),
                "HIIT Cardio",
                30,
                null, // Omitted / null score
                1L
        );

        when(workoutRepository.save(any(WorkoutLog.class))).thenAnswer(invocation -> {
            WorkoutLog log = invocation.getArgument(0);
            log.setId(101L);
            return log;
        });

        WorkoutResponse response = workoutService.create(request);

        assertNotNull(response);
        assertEquals(101L, response.id());
        assertEquals(30, response.duration());
        assertEquals(30.0, response.valueAchieved()); // Auto-defaulted to duration!
    }

    @Test
    @DisplayName("Update existing workout")
    void testUpdateWorkout() {
        WorkoutLog existing = new WorkoutLog();
        existing.setId(200L);
        existing.setUser(sampleUser);
        existing.setActivity("Old Activity");
        existing.setDuration(20);
        existing.setValueAchieved(5.0);

        when(workoutRepository.findById(200L)).thenReturn(Optional.of(existing));
        when(workoutRepository.save(any(WorkoutLog.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CreateWorkoutRequest updateRequest = new CreateWorkoutRequest(
                LocalDate.of(2026, 8, 20),
                "Updated Activity",
                50,
                15.0,
                1L
        );

        WorkoutResponse response = workoutService.update(200L, updateRequest);

        assertNotNull(response);
        assertEquals("Updated Activity", response.activity());
        assertEquals(50, response.duration());
        assertEquals(15.0, response.valueAchieved());
    }

    @Test
    @DisplayName("Find workouts by user ID")
    void testFindByUserId() {
        WorkoutLog log = new WorkoutLog();
        log.setId(1L);
        log.setUser(sampleUser);
        log.setActivity("Deadlifts");
        log.setDuration(40);
        log.setValueAchieved(80.0);

        when(workoutRepository.findByUserId(1L)).thenReturn(List.of(log));

        List<WorkoutResponse> results = workoutService.findByUserId(1L);

        assertEquals(1, results.size());
        assertEquals("Deadlifts", results.get(0).activity());
    }

    @Test
    @DisplayName("Find paginated workouts by user ID")
    void testFindByUserIdPaged() {
        WorkoutLog log = new WorkoutLog();
        log.setId(1L);
        log.setUser(sampleUser);
        log.setActivity("Cycling");
        log.setDuration(60);
        log.setValueAchieved(20.0);

        PageRequest pageRequest = PageRequest.of(0, 10);
        Page<WorkoutLog> page = new PageImpl<>(List.of(log), pageRequest, 1);

        when(workoutRepository.findByUserId(1L, pageRequest)).thenReturn(page);

        Page<WorkoutResponse> results = workoutService.findByUserIdPaged(1L, pageRequest);

        assertEquals(1, results.getTotalElements());
        assertEquals("Cycling", results.getContent().get(0).activity());
    }

    @Test
    @DisplayName("Delete workout by ID")
    void testDeleteWorkout() {
        WorkoutLog existing = new WorkoutLog();
        existing.setId(300L);
        when(workoutRepository.findById(300L)).thenReturn(Optional.of(existing));

        workoutService.delete(300L);

        verify(workoutRepository).delete(existing);
    }

    @Test
    @DisplayName("Throw ResourceNotFoundException when workout ID does not exist")
    void testGetWorkout_NotFound() {
        when(workoutRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> workoutService.findById(999L));
    }
}
