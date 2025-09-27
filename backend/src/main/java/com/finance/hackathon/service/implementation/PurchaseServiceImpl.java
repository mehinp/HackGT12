package com.finance.hackathon.service.implementation;

import com.finance.hackathon.domain.Purchase;
import com.finance.hackathon.repository.PurchaseRepository;
import com.finance.hackathon.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PurchaseServiceImpl implements PurchaseService {
    private final PurchaseRepository purchaseRepository;

    @Override
    public void newPurchase(Purchase purchase, Long currentUserId){
        purchaseRepository.newPurchase(purchase, currentUserId);
    }

    @Override
    public Purchase getPurchaseById(Long id) {
        return purchaseRepository.getPurchaseById(id);
    }
}
