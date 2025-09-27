package com.finance.hackathon.service;

import com.finance.hackathon.domain.Goal;

public interface GoalService {
    Goal createGoal(Goal goal, Long currentUserId);
    Goal getGoalByUserId(Long currentUserId);
}
