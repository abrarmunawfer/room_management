package com.ngs.backend.service;


import com.ngs.backend.entity.AdvancePayment;
import com.ngs.backend.entity.Client;
import com.ngs.backend.entity.Income;
import com.ngs.backend.entity.Room;
import com.ngs.backend.repository.AdvancePaymentRepository;
import com.ngs.backend.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdvancePaymentService {

    @Autowired
    private AdvancePaymentRepository advancePaymentRepository;

    @Autowired
    private ClientRepository clientRepository;

    public List<AdvancePayment> getAll() {
        return advancePaymentRepository.findAll();
    }

    public AdvancePayment getById(Long id) {
        return advancePaymentRepository.findById(id).orElse(null);
    }

    public AdvancePayment createAdvancePayment(Long clientId, String description, Double amount, LocalDate paymentDate, LocalDate refundDate) {
        Client client = clientRepository.findById(clientId).orElse(null);
        if (client == null || client.getAssignedRoom() == null) return null;

        AdvancePayment advancepayment = new AdvancePayment();
        advancepayment.setClient(client);
        advancepayment.setRoom(client.getAssignedRoom());
        advancepayment.setDescription(description);
        advancepayment.setAmount(amount);
        advancepayment.setPaymentDate(paymentDate);
        advancepayment.setRefundDate(refundDate);
        return advancePaymentRepository.save(advancepayment);
    }

    public AdvancePayment updateAdvancePayment(Long id, Long clientId, String description, Double amount, LocalDate paymentDate, LocalDate refundDate) {
        AdvancePayment advancePayment = advancePaymentRepository.findById(id).orElse(null);
        if (advancePayment == null) return null;

        Client client = clientRepository.findById(clientId).orElse(null);
        if (client == null) throw new RuntimeException("Client not found");

        Room room = client.getAssignedRoom(); // 💡 Get the assigned room from the client

        advancePayment.setClient(client);       // Update client
        advancePayment.setRoom(room);           // 🔄 Auto-update room from client
        advancePayment.setDescription(description);
        advancePayment.setAmount(amount);
        advancePayment.setPaymentDate(paymentDate);
        advancePayment.setRefundDate(refundDate);
        return advancePaymentRepository.save(advancePayment);
    }

    public void deleteAdvancePayment(Long id) {
        advancePaymentRepository.deleteById(id);
    }

    public List<AdvancePayment> searchByIdCard(String idCardNumber) {
        return advancePaymentRepository.findByClientIdCard(idCardNumber);
    }
}
