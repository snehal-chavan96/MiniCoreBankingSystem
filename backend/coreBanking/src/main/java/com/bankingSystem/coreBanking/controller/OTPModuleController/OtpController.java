package com.bankingSystem.coreBanking.controller.OTPModuleController;

import com.bankingSystem.coreBanking.DTO.OTPVerificationDTO.OTPRequestDTO;
import com.bankingSystem.coreBanking.Service.OTPService.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/otp")
@CrossOrigin("http://localhost:5173")
public class OtpController {

    private static final Logger logger = LoggerFactory.getLogger(OtpController.class);

    @Autowired
    private OtpService otpService;

    @PostMapping("/send")
    public String sendOtp(@RequestBody OTPRequestDTO request) {
        logger.info("Received OTP send request for phone number: {}", request.getPhoneNumber());
        logger.debug("Full request payload: {}", request);

        String response = otpService.sendOtp(request);

        logger.info("OTP send response: {}", response);
        return response;
    }

    @PostMapping("/verify")
    public String verifyOtp(@RequestBody OTPRequestDTO request) {
        logger.info("Received OTP verification request for phone number: {}", request.getPhoneNumber());
        logger.debug("Full request payload: {}", request);

        String response = otpService.verifyOtp(request);

        logger.info("OTP verification response: {}", response);
        return response;
    }
}
