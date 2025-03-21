package com.example.tomatomall.service;


import com.example.tomatomall.po.Account;
import com.example.tomatomall.vo.AccountVO;


public interface AccountService {


    public String register(Account account);


    public String login(AccountVO accountVO);

    public AccountVO getAccount(String username);

}
