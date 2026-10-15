package com.campuskhoj.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Result of an auto-match comparison between a LostItem and a FoundItem.
 * Matches PPT Slide 5:
 * Category (+40) + Location (+20) + Date within 3 days (+10) + Keywords (up to +30)
 * Threshold: score >= 50
 */
public class MatchResult implements Serializable {
    private static final long serialVersionUID = 1L;

    private final Item lostItem;
    private final Item foundItem;
    private final int totalScore;
    private final int categoryScore;
    private final int locationScore;
    private final int dateScore;
    private final int keywordScore;
    private final List<String> reasons;
    private final boolean qualified;

    public MatchResult(Item lostItem, Item foundItem, int totalScore,
                       int categoryScore, int locationScore, int dateScore, int keywordScore,
                       List<String> reasons) {
        this.lostItem = lostItem;
        this.foundItem = foundItem;
        this.totalScore = totalScore;
        this.categoryScore = categoryScore;
        this.locationScore = locationScore;
        this.dateScore = dateScore;
        this.keywordScore = keywordScore;
        this.reasons = reasons != null ? new ArrayList<>(reasons) : new ArrayList<>();
        this.qualified = totalScore >= 50;
    }

    public Item getLostItem() {
        return lostItem;
    }

    public Item getFoundItem() {
        return foundItem;
    }

    public int getTotalScore() {
        return totalScore;
    }

    public int getCategoryScore() {
        return categoryScore;
    }

    public int getLocationScore() {
        return locationScore;
    }

    public int getDateScore() {
        return dateScore;
    }

    public int getKeywordScore() {
        return keywordScore;
    }

    public List<String> getReasons() {
        return reasons;
    }

    public boolean isQualified() {
        return qualified;
    }

    @Override
    public String toString() {
        return String.format("Match [%d pts] '%s' <-> '%s' (Qualified: %b)",
            totalScore, lostItem.getName(), foundItem.getName(), qualified);
    }
}
