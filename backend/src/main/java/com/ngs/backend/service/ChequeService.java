package com.ngs.backend.service;

import com.ngs.backend.entity.Cheque;
import com.ngs.backend.repository.ChequeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChequeService {

    @Autowired
    private ChequeRepository chequeRepository;

    // Add cheque
    public Cheque addCheque(Cheque cheque) {
        return chequeRepository.save(cheque);
    }

    // Get all cheques
    public List<Cheque> getAllCheques() {
        return chequeRepository.findAll();
    }

    // Get cheque by ID
    public Optional<Cheque> getChequeById(Long id) {
        return chequeRepository.findById(id);
    }

    // Update cheque
    public Cheque updateCheque(Cheque cheque) {
        return chequeRepository.save(cheque);
    }

    // Delete cheque by ID
    public void deleteCheque(Long id) {
        chequeRepository.deleteById(id);
    }

    // Find by cheque number
    public Cheque getChequeByNumber(String chequeNumber) {
        return chequeRepository.findByChequeNumber(chequeNumber);
    }

    // Find by issue month and year
    public List<Cheque> getChequesByMonthAndYear(int month, int year) {
        return chequeRepository.findByIssueMonthAndYear(month, year);
    }
}