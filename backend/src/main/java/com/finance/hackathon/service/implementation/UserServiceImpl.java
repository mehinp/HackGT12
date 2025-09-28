package com.finance.hackathon.service.implementation;

import com.finance.hackathon.domain.User;
import com.finance.hackathon.repository.UserRepository;
import com.finance.hackathon.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository<User> userRepository;

    @Override
    public User createUser(User user) {
        return userRepository.createUser(user);
    }

    @Override
    public User authenticate(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }
        return user;
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.get(id);
    }

    @Override
    public void updateUserScore(Long id, int score) {
        userRepository.updateUserScore(id, score);
    }

}