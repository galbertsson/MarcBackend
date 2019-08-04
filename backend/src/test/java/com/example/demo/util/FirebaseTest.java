package com.example.demo.util;

import com.example.util.Firebase;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import org.junit.BeforeClass;
import org.junit.Test;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import static org.mockito.Mockito.*;

import java.io.IOException;
import java.io.InputStream;

public class FirebaseTest {

    //Setup firebase before testing
    @BeforeClass
    public static void init(){
        try {
            Resource r = new ClassPathResource("marcapipoint-firebase.json");
            InputStream is = r.getInputStream();


            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(is))
                    .setDatabaseUrl("https://marcapipoint.firebaseio.com")
                    .build();

            FirebaseApp.initializeApp(options);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    Firebase firebase = new Firebase();
    FirebaseAuth firebaseAuth = FirebaseAuth.getInstance();

    @Test
    public void InvalidTokenTest(){
        String uid = firebase.getUserIdFromToken("a");
        assert(uid == null);
    }

    @Test
    public void InvalidHeaderTest(){
        String uid = firebase.getUserIdFromAuthHeader("a");
        assert(uid == null);
    }

    @Test
    public void ValidHeaderInvalidTokenTest() {
        String uid = firebase.getUserIdFromAuthHeader("Bearer test");
        assert(uid == null);
    }
}
