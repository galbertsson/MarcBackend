package com.example.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Embeddable
public class BasicNote{

    @Getter
    @Setter
    String front;

    @Getter
    @Setter
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
