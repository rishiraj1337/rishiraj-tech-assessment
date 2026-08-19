package com.github.rishiraj1337.momentum.repository;

import com.github.rishiraj1337.momentum.entity.WorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkoutRepository extends JpaRepository<WorkoutLog, Long> {
    List<WorkoutLog> findByUserId(Long userId);
}