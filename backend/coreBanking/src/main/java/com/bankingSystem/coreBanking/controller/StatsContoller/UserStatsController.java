package com.bankingSystem.coreBanking.controller.StatsContoller;
import com.bankingSystem.coreBanking.Service.AccountsService.UserStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserStatsController {

    @Autowired
    private UserStatsService userStatsService;

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getUserCount() {
        long count = userStatsService.getTotalUsers();
        Map<String, Long> response = new HashMap<>();
        response.put("userCount", count);
        return ResponseEntity.ok(response);
    }
}
