package com.bankingSystem.coreBanking.Repository.FixedDepositRepository;

import com.bankingSystem.coreBanking.DTO.FixedDepositDTO.FixedDepositFilterRequestDTO;
import com.bankingSystem.coreBanking.Entity.FixedDeposit.FixedDeposit;

import java.util.List;

public interface FixedDepositCustomRepo {
    List<FixedDeposit> filterFDs(FixedDepositFilterRequestDTO filter);
}