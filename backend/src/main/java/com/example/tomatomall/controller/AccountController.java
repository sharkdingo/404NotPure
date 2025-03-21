package com.example.tomatomall.controller;

import com.example.tomatomall.dto.AccountUpdateDTO;
import com.example.tomatomall.exception.TomatoException;
import com.example.tomatomall.po.Account;
import com.example.tomatomall.service.AccountService;
import com.example.tomatomall.vo.AccountVO;
import com.example.tomatomall.vo.Response;
import com.example.tomatomall.util.TokenUtil;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Objects;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Resource
    AccountService accountService;

    /**
     * 获取用户详情
     */
    @GetMapping("/{username}")
    public Response getUser(@PathVariable String username) {
        AccountVO accountVO = accountService.getAccount(username);
        return Response.buildSuccess(accountVO);
    }

    /**
     * 创建新的用户
     */
    @PostMapping()
    public Response<String> createUser(@RequestBody AccountVO accountVO) {
        return Response.buildSuccess(accountService.register(accountVO.toPO()));
    }

    /**
     * 更新用户信息
     */
    @PutMapping()
    public Response<String> updateUser(@RequestBody AccountUpdateDTO dto, HttpServletRequest request) {
        String token = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    System.out.println("已获取token");
                    break;
                }
            }
        }

//         3. Token 不存在 → 返回 401 未授权
        if (token == null) {
            throw TomatoException.notLogin();
        }

        // 4. 解析 Token 获取当前用户（假设 Token 直接存储用户名）
        String currentUser;
        try {
            currentUser = TokenUtil.getUsernameFromToken(token); // 替换为你的 Token 解析逻辑
            System.out.println("Current User from Token: " + currentUser); // 调试输出
        } catch (Exception e) {
            throw TomatoException.notLogin();
        }

        System.out.println("Username from DTO: " + dto.getUsername()); // 调试输出
        if (!dto.getUsername().equals(currentUser)) {
            throw TomatoException.noPermission();
        }
        return Response.buildSuccess(accountService.update(dto));
    }

    /**
     * 登录
     */
    @PostMapping("/login")
    public Response<String> login(@RequestBody AccountVO accountVO, HttpServletResponse response) {
        String token = accountService.login(accountVO);
        // 将Token设置到Cookie中
        Cookie cookie = new Cookie("token", token);
        cookie.setPath("/");
        response.addCookie(cookie);
        return Response.buildSuccess(token);
    }
}
