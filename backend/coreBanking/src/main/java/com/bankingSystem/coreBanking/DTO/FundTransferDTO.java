package com.bankingSystem.coreBanking.DTO;


import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class FundTransferDTO {
    private Long fromAccountId;
    private Long toAccountId;
    private BigDecimal amount;
    private String remarks;
}
