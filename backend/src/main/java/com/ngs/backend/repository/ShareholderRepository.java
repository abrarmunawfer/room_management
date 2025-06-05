package com.ngs.backend.repository;

import com.ngs.backend.entity.Shareholder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShareholderRepository extends JpaRepository<Shareholder, Long> {
}
