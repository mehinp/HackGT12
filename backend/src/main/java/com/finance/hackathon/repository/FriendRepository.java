package com.finance.hackathon.repository;


import com.finance.hackathon.domain.User;

public interface FriendRepository {
    User addFriend(Long currentUserId, String friendEmail);
    int getFriendsCount(Long userId);
}
