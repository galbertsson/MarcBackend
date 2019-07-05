package com.example;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@ControllerAdvice
public class DeckNotFoundAdvice {

    @ResponseBody
    @ExceptionHandler(DeckNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String deckNotFoundHandler(DeckNotFoundException ex){
        return ex.getMessage();
    }
}
