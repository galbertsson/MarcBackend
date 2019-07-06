package com.example.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.*;

@JsonTypeInfo(use=JsonTypeInfo.Id.NAME, include=As.PROPERTY, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = ClozeNote.class, name = "ClozeNote"),
        @JsonSubTypes.Type(value = BasicNote.class, name = "BasicNote")
})
public abstract class Note {
}
