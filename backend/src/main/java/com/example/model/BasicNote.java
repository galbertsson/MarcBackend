package com.example.model;

public class BasicNote extends Note {
    String front;
    String back;

    BasicNote(){}

    public BasicNote(String front, String back){
        this.front = front;
        this.back = back;
    }

    @Override
    public String toString() {
        return "Basic Note " + super.toString();
    }
}
