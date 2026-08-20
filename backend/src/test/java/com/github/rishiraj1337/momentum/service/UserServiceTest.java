package com.github.rishiraj1337.momentum.service;

import com.github.rishiraj1337.momentum.dto.CreateUserRequest;
import com.github.rishiraj1337.momentum.dto.UpdateUserRequest;
import com.github.rishiraj1337.momentum.dto.UserResponse;
import com.github.rishiraj1337.momentum.entity.User;
import com.github.rishiraj1337.momentum.exception.ResourceNotFoundException;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Spy
    private UserMapper userMapper = new UserMapper();

    @InjectMocks
    private UserService userService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setName("Alex Runner");
        sampleUser.setEmail("alex@example.com");
        sampleUser.setPasswordHash("encodedPassword");
        sampleUser.setGoalType("running");
        sampleUser.setTargetValue(50.0);
    }

    @Test
    @DisplayName("Create new user with encoded password")
    void testCreateUser_Success() {
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("plainPassword123")).thenReturn("hashedPassword123");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(10L);
            return u;
        });

        CreateUserRequest request = new CreateUserRequest(
                "new@example.com",
                "plainPassword123",
                "New User",
                "running",
                60.0
        );

        UserResponse response = userService.create(request);

        assertNotNull(response);
        assertEquals(10L, response.id());
        assertEquals("New User", response.name());
        assertEquals("new@example.com", response.email());
        verify(passwordEncoder).encode("plainPassword123");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Reject user creation when email already exists")
    void testCreateUser_DuplicateEmail() {
        when(userRepository.existsByEmail("alex@example.com")).thenReturn(true);

        CreateUserRequest request = new CreateUserRequest(
                "alex@example.com",
                "password123",
                "Alex Runner",
                "running",
                50.0
        );

        assertThrows(IllegalArgumentException.class, () -> userService.create(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Update existing user profile")
    void testUpdateUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        UpdateUserRequest updateRequest = new UpdateUserRequest(
                "Alex Champion",
                "alex@example.com",
                "strength",
                100.0
        );

        UserResponse response = userService.update(1L, updateRequest);

        assertNotNull(response);
        assertEquals("Alex Champion", response.name());
        assertEquals("strength", response.goalType());
        assertEquals(100.0, response.targetValue());
    }

    @Test
    @DisplayName("Find user by ID")
    void testFindById() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        UserResponse response = userService.findById(1L);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals("Alex Runner", response.name());
    }

    @Test
    @DisplayName("Throw ResourceNotFoundException when user does not exist")
    void testFindById_NotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.findById(999L));
    }

    @Test
    @DisplayName("Delete user by ID")
    void testDeleteUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        userService.delete(1L);

        verify(userRepository).delete(sampleUser);
    }
}
