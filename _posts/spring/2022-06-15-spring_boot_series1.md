---
layout: post
title:  'Spring Boot Series [Part1]: API'
description: 
date:   2022-06-15 15:01:35 +0300
image:  '/images/spring_boot_logo.png'
logo_image:  '/images/spring_boot_logo.png'
categories:   web_development
tags: Spring
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Spring Web 프로젝트 시작하기

- 설정 후 Generate를 눌러주면 압축파일이 다운된다

![](/images/spring_api_1.png)

![](/images/spring_api_2.png)

![](/images/spring_api_3.png)

![](/images/spring_api_5.png)

- 스프링 부트에 내장된 톰캣 서버 실행

![](/images/spring_api_6.png)

- 포트 번호를 설정할 수 있다

![](/images/spring_api_7.png)



# REST API

![](/images/spring_api.png)

- API 테스트는 크롬 플러그인의 Talend API 를 사용

## @RestController

- REST API 처리하는 컨트롤러로 등록

![](/images/spring_api_8.png)

## @GetMapping

![](/images/spring_api_9.png)

```java
@RestController
@RequestMapping("/api")
public class MyGetController {

    @GetMapping(path="/num1")
    public String get1() {
        return "Hello this is num1 GET API";
    }
}
```

![](/images/spring_api_10.png)

## @RequestMapping

- URI 를 지정해주는 어노테이션

```java
    @RequestMapping(path = "/num2", method = RequestMethod.GET) // method 미지정시 get, post, delete 모두 매핑
    public String get2() {
        return "Hello this is num2 GET API";
    }
```

## @PathVariable

```java
    @GetMapping(path = "/num3/{id}")
    public String  get3(@PathVariable Integer id) {
        return "My id is" + Integer.toString(id);
    }
```

![](/images/spring_api_11.png)

## @RequestParam

```java
    @GetMapping(path = "/num4")
    public String get4(@RequestParam Map<String, String> queryParam) {

        StringBuilder sb = new StringBuilder();

        queryParam.entrySet().forEach(entry -> {

            sb.append(entry.getKey() + " = " + entry.getValue() + "\n");
        });

        return sb.toString();
    }
```

![](/images/spring_api_12.png)

```java
    @GetMapping(path = "/num5")
    public String get5(
            @RequestParam String name,
            @RequestParam String address,
            @RequestParam Integer age
    ) {
        return name + " " + address + " " + Integer.toString(age);
    }
```

![](/images/spring_api_13.png)

## GET dto

- 실무에서 가장 권장하는 방법

```java
package train.myApi.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserInfo {
    private String name;
    private String address;
    private Integer age;
}
```

```java
    @GetMapping(path = "/num6")
    public String get6(UserInfo userInfo) {
        return userInfo.getName() + " " + userInfo.getAddress() + " " + userInfo.getAge().toString();
    }
```

## @RequestBody

```java
@RestController
@RequestMapping(path = "/api/post")
public class MyPostController {

    @PostMapping(path = "/num1")
    public void num1(@RequestBody Map<String, Object> requestData) {
        requestData.entrySet().forEach(stringObjectEntry -> {
            System.out.println("stringObjectEntry.getKey() = " + stringObjectEntry.getKey());
            System.out.println("stringObjectEntry.getValue() = " + stringObjectEntry.getValue());
        });
    }
}
```

## POST dto

- POST에서 `@RequestBody` 는 dto 쓰더라도 붙여줘야 한다

```java
    @PostMapping(path = "/num1")
    public void num1(@RequestBody UserInfo requestData) {
        System.out.println(requestData.getName());
        System.out.println(requestData.getAddress());
        System.out.println(requestData.getAge().toString());
    }
```

## @JsonProperty

- dto 에서 정의한 변수가 스네이크 케이스(ex. phone_number)가 아닌 다른 방식으로 작성되었을 때 `JsonProperty를` 붙여준다

```java
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserInfo {
    private String name;
    private String address;
    private Integer age;

    @JsonProperty(value = "phone_number")
    private String phoneNumber;
}
```

# 응답 메세지 만들기

## ResponseEntity

![](/images/spring_api_14.png)

```java
@RestController
@RequestMapping(path = "/api/post")
public class MyPostController {

    @PostMapping(path = "/num2")
    public ResponseEntity<UserInfo> num2(@RequestBody UserInfo requestData) {
        return ResponseEntity.status(HttpStatus.CREATED).body(requestData);
    }
}
```

![](/images/spring_api_15.png)

- `body()`에 JSON 안넣어도 자동으로 만들어줌

```java
    @GetMapping(path = "/num7")
    public ResponseEntity<UserInfo> num7(UserInfo userInfo) {
        return ResponseEntity.status(HttpStatus.OK).body(userInfo);
    }
```

![](/images/spring_api_16.png)

## @JsonInclude

- null값은 제외하고 응답 메세지에 내려줄 수 있다

```java
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserInfo {
    private String name;
    private String address;
    private Integer age;

    @JsonProperty(value = "phone_number")
    private String phoneNumber;

    @JsonProperty(value = "OTP")
    private String OTP;
}
```

![](/images/spring_api_17.png)

# Object Mapper

![](/images/spring_api_18.png)