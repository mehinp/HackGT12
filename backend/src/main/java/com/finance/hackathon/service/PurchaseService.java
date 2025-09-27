package com.finance.hackathon.service;
import com.finance.hackathon.domain.Purchase;

public interface PurchaseService {
    void newPurchase(Purchase purchase, Long currentUserId);
    Purchase getPurchaseById(Long id);
}
