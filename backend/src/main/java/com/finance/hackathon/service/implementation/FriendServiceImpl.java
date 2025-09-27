package com.finance.hackathon.service.implementation;

import com.finance.hackathon.domain.User;
import com.finance.hackathon.repository.FriendRepository;
import com.finance.hackathon.service.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FriendServiceImpl implements FriendService {
    private final FriendRepository friendRepository;

    @Override
    public User addFriend(Long currentUserId, String friendEmail) {
        return friendRepository.addFriend(currentUserId, friendEmail);
    }

    @Override
    public int getFriendsCount(Long userId) {
        return friendRepository.getFriendsCount(userId);
    }
}
