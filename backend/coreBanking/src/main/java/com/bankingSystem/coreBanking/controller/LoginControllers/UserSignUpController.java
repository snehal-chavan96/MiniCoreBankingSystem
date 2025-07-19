package com.bankingSystem.coreBanking.controller.LoginControllers;

import com.bankingSystem.coreBanking.DTO.AllUsersDataDTO;
import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import com.bankingSystem.coreBanking.Repository.SignUpRepos.UserSignUpRepo;
import com.bankingSystem.coreBanking.Service.UserAuthService.GetAllUserService;
import com.bankingSystem.coreBanking.Service.UserAuthService.UserSignUpService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class UserSignUpController {

    private static final Logger logger = LoggerFactory.getLogger(UserSignUpController.class);

    @Autowired
    private UserSignUpService userSignUpService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public UserSignUpController(GetAllUserService getAllUserService) {
        this.getAllUserService = getAllUserService;
    }

    @PostMapping("/signUp")
    @CrossOrigin("http://localhost:5173")
    public ResponseEntity<?> userLogin(@RequestBody SignUpUserEntity signupData) {
        logger.info("Attempting signup for username: {}", signupData.getUsername());

        signupData.setHashPassword(encoder.encode(signupData.getHashPassword()));
        try {
            SignUpUserEntity savedUser = userSignUpService.register(signupData);
            logger.info("User created successfully: {}", savedUser.getUsername());
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            logger.warn("Signup failed for username: {} - Reason: {}", signupData.getUsername(), e.getMessage());
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    @Autowired
    private GetAllUserService getAllUserService;

    @GetMapping("/getUsers")
    public List<AllUsersDataDTO> getUsers() {
        logger.info("Fetching all users");
        return getAllUserService.getAllUsers();
    }

    @Autowired
    private UserSignUpRepo userByusername;

    @GetMapping("/user/{username}")
    public SignUpUserEntity getUserByUsername(@PathVariable String username) {
        logger.info("Fetching user by username: {}", username);
        return userByusername.findByUsername(username);
    }
}
