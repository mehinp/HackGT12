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


}
