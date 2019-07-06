package com.example.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.*;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Id;

@JsonTypeInfo(use=JsonTypeInfo.Id.NAME, include=As.PROPERTY, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = ClozeNote.class, name = "ClozeNote"),
        @JsonSubTypes.Type(value = BasicNote.class, name = "BasicNote")
})
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Note {
    @Id
    @GeneratedValue
    private Long id;
}
