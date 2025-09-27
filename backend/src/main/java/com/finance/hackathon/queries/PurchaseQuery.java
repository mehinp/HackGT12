package com.finance.hackathon.queries;

public class PurchaseQuery {
    public static final String INSERT_PURCHASE_QUERY = "INSERT INTO Purchases (user_id, amount, category, merchant) VALUES " +
            "(:userId, :amount, :category, :merchant)";

    public static final String SELECT_PURCHASE_BY_ID_QUERY = "SELECT * FROM Purchases WHERE id = :id";
}

