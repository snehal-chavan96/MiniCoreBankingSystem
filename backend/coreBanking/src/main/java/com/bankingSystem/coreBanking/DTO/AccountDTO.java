package com.bankingSystem.coreBanking.DTO;

import com.bankingSystem.coreBanking.Entity.Account;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {

    private Long accountId;
    private String accountNumber;
    private Long userId;
    private Account.AccountType accountType;
    private BigDecimal balance;
    private BigDecimal minimumBalance;
    private BigDecimal interestRate;
    private Account.Status status;
    private LocalDate openingDate;
    private LocalDate closingDate;
    private String branchCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}