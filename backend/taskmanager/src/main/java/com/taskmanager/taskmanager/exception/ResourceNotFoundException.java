package com.taskmanager.taskmanager.exception;

/**
 * Custom exception to handle resource not found scenarios.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
