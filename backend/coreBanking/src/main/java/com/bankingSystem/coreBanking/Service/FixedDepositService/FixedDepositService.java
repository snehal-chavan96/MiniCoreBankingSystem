package com.bankingSystem.coreBanking.Service.FixedDepositService;

import com.bankingSystem.coreBanking.DTO.FixedDepositDTO.FixedDepositFilterRequestDTO;
import com.bankingSystem.coreBanking.DTO.FixedDepositDTO.FixedDepositRequestDTO;
import com.bankingSystem.coreBanking.DTO.FixedDepositDTO.FixedDepositResponseDTO;
import com.bankingSystem.coreBanking.Entity.Accounts.Account;
import com.bankingSystem.coreBanking.Entity.FixedDeposit.FixedDeposit;
import com.bankingSystem.coreBanking.Repository.AccountRepository.AccountRepository;
import com.bankingSystem.coreBanking.Repository.FixedDepositRepository.FixedDepositRepo;
import com.bankingSystem.coreBanking.Util.FdNumberGenerator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class FixedDepositService {

    private static final double PENALTY_RATE = 0.01; // 1%

    private final FixedDepositRepo fdRepo;
    private final AccountRepository accountRepo;
    private final FdNumberGenerator fdNumberGenerator;

    public FixedDepositService(FixedDepositRepo fdRepo, AccountRepository accountRepo, FdNumberGenerator fdNumberGenerator) {
        this.fdRepo = fdRepo;
        this.accountRepo = accountRepo;
        this.fdNumberGenerator = fdNumberGenerator;
    }

    @Transactional
    public FixedDepositResponseDTO createFD(FixedDepositRequestDTO dto) {
        log.info("Creating FD for account {}", dto.getAccountId());

        Account account = accountRepo.findById(dto.getAccountId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        BigDecimal principal = BigDecimal.valueOf(dto.getPrincipalAmount());
        if (account.getBalance().compareTo(principal) < 0) {
            throw new IllegalArgumentException("Insufficient balance to open FD");
        }

        account.setBalance(account.getBalance().subtract(principal));
        accountRepo.save(account);

        double interestRate = calculateInterestRate(dto.getTenureMonths());
        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime maturityDate = startDate.plusMonths(dto.getTenureMonths());
        BigDecimal maturityAmount = calculateMaturity(principal, interestRate, dto.getTenureMonths());

        FixedDeposit fd = FixedDeposit.builder()
                .account(account)
                .fdNumber(fdNumberGenerator.generate())
                .principalAmount(principal)
                .interestRate(interestRate)
                .tenureMonths(dto.getTenureMonths())
                .startDate(startDate)
                .maturityDate(maturityDate)
                .maturityAmount(maturityAmount)
                .status(FixedDeposit.FDStatus.ACTIVE)
                .isAutoRenewal(Boolean.TRUE.equals(dto.getIsAutoRenewal()))
                .createdAt(LocalDateTime.now())
                .build();

        fd = fdRepo.save(fd);
        return mapToResponse(fd);
    }

    public FixedDepositResponseDTO getFDById(Long fdId) {
        FixedDeposit fd = fdRepo.findById(fdId)
                .orElseThrow(() -> new IllegalArgumentException("FD not found"));
        return mapToResponse(fd);
    }

    public List<FixedDepositResponseDTO> getFDsByAccountId(Long accountId) {
        return fdRepo.findByAccount_AccountId(accountId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public String closeFD(Long fdId) {
        FixedDeposit fd = fdRepo.findById(fdId)
                .orElseThrow(() -> new IllegalArgumentException("FD not found"));

        boolean premature = fd.getMaturityDate().isAfter(LocalDateTime.now());

        if (premature) {
            return handlePrematureClosure(fd);
        } else {
            return handleMaturity(fd);
        }
    }

    public List<FixedDepositResponseDTO> getFilteredFDs(FixedDepositFilterRequestDTO filter) {
        return fdRepo.filterFDs(filter)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private String handlePrematureClosure(FixedDeposit fd) {
        fd.setStatus(FixedDeposit.FDStatus.CLOSED);
        fd.setPrematureClosureDate(LocalDateTime.now());

        BigDecimal penaltyRate = fd.getPrematurePenaltyRate() != null
                ? fd.getPrematurePenaltyRate()
                : BigDecimal.valueOf(PENALTY_RATE);

        BigDecimal penaltyAmount = fd.getPrincipalAmount().multiply(penaltyRate);
        BigDecimal amountToReturn = fd.getPrincipalAmount().subtract(penaltyAmount);

        Account account = fd.getAccount();
        account.setBalance(account.getBalance().add(amountToReturn));
        accountRepo.save(account);
        fdRepo.save(fd);

        return "FD closed prematurely. Amount refunded: " + amountToReturn;
    }

    private String handleMaturity(FixedDeposit fd) {
        fd.setStatus(FixedDeposit.FDStatus.MATURED);
        Account account = fd.getAccount();
        account.setBalance(account.getBalance().add(fd.getMaturityAmount()));
        accountRepo.save(account);
        fdRepo.save(fd);

        return "FD matured. Amount credited: " + fd.getMaturityAmount();
    }

    private double calculateInterestRate(int tenureMonths) {
        if (tenureMonths <= 6) return 5.0;
        if (tenureMonths <= 12) return 6.5;
        return 7.0;
    }

    private BigDecimal calculateMaturity(BigDecimal principal, double ratePercent, int months) {
        double years = months / 12.0;
        double interest = principal.doubleValue() * (ratePercent / 100.0) * years;
        return principal.add(BigDecimal.valueOf(interest));
    }

    private FixedDepositResponseDTO mapToResponse(FixedDeposit fd) {
        return FixedDepositResponseDTO.builder()
                .fdNumber(fd.getFdNumber())
                .principalAmount(fd.getPrincipalAmount().doubleValue())
                .interestRate(fd.getInterestRate())
                .tenureMonths(fd.getTenureMonths())
                .startDate(fd.getStartDate())
                .maturityDate(fd.getMaturityDate())
                .maturityAmount(fd.getMaturityAmount().doubleValue())
                .status(fd.getStatus().name())
                .build();
    }
}
