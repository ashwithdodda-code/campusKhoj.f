package com.campuskhoj;

import com.campuskhoj.model.FoundItem;
import com.campuskhoj.model.Item;
import com.campuskhoj.model.LostItem;
import com.campuskhoj.model.Student;
import com.campuskhoj.model.enums.Category;
import com.campuskhoj.util.FileHandler;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests verifying File I/O and Object Serialization (items.dat)
 * from PPT Slides 4, 5, 10, 11.
 */
class FileHandlerPersistenceTest {

    @Test
    @DisplayName("FileHandler serializes and deserializes objects to disk accurately")
    void testSerializationCycle() {
        String testFile = "./data/test_items_" + System.currentTimeMillis() + ".dat";
        FileHandler handler = new FileHandler(testFile);

        List<Item> originalItems = new ArrayList<>();
        Student student = new Student("Hansika", "han@c.edu", "pwd", "25071A6621", "IT", 3);

        originalItems.add(new LostItem(
            "Earbuds Case", Category.ELECTRONICS, "White case", "Auditorium", LocalDate.now(), "U1", "Hansika"
        ));
        originalItems.add(new FoundItem(
            "Earbuds Case", Category.ELECTRONICS, "White case", "Auditorium", LocalDate.now(), "U2", "Dhruva", "Security Office"
        ));

        // Save
        boolean saved = handler.saveData(originalItems, Collections.singletonList(student), Collections.emptyList());
        assertTrue(saved, "Data must save successfully to disk");

        File diskFile = new File(testFile);
        assertTrue(diskFile.exists(), "Serialized file must physically exist");
        assertTrue(diskFile.length() > 0, "File must not be empty");

        // Load
        FileHandler.CampusDataWrapper loaded = handler.loadData();
        assertNotNull(loaded, "Loaded wrapper must not be null");
        assertEquals(2, loaded.getItems().size(), "Should load exactly 2 items");
        assertEquals("Earbuds Case", loaded.getItems().get(0).getName());
        assertEquals(1, loaded.getUsers().size(), "Should load exactly 1 user");

        // Clean up
        diskFile.deleteOnExit();
    }
}
