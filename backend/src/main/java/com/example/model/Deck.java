package com.example.model;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Deck {

    @Id
    @GeneratedValue
    private Long id;

    private String title;

    /*TODO: The serialization/deserialization problems likely comes from here, hibernate does not support arrays by default it seems like
    Can this we switched to list or collection?*/

    @ElementCollection
    private List<BasicNote> notes;

    Deck(){}

    public Deck(String title){
        this.title = title;
    }
}
