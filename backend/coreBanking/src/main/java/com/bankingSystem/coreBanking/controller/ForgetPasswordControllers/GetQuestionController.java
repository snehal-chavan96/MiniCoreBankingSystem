package com.bankingSystem.coreBanking.controller.ForgetPasswordControllers;

import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import com.bankingSystem.coreBanking.Repository.SignUpRepos.UserSignUpRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:5173")
public class GetQuestionController {
    @Autowired
    UserSignUpRepo userSignUpRepo;
    @GetMapping("security-question/{username}")
    public ResponseEntity getQuestionAccordingToUsername(@PathVariable String username){
        SignUpUserEntity user = userSignUpRepo.findByUsername(username.trim());
        if(user==null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User of the given username don't exists!");
        }else{
            //Isse humko question with text mil jayega instead of ENUM
            String question = user.getQuestionLists().getQuestion();
            return ResponseEntity.ok(question);
        }
    }
}
