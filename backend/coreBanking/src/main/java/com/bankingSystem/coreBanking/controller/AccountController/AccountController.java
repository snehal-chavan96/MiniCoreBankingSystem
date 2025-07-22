package com.bankingSystem.coreBanking.controller.AccountController;


import com.bankingSystem.coreBanking.DTO.AccountDTO;
import com.bankingSystem.coreBanking.DTO.BalanceRequestDTO;
import com.bankingSystem.coreBanking.Entity.Accounts.Account;
import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import com.bankingSystem.coreBanking.Repository.AccountRepository.AccountRepository;
import com.bankingSystem.coreBanking.Repository.SignUpRepos.UserSignUpRepo;
import com.bankingSystem.coreBanking.Service.AccountsService.AccountService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.logging.Logger;
@Slf4j
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/accounts")
public class AccountController {


    @Autowired
    private AccountService accountService;
    @Autowired
    private PasswordEncoder encoder;


    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserSignUpRepo userSignUpRepo;

    @PostMapping("/create/{username}")
    public ResponseEntity<?> createAccount(@RequestBody AccountDTO accountDTO, @PathVariable String username)
    {
        log.info("Creating an account!!");
        AccountDTO accountDTO1 = new AccountDTO();

//        SignUpUserEntity user = userSignUpRepo.findById(accountDTO.getUserId()).orElseThrow(
//                ()-> new RuntimeException("No user exists!!")
//        );
        SignUpUserEntity user = userSignUpRepo.findByUsername(username);
        accountDTO.setUserId(user.getUserId());
        if (accountRepository.existsByUser_PhoneNumber(user.getPhoneNumber()))
        {
            throw new IllegalArgumentException("An account already exist of the same mobile number!!");
        }
        else
        {
            try {

                accountDTO.setOpenedAt(LocalDate.now());
                accountDTO.setClosedAt(LocalDate.now().plusYears(10));
                accountDTO.setAccountNumber("FCX"+System.currentTimeMillis());
                accountDTO.setPin(encoder.encode(accountDTO.getPin()));
                accountDTO1 = accountService.createAccount(accountDTO);
                log.info("Account Created!!");
            } catch (Exception e) {
                System.out.println(e);
                log.info("Failed to create an account!!");
            }
        }


        return ResponseEntity.ok(accountDTO1);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<Account>> getAccounts(@PathVariable Long id)
    {
        log.info("Fetching accounts!!");
        List<Account> accounts = accountService.getAccounts(id);
        return ResponseEntity.ok(accounts);
    }

    @PostMapping("/viewbalance")
    public ResponseEntity<Double> viewBalance(@RequestBody BalanceRequestDTO balanceRequestDTO)
    {
        log.info("Fetching balance!!");
        Double amount = accountService.getBalance(balanceRequestDTO.getAccountNumber(), balanceRequestDTO.getPin());
        return ResponseEntity.ok(amount);
    }

}
