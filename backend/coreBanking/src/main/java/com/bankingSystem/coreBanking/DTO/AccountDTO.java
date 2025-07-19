package com.bankingSystem.coreBanking.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private Double balance;
    private String status;
    private LocalDate openedAt;
    private LocalDate closedAt;

}
