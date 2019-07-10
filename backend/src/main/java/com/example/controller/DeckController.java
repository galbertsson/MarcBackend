package com.example.controller;

import com.example.DeckNotFoundException;
import com.example.model.BasicNote;
import com.example.model.ClozeNote;
import com.example.model.Deck;
import com.example.model.Note;
import com.example.repository.DeckRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class DeckController {
    private final DeckRepository repository;

    DeckController(DeckRepository repository){
        this.repository = repository;
    }

    /**
     * @return A list of all the decks that exists in the database
     * */
    @GetMapping("/decks")
    List<Deck> all(){
        return repository.findAll();
    }

    /**
     * Saves the given deck to persistent storage
     * @param deck The Deck that should be saved
     * */
    @PostMapping("/decks/create")
    Deck newDeck(@RequestBody Deck deck){
        return repository.save(deck);
    }

    @GetMapping("/decks/{id}")
    Deck one(@PathVariable long id){
        return repository.findById(id)
                .orElseThrow(() ->
                        new DeckNotFoundException(id)
                );
    }

    @DeleteMapping("/decks/{id}")
    void deleteDeck(@PathVariable Long id){
        repository.deleteById(id);
    }
}