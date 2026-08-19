package com.github.rishiraj1337.momentum.repository;

import com.github.rishiraj1337.momentum.entity.WorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutRepository extends JpaRepository<WorkoutLog, Long> {
}