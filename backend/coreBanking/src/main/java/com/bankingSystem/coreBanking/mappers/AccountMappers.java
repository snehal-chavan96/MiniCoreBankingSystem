package com.bankingSystem.coreBanking.mappers;

import com.bankingSystem.coreBanking.DTO.AccountDTO;
import com.bankingSystem.coreBanking.Entity.Accounts.Account;
import com.bankingSystem.coreBanking.Entity.SignUp.SignUpUserEntity;

public class AccountMappers {

    public static Account mapToAccount(AccountDTO accountDTO, SignUpUserEntity user) {
        return new Account(
                accountDTO.getAccountId(),
                user,
                accountDTO.getAccountNumber(),
                Account.AccountType.valueOf(accountDTO.getType().toUpperCase()), // Convert String to Enum
                accountDTO.getBalance(),
                Account.AccountStatus.valueOf(accountDTO.getStatus().toUpperCase()), // Convert String to Enum
                accountDTO.getOpenedAt() != null ? accountDTO.getOpenedAt().atStartOfDay() : null,
                accountDTO.getClosedAt() != null ? accountDTO.getClosedAt().atStartOfDay() : null,
                accountDTO.getPin()
        );
    }

    public static AccountDTO mapToAccountDTO(Account account) {
        return new AccountDTO(
                account.getAccountId(),
                account.getUser().getUserId(),
                account.getAccountNumber(),
                account.getType().name(), // Convert Enum to String
                account.getBalance(),
                account.getStatus().name(), // Convert Enum to String
                account.getOpenedAt() != null ? account.getOpenedAt().toLocalDate() : null,
                account.getClosedAt() != null ? account.getClosedAt().toLocalDate() : null,
                account.getPin()
        );
    }
}
