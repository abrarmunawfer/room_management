package com.ngs.backend.repository;

import com.ngs.backend.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    // Search by ID Card Number (via Client)
    @Query("SELECT i FROM Income i WHERE i.client.idCardNumber = :idCardNumber")
    List<Income> findByClientIdCard(String idCardNumber);

    // Search by Year and Month
    @Query("SELECT i FROM Income i WHERE FUNCTION('MONTH', i.paymentForDate) = :month AND FUNCTION('YEAR', i.paymentForDate) = :year")
    List<Income> findByMonthAndYear(int month, int year);

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i WHERE MONTH(i.createdDate) = :month AND YEAR(i.createdDate) = :year")
    Double findTotalIncomeByMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i WHERE YEAR(i.createdDate) = :year")
    Double findTotalIncomeByYear(@Param("year") int year);

    List<Income> findByClientClientId(Long clientId);

}
