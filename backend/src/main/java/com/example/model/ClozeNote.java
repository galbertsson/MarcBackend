package com.example.model;


import lombok.Data;

import javax.persistence.Entity;

@Data
@Entity(name="ClozeNote")
public class ClozeNote extends Note{
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
