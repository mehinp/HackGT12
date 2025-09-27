package com.finance.hackathon.repository.implementation;

import com.finance.hackathon.domain.Purchase;
import com.finance.hackathon.repository.PurchaseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcOperations;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import static com.finance.hackathon.queries.PurchaseQuery.*;

@Repository
@RequiredArgsConstructor
@Slf4j
public class PurchaseRepositoryImpl implements PurchaseRepository {
    private final NamedParameterJdbcOperations jdbc;

    @Override
    public void newPurchase(Purchase purchase, Long currentUserId) {
        try {
            jdbc.update(INSERT_PURCHASE_QUERY, Map.of(
                    "userId", currentUserId,
                    "amount", purchase.getAmount(),
                    "category", purchase.getCategory(),
                    "merchant", purchase.getMerchant()
            ));
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public Purchase getPurchaseById(Long id) {
        try {
            return jdbc.queryForObject(SELECT_PURCHASE_BY_ID_QUERY,
                    Map.of("id", id), this::mapRowToPurchase);
        } catch (Exception e) {
            log.error("Purchase with id {} not found: {}", id, e.getMessage());
            return null;
        }
    }

    @Override
    public List<Purchase> getAllPurchasesByUserId(Long userId) {
        try {
            return jdbc.query(SELECT_ALL_PURCHASES_BY_USER_ID_QUERY,
                    Map.of("userId", userId), this::mapRowToPurchase);
        } catch (Exception e) {
            log.error("Error fetching purchases for user {}: {}", userId, e.getMessage());
            throw new RuntimeException("Error fetching purchases: " + e.getMessage());
        }
    }

    private Purchase mapRowToPurchase(ResultSet rs, int rowNum) throws SQLException {
        return new Purchase(
                rs.getString("id"),
                rs.getLong("user_id"),
                rs.getBigDecimal("amount"),
                rs.getString("category"),
                rs.getString("merchant"),
                rs.getTimestamp("purchase_time").toLocalDateTime()
        );
    }


}
