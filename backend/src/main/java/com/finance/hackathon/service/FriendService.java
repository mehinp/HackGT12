package com.finance.hackathon.service;

import com.finance.hackathon.domain.User;

import java.util.List;

public interface FriendService {
    User addFriend(Long currentUserId, String friendEmail);
    int getFriendsCount(Long userId);
    List<User> getAllFriends(Long userId);
}
