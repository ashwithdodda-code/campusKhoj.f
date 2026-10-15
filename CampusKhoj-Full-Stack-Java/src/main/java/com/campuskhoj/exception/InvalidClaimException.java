package com.campuskhoj.exception;

/**
 * Custom Exception thrown when an invalid claim is submitted or processed.
 * Matches PPT Slide 6, 9, 10.
 */
public class InvalidClaimException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public InvalidClaimException(String message) {
        super(message);
    }
}
