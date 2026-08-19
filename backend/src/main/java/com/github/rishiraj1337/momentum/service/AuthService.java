package com.github.rishiraj1337.momentum.service;

import com.github.rishiraj1337.momentum.dto.AuthResponse;
import com.github.rishiraj1337.momentum.dto.LoginRequest;
import com.github.rishiraj1337.momentum.dto.RegisterRequest;
import com.github.rishiraj1337.momentum.dto.UserResponse;
import com.github.rishiraj1337.momentum.entity.User;
import com.github.rishiraj1337.momentum.exception.InvalidCredentialsException;
import com.github.rishiraj1337.momentum.mapper.UserMapper;
import com.github.rishiraj1337.momentum.repository.UserRepository;
import com.github.rishiraj1337.momentum.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setName(request.name());
        user.setGoalType(request.goalType());
        user.setTargetValue(request.targetValue());
        user = userRepository.save(user);

        String token = jwtUtil.generate(user.getId(), user.getEmail());
        return new AuthResponse(token, userMapper.toResponse(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        String token = jwtUtil.generate(user.getId(), user.getEmail());
        return new AuthResponse(token, userMapper.toResponse(user));
    }
}