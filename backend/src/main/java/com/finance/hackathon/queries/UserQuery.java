package com.finance.hackathon.queries;

public class UserQuery {
    public static final String INSERT_USER_QUERY = "INSERT INTO users (first_name, last_name, email, password) VALUES " +
            "(:firstName, :lastName, :email, :password)";

}
