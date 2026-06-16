package com.bankingSystem.coreBanking.controller.ForgetPasswordControllers;

import com.bankingSystem.coreBanking.DTO.ForgetPasswordDTO.ChangePasswordDTO;
import com.bankingSystem.coreBanking.Service.UserAuthService.ChangePasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:5173")
public class ChangePasswordController {

    private static final Logger logger = LoggerFactory.getLogger(ChangePasswordController.class);

    @Autowired
    ChangePasswordService changePasswordService;

    @PutMapping("/change-password/{username}")
    public ResponseEntity<String> changePassword(@PathVariable String username, @RequestBody ChangePasswordDTO password) {
        logger.info("Received password change request for user: {}", username);
        logger.debug("Password DTO received: {}", password);  // Make sure toString() is safe & secure

        ResponseEntity<String> response = changePasswordService.changePassword(username, password);

        logger.info("Password change response for {}: {}", username, response.getBody());
        return response;
    }
}
