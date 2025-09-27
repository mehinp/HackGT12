package com.finance.hackathon.domain;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Purchase {
    private String id;
    private Long userId;
    private BigDecimal amount;
    private String category;
    private String merchant;
    // purchase time will automatically be populated by DB as current time when request is made
}
