package com.taskmanager.taskmanager.service;

import com.taskmanager.taskmanager.dto.TaskRequestDTO;
import com.taskmanager.taskmanager.dto.TaskResponseDTO;
import com.taskmanager.taskmanager.entity.Task;
import com.taskmanager.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class that handles business logic related to Task management.
 */
@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    /**
     * Create and save a new task.
     *
     * @param taskRequest the task creation data
     * @return the created task response
     */
    public TaskResponseDTO createTask(TaskRequestDTO taskRequest) {
        Task task = new Task();
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setCompleted(false);

        Task savedTask = taskRepository.save(task);
        return mapToResponseDTO(savedTask);
    }

    /**
     * Retrieve the five most recent incomplete tasks.
     *
     * @return list of recent task responses
     */
    public List<TaskResponseDTO> getRecentTasks() {
        return taskRepository.findTop5ByCompletedFalseOrderByIdDesc()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Mark a task as completed.
     *
     * @param id the ID of the task to mark as done
     * @return the updated task response
     * @throws ResourceNotFoundException if the task does not exist
     */
    public TaskResponseDTO markAsDone(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        task.setCompleted(true);
        Task updatedTask = taskRepository.save(task);
        return mapToResponseDTO(updatedTask);
    }

    /**
     * Update an existing task's information based on the provided request data.
     *
     * <p>This method retrieves the task by its ID, updates its fields such as
     * title and description, and persists the changes to the database.</p>
     *
     * @param id the ID of the task to update
     * @param taskRequest the new task details to apply
     * @return the updated task as a {@link TaskResponseDTO}
     * @throws ResourceNotFoundException if no task is found with the given ID
     */

    public TaskResponseDTO updateTask(Long id, TaskRequestDTO taskRequest) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        Task updatedTask = taskRepository.save(task);
        return mapToResponseDTO(updatedTask);
    }


    /**
     * Delete a task by its ID.
     *
     * @param id the ID of the task to delete
     * @throws ResourceNotFoundException if the task does not exist
     */
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        taskRepository.delete(task);
    }


    /**
     * Helper method to map a Task entity to its response DTO.
     */
    private TaskResponseDTO mapToResponseDTO(Task task) {
        return new TaskResponseDTO(task.getId(), task.getTitle(), task.getDescription(), task.isCompleted());
    }
}
