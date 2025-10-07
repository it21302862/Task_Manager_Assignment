package com.taskmanager.taskmanager.controller;

import com.taskmanager.taskmanager.dto.TaskRequestDTO;
import com.taskmanager.taskmanager.dto.TaskResponseDTO;
import com.taskmanager.taskmanager.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
public class TaskControllerTest {

    @Mock
    private TaskService taskService;

    @InjectMocks
    private TaskController taskController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateTask() {
        TaskRequestDTO request = new TaskRequestDTO();
        request.setTitle("Test Task");
        request.setDescription("Test Description");

        TaskResponseDTO response = new TaskResponseDTO();
        response.setId(1L);
        response.setTitle("Test Task");
        response.setDescription("Test Description");
        response.setCompleted(false);

        when(taskService.createTask(request)).thenReturn(response);

        ResponseEntity<TaskResponseDTO> result = taskController.createTask(request);

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertEquals(response, result.getBody());
        verify(taskService, times(1)).createTask(request);
    }

    @Test
    void testGetRecentTasks() {
        TaskResponseDTO task1 = new TaskResponseDTO();
        task1.setId(1L);
        task1.setTitle("Task 1");

        TaskResponseDTO task2 = new TaskResponseDTO();
        task2.setId(2L);
        task2.setTitle("Task 2");

        List<TaskResponseDTO> tasks = Arrays.asList(task1, task2);

        when(taskService.getRecentTasks()).thenReturn(tasks);

        ResponseEntity<List<TaskResponseDTO>> result = taskController.getRecentTasks();

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(2, result.getBody().size());
        verify(taskService, times(1)).getRecentTasks();
    }

    @Test
    void testMarkAsDone() {
        Long taskId = 1L;

        TaskResponseDTO updatedTask = new TaskResponseDTO();
        updatedTask.setId(taskId);
        updatedTask.setTitle("Task 1");
        updatedTask.setCompleted(true);

        when(taskService.markAsDone(taskId)).thenReturn(updatedTask);

        ResponseEntity<TaskResponseDTO> result = taskController.markAsDone(taskId);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(updatedTask, result.getBody());
        verify(taskService, times(1)).markAsDone(taskId);
    }

    @Test
    void testDeleteTask() {
        Long taskId = 1L;

        doNothing().when(taskService).deleteTask(taskId);

        ResponseEntity<String> result = taskController.deleteTask(taskId);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("Task deleted successfully", result.getBody());
        verify(taskService, times(1)).deleteTask(taskId);
    }
}
