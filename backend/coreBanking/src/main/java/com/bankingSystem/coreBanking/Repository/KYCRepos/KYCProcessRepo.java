package com.bankingSystem.coreBanking.Repository.KYCRepos;

import com.bankingSystem.coreBanking.Entity.UserKYC.UserKYCEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

//Here I will take username as an input and we will check whether the user's KYC status is approved or not
public interface KYCProcessRepo extends JpaRepository<UserKYCEntity, Long> {
}
