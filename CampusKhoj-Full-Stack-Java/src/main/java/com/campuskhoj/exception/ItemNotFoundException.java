package com.campuskhoj.exception;

/**
 * Custom Exception thrown when an item is not found in CampusKhoj registry.
 * Matches PPT Slide 6, 9, 10.
 */
public class ItemNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public ItemNotFoundException(String message) {
        super(message);
    }

    public ItemNotFoundException(String itemId, String entityType) {
        super(String.format("%s with ID '%s' was not found in the campus register", entityType, itemId));
    }
}
