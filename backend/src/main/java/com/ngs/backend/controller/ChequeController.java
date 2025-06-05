package com.ngs.backend.controller;

import com.ngs.backend.entity.Cheque;
import com.ngs.backend.service.ChequeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cheques")
@CrossOrigin(origins = "http://localhost:3000")
public class ChequeController {

    @Autowired
    private ChequeService chequeService;

    // Add cheque
    @PostMapping("/add")
    public ResponseEntity<Cheque> addCheque(@RequestBody Cheque cheque) {
        Cheque savedCheque = chequeService.addCheque(cheque);
        return ResponseEntity.ok(savedCheque);
    }

    // Get all cheques
    @GetMapping("/all")
    public List<Cheque> getAllCheques() {
        return chequeService.getAllCheques();
    }

    // Get cheque by ID
    @GetMapping("/{id}")
    public ResponseEntity<Cheque> getChequeById(@PathVariable Long id) {
        return chequeService.getChequeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update cheque
    @PutMapping("/update")
    public ResponseEntity<Cheque> updateCheque(@RequestBody Cheque cheque) {
        Cheque updatedCheque = chequeService.updateCheque(cheque);
        return ResponseEntity.ok(updatedCheque);
    }

    // Delete cheque by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCheque(@PathVariable Long id) {
        chequeService.deleteCheque(id);
        return ResponseEntity.ok("Cheque deleted successfully.");
    }

    // Get cheque by cheque number
    @GetMapping("/number/{chequeNumber}")
    public ResponseEntity<Cheque> getChequeByNumber(@PathVariable String chequeNumber) {
        Cheque cheque = chequeService.getChequeByNumber(chequeNumber);
        if (cheque != null) {
            return ResponseEntity.ok(cheque);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Filter cheques by month and year
    @GetMapping("/filter")
    public List<Cheque> filterChequesByMonthAndYear(@RequestParam int month, @RequestParam int year) {
        return chequeService.getChequesByMonthAndYear(month, year);
    }
}