package com.ngs.backend.controller;


import com.ngs.backend.entity.Expense;
import com.ngs.backend.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping("/total")
    public Double getTotalExpense(@RequestParam int month, @RequestParam int year) {
        return expenseService.getTotalExpenseByMonth(month, year);
    }

    // Get all expenses
    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    // Get expenses by dateCreated (Filter by Year and Month)
    @GetMapping("/filter")
    public List<Expense> getExpensesByDate(@RequestParam("year") int year, @RequestParam("month") int month) {
        return expenseService.getExpensesByDate(year, month);
    }

    // Get expense by ID
    @GetMapping("/{id}")
    public Expense getExpenseById(@PathVariable Long id) {
        return expenseService.getExpenseById(id);
    }

    // Add a new expense
    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        return expenseService.addExpense(expense);
    }

    // Update an existing expense
    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
        return expenseService.updateExpense(id, expense);
    }

    // Delete an expense
    @DeleteMapping("/{id}")
    public boolean deleteExpense(@PathVariable Long id) {
        return expenseService.deleteExpense(id);
    }
}
