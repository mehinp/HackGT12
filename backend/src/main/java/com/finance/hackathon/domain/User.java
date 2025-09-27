package com.finance.hackathon.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class User {
    private Long id;
    // Manual getters
    private String firstName;
    private String lastName;
    private String email;
    private String password;

}
