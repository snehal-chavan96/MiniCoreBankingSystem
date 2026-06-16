package com.bankingSystem.coreBanking.DTO.TransactionDTOs;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponseDTO {
    private Long txnId;
    private String type;
    private String status;
    private BigDecimal amount;
    private String counterpartyAccount;
    private String referenceId;
    private String remarks;
    private LocalDateTime txnTime;
}
