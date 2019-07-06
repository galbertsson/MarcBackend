package com.example.controller;

import com.example.model.Note;
import com.example.repository.NoteRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NoteController {
    private final NoteRepository repository;

    NoteController(NoteRepository repository){
        this.repository = repository;
    }

    @PostMapping("/note")
    Note foo(@RequestBody Note note){
        return repository.save(note);
    }
}
