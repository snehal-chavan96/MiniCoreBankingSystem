package com.bankingSystem.coreBanking.Service;
import com.bankingSystem.coreBanking.DTO.ForgetPasswordDTO.ChangePasswordDTO;
import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import com.bankingSystem.coreBanking.Repository.SignUpRepos.UserSignUpRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ChangePasswordService {
    // Calling UserSignUpRepo to get findByUsername() method
    @Autowired
    UserSignUpRepo userSignUpRepo;
    public ResponseEntity<String> changePassword(String username, ChangePasswordDTO changePasswordDTO){
        // Check whether the username gives something or not
        SignUpUserEntity user = userSignUpRepo.findByUsername(username);
        if(user == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User doesn't exists!");
        }
        // Setting password and hashing it using bcrypt
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        user.setHashPassword(bCryptPasswordEncoder.encode(changePasswordDTO.getPassword()));
        userSignUpRepo.save(user);
        // Return the status to server
        return ResponseEntity.ok("Password changed successfully!!");
    }
}
