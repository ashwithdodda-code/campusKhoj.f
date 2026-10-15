package com.campuskhoj;

import com.campuskhoj.model.*;
import com.campuskhoj.model.enums.Category;
import com.campuskhoj.model.enums.ItemStatus;
import com.campuskhoj.model.interfaces.Matchable;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests verifying the 4 OOP Pillars and college requirements
 * from PPT Slides 2, 6, 7, 8, 9, 10, 11:
 * - Encapsulation
 * - Abstraction
 * - Inheritance
 * - Polymorphism
 * - Static & Final members
 */
class OopPillarsTest {

    @Test
    @DisplayName("Encapsulation: setName rejects null or empty strings")
    void testEncapsulationValidation() {
        LostItem item = new LostItem(
            "Blue Backpack",
            Category.BAGS,
            "Canvas backpack",
            "Cafeteria",
            LocalDate.now(),
            "U1",
            "Ashwith"
        );

        assertThrows(IllegalArgumentException.class, () -> item.setName(null));
        assertThrows(IllegalArgumentException.class, () -> item.setName("   "));

        item.setName("Renamed Navy Backpack");
        assertEquals("Renamed Navy Backpack", item.getName());
    }

    @Test
    @DisplayName("Inheritance: LostItem and FoundItem inherit from Item")
    void testInheritance() {
        LostItem lost = new LostItem(
            "Keys", Category.KEYS, "Honda key", "Main Gate", LocalDate.now(), "U1", "Ashwith"
        );
        FoundItem found = new FoundItem(
            "Keys", Category.KEYS, "Honda key", "Main Gate", LocalDate.now(), "U2", "Dhruva", "Security Desk"
        );

        assertTrue(lost instanceof Item, "LostItem must be an instance of Item");
        assertTrue(found instanceof Item, "FoundItem must be an instance of Item");
        assertNotNull(lost.getItemId(), "Inherited itemId must be generated");
        assertNotNull(found.getItemId(), "Inherited itemId must be generated");
    }

    @Test
    @DisplayName("Polymorphism: getType() and canApproveClaims() behave differently per subclass")
    void testPolymorphism() {
        Item lost = new LostItem("ID Card", Category.ID_CARDS_WALLETS, "Student ID", "Canteen", LocalDate.now(), "U1", "Hansika");
        Item found = new FoundItem("ID Card", Category.ID_CARDS_WALLETS, "Student ID", "Canteen", LocalDate.now(), "U2", "Dhruva", "Admin Desk");

        assertEquals("LOST", lost.getType());
        assertEquals("FOUND", found.getType());
        assertEquals(ItemStatus.LOST, lost.getInitialStatus());
        assertEquals(ItemStatus.FOUND, found.getInitialStatus());

        User student = new Student("Ashwith", "ash@c.edu", "hash", "25071A6617", "CSE", 3);
        User staff = new Staff("Dhruva", "dhr@c.edu", "hash", "25071A6616", "Library", "Assistant");
        User admin = new Admin("Varshith", "var@c.edu", "hash", "25071A6607", "Proctor", 3);

        assertFalse(student.canApproveClaims(), "Students must not have claim approval authority");
        assertFalse(staff.canApproveClaims(), "Staff must not have claim approval authority");
        assertTrue(admin.canApproveClaims(), "Admin must have claim approval authority");

        assertEquals("STUDENT", student.getRole());
        assertEquals("STAFF", staff.getRole());
        assertEquals("ADMIN", admin.getRole());
    }

    @Test
    @DisplayName("Interface: LostItem implements Matchable interface")
    void testMatchableInterface() {
        LostItem lost = new LostItem("Earphones", Category.ELECTRONICS, "Black wireless", "Gym", LocalDate.now(), "U1", "Ashwith");
        assertTrue(lost instanceof Matchable, "LostItem must implement Matchable interface as per PPT Slide 6 & 7");
    }

    @Test
    @DisplayName("Static & Final: Counter generates unique IDs; ItemId is immutable")
    void testStaticCounterAndFinalId() {
        int initialCounter = Item.getCounter();
        LostItem item1 = new LostItem("Item 1", Category.OTHER, "", "Loc", LocalDate.now(), "U1", "A");
        LostItem item2 = new LostItem("Item 2", Category.OTHER, "", "Loc", LocalDate.now(), "U1", "A");

        assertNotEquals(item1.getItemId(), item2.getItemId(), "Item IDs must be unique");
        assertTrue(Item.getCounter() > initialCounter, "Static counter must increment");
    }
}
