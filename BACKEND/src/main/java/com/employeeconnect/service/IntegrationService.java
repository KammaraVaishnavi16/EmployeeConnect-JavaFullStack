package com.employeeconnect.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;
import javax.transaction.Transactional;

import com.employeeconnect.dao.BUDAO;
import com.employeeconnect.dao.EmployeeDAO;
import com.employeeconnect.dao.RoleDAO;
import com.employeeconnect.model.Employee;
import com.employeeconnect.model.Role;
import com.employeeconnect.model.BU;
import com.employeeconnect.request.IntegrationRequest;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
@RestController
@Transactional
public class IntegrationService {
	
	
		@Autowired
		private EmployeeDAO empRepo;
		@Autowired
		private BUDAO buRepo;
		@Autowired
		private RoleDAO roleRepo;
		
	
		Set<String> buName;
		Set<String> buHead;
		Set<String> manager;
		Map<String,String> managerMap;
		Map<String,String> buMap;
	
	 	
		@Scheduled(cron = "0 0 1 * * ?")
	 	public void getEmployees() throws IOException {
			System.out.println("STARTED");
			buName = new HashSet<>();
			buHead = new HashSet<>();
			manager = new HashSet<>();
			managerMap = new HashMap<>();
			buMap = new HashMap<>();
			
			//Store all employee from API
			storeEmployee();
			
			//Map the managers to those employees
			assignManagers();
			
			//Store All Business Unit into BU table
			storeBuName();
			
			//Map BU to all Employees
			assignBu();
			
			//Update Managers role
			managerRole();
			
			
			System.out.println("ENDED");
		    		    
		    
		    
	    
	 	}
		
		
		public void storeEmployee() throws IOException {
			String url = "https://eo66tim1i8ga55j.m.pipedream.net/";
			
		    RestTemplate restTemplate = new RestTemplate();
		
		    HttpHeaders headers = new HttpHeaders();
		    headers.setContentType(MediaType.APPLICATION_JSON);
		
		    String username = "au_master_prod_user";
		    String password = "bScK@LMjTsVVa#E2PiUQrfEE";
		    String credentials = username + ":" + password;
		    byte[] credentialsBytes = credentials.getBytes(StandardCharsets.UTF_8);
		    byte[] encodedBytes = Base64.encodeBase64(credentialsBytes);
		    String encodedCredentials = new String(encodedBytes, StandardCharsets.UTF_8);
		
		    headers.add("Authorization", "Basic " + encodedCredentials);
		
		    Map<String, String> requestBody = new HashMap<>();
		    requestBody.put("api_key", "zp6ueklch320sl#kvxf#2$eitbpk!+^%%jqr+y^2jck$12@i+hgx6#&l!1yqxingq0s4fd3f@r^jgaup6d00povw307ubm4egdjzdoorv?rchr8ywvyjh0accfz9c!*^");
		    requestBody.put("dataset_key", "x04!ib5wgtztnabfpmdxzkct6+b&kstz3bskiw|bd6h2q4af@^4qi7j#x*|0mk4n08f5*i|iqruopkxtnasqalmbsh5nzetnbj^7qm*hyuk&uo%yc$#fp!cthy7gwhpa");
		
		    HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);
		
		    ResponseEntity<String> responseEntity = restTemplate.postForEntity(url, requestEntity, String.class);
		
		    ObjectMapper objectMapper = new ObjectMapper();
		    Map<String, Object> responseMap = objectMapper.readValue(responseEntity.getBody(), new TypeReference<Map<String, Object>>(){});
		
		    List<IntegrationRequest> employeeDataList = objectMapper.convertValue(responseMap.get("employee_data"), new TypeReference<List<IntegrationRequest>>(){});
		    
		    for(IntegrationRequest employee: employeeDataList) {
		    	String id = employee.getEmployee_id();
		    	String mail = employee.getCompany_email_id();
		    	String name = employee.getFirst_name()+" "+employee.getLast_name();
		    	Role role = roleRepo.findById((long)2).orElse(null);
		    	
		    	
		    	
		    	Employee add = findByEmpId(id);
		    	if(add==null) {
		    		add = new Employee();
		    	}
		    	
		    	add.setName(name);
		    	add.setEmail(mail);
		    	add.setEmpId(id);
		    	add.setRole(role);
		    	empRepo.save(add);
		    	buName.add(employee.getBusiness_unit());
		    	
		    	
		    	String hod = employee.getHod();
		    	 if(hod.equals("N.A."))
	                hod="null";
		    	 else {
	                hod = hod.substring(hod.indexOf("(") + 1);
	                hod = hod.substring(0, hod.indexOf(")"));
	                buHead.add(hod);
		    	 }
	            manager.add(employee.getDirect_manager_employee_id());
	            managerMap.put(id,employee.getDirect_manager_employee_id());
	            buMap.put(id,employee.getBusiness_unit());
		    }

			
		}
		
		
		public void assignManagers() {
			for(String emp:managerMap.keySet()) {
				Employee employee = findByEmpId(emp);
				Employee manager = findByEmpId(managerMap.get(emp));
				if(employee==null || manager==null)continue;
				employee.setManager(manager);
				empRepo.save(employee);
			}
		}
		
		
		
		public Employee findByEmpId(String id) {
			return empRepo.findByEmpId(id).orElse(null);
		}
		
		public void storeBuName() {
			for(String bu:buName) {
				BU add = buRepo.findByName(bu).orElse(null);
				if(add==null) {
					add = new BU();
				}
				add.setName(bu);
				buRepo.save(add);
			}
		}
		
		public void assignBu() {
			for(String emp : buMap.keySet()) {
				Employee employee = findByEmpId(emp);
				BU bu = buRepo.findByName(buMap.get(emp)).orElse(null);
				if(bu==null || employee==null) continue;
				
				employee.setBu(bu);
				empRepo.save(employee);
			}
		}
		
		public void managerRole() {
			for(String id:manager) {
				Employee manager = findByEmpId(id);
				
				Role role = roleRepo.findById((long)4).orElse(null);
				if(manager==null||role==null) continue;
				manager.setRole(role);
				empRepo.save(manager);
			}
		}
		
		
		public void buHeadRole() {
			for(String id:buHead) {
				Employee head = findByEmpId(id);
				
				Role role = roleRepo.findById((long)5).orElse(null);
				if(head==null||role==null) continue;
				head.setRole(role);
				empRepo.save(head);
			}
		}
		
	
}
