package com.finance.hackathon.service;
import com.finance.hackathon.domain.Purchase;

public interface PurchaseService {
    Purchase newPurchase(Purchase purchase, Long currentUserId);
}
