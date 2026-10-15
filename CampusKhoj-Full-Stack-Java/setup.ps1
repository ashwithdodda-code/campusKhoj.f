# CampusKhoj: Quick Setup & Start Script for Windows 11 PowerShell
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   CAMPUSKHOJ: CAMPUS LOST AND FOUND MANAGEMENT SYSTEM    " -ForegroundColor Yellow
Write-Host "   Object Oriented Programming through Java Course Project" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check Java 17 or later
Write-Host "`n[1/3] Verifying Java Installation..." -ForegroundColor White
try {
    $javaVer = & java -version 2>&1 | Out-String
    Write-Host $javaVer -ForegroundColor Gray
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Java is not detected in PATH. Please install JDK 17+ from https://adoptium.net/ and restart PowerShell."
        exit 1
    }
} catch {
    Write-Error "Java executable not found. Please install JDK 17+."
    exit 1
}

# 2. Ensure data directory exists
Write-Host "[2/3] Setting up local persistence directory (./data)..." -ForegroundColor White
if (-not (Test-Path -Path ".\data")) {
    New-Item -ItemType Directory -Path ".\data" | Out-Null
    Write-Host "Created ./data directory for items.dat persistence." -ForegroundColor Green
}

# 3. Launch Spring Boot Application
Write-Host "[3/3] Launching CampusKhoj Spring Boot Server on port 8080..." -ForegroundColor White
Write-Host "-> Web Portal URL: http://localhost:8080" -ForegroundColor Cyan
Write-Host "-> Pre-configured Accounts:" -ForegroundColor Yellow
Write-Host "   - Admin:   varshith@campus.edu  /  Admin@123" -ForegroundColor Gray
Write-Host "   - Staff:   dhruva@campus.edu    /  Staff@123" -ForegroundColor Gray
Write-Host "   - Student: ashwith@campus.edu   /  Student@123" -ForegroundColor Gray
Write-Host "   - Student: hansika@campus.edu   /  Student@123" -ForegroundColor Gray
Write-Host "`nStarting application (Press Ctrl+C to stop)...`n" -ForegroundColor Yellow

.\mvnw.cmd spring-boot:run
