package com.ngs.backend.service;


import com.ngs.backend.entity.Client;
import com.ngs.backend.entity.Income;
import com.ngs.backend.entity.Room;
import com.ngs.backend.repository.ClientRepository;
import com.ngs.backend.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class IncomeService {
    @Autowired
    private IncomeRepository incomeRepo;

    @Autowired
    private ClientRepository clientRepo;

    public List<Income> getAll() {
        return incomeRepo.findAll();
    }

    public Income getById(Long id) {
        return incomeRepo.findById(id).orElse(null);
    }

    public Double getTotalIncomeByMonth(int month, int year) {
        return incomeRepo.findTotalIncomeByMonth(month, year);
    }

    public Double getTotalIncomeByYear(int year) {
        return incomeRepo.findTotalIncomeByYear(year);
    }

    public Income createIncome(Long clientId, String description, Double amount, LocalDate paymentForDate) {
        Client client = clientRepo.findById(clientId).orElse(null);
        if (client == null || client.getAssignedRoom() == null) return null;

        Income income = new Income();
        income.setClient(client);
        income.setRoom(client.getAssignedRoom());
        income.setDescription(description);
        income.setAmount(amount);
        income.setPaymentForDate(paymentForDate);
        return incomeRepo.save(income);
    }

    public Income updateIncome(Long id, Long clientId, String description, Double amount, LocalDate paymentForDate) {
        Income income = incomeRepo.findById(id).orElse(null);
        if (income == null) return null;

        Client client = clientRepo.findById(clientId).orElse(null);
        if (client == null) throw new RuntimeException("Client not found");

        Room room = client.getAssignedRoom(); // 💡 Get the assigned room from the client

        income.setClient(client);       // Update client
        income.setRoom(room);           // 🔄 Auto-update room from client
        income.setDescription(description);
        income.setAmount(amount);
        income.setPaymentForDate(paymentForDate);

        return incomeRepo.save(income);
    }

    public void deleteIncome(Long id) {
        incomeRepo.deleteById(id);
    }

    public List<Income> searchByIdCard(String idCardNumber) {
        return incomeRepo.findByClientIdCard(idCardNumber);
    }

    public List<Income> searchByMonthYear(int month, int year) {
        return incomeRepo.findByMonthAndYear(month, year);
    }
}
