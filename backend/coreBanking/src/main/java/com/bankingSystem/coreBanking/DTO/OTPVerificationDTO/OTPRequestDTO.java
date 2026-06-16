package com.bankingSystem.coreBanking.DTO.OTPVerificationDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OTPRequestDTO {
    private String username;
    private String phoneNumber;
    private String Otp;
}
