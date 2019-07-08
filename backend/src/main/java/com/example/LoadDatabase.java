package com.example;

import com.example.model.BasicNote;
import com.example.model.ClozeNote;
import com.example.model.Deck;
import com.example.model.Note;
import com.example.repository.DeckRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
@Slf4j
public class LoadDatabase {

    @Bean
    CommandLineRunner initDatabase(DeckRepository repository){
        Deck d = new Deck("Deck 1");

        List<Note> l = new ArrayList<>();
        l.add(new BasicNote("FrontTest", "BackTest"));
        //l.add(new BasicNote("FrontTest1", "BackTest1"));
        //l.add(new ClozeNote("Some kind of text :)"));

        d.setNotes(l);

        return args -> {
            log.info("Inserting " + repository.save(d));
            //log.info("Inserting " + repository.save(new Deck("Deck 2")));
        };
    }
}
