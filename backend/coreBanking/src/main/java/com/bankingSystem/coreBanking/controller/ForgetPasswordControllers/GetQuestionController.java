package com.bankingSystem.coreBanking.controller.ForgetPasswordControllers;

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
public class GetQuestionController {

    private static final Logger logger = LoggerFactory.getLogger(GetQuestionController.class);

    @Autowired
    private UserSignUpRepo userSignUpRepo;

    @GetMapping("/security-question/{username}")
    public ResponseEntity<?> getQuestionAccordingToUsername(@PathVariable String username) {
        logger.info("Received request to get security question for username: {}", username);

        try {
            SignUpUserEntity user = userSignUpRepo.findByUsername(username.trim());

            if (user == null) {
                logger.warn("User not found with username: {}", username);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User of the given username doesn't exist!");
            }

            String question = user.getQuestionLists().getQuestion();
            logger.info("Security question retrieved for username {}: {}", username, question);
            return ResponseEntity.ok(question);

        } catch (Exception e) {
            logger.error("Error retrieving security question for username {}: {}", username, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Something went wrong: " + e.getMessage());
        }
    }
}
