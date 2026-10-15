package com.campuskhoj.service;

import com.campuskhoj.exception.InvalidClaimException;
import com.campuskhoj.exception.ItemNotFoundException;
import com.campuskhoj.exception.UnauthorizedOperationException;
import com.campuskhoj.model.*;
import com.campuskhoj.model.enums.Category;
import com.campuskhoj.model.enums.ClaimStatus;
import com.campuskhoj.model.enums.ItemStatus;
import com.campuskhoj.util.FileHandler;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

/**
 * Core Service Layer managing Campus Items, Auto-Matching, and Claims.
 * Demonstrates:
 * - Method Overloading (search by keyword, by category, multi-filter)
 * - Polymorphism (Item subclasses, User permissions)
 * - Collections Framework, Generics, Java Streams and Lambdas
 * - File I/O persistence via FileHandler (items.dat)
 */
@Service
public class LostFoundService {

    private final List<Item> items = new CopyOnWriteArrayList<>();
    private final List<Claim> claims = new CopyOnWriteArrayList<>();
    private final MatchingEngine matchingEngine = new MatchingEngine();
    private final FileHandler fileHandler;

    public LostFoundService() {
        this.fileHandler = new FileHandler("./data/items.dat");
        loadPersistedData();
    }

    public LostFoundService(String dataFilePath) {
        this.fileHandler = new FileHandler(dataFilePath);
        loadPersistedData();
    }

    private void loadPersistedData() {
        FileHandler.CampusDataWrapper saved = fileHandler.loadData();
        if (saved != null) {
            if (saved.getItems() != null) items.addAll(saved.getItems());
            if (saved.getClaims() != null) claims.addAll(saved.getClaims());
            System.out.println("Loaded " + items.size() + " items and " + claims.size() + " claims from items.dat");
        }
    }

    public synchronized void persistState(List<User> users) {
        fileHandler.saveData(items, users != null ? users : Collections.emptyList(), claims);
    }

    // ==================== ITEM MANAGEMENT ====================

    public LostItem reportLostItem(String name, Category category, String description,
                                   String location, LocalDate incidentDate, User reporter) {
        if (reporter == null) {
            throw new UnauthorizedOperationException("Must be logged in to report a lost item");
        }
        LostItem lostItem = new LostItem(name, category, description, location, incidentDate,
                reporter.getUserId(), reporter.getName());
        items.add(lostItem);
        persistState(null);
        return lostItem;
    }

    public FoundItem registerFoundItem(String name, Category category, String description,
                                       String location, LocalDate incidentDate, User finder,
                                       String storageLocation) {
        if (finder == null) {
            throw new UnauthorizedOperationException("Must be logged in to register a found item");
        }
        FoundItem foundItem = new FoundItem(name, category, description, location, incidentDate,
                finder.getUserId(), finder.getName(), storageLocation);
        items.add(foundItem);
        persistState(null);
        return foundItem;
    }

    public List<Item> getAllItems() {
        return Collections.unmodifiableList(items);
    }

    public Optional<Item> findItemById(String itemId) {
        return items.stream()
                .filter(i -> i.getItemId().equalsIgnoreCase(itemId))
                .findFirst();
    }

    public Item getItemOrThrow(String itemId) {
        return findItemById(itemId)
                .orElseThrow(() -> new ItemNotFoundException(itemId, "Item"));
    }

    // ==================== OVERLOADED SEARCH METHODS (PPT SLIDE 9 & 11) ====================

    /**
     * Search overload 1: simple keyword search across name and description.
     */
    public List<Item> search(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllItems();
        }
        String q = keyword.toLowerCase().trim();
        return items.stream()
                .filter(i -> i.getName().toLowerCase().contains(q) ||
                             i.getDescription().toLowerCase().contains(q) ||
                             i.getLocation().toLowerCase().contains(q))
                .collect(Collectors.toList());
    }

    /**
     * Search overload 2: search by category.
     */
    public List<Item> search(Category category) {
        if (category == null) {
            return getAllItems();
        }
        return items.stream()
                .filter(i -> i.getCategory() == category)
                .collect(Collectors.toList());
    }

    /**
     * Search overload 3: comprehensive multi-parameter search.
     */
    public List<Item> search(String keyword, Category category, String location, ItemStatus status, String type) {
        return items.stream()
                .filter(i -> keyword == null || keyword.trim().isEmpty() ||
                             i.getName().toLowerCase().contains(keyword.toLowerCase()) ||
                             i.getDescription().toLowerCase().contains(keyword.toLowerCase()))
                .filter(i -> category == null || i.getCategory() == category)
                .filter(i -> location == null || location.trim().isEmpty() ||
                             i.getLocation().toLowerCase().contains(location.toLowerCase()))
                .filter(i -> status == null || i.getStatus() == status)
                .filter(i -> type == null || type.trim().isEmpty() || i.getType().equalsIgnoreCase(type))
                .collect(Collectors.toList());
    }

    // ==================== AUTO-MATCHING ENGINE (PPT SLIDE 5) ====================

    /**
     * Suggests matches for a lost item against all active found items.
     * Returns results sorted by score descending, filtering for score >= 50.
     */
    public List<MatchResult> findMatchesForLostItem(String lostItemId) {
        Item lost = getItemOrThrow(lostItemId);
        if (!"LOST".equalsIgnoreCase(lost.getType())) {
            throw new IllegalArgumentException("Auto-match is initiated for lost items");
        }

        return items.stream()
                .filter(item -> "FOUND".equalsIgnoreCase(item.getType()))
                .filter(item -> item.getStatus() != ItemStatus.RETURNED)
                .map(found -> matchingEngine.evaluateMatch(lost, found))
                .filter(MatchResult::isQualified)
                .sorted(Comparator.comparingInt(MatchResult::getTotalScore).reversed())
                .collect(Collectors.toList());
    }

    public List<MatchResult> getAllAutoMatches() {
        List<MatchResult> results = new ArrayList<>();
        List<Item> lostItems = items.stream().filter(i -> "LOST".equalsIgnoreCase(i.getType())).toList();
        List<Item> foundItems = items.stream().filter(i -> "FOUND".equalsIgnoreCase(i.getType())).toList();

        for (Item lost : lostItems) {
            for (Item found : foundItems) {
                MatchResult r = matchingEngine.evaluateMatch(lost, found);
                if (r.isQualified()) {
                    results.add(r);
                }
            }
        }
        results.sort(Comparator.comparingInt(MatchResult::getTotalScore).reversed());
        return results;
    }

    // ==================== CLAIMS & VERIFICATION WORKFLOW ====================

    public Claim submitClaim(String itemId, User claimant, String proofDescription, String contactPhone) {
        if (claimant == null) {
            throw new UnauthorizedOperationException("Only authenticated users can claim an item");
        }
        Item item = getItemOrThrow(itemId);

        if (item.getStatus() == ItemStatus.RETURNED) {
            throw new InvalidClaimException("Item #" + itemId + " has already been verified and returned to its rightful owner");
        }

        // Prevent claimant from claiming their own found submission
        if (item.getReportedByUserId() != null && item.getReportedByUserId().equals(claimant.getUserId()) && "FOUND".equalsIgnoreCase(item.getType())) {
            throw new InvalidClaimException("You cannot submit a claim on an item you registered as finder");
        }

        // Prevent duplicate pending claims by the same user
        boolean hasPending = claims.stream()
                .anyMatch(c -> c.getItem().getItemId().equals(itemId) &&
                               c.getClaimant().getUserId().equals(claimant.getUserId()) &&
                               c.getStatus() == ClaimStatus.PENDING);
        if (hasPending) {
            throw new InvalidClaimException("You already have an active pending claim for this item");
        }

        Claim claim = new Claim(item, claimant, proofDescription, contactPhone);
        claims.add(claim);
        item.setStatus(ItemStatus.CLAIMED);
        persistState(null);
        return claim;
    }

    public List<Claim> getAllClaims() {
        return Collections.unmodifiableList(claims);
    }

    public List<Claim> getClaimsForUser(String userId) {
        return claims.stream()
                .filter(c -> c.getClaimant().getUserId().equals(userId))
                .collect(Collectors.toList());
    }

    public Optional<Claim> findClaimById(String claimId) {
        return claims.stream().filter(c -> c.getClaimId().equalsIgnoreCase(claimId)).findFirst();
    }

    /**
     * Admin review workflow: approve or reject with recorded audit reason.
     */
    public Claim reviewClaim(String claimId, User reviewer, boolean approve, String reason) {
        if (reviewer == null || !reviewer.canApproveClaims()) {
            throw new UnauthorizedOperationException("Only designated administrators can approve or reject claims");
        }

        Claim claim = findClaimById(claimId)
                .orElseThrow(() -> new InvalidClaimException("Claim #" + claimId + " not found"));

        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new InvalidClaimException("Claim #" + claimId + " has already been reviewed (Current status: " + claim.getStatus() + ")");
        }

        // Prevent admin from approving their own claim
        if (claim.getClaimant().getUserId().equals(reviewer.getUserId())) {
            throw new UnauthorizedOperationException("Administrators cannot approve their own claims (Conflict of Interest)");
        }

        claim.setStatus(approve ? ClaimStatus.APPROVED : ClaimStatus.REJECTED);
        claim.setAdminReviewNotes(reason != null ? reason.trim() : (approve ? "Ownership proof verified" : "Insufficient proof"));
        claim.setReviewedByAdminName(reviewer.getName());
        claim.setReviewedAt(LocalDateTime.now());

        if (!approve) {
            // Revert item status if no other pending claims exist
            boolean otherPending = claims.stream()
                    .anyMatch(c -> c.getItem().getItemId().equals(claim.getItem().getItemId()) &&
                                   c.getStatus() == ClaimStatus.PENDING);
            if (!otherPending) {
                claim.getItem().setStatus(claim.getItem().getInitialStatus());
            }
        }

        persistState(null);
        return claim;
    }

    /**
     * Handover confirmation: item returned to owner.
     * Transitions status to RETURNED as required in PPT Slide 3 & 5.
     */
    public Claim confirmHandover(String claimId, User admin) {
        if (admin == null || !admin.canApproveClaims()) {
            throw new UnauthorizedOperationException("Only an admin can confirm item handover");
        }

        Claim claim = findClaimById(claimId)
                .orElseThrow(() -> new InvalidClaimException("Claim #" + claimId + " not found"));

        if (claim.getStatus() != ClaimStatus.APPROVED) {
            throw new InvalidClaimException("Only APPROVED claims can proceed to handover confirmation");
        }

        claim.setHandoverConfirmed(true);
        claim.setHandoverConfirmedAt(LocalDateTime.now());
        claim.setStatus(ClaimStatus.RETURNED);
        claim.getItem().setStatus(ItemStatus.RETURNED);

        persistState(null);
        return claim;
    }
}
