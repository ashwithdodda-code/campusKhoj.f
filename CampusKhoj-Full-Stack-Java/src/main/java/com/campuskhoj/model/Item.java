package com.campuskhoj.model;

import com.campuskhoj.model.enums.Category;
import com.campuskhoj.model.enums.ItemStatus;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Abstract Base Class for reported belongings.
 * Matches PPT Slide 6, 7, 8, 9:
 * - Implements Serializable for object stream file storage (items.dat)
 * - Demonstrates Encapsulation (private fields, validation in setName)
 * - Static counter generates unique, immutable IDs
 * - Abstract methods: getType() and getInitialStatus()
 */
public abstract class Item implements Serializable {
    private static final long serialVersionUID = 1L;

    // Static counter as highlighted in PPT Slide 7 & 10
    private static int counter = 1000;

    // Final immutable itemId
    private final String itemId;

    // Encapsulated state
    private String name;
    private Category category;
    private ItemStatus status;
    private String description;
    private String location;
    private LocalDate incidentDate;
    private String reportedByUserId;
    private String reportedByUserName;
    private LocalDateTime createdAt;

    public Item(String name, Category category, String description, String location, LocalDate incidentDate, String reportedByUserId, String reportedByUserName) {
        this.itemId = "ITEM-" + (++counter);
        setName(name);
        this.category = category;
        this.status = getInitialStatus();
        this.description = description != null ? description.trim() : "";
        this.location = location != null ? location.trim() : "Campus";
        this.incidentDate = incidentDate != null ? incidentDate : LocalDate.now();
        this.reportedByUserId = reportedByUserId;
        this.reportedByUserName = reportedByUserName;
        this.createdAt = LocalDateTime.now();
    }

    // Static counter accessors
    public static synchronized void setCounter(int value) {
        counter = value;
    }

    public static synchronized int getCounter() {
        return counter;
    }

    // Abstract methods - Abstraction & Polymorphism
    public abstract String getType();
    public abstract ItemStatus getInitialStatus();

    // Encapsulated getters and setters with validation
    public String getItemId() {
        return itemId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Item name cannot be empty");
        }
        this.name = name.trim();
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        if (category == null) {
            throw new IllegalArgumentException("Category cannot be null");
        }
        this.category = category;
    }

    public ItemStatus getStatus() {
        return status;
    }

    public void setStatus(ItemStatus status) {
        if (status == null) {
            throw new IllegalArgumentException("Item status cannot be null");
        }
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description != null ? description.trim() : "";
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location != null ? location.trim() : "";
    }

    public LocalDate getIncidentDate() {
        return incidentDate;
    }

    public void setIncidentDate(LocalDate incidentDate) {
        this.incidentDate = incidentDate;
    }

    public String getReportedByUserId() {
        return reportedByUserId;
    }

    public void setReportedByUserId(String reportedByUserId) {
        this.reportedByUserId = reportedByUserId;
    }

    public String getReportedByUserName() {
        return reportedByUserName;
    }

    public void setReportedByUserName(String reportedByUserName) {
        this.reportedByUserName = reportedByUserName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return String.format("[%s #%s] %s (%s) @ %s [%s]", getType(), itemId, name, category, location, status);
    }
}
