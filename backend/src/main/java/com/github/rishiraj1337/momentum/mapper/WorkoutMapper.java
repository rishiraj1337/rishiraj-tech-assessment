package com.github.rishiraj1337.momentum.mapper;

import com.github.rishiraj1337.momentum.dto.WorkoutResponse;
import com.github.rishiraj1337.momentum.entity.WorkoutLog;
import org.springframework.stereotype.Component;

@Component
public class WorkoutMapper {

    public WorkoutResponse toResponse(WorkoutLog workout) {
        return new WorkoutResponse(
                workout.getId(),
                workout.getWorkoutDate(),
                workout.getActivity(),
                workout.getDuration(),
                workout.getValueAchieved(),
                workout.getUser() != null ? workout.getUser().getId() : null,
                workout.getCreatedAt(),
                workout.getUpdatedAt()
        );
    }
}