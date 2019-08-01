package com.example.controller;

import com.example.DeckNotFoundException;
import com.example.model.Deck;
import com.example.repository.DeckRepository;
import com.example.util.Firebase;
import helpers.SimplifiedDeckView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class DeckController {
    private final DeckRepository repository;

    private final Firebase firebase;

    DeckController(DeckRepository repository, Firebase firebase){
        this.repository = repository;
        this.firebase = firebase;
    }

    /**
     * @return A list of all the decks that exists in the database
     * */
    @GetMapping("/decks")
    List<Deck> all(@RequestHeader String authorization){
        if(authorization == null){
            return null;
        }

        String uid = firebase.getUserIdFromAuthHeader(authorization);
        if(uid == null){
            return null;
        }

        List<Deck> decks = new LinkedList<>();
        for (Deck deck : repository.findAll()) {
            if(deck.getUid().equals(uid)){ //Only display the users decks
                decks.add(deck);
            }
        }

        return decks;
    }

    /**
     * @return Returns a list of the id and the title of all the decks
     * */
    @GetMapping("/decks/basic")
    List<SimplifiedDeckView> basic(@RequestHeader String authorization){
        if(authorization == null){
            return null;
        }

        String uid = firebase.getUserIdFromAuthHeader(authorization);
        if(uid == null){
            return null;
        }

        List<SimplifiedDeckView> decks = new LinkedList<>();
        for (Deck deck : repository.findAll()) {
            if(deck.getUid().equals(uid)){ //Only display the users decks
                decks.add(new SimplifiedDeckView(deck));
            }
        }

        return decks;
    }

    /**
     * Saves the given deck to persistent storage
     * @param deck The Deck that should be saved
     * */
    @PostMapping("/decks/create")
    Deck newDeck(@RequestBody Deck deck, @RequestHeader String authorization){
        String uid = firebase.getUserIdFromAuthHeader(authorization);

        //Has to be logged in to create deck
        if(uid != null){
            deck.setUid(uid);

            return repository.save(deck);
        }

        return null;
    }

    @GetMapping("/decks/{id}")
    Deck one(@PathVariable long id, @RequestHeader String authorization){
        String uid = firebase.getUserIdFromAuthHeader(authorization);

        if(uid == null){
            return null;
        }

        List<Deck> decks = repository.findAll();

        for (Deck deck : decks) {
            if(deck.getId() == id){
                //Needs to own the deck in order to get info
                if(deck.getUid().equals(uid)) {
                    return deck;
                }
                return null;
            }
        }

        return null;
    }

    @PostMapping("/decks/edit")
    void edit(@RequestBody Deck deck, @RequestHeader String authorization){
        String uid = firebase.getUserIdFromAuthHeader(authorization);

        if(uid == null){
            return;
        }

        Deck repDeck = repository.findById(deck.getId()).orElseThrow(() ->
                new DeckNotFoundException(deck.getId())
        );

        //Only allowed to edit a deck that we own
        if(repDeck.getUid().equals(uid)){
            repDeck.setNotes(deck.getNotes());
            repDeck.setTitle(deck.getTitle());
            repository.save(repDeck);
        }
    }

    @DeleteMapping("/decks/{id}")
    void deleteDeck(@PathVariable Long id, @RequestHeader String authorization){
        String uid = firebase.getUserIdFromAuthHeader(authorization);

        if(uid == null){
            return;
        }

        Deck deck = repository.findById(id).orElseThrow(() ->
                new DeckNotFoundException(id)
        );

        if(deck.getUid().equals(uid)){
            repository.deleteById(id);
        }
    }
}