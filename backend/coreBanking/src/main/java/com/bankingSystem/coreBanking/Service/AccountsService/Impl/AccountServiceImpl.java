package com.bankingSystem.coreBanking.Service.AccountsService.Impl;

import com.bankingSystem.coreBanking.DTO.AccountDTO;
import com.bankingSystem.coreBanking.Entity.Accounts.Account;
import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import com.bankingSystem.coreBanking.Repository.AccountRepository.AccountRepository;
import com.bankingSystem.coreBanking.Repository.SignUpRepos.UserSignUpRepo;
import com.bankingSystem.coreBanking.Service.AccountsService.AccountService;
import com.bankingSystem.coreBanking.mappers.AccountMappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AccountServiceImpl implements AccountService {


    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserSignUpRepo userSignUpRepo;

    @Autowired
    private PasswordEncoder encoder;
    @Override
    public List<Account> getAccounts(Long userId) {
        List<Account> accounts = accountRepository.findByUser_UserId(userId);
        return accounts;
    }

    @Override
    public AccountDTO createAccount(AccountDTO accountDTO) {
        SignUpUserEntity user = userSignUpRepo.findById(accountDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if user already has an account
        List<Account> existingAccounts = accountRepository.findByUser_UserId(user.getUserId());
        if (!existingAccounts.isEmpty()) {
            throw new IllegalStateException("User already has an account.");
        }

        Account account = AccountMappers.mapToAccount(accountDTO, user);
        Account savedAccount = accountRepository.save(account);
        return AccountMappers.mapToAccountDTO(savedAccount);
    }


    @Override

    public BigDecimal getBalance(String accNo, String pin) {
        Account account = accountRepository.findByAccountNumber(accNo)
                .orElseThrow(() ->
                        new IllegalArgumentException("Account with account number " + accNo + " not found.")
                );

        if (!encoder.matches(pin, account.getPin())) {
            throw new IllegalArgumentException("Incorrect PIN.");
        }

        return account.getBalance();
    }


}
