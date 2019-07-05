package com.example.controller;

import com.example.DeckNotFoundException;
import com.example.model.Deck;
import com.example.repository.DeckRepository;
import com.example.util.Firebase;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class DeckController {
    private final DeckRepository repository;

    DeckController(DeckRepository repository){
        this.repository = repository;
    }

    @GetMapping("/decks")
    List<Deck> all(){
        return repository.findAll();
    }

    @PostMapping("/decks")
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

    @PutMapping("/decks/{id}")
    Deck deckById(@RequestBody Deck newDeck, @PathVariable long id){
        return repository.findById(id)
                .map(deck -> {
                    deck.setTitle(newDeck.getTitle());
                    return repository.save(deck);
                })
                .orElseGet(() -> {
                    newDeck.setId(id);
                    return repository.save(newDeck);
                });
    }

    @DeleteMapping("/decks/{id}")
    void deleteDeck(@PathVariable Long id){
        repository.deleteById(id);
    }
}