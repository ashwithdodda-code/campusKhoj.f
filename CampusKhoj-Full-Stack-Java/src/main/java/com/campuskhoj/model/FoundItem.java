package com.campuskhoj.model;

import com.campuskhoj.model.enums.Category;
import com.campuskhoj.model.enums.ItemStatus;

import java.time.LocalDate;

/**
 * Concrete class for a found item registered on campus.
 * Matches PPT Slide 3, 6, 9:
 * "Register Found Item: Same details plus where the item is stored"
 */
public class FoundItem extends Item {
    private static final long serialVersionUID = 1L;

    // Field required by PPT Slide 3
    private String storageLocation;

    public FoundItem(String name, Category category, String description, String location, LocalDate incidentDate,
                     String reportedByUserId, String reportedByUserName, String storageLocation) {
        super(name, category, description, location, incidentDate, reportedByUserId, reportedByUserName);
        this.storageLocation = storageLocation != null ? storageLocation.trim() : "Main Security Desk / Admin Office";
    }

    @Override
    public String getType() {
        return "FOUND";
    }

    @Override
    public ItemStatus getInitialStatus() {
        return ItemStatus.FOUND;
    }

    public String getStorageLocation() {
        return storageLocation;
    }

    public void setStorageLocation(String storageLocation) {
        this.storageLocation = storageLocation != null ? storageLocation.trim() : "Main Security Desk";
    }

    @Override
    public String toString() {
        return super.toString() + " [Safely Stored at: " + storageLocation + "]";
    }
}
