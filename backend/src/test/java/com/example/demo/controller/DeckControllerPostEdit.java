package com.example.demo.controller;

import com.example.model.BasicNote;
import com.example.model.ClozeNote;
import com.example.model.Deck;
import com.example.model.Note;
import com.example.repository.DeckRepository;
import com.example.util.Firebase;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class DeckControllerPostEdit {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private Firebase firebase;

    @MockBean
    private DeckRepository deckRepository;

    /*
     * Testing validation of invalid user input
     */
    //No token sent
    @Test
    public void NoTokenEditDeck() throws Exception {
        this.mockMvc.perform(post("/decks/edit"))
                .andDo(print())
                .andExpect(status().is(400));
    }

    //Invalid token, valid deck
    @Test
    public void InvalidTokenEditDeck() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn(null);

        Deck d = new Deck("Test deck");
        d.setId(1l);
        d.setUid("123");

        when(deckRepository.findById(1L)).thenReturn(Optional.of(d));

        this.mockMvc.perform(post("/decks/edit")
                    .header("Authorization", "test")
                    .contentType("application/json")
                    .content("{\"id\":1,\"title\":\"test\",\"notes\":[]}")
                ).andDo(print())
                .andExpect(status().is(200))
                .andExpect(content().string("false"));
    }

    //Mocked "Valid" token sent, no valid deck sent
    @Test
    public void WithTokenInvalidDeckSent() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn("123");

        this.mockMvc.perform(post("/decks/edit")
                    .header("Authorization", "test")
                    .contentType("application/json")
                    .content("{\"title\":1,\"notes\":\"asd\"}"))
                .andDo(print())
                .andExpect(status().is(400));
    }

    //Mocked "Valid" token sent, valid deck sent
    @Test
    public void WithTokenEditValidDeck() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn("123");

        Deck d = new Deck("Test deck");
        d.setId(1l);
        d.setUid("123");


        when(deckRepository.findById(1L)).thenReturn(Optional.of(d));

        this.mockMvc.perform(post("/decks/edit")
                    .header("Authorization", "test")
                    .contentType("application/json")
                    .content("{\"id\":1,\"title\":\"test\",\"notes\":[]}"))
                .andDo(print())
                .andExpect(status().is(200))
                .andExpect(content().string("true"));

        //Make sure that we not only get the correct response, changes needs to get saved as well
        Deck dTest = new Deck("test");
        dTest.setId(1L);
        dTest.setUid("123");
        dTest.setNotes(new ArrayList<>());

        verify(deckRepository).save(dTest);
    }

    //Mocked "Valid" token sent, deck with notes sent
    @Test
    public void WithTokenEditDeckWithNotes() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn("123");

        Deck d = new Deck("Test deck");
        d.setId(1l);
        d.setUid("123");


        when(deckRepository.findById(1L)).thenReturn(Optional.of(d));

        this.mockMvc.perform(post("/decks/edit")
                    .header("Authorization", "test")
                    .contentType("application/json")
                    .content("{\"title\":\"test\"" +
                            ",\"notes\": [" +
                                "{\"type\":\"BasicNote\", \"front\":\"Dog\", \"back\":\"Hund\"}," +
                                "{\"type\":\"ClozeNote\", \"text\":\"Apollo {a:11} was the first manned mission to land on the moon\"}" +
                            "]" +
                            ",\"id\":1}"))
                .andDo(print())
                .andExpect(status().is(200))
                .andExpect(content().string("true"));

        //Make sure that we not only get the correct response, changes needs to get saved as well
        verify(deckRepository).save(argThat(deck -> deck.getTitle().equals("test")
                                                    && deck.getUid().equals("123")
                                                    && deck.getId() == 1L
                                                    && deck.getNotes().size() == 2
                                                    && deck.getNotes().get(0) instanceof BasicNote
                                                    && ((BasicNote)deck.getNotes().get(0)).getFront().equals("Dog")
                                                    && ((BasicNote)deck.getNotes().get(0)).getBack().equals("Hund")
                                                    && deck.getNotes().get(1) instanceof ClozeNote
                                                    && ((ClozeNote)deck.getNotes().get(1)).getText().equals("Apollo {a:11} was the first manned mission to land on the moon")
                                            ));
    }


    //Mocked "Valid" token sent, valid deck sent, not our deck
    @Test
    public void EditNotOurDeck() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn("123");

        Deck d = new Deck("Test deck");
        d.setId(1l);
        d.setUid("321");


        when(deckRepository.findById(1L)).thenReturn(Optional.of(d));

        this.mockMvc.perform(post("/decks/edit")
                .header("Authorization", "test")
                .contentType("application/json")
                .content("{\"id\":1,\"title\":\"test\",\"notes\":[]}"))
                .andDo(print())
                .andExpect(status().is(200))
                .andExpect(content().string("false"));


        verify(deckRepository, never()).save(any());
    }
}

