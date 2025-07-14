package com.bankingSystem.coreBanking.controller.ForgetPasswordControllers;

import com.bankingSystem.coreBanking.DTO.ForgetPasswordDTO.SecurityAnswerDTO;
import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import com.bankingSystem.coreBanking.Repository.SignUpRepos.UserSignUpRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:5173")
public class CheckAnswerController {
    @Autowired
    UserSignUpRepo userSignUpRepo;
    @Autowired
    GetQuestionController getQuestionController;
    @PostMapping("/verify-answer")
    public ResponseEntity<String> verifyAnswer(@RequestBody SecurityAnswerDTO securityAnswer){
        SignUpUserEntity usersData = userSignUpRepo.findByUsername(securityAnswer.getUsername());
        if(usersData == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with username not found");
        }
        //Both database answer as well as the users answer will be checked in lowercase only
        if(usersData.getUserAnswer().trim().equalsIgnoreCase(securityAnswer.getSecurityAnswer().trim())){
            return ResponseEntity.ok("Your answer matched. Now you can change the password");
        }else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("The answer to the question is wrong");
        }
    }
}
