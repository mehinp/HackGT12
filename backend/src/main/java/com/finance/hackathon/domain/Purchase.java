package com.finance.hackathon.domain;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

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
    // purchase time will automatically be populated by DB as current time when request is made
}
