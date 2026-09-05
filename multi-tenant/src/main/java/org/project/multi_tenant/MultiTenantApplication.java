package org.project.multi_tenant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MultiTenantApplication {

	// The mandatory entryway method that IntelliJ is looking for!
	public static void main(String[] args) {
		SpringApplication.run(MultiTenantApplication.class, args);
	}
}
