package com.example.tomatomall.controller;

import com.example.tomatomall.service.ImageService;
import com.example.tomatomall.vo.Response;
import com.example.tomatomall.exception.TomatoException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
public class ImageController {

  @Autowired
  private ImageService imageService;

  @PostMapping
  public Response<String> uploadImage(@RequestParam("file") MultipartFile file) {
    try {
      String url = imageService.upload(file);
      return Response.buildSuccess(url); // 确保 ResultVO.buildSuccess 正确包装数据
    } catch (TomatoException e) {
      e.printStackTrace();
      throw TomatoException.uploadFailure();
    }
  }
}