package com.finance.hackathon.queries;

public class PurchaseQuery {
    public static final String INSERT_PURCHASE_QUERY = "INSERT INTO Purchases (user_id, amount, category, merchant) VALUES " +
            "(:userId, :amount, :category, :merchant)";
}
