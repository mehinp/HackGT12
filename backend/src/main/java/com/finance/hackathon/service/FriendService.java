package com.finance.hackathon.service;

import com.finance.hackathon.domain.User;

public interface FriendService {
    User addFriend(Long currentUserId, String friendEmail);
    int getFriendsCount(Long userId);
}
