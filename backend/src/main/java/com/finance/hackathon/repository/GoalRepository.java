package com.finance.hackathon.repository;

import com.finance.hackathon.domain.Goal;

public interface GoalRepository {
    Goal createGoal(Goal goal, Long currentUserId);
    Goal getGoalByUserId(Long userId);
}
