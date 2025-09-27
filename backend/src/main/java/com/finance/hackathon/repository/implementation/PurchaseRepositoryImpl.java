package com.finance.hackathon.repository.implementation;

import com.finance.hackathon.domain.Purchase;
import com.finance.hackathon.repository.PurchaseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcOperations;
import org.springframework.stereotype.Repository;

import java.util.Map;

import static com.finance.hackathon.queries.PurchaseQuery.INSERT_PURCHASE_QUERY;

@Repository
@RequiredArgsConstructor
@Slf4j
public class PurchaseRepositoryImpl implements PurchaseRepository {
    private final NamedParameterJdbcOperations jdbc;

    @Override
    public Purchase newPurchase(Purchase purchase) {
        try {
            jdbc.update(INSERT_PURCHASE_QUERY, Map.of(
                    "userId", purchase.getUserId(),
                    "amount", purchase.getAmount(),
                    "categories", purchase.getCategory(),
                    "merchant", purchase.getMerchant()
//                    "userId",
            ));
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
        return purchase;
    }

}
