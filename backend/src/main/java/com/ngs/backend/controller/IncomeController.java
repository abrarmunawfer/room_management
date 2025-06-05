package com.ngs.backend.controller;


import com.ngs.backend.entity.Income;
import com.ngs.backend.service.IncomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/income")
@CrossOrigin(origins = "http://localhost:3000")
public class IncomeController {

    @Autowired
    private IncomeService incomeService;

    @GetMapping("/total")
    public Double getTotalIncome(@RequestParam int month, @RequestParam int year) {
        return incomeService.getTotalIncomeByMonth(month, year);
    }

    @GetMapping
    public List<Income> getAll() {
        return incomeService.getAll();
    }

    @GetMapping("/{id}")
    public Income getById(@PathVariable Long id) {
        return incomeService.getById(id);
    }

    @PostMapping
    public Income createIncome(
            @RequestParam Long clientId,
            @RequestParam String description,
            @RequestParam Double amount,
            @RequestParam String paymentForDate // Format: "2025-05-01"
    ) {
        return incomeService.createIncome(
                clientId,
                description,
                amount,
                LocalDate.parse(paymentForDate)
        );
    }

    @PutMapping("/{id}")
    public Income updateIncome(
            @PathVariable Long id,
            @RequestParam Long clientId,
            @RequestParam String description,
            @RequestParam Double amount,
            @RequestParam String paymentForDate
    ) {
        return incomeService.updateIncome(
                id,
                clientId,
                description,
                amount,
                LocalDate.parse(paymentForDate)
        );
    }


    @DeleteMapping("/{id}")
    public void deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncome(id);
    }

    @GetMapping("/search/idcard/{idCardNumber}")
    public List<Income> searchByIdCard(@PathVariable String idCardNumber) {
        return incomeService.searchByIdCard(idCardNumber);
    }

    @GetMapping("/search/date")
    public List<Income> searchByMonthYear(
            @RequestParam int month,
            @RequestParam int year
    ) {
        return incomeService.searchByMonthYear(month, year);
    }
}
