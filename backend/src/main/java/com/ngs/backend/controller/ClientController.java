package com.ngs.backend.controller;

import com.ngs.backend.entity.Client;
import com.ngs.backend.entity.StayStatus;
import com.ngs.backend.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/client")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @PostMapping("/add")
    public Client addClient(@RequestBody Client client) {
        return clientService.addClient(client);
    }

    @PutMapping("/update")
    public Client updateClient(@RequestBody Client client) {
        return clientService.updateClient(client);
    }

    @GetMapping("/getAll")
    public List<Client> getAllClients() {
        return clientService.getAllClients();
    }

    @GetMapping("/getByName")
    public List<Client> getByNameSorted() {
        return clientService.getClientsSortedByName();
    }

    @GetMapping("/getByIdCard")
    public List<Client> getByIdCardSorted() {
        return clientService.getClientsSortedByIdCard();
    }

    @GetMapping("/get/{id}")
    public Client getClient(@PathVariable Long id) {
        return clientService.getClientById(id);
    }
    @GetMapping
    public List<Client> getClientsByStatus(@RequestParam(required = false) String status) {
        if (status != null) {
            StayStatus stayStatus = StayStatus.valueOf(status.toUpperCase());
            return clientService.getClientsByStatus(stayStatus);
        } else {
            return clientService.getAllClients();
        }
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.ok("Client deleted");
    }
}