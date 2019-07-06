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

    /*@PostMapping("/note")
    String foo(@RequestBody Note note){
        if(note instanceof BasicNote){
            return "BasicNote";
        }else if(note instanceof ClozeNote){
            return "ClozeNote";
        }

        return "Unknown type!";
    }*/

    @GetMapping("/decks")
    List<Deck> all(){
        return repository.findAll();
    }

    @PostMapping("/decks")
    Deck newDeck(@RequestBody Deck deck){
        System.out.println(deck);
        return deck;
        //return repository.save(deck);
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