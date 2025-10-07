package com.taskmanager.taskmanager;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import org.junit.jupiter.api.Test;
import com.taskmanager.taskmanager.dto.TaskRequestDTO;
import org.springframework.http.MediaType;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class TaskControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TaskRepository taskRepository;

    @BeforeEach
    void setup() {
        taskRepository.deleteAll(); // Clean database before each test
    }

    @Test
    void testCreateTask() throws Exception {
        TaskRequestDTO request = new TaskRequestDTO();
        request.setTitle("Integration Task");
        request.setDescription("Integration Test Description");

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.title").value("Integration Task"))
                .andExpect(jsonPath("$.completed").value(false));
    }

    @Test
    void testGetRecentTasks() throws Exception {
        Task task = new Task();
        task.setTitle("Task 1");
        task.setDescription("Test");
        task.setCompleted(false);
        taskRepository.save(task);

        mockMvc.perform(get("/api/tasks/recent"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("Task 1"));
    }

    @Test
    void testMarkAsDone() throws Exception {
        Task task = new Task();
        task.setTitle("Task 2");
        task.setDescription("Test Mark");
        task.setCompleted(false);
        task = taskRepository.save(task);

        mockMvc.perform(put("/api/tasks/{id}/complete", task.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(true));
    }

    @Test
    void testDeleteTask() throws Exception {
        Task task = new Task();
        task.setTitle("Task 3");
        task.setDescription("Delete Test");
        task.setCompleted(false);
        task = taskRepository.save(task);

        mockMvc.perform(delete("/api/tasks/{id}", task.getId()))
                .andExpect(status().isOk())
                .andExpect(content().string("Task deleted successfully"));
    }
}
