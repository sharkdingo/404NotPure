package com.example.tomatomall.controller;

import com.example.tomatomall.po.Account;
import com.example.tomatomall.service.AccountService;
import com.example.tomatomall.vo.AccountVO;
import com.example.tomatomall.vo.Response;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

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
    public Response updateUser() {
        return null;
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
