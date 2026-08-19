package com.github.rishiraj1337.momentum.mapper;

import com.github.rishiraj1337.momentum.dto.UserResponse;
import com.github.rishiraj1337.momentum.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getGoalType(),
                user.getTargetValue(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}