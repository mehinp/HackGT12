package com.finance.hackathon.repository;
import com.finance.hackathon.domain.Purchase;

import java.util.List;

public interface PurchaseRepository {

    void newPurchase(Purchase purchase, Long currentUserId);
    Purchase getPurchaseById(Long id);
    List<Purchase> getAllPurchasesByUserId(Long userId);
}
