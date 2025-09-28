package com.finance.hackathon.resource;

import com.finance.hackathon.domain.Purchase;
import com.finance.hackathon.service.PurchaseService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping(path="/purchase")
public class PurchaseResource {
    private final PurchaseService purchaseService;

    @PostMapping("/record")
    public ResponseEntity<?> newPurchase(@RequestBody Purchase purchase, @RequestHeader(value="X-User-Id", required=false) Long userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing or invalid X-User-Id.");
        }
        purchaseService.newPurchase(purchase, userId);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "userId", userId,
                        "amount", purchase.getAmount(),
                        "category", purchase.getCategory(),
                        "merchant", purchase.getMerchant()
                ));
    }

    @GetMapping("/admin/{id}")
    public ResponseEntity<?> getPurchaseAdmin(@PathVariable("id") Long id) {
        Purchase purchase = purchaseService.getPurchaseById(id);
        if (purchase == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Purchase not found");
        }

        return ResponseEntity.ok(purchase);
    }

    @GetMapping("/my-purchases")
    public ResponseEntity<?> getMyPurchases(@RequestHeader(value="X-User-Id", required=false) Long userId) {
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User not logged in");
        }

        try {
            List<Purchase> purchases = purchaseService.getAllPurchasesByUserId(userId);
            return ResponseEntity.ok(Map.of(
                    "userId", userId,
                    "purchaseCount", purchases.size(),
                    "purchases", purchases
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching purchases");
        }
    }

    @GetMapping("/admin/user/{userId}")
    public ResponseEntity<?> getAllPurchasesByUserIdAdmin(@PathVariable("userId") Long userId) {
        try {
            List<Purchase> purchases = purchaseService.getAllPurchasesByUserId(userId);
            return ResponseEntity.ok(Map.of(
                    "userId", userId,
                    "purchaseCount", purchases.size(),
                    "purchases", purchases
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching purchases for user " + userId);
        }
    }



}