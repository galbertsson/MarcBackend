package com.example.model;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Embeddable;
import javax.persistence.Entity;

@Entity
public class ClozeNote extends Note{
    @Getter
    @Setter
    String text;

    ClozeNote(){}

    public ClozeNote(String text){
        this.text = text;
    }

    @Override
    public String toString() {
        return "Cloze Note {text:" + text + "}";
    }
}
