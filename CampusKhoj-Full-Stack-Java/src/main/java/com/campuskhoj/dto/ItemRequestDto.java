package com.campuskhoj.dto;

import com.campuskhoj.model.enums.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class ItemRequestDto {
    @NotBlank(message = "Item name is required")
    private String name;

    @NotNull(message = "Category is required")
    private Category category;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Campus location is required")
    private String location;

    private LocalDate incidentDate;

    // "LOST" or "FOUND"
    @NotBlank(message = "Type must be either LOST or FOUND")
    private String type;

    // Required when type is FOUND (Slide 3)
    private String storageLocation;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public LocalDate getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDate incidentDate) { this.incidentDate = incidentDate; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getStorageLocation() { return storageLocation; }
    public void setStorageLocation(String storageLocation) { this.storageLocation = storageLocation; }
}
