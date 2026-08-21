package com.github.rishiraj1337.momentum.service;

import com.github.rishiraj1337.momentum.dto.CreateWorkoutRequest;
import com.github.rishiraj1337.momentum.dto.WorkoutResponse;
import com.github.rishiraj1337.momentum.entity.User;
import com.github.rishiraj1337.momentum.entity.WorkoutLog;
import com.github.rishiraj1337.momentum.exception.ResourceNotFoundException;
import com.github.rishiraj1337.momentum.mapper.WorkoutMapper;
import com.github.rishiraj1337.momentum.repository.UserRepository;
import com.github.rishiraj1337.momentum.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;
    private final WorkoutMapper workoutMapper;

    @Transactional
    public WorkoutResponse create(CreateWorkoutRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.userId()));
        WorkoutLog workout = new WorkoutLog();
        applyRequest(workout, request);
        workout.setUser(user);
        return workoutMapper.toResponse(workoutRepository.save(workout));
    }

    @Transactional(readOnly = true)
    public Page<WorkoutResponse> findAll(Pageable pageable) {
        return workoutRepository.findAll(pageable).map(workoutMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public WorkoutResponse findById(Long id) {
        return workoutMapper.toResponse(getWorkout(id));
    }

    @Transactional
    public WorkoutResponse update(Long id, CreateWorkoutRequest request) {
        WorkoutLog workout = getWorkout(id);
        applyRequest(workout, request);
        if (request.userId() != null && (workout.getUser() == null || !workout.getUser().getId().equals(request.userId()))) {
            User user = userRepository.findById(request.userId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", request.userId()));
            workout.setUser(user);
        }
        return workoutMapper.toResponse(workoutRepository.save(workout));
    }

    @Transactional
    public void delete(Long id) {
        workoutRepository.delete(getWorkout(id));
    }

    @Transactional(readOnly = true)
    public List<WorkoutResponse> findByUserId(Long userId) {
        return workoutRepository.findByUserId(userId).stream()
                .map(workoutMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<WorkoutResponse> findByUserIdPaged(Long userId, Pageable pageable) {
        return workoutRepository.findByUserId(userId, pageable)
                .map(workoutMapper::toResponse);
    }

    private WorkoutLog getWorkout(Long id) {
        return workoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workout", id));
    }

    private void applyRequest(WorkoutLog workout, CreateWorkoutRequest request) {
        workout.setWorkoutDate(request.workoutDate());
        workout.setActivity(request.activity());
        workout.setDuration(request.duration());
        if (request.valueAchieved() != null) {
            workout.setValueAchieved(request.valueAchieved());
        } else {
            // Default value achieved to duration if not explicitly specified
            workout.setValueAchieved(request.duration() != null ? request.duration().doubleValue() : 0.0);
        }
    }
}