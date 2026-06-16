package com.bankingSystem.coreBanking.DTO.TransactionDTOs;
import lombok.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferResponseDTO {
    private String referenceId;
    private String status;
    private BigDecimal amount;
    private String fromAccountNumber;
    private String toAccountNumber;
    private Long debitTxnId;            // optional
    private Long creditTxnId;           // optional
    private LocalDateTime txnTime;      // e.g., debit txn time
}
