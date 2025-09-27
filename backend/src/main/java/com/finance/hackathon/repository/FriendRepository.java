package com.finance.hackathon.repository;


import com.finance.hackathon.domain.User;

import java.util.List;

public interface FriendRepository {
    User addFriend(Long currentUserId, String friendEmail);
    int getFriendsCount(Long userId);
    List<User> getAllFriends(Long userId);
}
