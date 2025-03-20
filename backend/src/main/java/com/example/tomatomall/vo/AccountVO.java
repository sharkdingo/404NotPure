package com.example.tomatomall.vo;

import com.example.tomatomall.po.Account;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class AccountVO {

  private Integer id;

  private String username;

  private String name;

  private String avatar;

  private String telephone;

  private String email;

  private String location;

  public Account toPO() {
    Account account = new Account();
    account.setId(id);
    account.setUsername(username);
    account.setName(name);
    account.setAvatar(avatar);
    account.setTelephone(telephone);
    account.setEmail(email);
    account.setLocation(location);
    return account;
  }
}