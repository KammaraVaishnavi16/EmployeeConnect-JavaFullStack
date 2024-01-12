package com.employeeconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.employeeconnect.dao.EmployeeDAO;
@SpringBootApplication
@EnableScheduling
@EnableJpaRepositories(basePackageClasses=EmployeeDAO.class)
public class EmployeeConnectApplication {

	public static void main(String[] args) {
		SpringApplication.run(EmployeeConnectApplication.class, args);
	}

}


/*
 


.   ____          _            __ _ _
/\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
\\/  ___)| |_)| | | | | || (_| |  ) ) ) )
'  |____| .__|_| |_|_| |_\__, | / / / /
=========|_|==============|___/=/_/_/_/
:: Spring Boot ::               (v2.7.11)



*/