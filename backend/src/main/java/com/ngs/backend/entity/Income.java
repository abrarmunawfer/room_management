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
public class Income {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = true)
    private Client client;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = true)
    private Room room;

    private String description;

    private Double amount;

    private LocalDate paymentForDate; // The month/year the rent is for

    private LocalDateTime createdDate; // Automatically updated on create/update

    @PrePersist
    @PreUpdate
    public void updateCreatedDate() {
        this.createdDate = LocalDateTime.now();
    }
}
