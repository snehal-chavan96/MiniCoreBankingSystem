package com.bankingSystem.coreBanking.controller.StatsContoller;

import com.bankingSystem.coreBanking.Service.AccountsService.UserStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserStatsController {

    private static final Logger logger = LoggerFactory.getLogger(UserStatsController.class);

    @Autowired
    private UserStatsService userStatsService;

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getUserCount() {
        logger.info("Received request to fetch total user count.");

        long count = userStatsService.getTotalUsers();
        logger.debug("Fetched user count from service: {}", count);

        Map<String, Long> response = new HashMap<>();
        response.put("userCount", count);

        logger.info("Returning response with user count: {}", response);
        return ResponseEntity.ok(response);
    }
}
