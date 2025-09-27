package com.finance.hackathon.resource;

import com.finance.hackathon.domain.Purchase;
import com.finance.hackathon.domain.User;
import com.finance.hackathon.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(path="/purchase")
public class PurchaseResource {
    private final PurchaseService purchaseService;

    @PostMapping("/record")
    public ResponseEntity<Purchase> newPurchase(@RequestBody Purchase purchase, Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        Purchase saved = purchaseService.newPurchase(purchase, userId);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);
    }

    private Long getCurrentUserId(Authentication authentication) {
        return ((User) authentication.getPrincipal()).getId();
    }

}
