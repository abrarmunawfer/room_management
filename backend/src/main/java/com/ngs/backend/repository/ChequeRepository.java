package com.ngs.backend.repository;

import com.ngs.backend.entity.Cheque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChequeRepository extends JpaRepository<Cheque, Long> {

    // Find by cheque number
    Cheque findByChequeNumber(String chequeNumber);

    // Find all cheques issued in a specific month and year
    @Query("SELECT c FROM Cheque c WHERE MONTH(c.issueDate) = ?1 AND YEAR(c.issueDate) = ?2")
    List<Cheque> findByIssueMonthAndYear(int month, int year);

    // Optional — Find by status too if needed
    List<Cheque> findByStatus(String status);
}