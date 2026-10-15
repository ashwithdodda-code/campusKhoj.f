package com.campuskhoj.dto;

import jakarta.validation.constraints.NotNull;

public class ClaimReviewDto {
    @NotNull(message = "Decision (approve boolean) is required")
    private Boolean approve;

    private String reason;

    public Boolean getApprove() { return approve; }
    public void setApprove(Boolean approve) { this.approve = approve; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
