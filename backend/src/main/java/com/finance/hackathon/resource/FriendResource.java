package com.finance.hackathon.resource;

import com.finance.hackathon.domain.User;
import com.finance.hackathon.service.FriendService;
import com.finance.hackathon.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/leaderboard")
@RequiredArgsConstructor
public class FriendResource {
    private final FriendService friendService;
    private final UserService userService;

    @PostMapping("/new-friend/{friendEmail}")
    public ResponseEntity<?> addFriend(@PathVariable("friendEmail") String friendEmail, @RequestHeader(value="X-User-Id", required=false) Long userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing or invalid X-User-Id.");
        }
        User friend = friendService.addFriend(userId, friendEmail);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "userId", userId,
                        "friend" , friend
                ));
    }

    @GetMapping("/count")
    public ResponseEntity<?> getFriendsCount(@RequestHeader(value="X-User-Id", required=false) Long userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing or invalid X-User-Id.");
        }

        int friendsCount = friendService.getFriendsCount(userId);

        return ResponseEntity.ok(Map.of(
                "userId", userId,
                "friendsCount", friendsCount
        ));
    }

    @GetMapping("/rankings")
    public ResponseEntity<?> getAllFriends(@RequestHeader(value="X-User-Id", required=false) Long userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing or invalid X-User-Id.");
        }
        User user = userService.getUserById(userId);
        List<User> ranks = friendService.getAllFriends(userId);
        ranks.add(user);
        ranks.sort(Comparator.comparing(User::getScore).reversed());

        return ResponseEntity.ok(Map.of(
                "ranks", ranks
        ));
    }





}
