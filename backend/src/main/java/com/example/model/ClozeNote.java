package com.example.model;

public class ClozeNote extends Note{
    String text;

    public ClozeNote(String text){
        this.text = text;
    }

    @Override
    public String toString() {
        return "Cloze Note " + super.toString();
    }
}
