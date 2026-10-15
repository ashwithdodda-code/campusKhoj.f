package com.campuskhoj;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * CampusKhoj - Campus Lost and Found Management System
 * Entry Point for Spring Boot Application.
 *
 * Course-Based Project: Object Oriented Programming through Java
 * Authors:
 * - CH. Shri Varshith (25071A6607)
 * - P. Dhruva Krishna (25071A6616)
 * - D. Ashwith (25071A6617)
 * - I. Hansika (25071A6621)
 */
@SpringBootApplication
public class CampusKhojApplication {

    public static void main(String[] args) {
        SpringApplication.run(CampusKhojApplication.class, args);
        System.out.println("==================================================================");
        System.out.println("   CampusKhoj - Campus Lost & Found Management System is Active   ");
        System.out.println("   Access local web portal at: http://localhost:8080             ");
        System.out.println("   H2 Console: http://localhost:8080/h2-console                   ");
        System.out.println("   Persistence: ./data/items.dat (File I/O Object Serialization)   ");
        System.out.println("==================================================================");
    }
}
