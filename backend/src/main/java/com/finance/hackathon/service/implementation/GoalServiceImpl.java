package com.finance.hackathon.service.implementation;

import com.finance.hackathon.domain.Goal;
import com.finance.hackathon.repository.GoalRepository;
import com.finance.hackathon.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {
    private final GoalRepository goalRepository;

    public Goal createGoal(Goal goal, Long currentUserId){
        return goalRepository.createGoal(goal, currentUserId);
    }

    public Optional<Goal> getGoalByUserId(Long currentUserId){
        return goalRepository.getGoalByUserId(currentUserId);
    }

}
