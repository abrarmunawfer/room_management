package com.ngs.backend.service;

import com.ngs.backend.entity.Users;
import com.ngs.backend.repository.UsersRepo;
import com.ngs.backend.request.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

	@Autowired
	UsersRepo usersRepo;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public Users addUser(Users user) {
		// Hash the password before saving
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return usersRepo.save(user);
	}


	public Users getUserByEmail(String email) {
		return usersRepo.findByEmail(email);
	}

	public Users updateUser(Users updatedUser) {
		System.out.println("Received update request for: " + updatedUser.getEmail());

		Users existingUser = usersRepo.findByEmail(updatedUser.getEmail());

		if (existingUser != null) {
			System.out.println("User found. Updating...");

			existingUser.setName(updatedUser.getName());

			// Only update password if a new one is provided
			if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
				System.out.println("New password provided. Hashing...");
				existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
			}

			return usersRepo.save(existingUser);
		}

		System.out.println("User not found. Returning null.");
		return null;
	}


	public boolean loginUser(LoginRequest loginRequest) {
		Users user = usersRepo.findByEmail(loginRequest.getEmail());

		if (user == null) {
			System.out.println("User not found: " + loginRequest.getEmail());
			return false;
		}

		System.out.println("User found. Comparing passwords:");
		System.out.println("Entered password provided (hidden for security).");
		System.out.println("Stored : " + user.getPassword());

		// Use passwordEncoder to compare raw input with hashed password
		return passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
	}
}
