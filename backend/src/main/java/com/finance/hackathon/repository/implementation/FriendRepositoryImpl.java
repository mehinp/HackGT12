package com.finance.hackathon.repository.implementation;

import com.finance.hackathon.domain.User;
import com.finance.hackathon.repository.FriendRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

import static com.finance.hackathon.queries.FriendQuery.COUNT_FRIENDS_QUERY;
import static com.finance.hackathon.queries.FriendQuery.INSERT_FRIEND_QUERY;

@Repository
@RequiredArgsConstructor
@Slf4j
public class FriendRepositoryImpl implements FriendRepository {
    private final NamedParameterJdbcTemplate jdbc;
    private final UserRepositoryImpl userRepository;

    @Override
    public User addFriend(Long currentUserId, String friendEmail) {
        User friend = userRepository.findByEmail(friendEmail);
        if (friend == null) {
            throw new RuntimeException("User with email " + friendEmail + " not found");
        }
        if (friend.getId().equals(currentUserId)) {
            throw new RuntimeException("You cannot add yourself as a friend");
        }
        try {
            jdbc.update(INSERT_FRIEND_QUERY, Map.of(
                    "userId", currentUserId,
                    "friendId", friend.getId()
            ));
            log.info("User {} added friend {}", currentUserId, friend.getId());
        } catch (Exception e){
            log.error(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
        return friend;
    }

    @Override
    public int getFriendsCount(Long userId) {
        try {
            Integer count = jdbc.queryForObject(COUNT_FRIENDS_QUERY,
                    Map.of("userId", userId), Integer.class);
            return count != null ? count : 0;
        } catch (Exception e) {
            log.error("Error getting friends count for user {}: {}", userId, e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

}
