package com.campuskhoj.model.enums;

/**
 * Enumeration of item categories in CampusKhoj.
 * Demonstrates Java Enum usage with display labels and icon references.
 */
public enum Category {
    ELECTRONICS("Electronics & Gadgets"),
    ID_CARDS_WALLETS("ID Cards & Wallets"),
    BOOKS_STATIONERY("Books & Stationery"),
    KEYS("Keys & Keychains"),
    ACCESSORIES("Accessories & Watches"),
    CLOTHING("Clothing & Apparel"),
    BAGS("Bags & Backpacks"),
    OTHER("Other Campus Items");

    private final String displayName;

    Category(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
