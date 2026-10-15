package com.campuskhoj;

import com.campuskhoj.model.FoundItem;
import com.campuskhoj.model.LostItem;
import com.campuskhoj.model.MatchResult;
import com.campuskhoj.model.enums.Category;
import com.campuskhoj.service.MatchingEngine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests verifying the exact Auto-Matching Engine algorithm from PPT Slide 5:
 * Category (+40) + Location (+20) + Date within 3 days (+10) + Keywords (up to +30)
 * Match threshold: score >= 50
 */
class MatchingEngineTest {

    private MatchingEngine matchingEngine;

    @BeforeEach
    void setUp() {
        matchingEngine = new MatchingEngine();
    }

    @Test
    @DisplayName("Exact match across category, location, date, and keywords should score >= 90")
    void testPerfectMatch() {
        LocalDate today = LocalDate.now();

        LostItem lost = new LostItem(
            "Casio Scientific Calculator fx-991CW",
            Category.ELECTRONICS,
            "Black scientific calculator with solar panel",
            "Block A - Computer Lab 3",
            today,
            "USR-1",
            "Student Ashwith"
        );

        FoundItem found = new FoundItem(
            "Casio Calculator Scientific fx-991CW",
            Category.ELECTRONICS,
            "Found calculator on desk with solar panel",
            "Block A - Computer Lab 3",
            today.minusDays(1),
            "USR-2",
            "Staff Dhruva",
            "Security Desk"
        );

        MatchResult result = matchingEngine.evaluateMatch(lost, found);

        assertEquals(40, result.getCategoryScore(), "Category match must award 40 points");
        assertEquals(20, result.getLocationScore(), "Location match must award 20 points");
        assertEquals(10, result.getDateScore(), "Date within 3 days must award 10 points");
        assertTrue(result.getKeywordScore() >= 20, "Keyword overlap must award points");
        assertTrue(result.getTotalScore() >= 90, "Total score should be >= 90");
        assertTrue(result.isQualified(), "Result must be marked qualified as score >= 50");
    }

    @Test
    @DisplayName("Different category and location should not meet threshold (score < 50)")
    void testUnrelatedItems() {
        LocalDate today = LocalDate.now();

        LostItem lost = new LostItem(
            "Water Bottle",
            Category.OTHER,
            "Blue metal flask",
            "Sports Complex",
            today.minusDays(10),
            "USR-1",
            "Ashwith"
        );

        FoundItem found = new FoundItem(
            "Calculus Textbook",
            Category.BOOKS_STATIONERY,
            "Mathematics volume 2",
            "Library 3rd Floor",
            today,
            "USR-2",
            "Dhruva",
            "Librarian Desk"
        );

        MatchResult result = matchingEngine.evaluateMatch(lost, found);

        assertEquals(0, result.getCategoryScore());
        assertEquals(0, result.getLocationScore());
        assertEquals(0, result.getDateScore());
        assertEquals(0, result.getKeywordScore());
        assertEquals(0, result.getTotalScore());
        assertFalse(result.isQualified(), "Score < 50 must NOT qualify as a suggested match");
    }

    @Test
    @DisplayName("Category alone (+40) without other matches should NOT pass threshold of 50")
    void testCategoryOnlyDoesNotExceedThreshold() {
        LostItem lost = new LostItem(
            "Sony Headphones",
            Category.ELECTRONICS,
            "Wireless over-ear headphones",
            "Auditorium",
            LocalDate.of(2026, 1, 1),
            "USR-1",
            "Ashwith"
        );

        FoundItem found = new FoundItem(
            "Samsung Phone Charger",
            Category.ELECTRONICS,
            "White USB-C charging cable",
            "Parking Lot",
            LocalDate.of(2026, 2, 1),
            "USR-2",
            "Dhruva",
            "Security Cabin"
        );

        MatchResult result = matchingEngine.evaluateMatch(lost, found);

        assertEquals(40, result.getCategoryScore());
        assertEquals(0, result.getLocationScore());
        assertEquals(0, result.getDateScore());
        assertEquals(40, result.getTotalScore());
        assertFalse(result.isQualified(), "Score 40 is below threshold of 50");
    }
}
