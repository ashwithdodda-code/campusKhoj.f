package com.campuskhoj.controller;

import com.campuskhoj.dto.ApiResponseDto;
import com.campuskhoj.model.MatchResult;
import com.campuskhoj.service.LostFoundService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final LostFoundService lostFoundService;

    public MatchController(LostFoundService lostFoundService) {
        this.lostFoundService = lostFoundService;
    }

    @GetMapping
    public ResponseEntity<ApiResponseDto<List<MatchResult>>> getAllMatches() {
        List<MatchResult> matches = lostFoundService.getAllAutoMatches();
        return ResponseEntity.ok(ApiResponseDto.ok("Suggested item matches (Score >= 50)", matches));
    }

    @GetMapping("/lost/{lostItemId}")
    public ResponseEntity<ApiResponseDto<List<MatchResult>>> getMatchesForLostItem(
            @PathVariable String lostItemId) {
        List<MatchResult> matches = lostFoundService.findMatchesForLostItem(lostItemId);
        return ResponseEntity.ok(ApiResponseDto.ok("Matches for lost item #" + lostItemId, matches));
    }
}
