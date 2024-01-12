package com.employeeconnect.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employeeconnect.model.BU;

public interface BUDAO extends JpaRepository<BU,Long>{
	Optional<BU> findByName(String name);
}
