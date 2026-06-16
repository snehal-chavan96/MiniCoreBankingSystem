package com.bankingSystem.coreBanking.DTO.FixedDepositDTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FixedDepositResponseDTO {
    private String fdNumber;
    private Double principalAmount;
    private Double interestRate;
    private Integer tenureMonths;
    private LocalDateTime startDate;
    private LocalDateTime maturityDate;
    private Double maturityAmount;
    private String status;
}