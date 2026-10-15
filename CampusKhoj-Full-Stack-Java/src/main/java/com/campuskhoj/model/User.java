package com.campuskhoj.model;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Abstract Base Class for all Users in CampusKhoj.
 * Demonstrates:
 * 1. Abstraction (cannot be instantiated directly, defines abstract contract).
 * 2. Encapsulation (private fields, validation in setters).
 * 3. Inheritance (extended by Student, Staff, Admin).
 * 4. Polymorphism (subclasses override getRole() and canApproveClaims()).
 */
public abstract class User implements Serializable {
    private static final long serialVersionUID = 1L;

    private static int userCounter = 5000;

    private final String userId;
    private String name;
    private String email;
    private String passwordHash;
    private String collegeId;
    private String departmentOrBranch;
    private LocalDateTime registeredAt;

    public User(String name, String email, String passwordHash, String collegeId, String departmentOrBranch) {
        this.userId = "USR-" + (++userCounter);
        setName(name);
        setEmail(email);
        this.passwordHash = passwordHash;
        this.collegeId = collegeId;
        this.departmentOrBranch = departmentOrBranch;
        this.registeredAt = LocalDateTime.now();
    }

    public static synchronized void setCounter(int value) {
        userCounter = value;
    }

    public static synchronized int getCounter() {
        return userCounter;
    }

    // Abstract methods demonstrating Abstraction & Polymorphism
    public abstract String getRole();
    public abstract boolean canApproveClaims();

    // Getters and Setters demonstrating Encapsulation
    public String getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("User name cannot be empty");
        }
        this.name = name.trim();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Invalid email address");
        }
        this.email = email.trim().toLowerCase();
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getCollegeId() {
        return collegeId;
    }

    public void setCollegeId(String collegeId) {
        this.collegeId = collegeId;
    }

    public String getDepartmentOrBranch() {
        return departmentOrBranch;
    }

    public void setDepartmentOrBranch(String departmentOrBranch) {
        this.departmentOrBranch = departmentOrBranch;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }

    @Override
    public String toString() {
        return String.format("[%s] %s (%s) - ID: %s", getRole(), name, email, collegeId);
    }
}
