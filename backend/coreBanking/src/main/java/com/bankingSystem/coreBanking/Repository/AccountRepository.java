package com.bankingSystem.coreBanking.Repository;

import com.bankingSystem.coreBanking.Entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account,Long> {
}
