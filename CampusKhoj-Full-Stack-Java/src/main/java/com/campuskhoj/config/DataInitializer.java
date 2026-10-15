package com.campuskhoj.config;

import com.campuskhoj.model.User;
import com.campuskhoj.model.enums.Category;
import com.campuskhoj.service.LostFoundService;
import com.campuskhoj.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Optional;

/**
 * Initializes rich campus demo data for presentation and grading.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final LostFoundService lostFoundService;
    private final UserService userService;

    public DataInitializer(LostFoundService lostFoundService, UserService userService) {
        this.lostFoundService = lostFoundService;
        this.userService = userService;
    }

    @Override
    public void run(String... args) {
        if (lostFoundService.getAllItems().isEmpty()) {
            System.out.println("Initializing CampusKhoj sample lost and found items...");

            Optional<User> studentAshwith = userService.findByEmail("ashwith@campus.edu");
            Optional<User> studentHansika = userService.findByEmail("hansika@campus.edu");
            Optional<User> staffDhruva = userService.findByEmail("dhruva@campus.edu");

            if (studentAshwith.isPresent() && studentHansika.isPresent() && staffDhruva.isPresent()) {
                // 1. Lost Item by Ashwith: Scientific Calculator
                lostFoundService.reportLostItem(
                    "Casio fx-991CW ClassWiz Calculator",
                    Category.ELECTRONICS,
                    "Black casing with silver buttons, slight scratch on back battery cover, has sticker 'CS-2026'",
                    "Block A - Computer Lab 3",
                    LocalDate.now().minusDays(1),
                    studentAshwith.get()
                );

                // 2. Found Item by Dhruva (Staff): Matches the calculator (+40 Category, +20 Location, +10 Date, +20 Keywords -> 90 Score!)
                lostFoundService.registerFoundItem(
                    "Casio Scientific Calculator fx-991CW",
                    Category.ELECTRONICS,
                    "Found left behind on desk 14 after morning compiler design lab. White sticker on back.",
                    "Block A - Computer Lab 3",
                    LocalDate.now().minusDays(1),
                    staffDhruva.get(),
                    "Central Security Desk - Locker #12"
                );

                // 3. Lost Item by Hansika: Titan Fastrack Smartwatch
                lostFoundService.reportLostItem(
                    "Titan Fastrack Reflex Smartwatch",
                    Category.ACCESSORIES,
                    "Navy blue silicone strap with matte black buckle. Screen protector has tiny bubble.",
                    "Central Library - 2nd Floor Reading Room",
                    LocalDate.now().minusDays(2),
                    studentHansika.get()
                );

                // 4. Found Item: Navy Blue Fitness Smartwatch
                lostFoundService.registerFoundItem(
                    "Navy Blue Reflex Smartwatch",
                    Category.ACCESSORIES,
                    "Found placed on silent zone study table near book stacks #4.",
                    "Central Library - 2nd Floor Reading Room",
                    LocalDate.now().minusDays(2),
                    staffDhruva.get(),
                    "Librarian Issue Desk Shelf A"
                );

                // 5. Lost Item: Student ID Card & Metro Pass
                lostFoundService.reportLostItem(
                    "Campus Student ID & RFID Card",
                    Category.ID_CARDS_WALLETS,
                    "CSE Department ID card in transparent lanyard badge with red college ribbon.",
                    "Campus Canteen Food Court",
                    LocalDate.now().minusDays(3),
                    studentAshwith.get()
                );

                // 6. Found Item: Lanyard with Student ID
                lostFoundService.registerFoundItem(
                    "Student ID Card in Red Lanyard",
                    Category.ID_CARDS_WALLETS,
                    "Handed in by cafeteria staff. Found near beverage counter.",
                    "Campus Canteen Food Court",
                    LocalDate.now().minusDays(3),
                    staffDhruva.get(),
                    "Campus Admin Reception - Counter 2"
                );

                // 7. Found Item: Yamaha Bike Key with Leather Keychain
                lostFoundService.registerFoundItem(
                    "Yamaha Bike Key with Blue Ribbon",
                    Category.KEYS,
                    "Single ignition key with silver ring and blue fabric tag.",
                    "Student Vehicle Parking Bay B",
                    LocalDate.now().minusDays(4),
                    staffDhruva.get(),
                    "Main Gate Security Cabin"
                );

                // Save initial state to file
                lostFoundService.persistState(userService.getAllUsers());
                System.out.println("CampusKhoj sample data seeded and saved to items.dat successfully.");
            }
        }
    }
}
