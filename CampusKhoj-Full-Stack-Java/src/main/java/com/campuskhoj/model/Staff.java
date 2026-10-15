package com.campuskhoj.model;

/**
 * Concrete Staff entity extending User.
 * Demonstrates Inheritance and Polymorphic method overriding.
 */
public class Staff extends User {
    private static final long serialVersionUID = 1L;

    private String designation;

    public Staff(String name, String email, String passwordHash, String staffId, String department, String designation) {
        super(name, email, passwordHash, staffId, department);
        this.designation = designation;
    }

    @Override
    public String getRole() {
        return "STAFF";
    }

    @Override
    public boolean canApproveClaims() {
        return false;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }
}
