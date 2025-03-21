package com.example.tomatomall.configure;

import com.example.tomatomall.exception.TomatoException;
import com.example.tomatomall.util.TokenUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Configuration
public class LoginInterceptor implements HandlerInterceptor {
    private static final Logger logger = LoggerFactory.getLogger(LoginInterceptor.class);
    @Autowired
    private TokenUtil tokenUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler){
        // 排除注册和登录路径
        String uri = request.getRequestURI();
        logger.info("Request URI: {}", uri);
        if (uri.equals("/api/accounts") || uri.equals("/api/accounts/login")) {
            return true;
        }

        // 从Cookie中获取Token
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("token".equals(cookie.getName())) {
                    String token = cookie.getValue();
                    // 验证Token
                    if (tokenUtil.verifyToken(token)) {
                        return true;
                    }
                }
            }
        }
        throw TomatoException.notLogin();
    }
}
