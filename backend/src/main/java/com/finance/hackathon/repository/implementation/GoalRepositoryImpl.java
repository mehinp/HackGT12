package com.finance.hackathon.repository.implementation;


import com.finance.hackathon.domain.Goal;
import com.finance.hackathon.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.Map;

import static com.finance.hackathon.queries.GoalQuery.INSERT_GOAL_QUERY;
import static com.finance.hackathon.queries.GoalQuery.SELECT_GOAL_BY_USER_ID_QUERY;

@Repository
@RequiredArgsConstructor
@Slf4j
public class GoalRepositoryImpl implements GoalRepository {
    private final NamedParameterJdbcTemplate jdbc;

    @Override
    public Goal createGoal(Goal goal, Long currentUserId) {
        try {
            jdbc.update(INSERT_GOAL_QUERY, Map.of("userId", currentUserId, "title", goal.getTitle(),
                    "saved", goal.getSaved(), "end_date", goal.getEndDate()));
        } catch (Exception e){
            log.error(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
        return goal;
    }

    @Override
    public Goal getGoalByUserId(Long userId) {
        try {
            return jdbc.queryForObject(SELECT_GOAL_BY_USER_ID_QUERY,
                    Map.of("userId", userId), this::mapRowToGoal);
        } catch (Exception e) {
            log.error("Error fetching goal for user {}: {}", userId, e.getMessage());
            throw new RuntimeException("Failed to fetch goal for user: " + e.getMessage());
        }
    }

    private Goal mapRowToGoal(ResultSet rs, int rowNum) throws SQLException {
        return Goal.builder()
                .id(rs.getLong("id"))
                .userId(rs.getLong("user_id"))
                .title(rs.getString("title"))
                .saved(rs.getBigDecimal("saved"))
                .endDate(LocalDate.from(rs.getTimestamp("end_date").toLocalDateTime()))
                .build();
    }



}
