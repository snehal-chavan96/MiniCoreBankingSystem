package com.bankingSystem.coreBanking.Service.OTPService;

import com.bankingSystem.coreBanking.DTO.OTPVerificationDTO.OTPRequestDTO;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TwilioOtpServiceImplementation implements OtpService{
    @Value("${twilio.verifyServiceSid}")
    private String verifyServiceSid;

    @Override
    public String sendOtp(OTPRequestDTO request){
        Verification verification = Verification.creator(
                verifyServiceSid,
                "+91" + request.getPhoneNumber(),
                "sms"
        ).create();
        return "OTP sent to +91"+ request.getPhoneNumber();
    }

    @Override
    public String verifyOtp(OTPRequestDTO request){
        VerificationCheck verificationCheck = VerificationCheck.creator(verifyServiceSid)
                .setTo("+91"+request.getPhoneNumber())
                .setCode(request.getOtp())
                .create();
        if("approved".equals(verificationCheck.getStatus())){
            return "OTP verified redirecting to reset password page";
        }else{
            throw new RuntimeException("Invalid OTP");
        }
    }
}
