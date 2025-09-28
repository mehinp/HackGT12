package com.finance.hackathon.repository;

import com.finance.hackathon.domain.User;

public interface UserRepository<T extends User> {
    T createUser(T user);
    T get(Long id);
    T findByEmail(String email);
    void updateUserScore(Long id, int score);

}