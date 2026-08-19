package com.github.rishiraj1337.momentum.repository;

import com.github.rishiraj1337.momentum.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}