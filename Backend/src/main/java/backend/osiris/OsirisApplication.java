package backend.osiris;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "backend.osiris")

public class OsirisApplication {

	public static void main(String[] args) {
		SpringApplication.run(OsirisApplication.class, args);
	}

}
