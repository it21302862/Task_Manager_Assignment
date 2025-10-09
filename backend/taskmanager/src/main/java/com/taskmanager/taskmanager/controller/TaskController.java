package com.taskmanager.taskmanager.controller;

import com.taskmanager.taskmanager.dto.TaskRequestDTO;
import com.taskmanager.taskmanager.dto.TaskResponseDTO;
import com.taskmanager.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for managing task endpoints.
 */
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * Create a new task.
     */
    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(@Valid @RequestBody TaskRequestDTO taskRequest) {
        TaskResponseDTO createdTask = taskService.createTask(taskRequest);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    /**
     * Get the 5 most recent incomplete tasks.
     */
    @GetMapping("/recent")
    public ResponseEntity<List<TaskResponseDTO>> getRecentTasks() {
        List<TaskResponseDTO> tasks = taskService.getRecentTasks();
        return ResponseEntity.ok(tasks);
    }

    /**
     * Mark a task as completed.
     */
    @PutMapping("/{id}/complete")
    public ResponseEntity<TaskResponseDTO> markAsDone(@PathVariable Long id) {
        TaskResponseDTO updatedTask = taskService.markAsDone(id);
        return ResponseEntity.ok(updatedTask);
    }

    /**
     * Update a task (title, description, etc.).
     */
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequestDTO taskRequest) {
        TaskResponseDTO updatedTask = taskService.updateTask(id, taskRequest);
        return ResponseEntity.ok(updatedTask);
    }


    /**
     * Delete a task by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok("Task deleted successfully");
    }

}
