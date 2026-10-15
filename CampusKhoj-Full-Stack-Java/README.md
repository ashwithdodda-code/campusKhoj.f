# CampusKhoj: Campus Lost and Found Management System
### Object Oriented Programming through Java — Course-Based Project

Built directly from the master project specification and presentation by:
- **CH. Shri Varshith** (25071A6607) — Administrator & Security Lead
- **P. Dhruva Krishna** (25071A6616) — Staff & Inventory Lead
- **D. Ashwith** (25071A6617) — Student & Architecture Lead
- **I. Hansika** (25071A6621) — Student & Verification Lead

---

## 1. Project Overview & PPT Requirement Alignment

Lost belongings on campus (student ID cards, scientific calculators, fitness smartwatches, keys, lab apparatus) are traditionally lost in transit or posted on unstructured group chats. **CampusKhoj** provides a centralized, secure, role-based register with an intelligent auto-matching engine, rigorous ownership verification workflow, and persistent disk serialization.

### The 4 OOP Pillars Demonstrated

| OOP Pillar | Real Implementation in CampusKhoj | Location in Code |
| :--- | :--- | :--- |
| **Encapsulation** | All fields in `Item`, `User`, `Claim` are `private`. Access is strictly managed via getters & setters. Validation checks (e.g. `setName()` rejecting blank strings, email format validation, positive counter guards) protect internal state. | `com.campuskhoj.model.Item`, `User.java`, `Claim.java` |
| **Abstraction** | `Item` and `User` are abstract classes defining contracts without exposing concrete instantiation details. `Matchable` interface exposes scoring as a single contract method. | `com.campuskhoj.model.Item`, `User.java`, `Matchable.java` |
| **Inheritance** | `LostItem` and `FoundItem` extend `Item`. `Student`, `Staff`, and `Admin` extend `User`. Custom domain exceptions extend `RuntimeException`. Shared attributes (IDs, timestamps, reporter metadata) are declared once and reused. | `com.campuskhoj.model.*`, `com.campuskhoj.exception.*` |
| **Polymorphism** | `getType()`, `getRole()`, `canApproveClaims()`, and `toString()` are dynamically dispatched across concrete subclasses. Search method is overloaded (`search(keyword)`, `search(category)`, `search(...)`). `getAllItems().forEach(System.out::println)` prints items in their respective formats. | `com.campuskhoj.model.*`, `LostFoundService.java` |

### 5 Layered Packages & 12+ Classes

```
com.campuskhoj
├── config
│   ├── DataInitializer.java (Seeds initial users & campus items)
│   └── SecurityConfig.java (Spring Security, BCrypt, session management)
├── controller
│   ├── AdminController.java (Review claims, handover, stats, users)
│   ├── AuthController.java (Login, register, session, profile)
│   ├── ClaimController.java (Claim submission, history)
│   ├── ItemController.java (Report lost/found, search, filters)
│   └── MatchController.java (Auto-match score suggestions)
├── dto
│   ├── ApiResponseDto.java
│   ├── ClaimRequestDto.java
│   ├── ClaimReviewDto.java
│   ├── ItemRequestDto.java
│   ├── LoginRequestDto.java
│   └── UserRegisterDto.java
├── exception
│   ├── GlobalExceptionHandler.java (Centralized HTTP error mapping)
│   ├── InvalidClaimException.java
│   ├── ItemNotFoundException.java
│   └── UnauthorizedOperationException.java
├── model
│   ├── enums
│   │   ├── Category.java (ELECTRONICS, ID_CARDS_WALLETS, KEYS, ...)
│   │   ├── ClaimStatus.java (PENDING, APPROVED, REJECTED, RETURNED)
│   │   └── ItemStatus.java (LOST, FOUND, CLAIMED, RETURNED)
│   ├── interfaces
│   │   └── Matchable.java (int matchScore(Item other))
│   ├── Admin.java (extends User, canApproveClaims = true)
│   ├── Claim.java (has-a Item, has-a User)
│   ├── FoundItem.java (extends Item, storageLocation)
│   ├── Item.java (abstract, static counter = 1000, final itemId)
│   ├── LostItem.java (extends Item, implements Matchable)
│   ├── MatchResult.java (score breakdown, qualified flag)
│   ├── Staff.java (extends User, department, designation)
│   ├── Student.java (extends User, rollNumber, yearOfStudy)
│   └── User.java (abstract, static counter, final userId)
├── service
│   ├── LostFoundService.java (Core business logic, overloaded search, workflow)
│   ├── MatchingEngine.java (Scoring algorithm implementation)
│   └── UserService.java (BCrypt hashing, sessions, auth)
└── util
    └── FileHandler.java (Object serialization to items.dat)
```

---

## 2. Smart Auto-Matching Algorithm (PPT Slide 5)

When a lost item is reported, the system evaluates all active found items against this exact scoring formula:

$$\text{Total Score} = \text{Category Match (+40)} + \text{Location Match (+20)} + \text{Date within 3 Days (+10)} + \text{Keyword Overlap (up to +30)}$$

- **Category Match**: $+40$ points if `lost.getCategory() == found.getCategory()`
- **Location Match**: $+20$ points for exact zone match (or $+15$ for partial/nearby zone)
- **Date Proximity**: $+10$ points if $|lostDate - foundDate| \le 3\text{ days}$
- **Keywords**: up to $+30$ points based on shared token count (3+ tokens: +30, 2 tokens: +20, 1 token: +10)
- **Threshold**: Only matches scoring **$\ge 50$** are suggested to users.

---

## 3. Item Lifecycle & Verification Workflow

$$\text{LOST / FOUND} \longrightarrow \text{CLAIMED (Pending Review)} \longrightarrow \text{APPROVED / REJECTED} \longrightarrow \text{RETURNED}$$

1. **Submission**: A student or staff member reports a lost item or registers a found item.
2. **Auto-Match Engine**: The system immediately displays suggested matches with a detailed score breakdown.
3. **Claim with Ownership Proof**: The rightful owner submits unique identifiers (e.g. serial numbers, engravings, hidden marks, interior contents).
4. **Administrative Audit**: Only administrators can approve or reject claims, with mandatory review notes recorded.
5. **Handover Confirmation**: Once approved, the admin confirms physical handover at the designated campus office; the item transitions permanently to `RETURNED`.

---

## 4. Pre-configured Demonstration Accounts

All passwords are encrypted with BCrypt (`$2a$10$...`).

| Role | Name | Email | Password | College / Roll ID | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Admin** | CH. Shri Varshith | `varshith@campus.edu` | `Admin@123` | `25071A6607` | Can review claims, confirm handovers, view audit stats |
| **Staff** | P. Dhruva Krishna | `dhruva@campus.edu` | `Staff@123` | `25071A6616` | Library Services, can register found items |
| **Student** | D. Ashwith | `ashwith@campus.edu` | `Student@123` | `25071A6617` | CSE 3rd Year, can report lost/found items & submit claims |
| **Student** | I. Hansika | `hansika@campus.edu` | `Student@123` | `25071A6621` | IT 3rd Year, can report lost/found items & submit claims |

---

## 5. Windows 11 PowerShell Setup & Execution Guide

### Option A: 1-Click Verification & Startup
Open PowerShell in the extracted directory:
```powershell
# 1. Verify Java and run all automated unit tests
.\verify.ps1

# 2. Launch the application
.\setup.ps1
```

### Option B: Manual Maven Commands
```powershell
# 1. Verify Java version (must be 17 or higher)
java -version

# 2. Compile and run test suite
.\mvnw.cmd clean test

# 3. Start Spring Boot development server
.\mvnw.cmd spring-boot:run
```

Once started, open your browser at:
`http://localhost:8080`
