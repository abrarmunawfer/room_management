package com.ngs.backend.controller;

import com.ngs.backend.service.ExpenseService;
import com.ngs.backend.service.IncomeService;
import com.ngs.backend.service.ProfitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profits")
public class ProfitController {

    @Autowired
    private IncomeService incomeService;

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private ProfitService profitService;

    @GetMapping("/month")
    public Double getProfitByMonth(@RequestParam int month, @RequestParam int year) {
        Double totalIncome = incomeService.getTotalIncomeByMonth(month, year);
        Double totalExpense = expenseService.getTotalExpenseByMonth(month, year);

        if (totalIncome == null) totalIncome = 0d;
        if (totalExpense == null) totalExpense = 0d;

        return totalIncome - totalExpense;
    }

    @GetMapping("/year")
    public Double getProfitByYear(@RequestParam int year) {
        Double totalIncome = incomeService.getTotalIncomeByYear(year);
        Double totalExpense = expenseService.getTotalExpenseByYear(year);

        if (totalIncome == null) totalIncome = 0d;
        if (totalExpense == null) totalExpense = 0d;

        return totalIncome - totalExpense;
    }

    @GetMapping("/pdf/month")
    public ResponseEntity<byte[]> generateMonthlyProfitPdf(@RequestParam int month, @RequestParam int year) {
        byte[] pdfBytes = profitService.generateMonthlyProfitPdf(month, year);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=monthly-profit-report.pdf");
        headers.setContentType(MediaType.APPLICATION_PDF);

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @GetMapping("/pdf/year")
    public ResponseEntity<byte[]> generateYearlyProfitPdf(@RequestParam int year) {
        byte[] pdfBytes = profitService.generateYearlyProfitPdf(year);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=yearly-profit-report.pdf");
        headers.setContentType(MediaType.APPLICATION_PDF);

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}


