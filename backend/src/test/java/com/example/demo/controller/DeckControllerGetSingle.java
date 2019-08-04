package com.example.demo.controller;

import com.example.model.Deck;
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

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class DeckControllerGetSingle {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private Firebase firebase;

    @MockBean
    private DeckRepository deckRepository;

    //No token sent
    @Test
    public void NoTokenCreateDeck() throws Exception {
        this.mockMvc.perform(get("/decks/1"))
                .andDo(print())
                .andExpect(status().is(400));
    }

    //Invalid token
    @Test
    public void InvalidTokenGetDeck() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn(null);

        this.mockMvc.perform(get("/decks/1")
                    .header("Authorization", "test")
                ).andDo(print())
                .andExpect(status().is(200))
                .andExpect(content().string(""));
    }

    //Mocked "Valid" token sent, no valid id sent
    @Test
    public void WithTokenNoValidId() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn("123");

        this.mockMvc.perform(get("/decks/ad")
                    .header("Authorization", "test"))
                .andDo(print())
                .andExpect(status().is(400));
    }

    //Mocked "Valid" token sent, valid id sent, our deck in repo
    @Test
    public void WithTokenGetOneDeck() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn("123");

        Deck d = new Deck("English");
        d.setUid("123");

        when(deckRepository.findById(1L)).thenReturn(Optional.of(d));

        this.mockMvc.perform(get("/decks/1")
                    .header("Authorization", "test"))
                .andDo(print())
                .andExpect(status().is(200))
                .andExpect(content().json("{\"id\": null,\"title\":\"English\", \"uid\":\"123\",\"notes\":null}"));
    }

    //Mocked "Valid" token sent, valid id sent, not our deck in repo
    @Test
    public void WithTokenNotOurDeck() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn("123");

        Deck d = new Deck("English");
        d.setUid("321");

        when(deckRepository.findById(1L)).thenReturn(Optional.of(d));

        this.mockMvc.perform(get("/decks/1")
                    .header("Authorization", "test"))
                .andDo(print())
                .andExpect(status().is(200))
                .andExpect(content().string(""));
    }
}
