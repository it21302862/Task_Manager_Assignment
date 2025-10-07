package com.taskmanager.taskmanager.dto;

import lombok.*;

/**
 * DTO for returning task details in responses.
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskResponseDTO {
    private Long id;
    private String title;
    private String description;
    private boolean completed;
}

