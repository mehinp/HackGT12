package com.finance.hackathon.domain;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class Purchase {
    private String id;
    private Long userId;
    private BigDecimal amount;
    private String category;
    private String merchant;
    private LocalDateTime purchaseTime;
}
