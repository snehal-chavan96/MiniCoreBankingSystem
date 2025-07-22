package com.bankingSystem.coreBanking.DTO.AccountDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class AccountDTO {


    private Long accountId;
    private Long userId;
    private String accountNumber;
    private String type;
    private BigDecimal balance;
    private String status;
    private LocalDate openedAt;
    private LocalDate closedAt;
    private String pin;

}
