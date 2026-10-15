# CampusKhoj: Project Verification & Test Runner Script for Windows 11 PowerShell
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   CAMPUSKHOJ: VERIFICATION AND TEST SUITE EXECUTION      " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check Java version
Write-Host "`n[Step 1] Checking JDK Version..." -ForegroundColor White
$javaOutput = java -version 2>&1
Write-Host ($javaOutput -join "`n") -ForegroundColor Gray

# 2. Clean build and run automated tests
Write-Host "`n[Step 2] Compiling Project & Running Automated JUnit 5 Tests..." -ForegroundColor White
Write-Host "Running: .\mvnw.cmd clean test`n" -ForegroundColor DarkCyan

.\mvnw.cmd clean test

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n==========================================================" -ForegroundColor Green
    Write-Host "   ALL TESTS PASSED SUCCESSFULLY! PROJECT IS VERIFIED.   " -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "Verified test suites:" -ForegroundColor White
    Write-Host "  [OK] MatchingEngineTest (Category +40, Location +20, Date +10, Keywords +30, Threshold 50)" -ForegroundColor Gray
    Write-Host "  [OK] OopPillarsTest (Encapsulation, Abstraction, Inheritance, Polymorphism, Static/Final)" -ForegroundColor Gray
    Write-Host "  [OK] ClaimWorkflowTest (Submit, Review, Handover, Security Guards)" -ForegroundColor Gray
    Write-Host "  [OK] FileHandlerPersistenceTest (Serialization/Deserialization to items.dat)" -ForegroundColor Gray
    Write-Host "`nYou can now start the server with: .\setup.ps1" -ForegroundColor Yellow
} else {
    Write-Host "`n==========================================================" -ForegroundColor Red
    Write-Host "   BUILD OR TESTS FAILED. PLEASE CHECK LOGS ABOVE.       " -ForegroundColor Red
    Write-Host "==========================================================" -ForegroundColor Red
}
