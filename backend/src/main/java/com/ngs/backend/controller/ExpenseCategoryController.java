package com.ngs.backend.controller;

import com.ngs.backend.entity.ExpenseCategory;
import com.ngs.backend.repository.ExpenseCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expense-categorie")
@CrossOrigin(origins = "http://localhost:3000")
public class ExpenseCategoryController {

    @Autowired
    private ExpenseCategoryRepository categoryRepo;

    @GetMapping
    public List<ExpenseCategory> getAll() {
        return categoryRepo.findAll();
    }

    @PostMapping
    public ExpenseCategory create(@RequestBody ExpenseCategory category) {
        return categoryRepo.save(category);
    }

    @PutMapping("/{id}")
    public ExpenseCategory update(@PathVariable Long id, @RequestBody ExpenseCategory category) {
        category.setId(id);
        return categoryRepo.save(category);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        categoryRepo.deleteById(id);
    }
}