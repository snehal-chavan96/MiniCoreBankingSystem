package com.bankingSystem.coreBanking.mappers;

import com.bankingSystem.coreBanking.DTO.AccountDTO;
import com.bankingSystem.coreBanking.Entity.Accounts.Account;
import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;
import com.bankingSystem.coreBanking.Repository.SignUpRepos.UserSignUpRepo;
import org.springframework.beans.factory.annotation.Autowired;

public class AccountMappers {



    public static Account mapToAccount(AccountDTO accountDTO, SignUpUserEntity user)
    {



        return new Account(
                accountDTO.getAccountId(),
                user,
                accountDTO.getAccountNumber(),
                accountDTO.getType(),
                accountDTO.getBalance(),
                accountDTO.getStatus(),
                accountDTO.getOpenedAt(),
                accountDTO.getClosedAt(),
                accountDTO.getPin()
        );
    }

    public static AccountDTO mapToAccountDTO(Account account)
    {



        return new AccountDTO(
                account.getAccountId(),
                account.getUser().getUserId(),
                account.getAccountNumber(),
                account.getType(),
                account.getBalance(),
                account.getStatus(),
                account.getOpenedAt(),
                account.getClosedAt(),
                account.getPin()
        );
    }

}
