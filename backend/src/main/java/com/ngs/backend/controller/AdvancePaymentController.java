package com.ngs.backend.controller;


import com.ngs.backend.entity.AdvancePayment;
import com.ngs.backend.service.AdvancePaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/advance-payment")
@CrossOrigin(origins = "http://localhost:3000")
public class AdvancePaymentController {

    @Autowired
    private AdvancePaymentService advancePaymentServicel;

    @GetMapping
    public List<AdvancePayment> getAll() {
        return advancePaymentServicel.getAll();
    }

    @GetMapping("/{id}")
    public AdvancePayment getById(@PathVariable Long id) {
        return advancePaymentServicel.getById(id);
    }

    @PostMapping
    public AdvancePayment createAdvancePayment(
            @RequestParam Long clientId,
            @RequestParam String description,
            @RequestParam Double amount,
            @RequestParam String paymentDate, // Format: "2025-05-01"
            @RequestParam(required = false) String refundDate
    ) {
        return advancePaymentServicel.createAdvancePayment(
                clientId,
                description,
                amount,
                LocalDate.parse(paymentDate),
                refundDate != null && !refundDate.isEmpty() ? LocalDate.parse(refundDate) : null
        );
    }

    @PutMapping("/{id}")
    public AdvancePayment updateAdvancePayment(
            @PathVariable Long id,
            @RequestParam Long clientId,
            @RequestParam String description,
            @RequestParam Double amount,
            @RequestParam String paymentDate,
            @RequestParam(required = false) String refundDate
    ) {
        return advancePaymentServicel.updateAdvancePayment(
                id,
                clientId,
                description,
                amount,
                LocalDate.parse(paymentDate),
                refundDate != null && !refundDate.isEmpty() ? LocalDate.parse(refundDate) : null
        );
    }


    @DeleteMapping("/{id}")
    public void deleteAdvancePayment(@PathVariable Long id) {
        advancePaymentServicel.deleteAdvancePayment(id);
    }

    @GetMapping("/search/idcard/{idCardNumber}")
    public List<AdvancePayment> searchByIdCard(@PathVariable String idCardNumber) {
        return advancePaymentServicel.searchByIdCard(idCardNumber);
    }


}
