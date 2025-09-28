package com.finance.hackathon.resource;

import com.finance.hackathon.domain.Goal;
import com.finance.hackathon.domain.Purchase;
import com.finance.hackathon.domain.User;
import com.finance.hackathon.service.GoalService;
import com.finance.hackathon.service.PurchaseService;
import com.finance.hackathon.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping(path="/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardResource {
    private final UserService userService;
    private final PurchaseService purchaseService;
    private final GoalService goalService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserDashboard(@PathVariable("userId") Long userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing or invalid X-User-Id.");
        }

        try {
            User user = userService.getUserById(userId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User not found");
            }

            List<Purchase> purchases = purchaseService.getAllPurchasesByUserId(userId);
            Purchase latestPurchase = purchases.isEmpty() ? null : purchases.getFirst();

            Optional<Goal> goalOpt = goalService.getGoalByUserId(userId);

            Map<String, Object> dashboard = new HashMap<>();
            dashboard.put("userId", user.getId());
            dashboard.put("income", user.getIncome());
            dashboard.put("expenditures", user.getExpenditures());
            dashboard.put("score", user.getScore());

            if (latestPurchase != null) {
                dashboard.put("amount", latestPurchase.getAmount());
                dashboard.put("merchant", latestPurchase.getMerchant());
                dashboard.put("purchase_time", latestPurchase.getPurchaseTime());
                dashboard.put("category", latestPurchase.getCategory());
            } else {
                dashboard.put("amount", null);
                dashboard.put("merchant", null);
                dashboard.put("purchase_time", null);
                dashboard.put("category", null);
            }

            if (goalOpt.isPresent()) {
                Goal goal = goalOpt.get();
                dashboard.put("days", goal.getDays());
                dashboard.put("saved", goal.getSaved());
            } else {
                dashboard.put("days", null);
                dashboard.put("saved", null);
            }

            return ResponseEntity.ok(dashboard);

        } catch (Exception e) {
            log.error("Error fetching dashboard for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching user dashboard: " + e.getMessage());
        }
    }
}