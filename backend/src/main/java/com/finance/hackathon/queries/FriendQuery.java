package com.finance.hackathon.queries;

public class FriendQuery {
    public static final String INSERT_FRIEND_QUERY =
            "INSERT INTO Friends (user_id, friend_id) VALUES (:userId, :friendId)";

    public static final String COUNT_FRIENDS_QUERY =
            "SELECT COUNT(*) FROM Friends WHERE user_id = :userId";
}