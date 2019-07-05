package com.example.model;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Data
@Entity
public class Deck {

    @Id
    @GeneratedValue
    private Long id;

    private String title;
    private Note[] notes;

    Deck(){}

    public Deck(String title){
        this.title = title;
    }
}
