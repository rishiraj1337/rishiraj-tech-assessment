package com.github.rishiraj1337.momentum.repository;

import com.github.rishiraj1337.momentum.entity.WorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WorkoutRepository extends JpaRepository<WorkoutLog, Long> {
    List<WorkoutLog> findByUserId(Long userId);
    Page<WorkoutLog> findByUserId(Long userId, Pageable pageable);
    List<WorkoutLog> findByUserIdAndWorkoutDateBetween(Long userId, LocalDate start, LocalDate end);
}