package com.lubricantshop.back;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LubricantShopBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(LubricantShopBackApplication.class, args);
	}

}
