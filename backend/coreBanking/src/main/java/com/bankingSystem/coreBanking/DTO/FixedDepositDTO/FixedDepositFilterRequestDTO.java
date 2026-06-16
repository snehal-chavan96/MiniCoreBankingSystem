package com.bankingSystem.coreBanking.DTO.FixedDepositDTO;

import com.bankingSystem.coreBanking.Entity.FixedDeposit.FixedDeposit;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FixedDepositFilterRequestDTO {
    private Long accountId;
    private FixedDeposit.FDStatus status;
    private LocalDate startFrom;
    private LocalDate startTo;
    private LocalDate maturityFrom;
    private LocalDate maturityTo;
}
