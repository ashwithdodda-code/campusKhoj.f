package com.campuskhoj.model;

/**
 * Concrete Admin entity extending User.
 * Demonstrates Inheritance, Polymorphic privilege escalation check,
 * and Administrative authority in CampusKhoj.
 */
public class Admin extends User {
    private static final long serialVersionUID = 1L;

    private String administrativeOffice;
    private int securityClearanceLevel;

    public Admin(String name, String email, String passwordHash, String adminId, String office, int securityClearanceLevel) {
        super(name, email, passwordHash, adminId, office);
        this.administrativeOffice = office;
        this.securityClearanceLevel = securityClearanceLevel;
    }

    @Override
    public String getRole() {
        return "ADMIN";
    }

    @Override
    public boolean canApproveClaims() {
        return true;
    }

    public String getAdministrativeOffice() {
        return administrativeOffice;
    }

    public void setAdministrativeOffice(String administrativeOffice) {
        this.administrativeOffice = administrativeOffice;
    }

    public int getSecurityClearanceLevel() {
        return securityClearanceLevel;
    }

    public void setSecurityClearanceLevel(int securityClearanceLevel) {
        this.securityClearanceLevel = securityClearanceLevel;
    }
}
