package com.finance.hackathon.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class User {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String confirmPassword;
    private BigDecimal income;
    private BigDecimal expenditures;
    private int score;

    public User(Long id, String firstName, String lastName,
                String email, String password,
                BigDecimal income, BigDecimal expenditures, int score) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.income = income;
        this.expenditures = expenditures;
        this.score = score;
    }
}
