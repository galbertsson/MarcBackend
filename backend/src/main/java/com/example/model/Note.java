package com.example.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.*;
import com.fasterxml.jackson.annotation.JsonTypeInfo.Id;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@JsonTypeInfo(use=JsonTypeInfo.Id.NAME, include=As.PROPERTY, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = ClozeNote.class, name = "ClozeNote"),
        @JsonSubTypes.Type(value = BasicNote.class, name = "BasicNote")
})
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Note {
    @javax.persistence.Id
    @GeneratedValue
    long Id;
}
