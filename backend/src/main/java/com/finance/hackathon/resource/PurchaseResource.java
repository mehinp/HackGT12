package com.finance.hackathon.resource;

import com.finance.hackathon.domain.Purchase;
import com.finance.hackathon.service.PurchaseService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping(path="/purchase")
public class PurchaseResource {
    private final PurchaseService purchaseService;

    @PostMapping("/record")
    public ResponseEntity<?> newPurchase(@RequestBody Purchase purchase, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User not logged in");
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



}