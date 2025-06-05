package com.ngs.backend.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long clientId;

    private String name;
    private String contactNumber;
    private String idCardNumber; // National ID / Passport
    private String email;
    private String address;

    @Enumerated(EnumType.STRING)
    private StayStatus status; // Staying or Vacated

    private LocalDate registerDate;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = true)
    private Room assignedRoom;
}
