package com.campuskhoj.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ClaimRequestDto {
    @NotBlank(message = "Item ID is required")
    private String itemId;

    @NotBlank(message = "Proof description is required")
    @Size(min = 5, message = "Proof description must be at least 5 characters (include serial numbers, color shades, or internal marks)")
    private String proofDescription;

    private String contactPhone;

    public String getItemId() { return itemId; }
    public void setItemId(String itemId) { this.itemId = itemId; }
    public String getProofDescription() { return proofDescription; }
    public void setProofDescription(String proofDescription) { this.proofDescription = proofDescription; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
}
