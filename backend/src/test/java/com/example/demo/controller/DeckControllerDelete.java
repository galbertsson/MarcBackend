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

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class DeckControllerDelete {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private Firebase firebase;

    @MockBean
    private DeckRepository deckRepository;

    //No token sent
    @Test
    public void NoTokenDeleteDeck() throws Exception {
        this.mockMvc.perform(delete("/decks/1"))
                .andDo(print())
                .andExpect(status().is(400));
    }

    //Invalid token, valid deck
    @Test
    public void InvalidTokenDeleteDeck() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn(null);

        Deck d = new Deck("Test deck");
        d.setId(1l);
        d.setUid("123");

        when(deckRepository.findById(1L)).thenReturn(Optional.of(d));

        this.mockMvc.perform(delete("/decks/1")
                    .header("Authorization", "test")
                ).andDo(print())
                .andExpect(status().is(200))
                .andExpect(content().string("false"));
    }

    //Mocked "Valid" token sent, no valid deck id sent
    @Test
    public void WithTokenDeleteInvalidId() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn("123");

        this.mockMvc.perform(delete("/decks/a")
                    .header("Authorization", "test"))
                .andDo(print())
                .andExpect(status().is(400));
    }

    //Mocked "Valid" token sent, valid id sent
    @Test
    public void WithTokenDeleteValidDeck() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn("123");

        Deck d = new Deck("Test deck");
        d.setId(1l);
        d.setUid("123");


        when(deckRepository.findById(1L)).thenReturn(Optional.of(d));

        this.mockMvc.perform(delete("/decks/1")
                    .header("Authorization", "test"))
                .andDo(print())
                .andExpect(status().is(200))
                .andExpect(content().string("true"));

        //Make sure that we not only get the correct response, changes needs to get saved as well
        verify(deckRepository).deleteById(1L);
    }

    //Mocked "Valid" token sent, valid deck sent, not our deck
    @Test
    public void DeleteNotOurDeck() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn("123");

        Deck d = new Deck("Test deck");
        d.setId(1l);
        d.setUid("321");


        when(deckRepository.findById(1L)).thenReturn(Optional.of(d));

        this.mockMvc.perform(delete("/decks/1")
                .header("Authorization", "test"))
                .andDo(print())
                .andExpect(status().is(200))
                .andExpect(content().string("false"));


        verify(deckRepository, never()).deleteById(any());
    }
}

