package com.finance.hackathon.repository.implementation;

import com.finance.hackathon.domain.User;
import com.finance.hackathon.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

import static com.finance.hackathon.queries.UserQuery.*;

@Repository
@RequiredArgsConstructor
@Slf4j
public class UserRepositoryImpl implements UserRepository<User> {
    private final NamedParameterJdbcTemplate jdbc;

    @Override
    public User createUser(User user) {
        if (!user.getPassword().equals(user.getConfirmPassword())) {
            throw new RuntimeException("Passwords don't match. Please try again.");
        }
        try {
            jdbc.update(INSERT_USER_QUERY, Map.of(
                    "firstName", user.getFirstName(),
                    "lastName", user.getLastName(),
                    "email", user.getEmail(),
                    "password", user.getPassword(),
                    "income", user.getIncome(),
                    "expenditures", user.getExpenditures()
            ));
            return user;
        } catch (Exception e){
            log.error(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public User get(Long id) {
        try {
            return jdbc.queryForObject(SELECT_USER_BY_ID_QUERY,
                    Map.of("id", id), this::mapRowToUser);
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }

    @Override
    public User findByEmail(String email) {
        try {
            return jdbc.queryForObject(SELECT_USER_BY_EMAIL_QUERY,
                    Map.of("email", email), this::mapRowToUser);
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }

    @Override
    public void updateUserScore(Long id, int score) {
        try {
            jdbc.update(UPDATE_USER_SCORE_QUERY,
                    Map.of("id", id, "score", score));
        } catch (Exception e) {
            log.error("Failed to update score for user {}: {}", id, e.getMessage());
            throw new RuntimeException("Unable to update score");
        }
    }

    private User mapRowToUser(ResultSet rs, int rowNum) throws SQLException {
        return User.builder()
                .id(rs.getLong("id"))
                .firstName(rs.getString("first_name"))
                .lastName(rs.getString("last_name"))
                .email(rs.getString("email"))
                .password(rs.getString("password"))
                .income(rs.getBigDecimal("income"))
                .expenditures(rs.getBigDecimal("expenditures"))
                .score(rs.getInt("score"))
                .build();
    }
}