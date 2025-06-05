package com.ngs.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cheque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String chequeNumber;

    private String accountHolderName;
    private String bankName;
    private String ifscCode;
    private Double amount;

    private LocalDate issueDate;
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    private ChequeStatus status;

    private String remarks;

    private LocalDateTime createdDate;

    @PrePersist
    @PreUpdate
    public void updateCreatedDate() {
        this.createdDate = LocalDateTime.now();
    }
}
