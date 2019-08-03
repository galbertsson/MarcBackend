package com.example.demo.controller;

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

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class DeckControllerPostCreate {

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
    public void NoTokenCreateDeck() throws Exception {
        this.mockMvc.perform(post("/decks/create"))
                .andDo(print())
                .andExpect(status().is(400));
    }

    //Invalid token, valid deck
    @Test
    public void InvalidTokenGetDeck() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn(null);

        this.mockMvc.perform(post("/decks/create")
                    .header("Authorization", "test")
                    .contentType("application/json")
                    .content("{\"title\":\"test\",\"notes\":[]}")
                ).andDo(print())
                .andExpect(status().is(200))
                .andExpect(content().string("false"));
    }

    //Mocked "Valid" token sent, no valid deck sent
    @Test
    public void WithTokenGetDeck() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn("123");

        this.mockMvc.perform(post("/decks/create")
                    .header("Authorization", "test")
                    .contentType("application/json")
                    .content("{\"title\":1,\"notes\":\"asd\"}"))
                .andDo(print())
                .andExpect(status().is(400));
    }

    //Mocked "Valid" token sent, valid deck sent
    @Test
    public void WithTokenGetOneDeck() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn("123");

        this.mockMvc.perform(post("/decks/create")
                    .header("Authorization", "test")
                    .contentType("application/json")
                    .content("{\"title\":\"test\",\"notes\":[]}"))
                .andDo(print())
                .andExpect(status().is(200))
                .andExpect(content().string("true"));
    }

    //Mocked "Valid" token sent, deck with notes sent
    @Test
    public void WithTokenGetTwoDecks() throws Exception {
        when(firebase.getUserIdFromAuthHeader("test")).thenReturn("123");

        this.mockMvc.perform(post("/decks/create")
                    .header("Authorization", "test")
                    .contentType("application/json")
                    .content("{\"title\":\"test\"" +
                            ",\"notes\": [" +
                                "{\"type\":\"BasicNote\", \"front\":\"Dog\", \"back\":\"Hund\"}," +
                                "{\"type\":\"ClozeNote\", \"text\":\"Apollo {a:11} was the first manned mission to land on the moon\"}" +
                            "]}"))
                .andDo(print())
                .andExpect(status().is(200))
                .andExpect(content().string("true"));
    }
}
