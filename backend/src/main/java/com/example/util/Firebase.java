package com.example.util;

import com.google.firebase.auth.FirebaseAuth;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
public class Firebase {

    /**
     * Given an auth header with the specified shape it returns the token if the type and token is valid.
     * @param authHeader A HTTP request header with the shape of "[type] [token]"
     * @return returns the user id from Firebase
    * */
    public String getUserIdFromAuthHeader(String authHeader){
         String[] strings = authHeader.split(" ");

        //Check what we can before contacting Firebase
         if(strings.length == 2 && strings[0].equals("Bearer")){
             return getUserIdFromToken(strings[1]);
         }

         return null;
    }

    public String getUserIdFromToken(String token){
        String userId = null;

        try {
            userId = FirebaseAuth.getInstance().verifyIdTokenAsync(token).get().getUid();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }

        return userId;
    }
}
