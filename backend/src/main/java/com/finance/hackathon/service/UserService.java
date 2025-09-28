package com.finance.hackathon.service;
import com.finance.hackathon.domain.User;

public interface UserService {
    User createUser(User user);
    User authenticate(String email, String password);
    User getUserById(Long id);
    void updateUserScore(Long id, int score);
}
