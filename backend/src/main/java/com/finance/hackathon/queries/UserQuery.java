package com.finance.hackathon.queries;

public class UserQuery {
    public static final String INSERT_USER_QUERY = "INSERT INTO Users (first_name, last_name, email, password, income, expenditures) VALUES " +
            "(:firstName, :lastName, :email, :password, :income, :expenditures)";

    public static final String SELECT_USER_BY_EMAIL_QUERY = "SELECT * FROM users WHERE email = :email";

    public static final String SELECT_USER_BY_ID_QUERY = "SELECT * FROM users WHERE id = :id";

}