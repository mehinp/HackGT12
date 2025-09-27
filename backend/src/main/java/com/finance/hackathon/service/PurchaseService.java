package com.finance.hackathon.service;
import com.finance.hackathon.domain.Purchase;

import java.util.List;

public interface PurchaseService {
    void newPurchase(Purchase purchase, Long currentUserId);
    Purchase getPurchaseById(Long id);
    List<Purchase> getAllPurchasesByUserId(Long userId);
}
