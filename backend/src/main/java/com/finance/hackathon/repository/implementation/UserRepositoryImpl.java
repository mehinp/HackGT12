package com.finance.hackathon.repository.implementation;

import com.finance.hackathon.domain.User;
import com.finance.hackathon.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

import static com.finance.hackathon.queries.UserQuery.*;

@Repository
@RequiredArgsConstructor
@Slf4j
public class UserRepositoryImpl implements UserRepository<User> {
    private final NamedParameterJdbcTemplate jdbc;

    @Override
    public User createUser(User user) {
        try {
            jdbc.update(INSERT_USER_QUERY, Map.of("firstName", user.getFirstName(), "lastName", user.getLastName(),
                    "email", user.getEmail(), "password", user.getPassword()));
            return user;

        } catch (Exception e){
            log.error(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public User get(Long id) {
        return null;
    }
}
