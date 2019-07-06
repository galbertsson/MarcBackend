package com.example.model;

import lombok.Data;

import javax.persistence.Entity;

@Data
@Entity(name="BasicNote")
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
        return "Basic Note {front:" + front + ", back:" + back + "}";
    }
}
