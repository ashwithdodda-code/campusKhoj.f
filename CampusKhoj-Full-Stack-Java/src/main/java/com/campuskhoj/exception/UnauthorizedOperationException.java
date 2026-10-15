package com.campuskhoj.exception;

/**
 * Custom Exception thrown when an unauthorized user attempts an operation.
 */
public class UnauthorizedOperationException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public UnauthorizedOperationException(String message) {
        super(message);
    }
}
