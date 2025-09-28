package com.finance.hackathon.resource;

import com.finance.hackathon.domain.Goal;
import com.finance.hackathon.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/goals")
@RequiredArgsConstructor
public class GoalResource {
    private final GoalService goalService;

    @PostMapping("/new")
    public ResponseEntity<?> createGoal(@RequestBody Goal goal, @RequestHeader(value="X-User-Id", required=false) Long userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing or invalid X-User-Id.");
        }
        Goal userGoal = goalService.createGoal(goal, userId);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "userId", userId,
                        "goal" , userGoal
                ));
    }

    @GetMapping("/my-goals")
    public ResponseEntity<?> getGoalByUserId(@RequestHeader(value="X-User-Id", required=false) Long userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing or invalid X-User-Id.");
        }
        Optional<Goal> userGoal = goalService.getGoalByUserId(userId);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "goal" , userGoal
                ));
    }
}
