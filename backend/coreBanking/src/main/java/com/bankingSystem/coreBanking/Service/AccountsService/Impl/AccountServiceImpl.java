package com.bankingSystem.coreBanking.Service.AccountsService.Impl;

import com.bankingSystem.coreBanking.DTO.AccountDTO;
import com.bankingSystem.coreBanking.Entity.Accounts.Account;
import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import com.bankingSystem.coreBanking.Repository.AccountRepo.AccountRepository;
import com.bankingSystem.coreBanking.Repository.SignUpRepos.UserSignUpRepo;
import com.bankingSystem.coreBanking.Service.AccountsService.AccountService;
import com.bankingSystem.coreBanking.mappers.AccountMappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

        SignUpUserEntity user = userSignUpRepo.findById(accountDTO.getUserId()).orElseThrow();
        Account account = AccountMappers.mapToAccount(accountDTO, user);
        Account savedAccount = accountRepository.save(account);
        return AccountMappers.mapToAccountDTO(savedAccount);
    }

    @Override
    public Double getBalance(String accNo, String pin) {
        Account account = accountRepository.findByAccountNumber(accNo);

        if (account == null) {
            throw new IllegalArgumentException("Account with account number " + accNo + " not found.");
            // Or return null or throw custom exception as per your design
        }

        if (encoder.matches(pin, account.getPin())) {
            return account.getBalance();
        }

        throw new IllegalArgumentException("Incorrect PIN.");
        // Or return null if you prefer

    }

}
