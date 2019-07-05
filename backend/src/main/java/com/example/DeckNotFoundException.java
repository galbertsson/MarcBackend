package com.example;

public class DeckNotFoundException extends RuntimeException {
    public DeckNotFoundException(Long id){
        super("Cannot access deck " + id);
    }
}
