package com.ngs.backend.controller;

import com.ngs.backend.entity.Users;
import com.ngs.backend.request.LoginRequest;
import com.ngs.backend.service.JwtUtil;
import com.ngs.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UsersController {

	@Autowired
	UserService userService;

	@Autowired
	JwtUtil jwtUtil;

	@PostMapping("/addUser")
	@CrossOrigin(origins = "http://localhost:3000")
	public Users addUser(@RequestBody Users user) {
		return userService.addUser(user);
	}

	@PostMapping("/loginUser")
	@CrossOrigin(origins = "http://localhost:3000")
	public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
		boolean success = userService.loginUser(loginRequest);
		if (success) {
			String token = jwtUtil.generateToken(loginRequest.getEmail());
			return ResponseEntity.ok(token);
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
		}
	}

	@PostMapping("/getUser")
	@CrossOrigin(origins = "http://localhost:3000")
	public ResponseEntity<Users> getUser(@RequestBody LoginRequest loginRequest) {
		String email = loginRequest.getEmail();
		Users user = userService.getUserByEmail(email);
		if (user != null) {
			return new ResponseEntity<>(user, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}


	@PostMapping("/updateUser")
	@CrossOrigin(origins = "http://localhost:3000")
	public ResponseEntity<Users> updateUser(@RequestBody Users updatedUser) {
		Users user = userService.updateUser(updatedUser);
		if (user != null) {
			return new ResponseEntity<>(user, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

}
