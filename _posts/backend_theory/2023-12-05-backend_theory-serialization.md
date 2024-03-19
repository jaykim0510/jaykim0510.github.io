---
layout: post
title:  '[Backend Thoery] 직렬화와 역직렬화'
description: 
date:   2023-12-05 15:01:35 +0300
image:  '/images/backend_theory_logo.png'
logo_image: '/images/backend_theory_logo.png'
category: backend
tag: backend_theory
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 직렬화와 역직렬화

![](/images/backend_theory_serialization_1.png)

- 직렬화(Serialization)
  - 메모리 상에 존재하는 객체를 문자열(바이너리 또는 텍스트)로 변환하는 것을 말한다
  - 문자열로 변환함으로써 네트워크를 통해 전송하고, 파일로 저장하는 것이 가능해진다
- 역직렬화(Deserialization)
  - 역직렬화는 직렬화의 반대로, 문자열을 객체로 변환하는 것을 말한다


# JSON

- **J**ava**S**cript **O**bject **N**otation
- 자바스크립트 객체를 문자열로 표현한 데이터 포맷이다
- 문자열이기 때문에 외부 요소와 데이터를 주고 받을 수 있고, 동시에 객체 형태이기 때문에 키와 값을 가지는 형태로 데이터를 표현하기 좋다
- 그래서 직렬화/역직렬화에서 문자열을 JSON 형태로 많이 사용한다 (XML과 같은 다른 형태에 비해 간결하다)

![](/images/backend_theory_serialization_2.png)

## JSON 문법

- 키(key)과 값(value)으로 구성된다
- 키를 중복선언하면 나중에 선언한 해당 키가 덮어쓰게 된다
- 키(key)는 쌍따옴표로 묶인 문자열이어야 한다
- 값(value)으로 number, string, boolean, array, object, null 타입을 사용할 수 있다

```js
{
    "name": "Mike",
    "age": 20,
    "isAlive": true,
    "hobbies": ["Soccer", "Game"]
}
```

# 참고

- [[CS] 데이터교환형식 - JSON, 직렬화와 역직렬화, Johnny's 개발 STORY](https://jhlee-developer.tistory.com/entry/CS-JSON-%EC%A7%81%EB%A0%AC%ED%99%94-%EC%97%AD%EC%A7%81%EB%A0%AC%ED%99%94)
- [[Javascript] 직렬화(Serialize), 역직렬화(Deserialize), 대범하게:티스토리](https://bo5mi.tistory.com/251)
- [[JavaScript] 왜 불러온 객체는 메서드 사용이 불가능할까? feat. 직렬화 & 역직렬화, Profile-exe](https://velog.io/@profile_exe/JS-deserialization-use-method)