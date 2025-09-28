package com.finance.hackathon.repository;

import com.finance.hackathon.domain.Goal;

import java.util.Optional;

public interface GoalRepository {
    Goal createGoal(Goal goal, Long currentUserId);
    Optional<Goal> getGoalByUserId(Long userId);
}
