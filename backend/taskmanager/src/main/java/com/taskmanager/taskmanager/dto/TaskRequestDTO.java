package com.taskmanager.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * DTO for creating or updating a Task.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequestDTO {

    @NotBlank(message = "Title is required")
    private String title;
    @NotBlank(message = "Description is required")
    private String description;
}
