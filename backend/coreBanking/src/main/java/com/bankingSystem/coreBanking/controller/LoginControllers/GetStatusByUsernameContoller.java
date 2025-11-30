package com.bankingSystem.coreBanking.controller.LoginControllers;

import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import com.bankingSystem.coreBanking.Repository.SignUpRepos.UserSignUpRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class GetStatusByUsernameContoller {

    private static final Logger logger = LoggerFactory.getLogger(GetStatusByUsernameContoller.class);

    @Autowired
    private UserSignUpRepo userByusername;

    @GetMapping("/user/details/{username}")
    public ResponseEntity<?> getUserDetails(@PathVariable String username) {
        logger.info("Received request to fetch user details for username: {}", username);

        try {
            SignUpUserEntity user = userByusername.findByUsername(username);
            if (user == null) {
                logger.warn("User not found with username: {}", username);
                return ResponseEntity.status(404).body("User not found");
            }

            logger.info("User details found for username: {}", username);
            return ResponseEntity.ok(user);

        } catch (Exception e) {
            logger.error("Exception occurred while fetching user details for username {}: {}", username, e.getMessage());
            return ResponseEntity.status(500).body("Internal server error occurred");
        }
    }
}
