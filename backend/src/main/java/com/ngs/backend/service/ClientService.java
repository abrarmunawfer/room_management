package com.ngs.backend.service;

import com.ngs.backend.entity.Client;
import com.ngs.backend.entity.Income;
import com.ngs.backend.entity.StayStatus;
import com.ngs.backend.repository.ClientRepository;
import com.ngs.backend.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private IncomeRepository incomeRepository;

    public Client addClient(Client client) {
        client.setRegisterDate(java.time.LocalDate.now());
        return clientRepository.save(client);
    }

    public Client updateClient(Client client) {
        // Automatically set registerDate to the current date when updating a client
        client.setRegisterDate(java.time.LocalDate.now());

        // Save the updated client to the database
        return clientRepository.save(client);
    }


    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }
    public List<Client> getClientsByStatus(StayStatus status) {
        return clientRepository.findByStatus(status);
    }


    public List<Client> getClientsSortedByName() {
        return clientRepository.findByOrderByNameAsc();
    }

    public List<Client> getClientsSortedByIdCard() {
        return clientRepository.findByOrderByIdCardNumberAsc();
    }

    public Client getClientById(Long id) {
        return clientRepository.findById(id).orElse(null);
    }

    public void deleteClient(Long id) {
        Client client = clientRepository.findById(id).orElseThrow(() -> new RuntimeException("Client not found"));

        // Delete incomes linked to this client first
        List<Income> incomes = incomeRepository.findByClientIdCard(client.getIdCardNumber());
        incomeRepository.deleteAll(incomes);

        // Now delete client
        clientRepository.deleteById(id);
    }
}