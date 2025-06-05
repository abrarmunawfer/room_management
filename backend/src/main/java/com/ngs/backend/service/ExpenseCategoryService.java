package com.ngs.backend.service;

import com.ngs.backend.entity.ExpenseCategory;
import com.ngs.backend.repository.ExpenseCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpenseCategoryService {

    @Autowired
    private ExpenseCategoryRepository repository;

    public ExpenseCategory saveCategory(ExpenseCategory category) {
        return repository.save(category);
    }

    public List<ExpenseCategory> getAllCategories() {
        return repository.findAll();
    }

    public Optional<ExpenseCategory> getCategoryById(Long id) {
        return repository.findById(id);
    }

    public void deleteCategory(Long id) {
        repository.deleteById(id);
    }
}