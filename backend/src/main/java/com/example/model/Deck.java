package com.example.model;

import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
public class Deck {

    @Id
    @GeneratedValue
    private Long id;

    private String title;

    private String uid;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Note> notes;

    Deck(){}

    public Deck(String title){
        this.title = title;
    }
}
