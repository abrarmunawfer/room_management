package com.ngs.backend.repository;

import com.ngs.backend.entity.Client;
import com.ngs.backend.entity.StayStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByOrderByNameAsc();
    List<Client> findByOrderByIdCardNumberAsc();
    List<Client> findByStatus(StayStatus status);

}
