package com.bankingSystem.coreBanking.controller.ForgetPasswordControllers;

import com.bankingSystem.coreBanking.DTO.ForgetPasswordDTO.SecurityAnswerDTO;
import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import com.bankingSystem.coreBanking.Repository.SignUpRepos.UserSignUpRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:5173")
public class CheckAnswerController {

    private static final Logger logger = LoggerFactory.getLogger(CheckAnswerController.class);

    @Autowired
    UserSignUpRepo userSignUpRepo;

    @Autowired
    GetQuestionController getQuestionController;

    @PostMapping("/verify-answer")
    public ResponseEntity<String> verifyAnswer(@RequestBody SecurityAnswerDTO securityAnswer) {
        logger.info("Verifying answer for username: {}", securityAnswer.getUsername());

        SignUpUserEntity usersData = userSignUpRepo.findByUsername(securityAnswer.getUsername());

        if (usersData == null) {
            logger.warn("User with username '{}' not found.", securityAnswer.getUsername());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with username not found");
        }

        boolean isMatch = usersData.getUserAnswer().trim().equalsIgnoreCase(securityAnswer.getSecurityAnswer().trim());

        if (isMatch) {
            logger.info("Security answer matched for user '{}'", securityAnswer.getUsername());
            return ResponseEntity.ok("Your answer matched. Now you can change the password");
        } else {
            logger.warn("Security answer mismatch for user '{}'", securityAnswer.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("The answer to the question is wrong");
        }
    }
}
