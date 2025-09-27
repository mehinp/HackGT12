package com.finance.hackathon.queries;

public class FriendQuery {
    public static final String INSERT_FRIEND_QUERY =
            "INSERT INTO Friends (user_id, friend_id) VALUES (:userId, :friendId)";

    public static final String COUNT_FRIENDS_QUERY =
            "SELECT COUNT(*) FROM Friends WHERE user_id = :userId";

    public static final String SELECT_ALL_FRIENDS_QUERY =
            "SELECT u.* " +
            "FROM Friends f " +
            "JOIN Users u ON f.friend_id = u.id " +
            "WHERE f.user_id = :userId " +
            "ORDER BY u.score DESC";

}