package com.example;

import com.example.model.Deck;
import com.example.repository.DeckRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class LoadDatabase {

    @Bean
    CommandLineRunner initDatabase(DeckRepository repository){
        return args -> {
            log.info("Inserting " + repository.save(new Deck("Deck 1")));
            log.info("Inserting " + repository.save(new Deck("Deck 2")));
        };
    }
}
