package com.example.demo.controller;

import com.example.model.Deck;
import com.example.repository.DeckRepository;
import com.example.util.Firebase;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class DeckControllerGetDecks {

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
    public void NoTokenGetDeck() throws Exception {
        this.mockMvc.perform(get("/decks"))
                .andDo(print())
                .andExpect(status().is(400))
                .andExpect(content().string(""));
    }

    //Invalid token
    @Test
    public void InvalidTokenGetDeck() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn(null);

        this.mockMvc.perform(get("/decks").header("Authorization", "test"))
                .andDo(print())
                .andExpect(status().is(200))
                .andExpect(content().string(""));
    }

    //Mocked "Valid" token sent, no decks in repository
    @Test
    public void WithTokenGetDeck() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn("123");

        this.mockMvc.perform(get("/decks").header("Authorization", "test"))
                .andDo(print())
                .andExpect(status().is(200))
                .andExpect(content().string("[]"));
    }

    //Mocked "Valid" token sent, 1 deck in repository
    @Test
    public void WithTokenGetOneDeck() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn("123");

        ArrayList<Deck> decks = new ArrayList<>();
        Deck d = new Deck("Test Deck");
        d.setId(1L);
        d.setUid("123");

        decks.add(d);

        when(deckRepository.findAll()).thenReturn(decks);

        this.mockMvc.perform(get("/decks").header("Authorization", "test"))
                .andDo(print())
                .andExpect(status().is(200))
                .andExpect(content().json("[{'id':1, 'title':'Test Deck', 'uid':'123', 'notes':null}]"));
    }

    //Mocked "Valid" token sent, 2 decks in repository
    @Test
    public void WithTokenGetTwoDecks() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn("123");

        ArrayList<Deck> decks = new ArrayList<>();
        Deck d = new Deck("Test Deck");
        d.setId(1L);
        d.setUid("123");

        Deck d2 = new Deck("Another Deck");
        d2.setId(2L);
        d2.setUid("123");

        decks.add(d);
        decks.add(d2);

        when(deckRepository.findAll()).thenReturn(decks);

        this.mockMvc.perform(get("/decks").header("Authorization", "test"))
                .andDo(print())
                .andExpect(status().is(200))
                .andExpect(content().json("[{'id':1, 'title':'Test Deck', 'uid':'123', 'notes':null},{'id':2, 'title':'Another Deck', 'uid':'123', 'notes':null}]"));
    }

    //Mocked "Valid" token sent, 2 decks in repository
    @Test
    public void WithTokenGetOneOurDeck() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn("123");

        ArrayList<Deck> decks = new ArrayList<>();
        Deck d = new Deck("Test Deck");
        d.setId(1L);
        d.setUid("123");

        Deck d2 = new Deck("Another Deck");
        d2.setId(2L);
        d2.setUid("1234");

        decks.add(d);
        decks.add(d2);

        when(deckRepository.findAll()).thenReturn(decks);

        this.mockMvc.perform(get("/decks").header("Authorization", "test"))
                .andDo(print())
                .andExpect(status().is(200))
                .andExpect(content().json("[{'id':1, 'title':'Test Deck', 'uid':'123', 'notes':null}]"));
    }
}
