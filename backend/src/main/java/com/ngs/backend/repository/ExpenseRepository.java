package com.ngs.backend.repository;

import com.ngs.backend.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByDateCreated(Date dateCreated);
    // Find expenses within a date range (month and year)
    List<Expense> findByDateCreatedBetween(Date startDate, Date endDate);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE MONTH(e.dateCreated) = :month AND YEAR(e.dateCreated) = :year")
    Double findTotalExpenseByMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE YEAR(e.dateCreated) = :year")
    Double findTotalExpenseByYear(@Param("year") int year);

}
