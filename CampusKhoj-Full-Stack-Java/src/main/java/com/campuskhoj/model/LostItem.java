package com.campuskhoj.model;

import com.campuskhoj.model.enums.Category;
import com.campuskhoj.model.enums.ItemStatus;
import com.campuskhoj.model.interfaces.Matchable;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * Concrete class for a lost item report.
 * Matches PPT Slide 6 & 7:
 * "public class LostItem extends Item implements Matchable"
 * Implements matchScore(Item other) scoring algorithm.
 */
public class LostItem extends Item implements Matchable {
    private static final long serialVersionUID = 1L;

    private String suspectedLossArea;

    public LostItem(String name, Category category, String description, String location, LocalDate incidentDate, String reportedByUserId, String reportedByUserName) {
        super(name, category, description, location, incidentDate, reportedByUserId, reportedByUserName);
        this.suspectedLossArea = location;
    }

    @Override
    public String getType() {
        return "LOST";
    }

    @Override
    public ItemStatus getInitialStatus() {
        return ItemStatus.LOST;
    }

    public String getSuspectedLossArea() {
        return suspectedLossArea;
    }

    public void setSuspectedLossArea(String suspectedLossArea) {
        this.suspectedLossArea = suspectedLossArea;
    }

    /**
     * Exact PPT Matching algorithm:
     * category: +40
     * location: +20
     * date within 3 days: +10
     * keywords: up to +30
     * Threshold: score >= 50
     */
    @Override
    public int matchScore(Item other) {
        if (other == null || this.getItemId().equals(other.getItemId())) {
            return 0;
        }

        int score = 0;

        // 1. Category match (+40)
        if (this.getCategory() == other.getCategory()) {
            score += 40;
        }

        // 2. Location match (+20)
        if (this.getLocation() != null && other.getLocation() != null) {
            String loc1 = this.getLocation().toLowerCase().trim();
            String loc2 = other.getLocation().toLowerCase().trim();
            if (loc1.equalsIgnoreCase(loc2) || loc1.contains(loc2) || loc2.contains(loc1)) {
                score += 20;
            }
        }

        // 3. Date within 3 days (+10)
        if (this.getIncidentDate() != null && other.getIncidentDate() != null) {
            long daysApart = Math.abs(ChronoUnit.DAYS.between(this.getIncidentDate(), other.getIncidentDate()));
            if (daysApart <= 3) {
                score += 10;
            }
        }

        // 4. Keyword similarity (up to +30)
        score += computeKeywordScore(this.getName() + " " + this.getDescription(),
                                     other.getName() + " " + other.getDescription());

        return Math.min(score, 100);
    }

    private int computeKeywordScore(String textA, String textB) {
        Set<String> wordsA = extractMeaningfulTokens(textA);
        Set<String> wordsB = extractMeaningfulTokens(textB);

        if (wordsA.isEmpty() || wordsB.isEmpty()) {
            return 0;
        }

        long common = wordsA.stream().filter(wordsB::contains).count();
        if (common >= 3) {
            return 30;
        } else if (common == 2) {
            return 20;
        } else if (common == 1) {
            return 10;
        }
        return 0;
    }

    private Set<String> extractMeaningfulTokens(String text) {
        if (text == null) return new HashSet<>();
        Set<String> stopWords = new HashSet<>(Arrays.asList(
            "the", "a", "an", "and", "or", "in", "on", "at", "to", "for", "of", "with", "is", "was", "near", "by"
        ));
        Set<String> tokens = new HashSet<>();
        for (String word : text.toLowerCase().split("[^a-zA-Z0-9]+")) {
            if (word.length() > 2 && !stopWords.contains(word)) {
                tokens.add(word);
            }
        }
        return tokens;
    }
}
