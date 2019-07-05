package com.example.util;

import com.google.firebase.auth.FirebaseAuth;

import java.util.concurrent.ExecutionException;

public class Firebase {
    public static String getUserIdFromToken(String token){
        String userId = null;

        try {
            userId = FirebaseAuth.getInstance().verifyIdTokenAsync(token).get().getUid();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }

        return userId;
    }
}
