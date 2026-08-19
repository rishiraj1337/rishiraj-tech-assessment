package com.github.rishiraj1337.momentum.seeder;

import com.github.rishiraj1337.momentum.config.JwtUtil;
import com.github.rishiraj1337.momentum.entity.User;
import com.github.rishiraj1337.momentum.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

@Slf4j
@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    public static final String TEST_PASSWORD = "password123";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${app.seed.user-count:5}")
    private int defaultUserCount;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Seeder skipped: database already has {} user(s)", userRepository.count());
            return;
        }

        int count = askUserCount();
        if (count <= 0) {
            log.info("Seeder skipped: invalid or zero user count");
            return;
        }

        List<User> users = seedUsers(count);
        logSeedSummary(users);
    }

    private int askUserCount() {
        try (Scanner scanner = new Scanner(System.in)) {
            System.out.print("How many users to seed? [default " + defaultUserCount + "]: ");
            String input = scanner.hasNextLine() ? scanner.nextLine().trim() : "";
            if (input.isEmpty()) {
                return defaultUserCount;
            }
            return Integer.parseInt(input);
        } catch (Exception e) {
            log.warn("Could not read user count interactively, using default {}", defaultUserCount);
            return defaultUserCount;
        }
    }

    private List<User> seedUsers(int count) {
        List<User> users = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            User user = new User();
            user.setEmail("user" + i + "@test.com");
            user.setPasswordHash(passwordEncoder.encode(TEST_PASSWORD));
            user.setName("Test User " + i);
            user.setGoalType("strength");
            user.setTargetValue(100.0);
            users.add(user);
        }
        return userRepository.saveAll(users);
    }

    private void logSeedSummary(List<User> users) {
        User testUser = users.get(0);
        String token = jwtUtil.generate(testUser.getId(), testUser.getEmail());

        System.out.println("==========================================");
        System.out.println("Seeded " + users.size() + " user(s)");
        System.out.println("Test username: " + testUser.getEmail());
        System.out.println("Test password: " + TEST_PASSWORD);
        System.out.println("JWT token:     " + token);
        System.out.println("==========================================");
    }
}
