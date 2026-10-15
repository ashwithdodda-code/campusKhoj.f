package com.campuskhoj.model;

/**
 * Concrete Student entity extending User.
 * Demonstrates Inheritance and Polymorphic method overriding.
 */
public class Student extends User {
    private static final long serialVersionUID = 1L;

    private int yearOfStudy;

    public Student(String name, String email, String passwordHash, String rollNumber, String branch, int yearOfStudy) {
        super(name, email, passwordHash, rollNumber, branch);
        this.yearOfStudy = yearOfStudy;
    }

    @Override
    public String getRole() {
        return "STUDENT";
    }

    @Override
    public boolean canApproveClaims() {
        return false;
    }

    public int getYearOfStudy() {
        return yearOfStudy;
    }

    public void setYearOfStudy(int yearOfStudy) {
        this.yearOfStudy = yearOfStudy;
    }
}
