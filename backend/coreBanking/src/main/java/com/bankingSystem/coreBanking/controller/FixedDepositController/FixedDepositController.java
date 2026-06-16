package com.bankingSystem.coreBanking.controller.FixedDepositController;

import com.bankingSystem.coreBanking.DTO.FixedDepositDTO.FixedDepositFilterRequestDTO;
import com.bankingSystem.coreBanking.DTO.FixedDepositDTO.FixedDepositRequestDTO;
import com.bankingSystem.coreBanking.DTO.FixedDepositDTO.FixedDepositResponseDTO;
import com.bankingSystem.coreBanking.Service.FixedDepositService.FixedDepositService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fixed-deposit")
public class FixedDepositController {

    private static final Logger logger = LoggerFactory.getLogger(FixedDepositController.class);
    private final FixedDepositService fdService;

    public FixedDepositController(FixedDepositService fdService) {
        this.fdService = fdService;
    }

    @PostMapping("/create")
    public ResponseEntity<FixedDepositResponseDTO> createFD(@Valid @RequestBody FixedDepositRequestDTO dto) {
        logger.info("API: Create FD called for account {}", dto.getAccountId());
        return ResponseEntity.ok(fdService.createFD(dto));
    }

    @GetMapping("/by-id/{fdId}")
    public ResponseEntity<FixedDepositResponseDTO> getById(@PathVariable Long fdId) {
        logger.info("API: Get FD by id {}", fdId);
        return ResponseEntity.ok(fdService.getFDById(fdId));
    }

    @GetMapping("/by-account/{accountId}")
    public ResponseEntity<?> getByAccount(@PathVariable Long accountId) {
        logger.info("API: Get FDs by account {}", accountId);

        List<FixedDepositResponseDTO> fds = fdService.getFDsByAccountId(accountId);

        if (fds.isEmpty()) {
            return ResponseEntity.status(404).body(
                    Map.of("message", "No Fixed Deposits found for account ID: " + accountId)
            );
        }
        return ResponseEntity.ok(fds);
    }



    @PostMapping("/close/{fdId}")
    public ResponseEntity<String> closeFD(@PathVariable Long fdId) {
        logger.info("API: Close FD {}", fdId);
        return ResponseEntity.ok(fdService.closeFD(fdId));
    }

    @PostMapping("/statement")
    public ResponseEntity<?> getFilteredFDs(@RequestBody FixedDepositFilterRequestDTO filter) {
        logger.info("API: Filter FDs called");
        List<FixedDepositResponseDTO> result = fdService.getFilteredFDs(filter);

        if (result.isEmpty()) {
            return ResponseEntity.status(404).body(
                    Map.of("message", "No Fixed Deposits found for the given criteria")
            );
        }
        return ResponseEntity.ok(result);
    }

}
