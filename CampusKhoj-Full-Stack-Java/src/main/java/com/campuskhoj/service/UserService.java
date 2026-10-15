package com.campuskhoj.service;

import com.campuskhoj.exception.UnauthorizedOperationException;
import com.campuskhoj.model.Admin;
import com.campuskhoj.model.Staff;
import com.campuskhoj.model.Student;
import com.campuskhoj.model.User;
import com.campuskhoj.util.FileHandler;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Service managing user accounts, authentication, BCrypt hashing, and role verification.
 */
@Service
public class UserService {

    private final List<User> users = new CopyOnWriteArrayList<>();
    private final Map<String, User> sessions = new ConcurrentHashMap<>();
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final FileHandler fileHandler;

    public UserService() {
        this.fileHandler = new FileHandler("./data/items.dat");
        loadPersistedUsers();
        if (users.isEmpty()) {
            seedDefaultAccounts();
        }
    }

    private void loadPersistedUsers() {
        FileHandler.CampusDataWrapper saved = fileHandler.loadData();
        if (saved != null && saved.getUsers() != null && !saved.getUsers().isEmpty()) {
            users.addAll(saved.getUsers());
            System.out.println("Loaded " + users.size() + " registered users from persistence");
        }
    }

    public void seedDefaultAccounts() {
        // PPT Slide 12 Authors & Role Personas
        // Admin: CH. Shri Varshith - 25071A6607
        Admin admin = new Admin(
            "CH. Shri Varshith",
            "varshith@campus.edu",
            passwordEncoder.encode("Admin@123"),
            "25071A6607",
            "Chief Proctor & Security Wing",
            3
        );
        users.add(admin);

        // Staff: P. Dhruva Krishna - 25071A6616
        Staff staff = new Staff(
            "P. Dhruva Krishna",
            "dhruva@campus.edu",
            passwordEncoder.encode("Staff@123"),
            "25071A6616",
            "Central Library Services",
            "Assistant Librarian"
        );
        users.add(staff);

        // Student: D. Ashwith - 25071A6617
        Student student1 = new Student(
            "D. Ashwith",
            "ashwith@campus.edu",
            passwordEncoder.encode("Student@123"),
            "25071A6617",
            "Computer Science & Engineering",
            3
        );
        users.add(student1);

        // Student: I. Hansika - 25071A6621
        Student student2 = new Student(
            "I. Hansika",
            "hansika@campus.edu",
            passwordEncoder.encode("Student@123"),
            "25071A6621",
            "Information Technology",
            3
        );
        users.add(student2);
    }

    public List<User> getAllUsers() {
        return Collections.unmodifiableList(users);
    }

    public Optional<User> findByEmail(String email) {
        if (email == null) return Optional.empty();
        return users.stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email.trim()))
                .findFirst();
    }

    public Optional<User> findById(String userId) {
        if (userId == null) return Optional.empty();
        return users.stream()
                .filter(u -> u.getUserId().equalsIgnoreCase(userId.trim()))
                .findFirst();
    }

    public User registerStudent(String name, String email, String rawPassword,
                                String rollNumber, String branch, int year) {
        validateEmailUnique(email);
        Student student = new Student(
            name, email, passwordEncoder.encode(rawPassword), rollNumber, branch, year
        );
        users.add(student);
        return student;
    }

    public User registerStaff(String name, String email, String rawPassword,
                              String staffId, String department, String designation) {
        validateEmailUnique(email);
        Staff staff = new Staff(
            name, email, passwordEncoder.encode(rawPassword), staffId, department, designation
        );
        users.add(staff);
        return staff;
    }

    public User login(String email, String rawPassword) {
        User user = findByEmail(email)
                .orElseThrow(() -> new UnauthorizedOperationException("Invalid email or password"));

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new UnauthorizedOperationException("Invalid email or password");
        }

        String token = UUID.randomUUID().toString();
        sessions.put(token, user);
        return user;
    }

    public String createSession(User user) {
        String token = UUID.randomUUID().toString();
        sessions.put(token, user);
        return token;
    }

    public Optional<User> getUserBySession(String token) {
        if (token == null) return Optional.empty();
        return Optional.ofNullable(sessions.get(token));
    }

    public void invalidateSession(String token) {
        if (token != null) {
            sessions.remove(token);
        }
    }

    private void validateEmailUnique(String email) {
        if (findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("An account with email '" + email + "' already exists");
        }
    }
}
