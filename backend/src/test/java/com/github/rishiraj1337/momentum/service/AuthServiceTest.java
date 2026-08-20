package com.github.rishiraj1337.momentum.service;

import com.github.rishiraj1337.momentum.config.JwtUtil;
import com.github.rishiraj1337.momentum.dto.AuthResponse;
import com.github.rishiraj1337.momentum.dto.LoginRequest;
import com.github.rishiraj1337.momentum.dto.RegisterRequest;
import com.github.rishiraj1337.momentum.entity.User;
import com.github.rishiraj1337.momentum.exception.InvalidCredentialsException;
import com.github.rishiraj1337.momentum.mapper.UserMapper;
import com.github.rishiraj1337.momentum.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Spy
    private UserMapper userMapper = new UserMapper();

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setName("Alex Runner");
        sampleUser.setEmail("alex@example.com");
        sampleUser.setPasswordHash("hashedPassword123");
        sampleUser.setGoalType("running");
        sampleUser.setTargetValue(50.0);
    }

    @Test
    @DisplayName("Register new user successfully and return JWT token")
    void testRegister_Success() {
        when(userRepository.existsByEmail("alex@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("hashedPassword123");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(1L);
            return u;
        });
        when(jwtUtil.generate(1L, "alex@example.com")).thenReturn("mocked.jwt.token");

        RegisterRequest request = new RegisterRequest(
                "alex@example.com",
                "secret123",
                "Alex Runner",
                "running",
                50.0
        );

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mocked.jwt.token", response.token());
        assertEquals("Alex Runner", response.user().name());
        assertEquals("alex@example.com", response.user().email());
    }

    @Test
    @DisplayName("Reject registration if email already exists")
    void testRegister_DuplicateEmail() {
        when(userRepository.existsByEmail("alex@example.com")).thenReturn(true);

        RegisterRequest request = new RegisterRequest(
                "alex@example.com",
                "secret123",
                "Alex Runner",
                "running",
                50.0
        );

        assertThrows(IllegalArgumentException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Login successfully with valid credentials")
    void testLogin_Success() {
        when(userRepository.findByEmail("alex@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("secret123", "hashedPassword123")).thenReturn(true);
        when(jwtUtil.generate(1L, "alex@example.com")).thenReturn("valid.jwt.token");

        LoginRequest request = new LoginRequest("alex@example.com", "secret123");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("valid.jwt.token", response.token());
        assertEquals("Alex Runner", response.user().name());
    }

    @Test
    @DisplayName("Fail login when password does not match")
    void testLogin_InvalidPassword() {
        when(userRepository.findByEmail("alex@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("wrongPassword", "hashedPassword123")).thenReturn(false);

        LoginRequest request = new LoginRequest("alex@example.com", "wrongPassword");

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request));
    }

    @Test
    @DisplayName("Fail login when email is not found")
    void testLogin_EmailNotFound() {
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        LoginRequest request = new LoginRequest("unknown@example.com", "anyPassword");

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request));
    }
}
