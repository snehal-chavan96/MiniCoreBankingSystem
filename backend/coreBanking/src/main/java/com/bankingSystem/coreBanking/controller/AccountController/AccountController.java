package com.bankingSystem.coreBanking.controller.AccountController;

import com.bankingSystem.coreBanking.DTO.AccountDTO.AccountDTO;
import com.bankingSystem.coreBanking.DTO.TransactionDTOs.BalanceRequestDTO;
import com.bankingSystem.coreBanking.Entity.Accounts.Account;
import com.bankingSystem.coreBanking.Repository.AccountRepository.AccountRepository;
import com.bankingSystem.coreBanking.Service.AccountsService.AccountService;
import com.bankingSystem.coreBanking.Util.AccountNumberGenerator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AccountService accountService;
    @Autowired
    private PasswordEncoder encoder;

    @PostMapping("/create")
    public ResponseEntity<?> createAccount(@RequestBody AccountDTO accountDTO) {
        log.info("Creating an account!!");
        try {
            accountDTO.setOpenedAt(LocalDate.now());
            accountDTO.setClosedAt(LocalDate.now().plusYears(10));
            accountDTO.setAccountNumber(
                    AccountNumberGenerator.generate(Account.AccountType.valueOf(accountDTO.getType()))
            );
            accountDTO.setPin(encoder.encode(accountDTO.getPin()));
            AccountDTO createdAccount = accountService.createAccount(accountDTO);
            log.info("Account Created!!");
            return ResponseEntity.ok(createdAccount);
        } catch (IllegalStateException e) {
            log.error("Account creation failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error creating account", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating account");
        }
    }


    @GetMapping("/user/{id}")
    public ResponseEntity<List<Account>> getAccounts(@PathVariable Long id)
    {
        List<Account> accounts = accountService.getAccounts(id);
        return ResponseEntity.ok(accounts);
    }

    @PostMapping("/viewbalance")
    public ResponseEntity<BigDecimal> viewBalance(@RequestBody BalanceRequestDTO balanceRequestDTO)
    {
        BigDecimal amount = accountService.getBalance(balanceRequestDTO.getAccountNumber(), balanceRequestDTO.getPin());
        return ResponseEntity.ok(amount);
    }

    @GetMapping("/{id}/balance")
    public ResponseEntity<BigDecimal> getBalanceById(@PathVariable Long id) {
        return accountRepository.findById(id)
                .map(acc -> ResponseEntity.ok(acc.getBalance()))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }


}
