package com.bankingSystem.coreBanking.Repository.KYCRepos;

import com.bankingSystem.coreBanking.Entity.UserKYC.UserKYCEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KYCProcessRepo extends JpaRepository<UserKYCEntity, Long> {
}
