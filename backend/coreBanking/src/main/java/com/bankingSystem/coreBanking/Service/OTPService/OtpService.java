package com.bankingSystem.coreBanking.Service.OTPService;

import com.bankingSystem.coreBanking.DTO.OTPVerificationDTO.OTPRequestDTO;
import org.springframework.stereotype.Service;

public interface OtpService {
    String sendOtp(OTPRequestDTO request);
    String verifyOtp(OTPRequestDTO request);
}
