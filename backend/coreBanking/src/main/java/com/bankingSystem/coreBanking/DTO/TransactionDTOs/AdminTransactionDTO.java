package com.bankingSystem.coreBanking.DTO.TransactionDTOs;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminTransactionDTO {
    private String referenceId;
    private String fromAccount;
    private String toAccount;
    private BigDecimal amount;
    private String status;      // SUCCESS / FAILED / PENDING
    private LocalDateTime txnTime;
}