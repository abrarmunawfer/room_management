package com.ngs.backend.repository;

import com.ngs.backend.entity.AdvancePayment;
import com.ngs.backend.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AdvancePaymentRepository extends JpaRepository<AdvancePayment, Long> {

    @Query("SELECT a FROM AdvancePayment a WHERE a.client.idCardNumber = :idCardNumber")
    List<AdvancePayment> findByClientIdCard(String idCardNumber);

    List<AdvancePayment> findByClientClientId(Long clientId);
}
