package com.github.rishiraj1337.momentum.service;

import com.github.rishiraj1337.momentum.dto.CreateUserRequest;
import com.github.rishiraj1337.momentum.dto.UpdateUserRequest;
import com.github.rishiraj1337.momentum.dto.UserResponse;
import com.github.rishiraj1337.momentum.entity.User;
import com.github.rishiraj1337.momentum.exception.ResourceNotFoundException;
import com.github.rishiraj1337.momentum.mapper.UserMapper;
import com.github.rishiraj1337.momentum.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse create(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already in use: " + request.email());
        }
        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setName(request.name());
        user.setGoalType(request.goalType());
        user.setTargetValue(request.targetValue());
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream().map(userMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        return userMapper.toResponse(getUser(id));
    }

    @Transactional
    public UserResponse update(Long id, UpdateUserRequest request) {
        User user = getUser(id);
        if (request.email() != null && !request.email().isBlank() && !request.email().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmail(request.email())) {
                throw new IllegalArgumentException("Email already in use: " + request.email());
            }
            user.setEmail(request.email());
        }
        user.setName(request.name());
        user.setGoalType(request.goalType());
        user.setTargetValue(request.targetValue());
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id) {
        userRepository.delete(getUser(id));
    }

    public User getUser(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User", id));
    }
}