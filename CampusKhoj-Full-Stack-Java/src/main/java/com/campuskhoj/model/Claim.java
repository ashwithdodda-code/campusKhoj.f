package com.campuskhoj.model;

import com.campuskhoj.model.enums.ClaimStatus;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Claim representation showing Association & Composition:
 * PPT Slide 6 & 10: "Claim has-a Item, has-a User"
 */
public class Claim implements Serializable {
    private static final long serialVersionUID = 1L;

    private static int claimCounter = 7000;

    private final String claimId;
    private final Item item;
    private final User claimant;
    private String proofDescription;
    private String contactPhone;
    private ClaimStatus status;
    private String adminReviewNotes;
    private String reviewedByAdminName;
    private LocalDateTime reviewedAt;
    private boolean handoverConfirmed;
    private LocalDateTime handoverConfirmedAt;
    private LocalDateTime createdAt;

    public Claim(Item item, User claimant, String proofDescription, String contactPhone) {
        if (item == null) {
            throw new IllegalArgumentException("Claim must be associated with an item");
        }
        if (claimant == null) {
            throw new IllegalArgumentException("Claim must be submitted by a registered user");
        }
        if (proofDescription == null || proofDescription.trim().length() < 5) {
            throw new IllegalArgumentException("Proof description must contain specific ownership evidence (min 5 characters)");
        }

        this.claimId = "CLM-" + (++claimCounter);
        this.item = item;
        this.claimant = claimant;
        this.proofDescription = proofDescription.trim();
        this.contactPhone = contactPhone != null ? contactPhone.trim() : "";
        this.status = ClaimStatus.PENDING;
        this.createdAt = LocalDateTime.now();
        this.handoverConfirmed = false;
    }

    public static synchronized void setCounter(int value) {
        claimCounter = value;
    }

    public static synchronized int getCounter() {
        return claimCounter;
    }

    public String getClaimId() {
        return claimId;
    }

    public Item getItem() {
        return item;
    }

    public User getClaimant() {
        return claimant;
    }

    public String getProofDescription() {
        return proofDescription;
    }

    public void setProofDescription(String proofDescription) {
        this.proofDescription = proofDescription;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public ClaimStatus getStatus() {
        return status;
    }

    public void setStatus(ClaimStatus status) {
        this.status = status;
    }

    public String getAdminReviewNotes() {
        return adminReviewNotes;
    }

    public void setAdminReviewNotes(String adminReviewNotes) {
        this.adminReviewNotes = adminReviewNotes;
    }

    public String getReviewedByAdminName() {
        return reviewedByAdminName;
    }

    public void setReviewedByAdminName(String reviewedByAdminName) {
        this.reviewedByAdminName = reviewedByAdminName;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public boolean isHandoverConfirmed() {
        return handoverConfirmed;
    }

    public void setHandoverConfirmed(boolean handoverConfirmed) {
        this.handoverConfirmed = handoverConfirmed;
    }

    public LocalDateTime getHandoverConfirmedAt() {
        return handoverConfirmedAt;
    }

    public void setHandoverConfirmedAt(LocalDateTime handoverConfirmedAt) {
        this.handoverConfirmedAt = handoverConfirmedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
