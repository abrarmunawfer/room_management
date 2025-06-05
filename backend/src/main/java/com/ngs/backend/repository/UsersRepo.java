package com.ngs.backend.repository;


import com.ngs.backend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepo extends JpaRepository<Users, String> {

    Users findByEmail(String email);
}
