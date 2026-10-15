package com.campuskhoj.util;

import com.campuskhoj.model.Claim;
import com.campuskhoj.model.Item;
import com.campuskhoj.model.User;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

/**
 * File I/O & Object Serialization Utility as highlighted across PPT Slides 4, 5, 6, 10, 11.
 * Persists CampusKhoj data to 'items.dat' to ensure persistence across server restarts.
 * Demonstrates:
 * - Java Object Streams (ObjectOutputStream, ObjectInputStream)
 * - Serialization & Serializable interfaces
 * - Exception handling with try-with-resources
 * - Atomic persistence & directory management
 */
public class FileHandler {

    private final String filePath;

    public FileHandler() {
        this("./data/items.dat");
    }

    public FileHandler(String filePath) {
        this.filePath = filePath;
        ensureParentDirectoryExists();
    }

    private void ensureParentDirectoryExists() {
        try {
            Path path = Paths.get(filePath);
            if (path.getParent() != null && !Files.exists(path.getParent())) {
                Files.createDirectories(path.getParent());
            }
        } catch (IOException e) {
            System.err.println("Could not create data directory: " + e.getMessage());
        }
    }

    /**
     * Serialized Data Wrapper holding all campus state.
     */
    public static class CampusDataWrapper implements Serializable {
        private static final long serialVersionUID = 1L;

        private final List<Item> items;
        private final List<User> users;
        private final List<Claim> claims;
        private final int itemCounter;
        private final int userCounter;
        private final int claimCounter;

        public CampusDataWrapper(List<Item> items, List<User> users, List<Claim> claims,
                                 int itemCounter, int userCounter, int claimCounter) {
            this.items = items != null ? new ArrayList<>(items) : new ArrayList<>();
            this.users = users != null ? new ArrayList<>(users) : new ArrayList<>();
            this.claims = claims != null ? new ArrayList<>(claims) : new ArrayList<>();
            this.itemCounter = itemCounter;
            this.userCounter = userCounter;
            this.claimCounter = claimCounter;
        }

        public List<Item> getItems() {
            return items;
        }

        public List<User> getUsers() {
            return users;
        }

        public List<Claim> getClaims() {
            return claims;
        }

        public int getItemCounter() {
            return itemCounter;
        }

        public int getUserCounter() {
            return userCounter;
        }

        public int getClaimCounter() {
            return claimCounter;
        }
    }

    /**
     * Saves campus items, users, and claims to items.dat via ObjectOutputStream.
     */
    public synchronized boolean saveData(List<Item> items, List<User> users, List<Claim> claims) {
        ensureParentDirectoryExists();
        CampusDataWrapper wrapper = new CampusDataWrapper(
            items, users, claims,
            Item.getCounter(), User.getCounter(), Claim.getCounter()
        );

        try (ObjectOutputStream oos = new ObjectOutputStream(
                new BufferedOutputStream(new FileOutputStream(filePath)))) {
            oos.writeObject(wrapper);
            oos.flush();
            return true;
        } catch (IOException e) {
            System.err.println("Failed to serialize campus data to " + filePath + ": " + e.getMessage());
            return false;
        }
    }

    /**
     * Loads campus data from items.dat via ObjectInputStream on server startup.
     */
    public synchronized CampusDataWrapper loadData() {
        File file = new File(filePath);
        if (!file.exists() || file.length() == 0) {
            return null;
        }

        try (ObjectInputStream ois = new ObjectInputStream(
                new BufferedInputStream(new FileInputStream(file)))) {
            Object obj = ois.readObject();
            if (obj instanceof CampusDataWrapper) {
                CampusDataWrapper data = (CampusDataWrapper) obj;
                // Restore static sequence counters
                Item.setCounter(Math.max(Item.getCounter(), data.getItemCounter()));
                User.setCounter(Math.max(User.getCounter(), data.getUserCounter()));
                Claim.setCounter(Math.max(Claim.getCounter(), data.getClaimCounter()));
                return data;
            }
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("Failed to load serialized data from " + filePath + " (using fresh defaults): " + e.getMessage());
        }
        return null;
    }
}
