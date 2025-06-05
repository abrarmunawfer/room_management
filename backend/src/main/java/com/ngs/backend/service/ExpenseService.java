package com.ngs.backend.service;

import com.ngs.backend.entity.Expense;
import com.ngs.backend.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }
    public Double getTotalExpenseByMonth(int month, int year) {
        return expenseRepository.findTotalExpenseByMonth(month, year);
    }

    public Double getTotalExpenseByYear(int year) {
        return expenseRepository.findTotalExpenseByYear(year);
    }

    // Filter expenses by Year and Month
    public List<Expense> getExpensesByDate(int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);
        return expenseRepository.findByDateCreatedBetween(java.sql.Date.valueOf(startDate), java.sql.Date.valueOf(endDate));
    }

    // Get an expense by ID
    public Expense getExpenseById(Long id) {
        Optional<Expense> expense = expenseRepository.findById(id);
        return expense.orElse(null);
    }

    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public Expense updateExpense(Long id, Expense expense) {
        if (expenseRepository.existsById(id)) {
            expense.setId(id);
            return expenseRepository.save(expense);
        } else {
            return null;
        }
    }

    public boolean deleteExpense(Long id) {
        if (expenseRepository.existsById(id)) {
            expenseRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}