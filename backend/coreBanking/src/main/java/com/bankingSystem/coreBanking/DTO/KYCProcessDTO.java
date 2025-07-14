package com.bankingSystem.coreBanking.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class KYCProcessDTO {
    private long userId;
    private String aadharNumber;
    private String panNumber;
    private String documentFile;
}
