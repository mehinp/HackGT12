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




    public Purchase newPurchase(Purchase purchase, Long currentUserId){
        Purchase purchaseWithUserId = new Purchase(
                purchase.getId(),
                currentUserId,  // Set the user ID from the logged-in user
                purchase.getAmount(),
                purchase.getCategory(),
                purchase.getMerchant()
        );
        return purchaseRepository.newPurchase(purchaseWithUserId);
    }
}
