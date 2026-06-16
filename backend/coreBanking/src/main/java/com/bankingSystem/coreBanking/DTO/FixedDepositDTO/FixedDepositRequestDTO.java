package com.bankingSystem.coreBanking.DTO.FixedDepositDTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FixedDepositRequestDTO {
    @NotNull
    private Long accountId;

    @NotNull @Positive
    private Double principalAmount;

    @NotNull @Positive
    private Integer tenureMonths;

    private Boolean isAutoRenewal;
}

