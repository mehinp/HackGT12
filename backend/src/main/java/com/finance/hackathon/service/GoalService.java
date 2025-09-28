package com.finance.hackathon.service;

import com.finance.hackathon.domain.Goal;

import java.util.Optional;

public interface GoalService {
    Goal createGoal(Goal goal, Long currentUserId);
    Optional<Goal> getGoalByUserId(Long currentUserId);
}
