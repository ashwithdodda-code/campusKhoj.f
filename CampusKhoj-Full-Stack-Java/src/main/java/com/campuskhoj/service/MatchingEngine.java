package com.campuskhoj.service;

import com.campuskhoj.model.Item;
import com.campuskhoj.model.MatchResult;

import java.time.temporal.ChronoUnit;
import java.util.*;

/**
 * Smart Auto-Matching Engine implementing PPT Slide 5 algorithm:
 * - Category match: +40
 * - Location match: +20
 * - Date within 3 days: +10
 * - Keywords overlap: up to +30
 * - Suggested match threshold: score >= 50
 */
public class MatchingEngine {

    public static final int THRESHOLD = 50;

    private static final Set<String> STOP_WORDS = new HashSet<>(Arrays.asList(
        "the", "a", "an", "and", "or", "in", "on", "at", "to", "for", "of", "with",
        "is", "was", "near", "by", "from", "my", "lost", "found", "black", "blue", "grey"
    ));

    /**
     * Scores a lost item against a candidate found item.
     */
    public MatchResult evaluateMatch(Item lostItem, Item foundItem) {
        if (lostItem == null || foundItem == null) {
            return new MatchResult(lostItem, foundItem, 0, 0, 0, 0, 0, Collections.emptyList());
        }

        int catScore = 0;
        int locScore = 0;
        int dateScore = 0;
        int kwScore = 0;
        List<String> reasons = new ArrayList<>();

        // 1. Category match (+40)
        if (lostItem.getCategory() == foundItem.getCategory()) {
            catScore = 40;
            reasons.add(String.format("Exact Category Match: %s (+40)", lostItem.getCategory().getDisplayName()));
        }

        // 2. Location match (+20)
        if (lostItem.getLocation() != null && foundItem.getLocation() != null) {
            String l1 = lostItem.getLocation().trim().toLowerCase();
            String l2 = foundItem.getLocation().trim().toLowerCase();
            if (l1.equalsIgnoreCase(l2)) {
                locScore = 20;
                reasons.add(String.format("Exact Campus Zone Match: '%s' (+20)", lostItem.getLocation()));
            } else if (l1.contains(l2) || l2.contains(l1)) {
                locScore = 15;
                reasons.add(String.format("Proximity Zone Match: '%s' & '%s' (+15)", lostItem.getLocation(), foundItem.getLocation()));
            }
        }

        // 3. Date within 3 days (+10)
        if (lostItem.getIncidentDate() != null && foundItem.getIncidentDate() != null) {
            long days = Math.abs(ChronoUnit.DAYS.between(lostItem.getIncidentDate(), foundItem.getIncidentDate()));
            if (days <= 3) {
                dateScore = 10;
                reasons.add(String.format("Date Proximity: %d day(s) apart (+10)", days));
            }
        }

        // 4. Keyword overlap (up to +30)
        Set<String> wordsLost = extractTokens(lostItem.getName() + " " + lostItem.getDescription());
        Set<String> wordsFound = extractTokens(foundItem.getName() + " " + foundItem.getDescription());
        Set<String> overlap = new HashSet<>(wordsLost);
        overlap.retainAll(wordsFound);

        if (!overlap.isEmpty()) {
            if (overlap.size() >= 3) {
                kwScore = 30;
            } else if (overlap.size() == 2) {
                kwScore = 20;
            } else {
                kwScore = 10;
            }
            reasons.add(String.format("Keyword Overlap (%s): +%d", String.join(", ", overlap), kwScore));
        }

        int total = catScore + locScore + dateScore + kwScore;
        return new MatchResult(lostItem, foundItem, total, catScore, locScore, dateScore, kwScore, reasons);
    }

    private Set<String> extractTokens(String text) {
        if (text == null) return Collections.emptySet();
        Set<String> tokens = new HashSet<>();
        for (String w : text.toLowerCase().split("[^a-zA-Z0-9]+")) {
            if (w.length() > 2 && !STOP_WORDS.contains(w)) {
                tokens.add(w);
            }
        }
        return tokens;
    }
}
