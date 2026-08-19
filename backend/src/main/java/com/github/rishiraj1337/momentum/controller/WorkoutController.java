package com.github.rishiraj1337.momentum.controller;

import com.github.rishiraj1337.momentum.dto.CreateWorkoutRequest;
import com.github.rishiraj1337.momentum.dto.WorkoutResponse;
import com.github.rishiraj1337.momentum.service.WorkoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutService workoutService;

    @PostMapping
    public ResponseEntity<WorkoutResponse> create(@Valid @RequestBody CreateWorkoutRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workoutService.create(request));
    }

    @GetMapping
    public List<WorkoutResponse> getAll() {
        return workoutService.findAll();
    }

    @GetMapping("/{id}")
    public WorkoutResponse getById(@PathVariable Long id) {
        return workoutService.findById(id);
    }

    @PutMapping("/{id}")
    public WorkoutResponse update(@PathVariable Long id, @Valid @RequestBody CreateWorkoutRequest request) {
        return workoutService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        workoutService.delete(id);
        return ResponseEntity.noContent().build();
    }
}