package com.finance.hackathon.repository;
import com.finance.hackathon.domain.Purchase;

public interface PurchaseRepository {

    void newPurchase(Purchase purchase, Long currentUserId);
    Purchase getPurchaseById(Long id);
}
