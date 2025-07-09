package com.bankingSystem.coreBanking.Service.AuthenticationServices.Impls;

import com.bankingSystem.coreBanking.DTO.AccountDTO;
import com.bankingSystem.coreBanking.Entity.Account;
import com.bankingSystem.coreBanking.Entity.SignUpUserEntity;
import com.bankingSystem.coreBanking.mappers.AccountMapper;
import com.bankingSystem.coreBanking.Repository.AuthenticationRepos.AccountRepository;
import com.bankingSystem.coreBanking.Repository.AuthenticationRepos.UserSignUpRepo;
import com.bankingSystem.coreBanking.Service.AuthenticationServices.AccountService;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

//@AllArgsConstructor
@NoArgsConstructor
@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private UserSignUpRepo userRepo;

    public AccountServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public AccountServiceImpl(UserSignUpRepo userRepo) {
        this.userRepo = userRepo;
    }


    @Override
    public AccountDTO createAccount(AccountDTO accountDTO) {
        Long id = accountDTO.getUserId();
        SignUpUserEntity users = userRepo.findById(id).orElseThrow();
        Account account = AccountMapper.accountDTOToAccount(accountDTO, users);
        Account savedAccount = accountRepository.save(account);
        return AccountMapper.accountToAccountDTO(savedAccount);
    }

    @Override
    public boolean addFunds(String accountNumber, BigDecimal amount) {
        Account account = accountRepository.findByAccountNumber(accountNumber).orElseThrow();
        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);
        return true;
    }

    @Override
    public BigDecimal viewBalance(String accNo) {
        Account account = accountRepository.findByAccountNumber(accNo).orElseThrow();
        return account.getBalance();
    }
}

/*
{
  "customerId": 6,
  "accountType": "CURRENT",
  "balance": 0,
  "minimumBalance": 0,
  "interestRate": 0,
  "status": "ACTIVE",
  "openingDate": "2024-06-20",
  "branchCode": "BR001"
}



{
//account
  "customerId": 2,
  "accountType": "SAVINGS",
  "balance": 9,
  "minimumBalance": 9,
  "interestRate": 9,
  "status": "ACTIVE",
  "openingDate": "2024-06-20",
  "closingDate": null,
  "branchCode": "BR001",

}
//customer

"user": 1,
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-05-20",
  "gender": "MALE",
  "phoneNumber": "+919876543210",
  "addressLine1": "123 Main Street",
  "addressLine2": "Suite 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "country": "India",
  "kycStatus": "PENDING",
  "kycDocuments": "{\"aadhaar\":\"uploaded\",\"pan\":\"uploaded\"}"
 */