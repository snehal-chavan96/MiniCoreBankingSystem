package com.bankingSystem.coreBanking.Repository.FixedDepositRepository;

import com.bankingSystem.coreBanking.Entity.FixedDeposit.FixedDeposit;
import com.bankingSystem.coreBanking.Repository.FixedDepositRepository.FixedDepositCustomRepo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface FixedDepositRepo extends JpaRepository<FixedDeposit, Long>, FixedDepositCustomRepo {
    Optional<FixedDeposit> findByFdNumber(String fdNumber);
    List<FixedDeposit> findByAccount_AccountId(Long accountId);
    List<FixedDeposit> findByStatusAndMaturityDateBefore(
            FixedDeposit.FDStatus status, LocalDateTime dateTime
    );
    long countByStartDateBetween(LocalDateTime start, LocalDateTime end);
}