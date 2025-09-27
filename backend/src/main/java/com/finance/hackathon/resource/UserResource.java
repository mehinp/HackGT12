package com.finance.hackathon.resource;

import com.finance.hackathon.domain.User;
import com.finance.hackathon.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping(path="/user")
@RequiredArgsConstructor
@Slf4j
public class UserResource {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> saveUser(@RequestBody User user) {
        User saved = userService.createUser(user);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User loginUser, HttpSession session) {
        try {
            User user = userService.authenticate(loginUser.getEmail(), loginUser.getPassword());
            session.setAttribute("userId", user.getId());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable("id") Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }





}
