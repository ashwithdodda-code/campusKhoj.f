package com.campuskhoj;

import com.campuskhoj.exception.InvalidClaimException;
import com.campuskhoj.exception.UnauthorizedOperationException;
import com.campuskhoj.model.*;
import com.campuskhoj.model.enums.Category;
import com.campuskhoj.model.enums.ClaimStatus;
import com.campuskhoj.model.enums.ItemStatus;
import com.campuskhoj.service.LostFoundService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests verifying Claim & Ownership Verification Workflow from PPT Slide 3, 5, 6:
 * Owner submits proof -> Pending -> Admin Approves/Rejects -> Item becomes RETURNED
 */
class ClaimWorkflowTest {

    private LostFoundService service;
    private Student student;
    private Admin admin;
    private Staff staff;

    @BeforeEach
    void setUp() {
        String testDb = "./data/test_items_" + System.currentTimeMillis() + ".dat";
        service = new LostFoundService(testDb);

        student = new Student("Ashwith", "ash@c.edu", "pass", "25071A6617", "CSE", 3);
        staff = new Staff("Dhruva", "dhr@c.edu", "pass", "25071A6616", "Library", "Assistant");
        admin = new Admin("Varshith", "var@c.edu", "pass", "25071A6607", "Chief Proctor", 3);

        // Delete test file on teardown
        new File(testDb).deleteOnExit();
    }

    @Test
    @DisplayName("Complete happy path: Claim -> Approve -> Handover to RETURNED")
    void testClaimLifecycleHappyPath() {
        FoundItem found = service.registerFoundItem(
            "HP Pavilion Laptop Charger",
            Category.ELECTRONICS,
            "Black 65W barrel pin charger",
            "Library 2nd Floor",
            LocalDate.now(),
            staff,
            "Security Desk Locker 4"
        );

        // 1. Submit claim
        Claim claim = service.submitClaim(
            found.getItemId(),
            student,
            "Has blue electrical tape around the jack and serial ending in 8892",
            "+91 9876543210"
        );

        assertNotNull(claim);
        assertEquals(ClaimStatus.PENDING, claim.getStatus());
        assertEquals(ItemStatus.CLAIMED, found.getStatus());

        // 2. Admin reviews & approves
        Claim approved = service.reviewClaim(claim.getClaimId(), admin, true, "Serial number matched records");
        assertEquals(ClaimStatus.APPROVED, approved.getStatus());
        assertEquals("Varshith", approved.getReviewedByAdminName());

        // 3. Confirm Handover
        Claim returned = service.confirmHandover(claim.getClaimId(), admin);
        assertEquals(ClaimStatus.RETURNED, returned.getStatus());
        assertEquals(ItemStatus.RETURNED, found.getStatus(), "Item status must transition to RETURNED");
        assertTrue(returned.isHandoverConfirmed());
    }

    @Test
    @DisplayName("Non-admin user cannot approve claims")
    void testNonAdminCannotApproveClaim() {
        FoundItem found = service.registerFoundItem(
            "Umbrella", Category.OTHER, "Blue umbrella", "Canteen", LocalDate.now(), staff, "Desk"
        );
        Claim claim = service.submitClaim(found.getItemId(), student, "Has floral pattern", "123");

        assertThrows(UnauthorizedOperationException.class, () ->
            service.reviewClaim(claim.getClaimId(), student, true, "Self approval attempt")
        );
    }

    @Test
    @DisplayName("Cannot claim already returned item")
    void testCannotClaimReturnedItem() {
        FoundItem found = service.registerFoundItem(
            "Pen drive", Category.ELECTRONICS, "SanDisk 64GB", "Lab", LocalDate.now(), staff, "Desk"
        );
        Claim claim = service.submitClaim(found.getItemId(), student, "Contains OS lab assignments", "123");
        service.reviewClaim(claim.getClaimId(), admin, true, "Verified");
        service.confirmHandover(claim.getClaimId(), admin);

        Student anotherStudent = new Student("Hansika", "han@c.edu", "pass", "25071A6621", "IT", 3);
        assertThrows(InvalidClaimException.class, () ->
            service.submitClaim(found.getItemId(), anotherStudent, "Different proof", "456")
        );
    }
}
