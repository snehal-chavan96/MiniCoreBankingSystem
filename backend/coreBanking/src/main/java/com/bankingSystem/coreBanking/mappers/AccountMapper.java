package com.bankingSystem.coreBanking.mappers;

import com.bankingSystem.coreBanking.DTO.AccountDTO;
import com.bankingSystem.coreBanking.Entity.Account;
import com.bankingSystem.coreBanking.Entity.SignUpUserEntity;

public class AccountMapper {
    public static AccountDTO accountToAccountDTO(Account account) {
        return new AccountDTO(
                account.getAccountId(),
                account.getAccountNumber(),
                account.getUser() != null ? account.getUser().getUserId() : null,
                account.getAccountType(),
                account.getBalance(),
                account.getMinimumBalance(),
                account.getInterestRate(),
                account.getStatus(),
                account.getOpeningDate(),
                account.getClosingDate(),
                account.getBranchCode(),
                account.getCreatedAt(),
                account.getUpdatedAt()
        );
    }

    public static Account accountDTOToAccount(AccountDTO dto, SignUpUserEntity user) {
        Account account = new Account();
        account.setAccountId(dto.getAccountId());
        account.setAccountNumber(dto.getAccountNumber());
        account.setUser(user);
        account.setAccountType(dto.getAccountType());
        account.setBalance(dto.getBalance());
        account.setMinimumBalance(dto.getMinimumBalance());
        account.setInterestRate(dto.getInterestRate());
        account.setStatus(dto.getStatus());
        account.setOpeningDate(dto.getOpeningDate());
        account.setClosingDate(dto.getClosingDate());
        account.setBranchCode(dto.getBranchCode());
        account.setCreatedAt(dto.getCreatedAt());
        account.setUpdatedAt(dto.getUpdatedAt());
        return account;
    }
}