package com.bankingSystem.coreBanking.DTO.TransactionDTOs;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class FundTransferDTO {
    private String fromAccountNumber;  // Changed from Long to String
    private String toAccountNumber;    // Changed from Long to String
    private BigDecimal amount;
    private String remarks;
}
