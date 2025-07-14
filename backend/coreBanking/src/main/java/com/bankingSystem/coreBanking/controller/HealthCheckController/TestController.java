package com.bankingSystem.coreBanking.controller.HealthCheckController;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {
    @GetMapping("/test-api")
    public String testApi(){
        return "OK TESTED";
    }

    @CrossOrigin
    @GetMapping("/home")
    public String sendValue(){
        return "Springboot Home";
    }
}
