package com.example.tomatomall.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.example.tomatomall.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class TokenUtil {
    private static final long EXPIRE_TIME = 24 * 60 * 60 * 1000;
    private static final String SECRET = "404NotPure";

    @Autowired
    UserRepository userRepository;

    public boolean verifyToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(SECRET);
            JWTVerifier verifier = JWT.require(algorithm).build();
            verifier.verify(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String generateToken(String username) {
        Date expireDate = new Date(System.currentTimeMillis() + EXPIRE_TIME);
        Algorithm algorithm = Algorithm.HMAC256(SECRET);
        return JWT.create()
                .withSubject(username)
                .withExpiresAt(expireDate)
                .sign(algorithm);
    }

}
