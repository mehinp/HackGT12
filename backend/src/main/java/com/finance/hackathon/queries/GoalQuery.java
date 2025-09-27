package com.finance.hackathon.queries;

public class GoalQuery {
    public static final String INSERT_GOAL_QUERY = "INSERT INTO GOALS (user_id, title, saved, end_date) VALUES " +
            "(:userId, :title, :saved, :end_date)";

    public static final String SELECT_GOAL_BY_USER_ID_QUERY = "SELECT id, user_id, title, saved, end_date FROM Goals WHERE user_id = :userId";
}
