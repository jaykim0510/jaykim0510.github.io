---
layout: post
title:  '[Backend Thoery] 인증/인가'
description: 세션, JWT, OAuth 방식의 인증과 인가에 대해 배운다
date:   2023-12-08 15:01:35 +0300
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

# 인증과 인가

- **인증(Authentication)**
  - 유효한 사용자인지를 확인한다 
  - ex. 로그인 여부를 확인한다
- **인가(Authorization)**
  - 권한이 있는지를 확인하고 있으면 특정 행동을 허가한다
  - 인가는 인증 절차를 거친 후에 진행된다
  - ex. 불법 광고 영상을 올린 사용자를 탈퇴시키려 할 때, 먼저 관리자 권한이 있는지 확인하고 있는 경우 허가한다
  - ex. 자신이 작성했던 댓글을 수정하려 할 때, 댓글 작성자가 맞는지 확인하고 맞는 경우 허가한다

![](/images/backend_theory_2.png)

# 인증(Authentication)

- 보통 인증은 웹 서비스에서 로그인한 유저에게만 제공하는 정보에 접근하려고 할 때 요구된다
- 이 때 HTTP는 무상태(stateless)한 특성 때문에 로그인한 정보를 저장하고 있지 않으면, 매번 인증 절차를 진행해야 된다
- 그래서 백엔드에서 인증 절차를 구현할 때는 사용자의 로그인 정보를 어디에 저장할지 고민해야 한다
- 아래의 세가지 주요 인증 방식을 살펴보자

## 세션 인증 방식

- 서버에 포함된 세션 저장소에 로그인한 사용자의 정보를 저장한다
- 사용자가 로그인 성공시 세션 저장소에 (세션ID-사용자정보)라는 키-밸류 형태의 데이터가 저장되고, 사용자의 웹 브라우저 쿠키에 세션ID가 저장된다
- 사용자는 매번 로그인 인증 절차를 거치지 않고, 쿠키에 저장된 세션ID를 요청(request)과 함께 보냄으로써 인증된 사용자임을 증명할 수 있다

![](/images/backend_theory_3.png)

<div class="bell-para">
    <div class="bell-bar">
      <i class="fa-solid fa-bell"></i>
      세션 인증 방식의 장단점
    </div>
    <div class="bell-content">
      <ul>
        <li>장점
          <ul>
            <li>사용자 민감 정보는 서버에 저장하고, 세션 ID만으로 인증이 가능하다</li>
            <li>쿠키에는 세션 ID 정보만 있기 때문에, 탈취되어도 세션 ID만 무효화하면 사용자 정보는 안전하다는 점에서 사후대처가 된다</li>
          </ul>
        </li>
        <li>단점
          <ul>
            <li>해커가 세션 ID를 탈취하여 위장 접근할 수 있다.(하이재킹 공격)</li>
            <li>서버를 스케일아웃 시킬 경우 모든 서버가 세션 정보를 가지고 있어야 하므로, 서버의 확장성을 떨어트린다 <a href='https://www.youtube.com/watch?v=BotXDfBPvDA'>(유튜브 7분 30초 참고)</a></li>
          </ul>
        </li>
      </ul>
    </div>
</div>

## JWT 토큰 인증 방식

- 로그인한 사용자 정보를 JWT 토큰으로 만들어 사용자의 브라우저 쿠키에 저장한다
- 사용자가 로그인 성공시 서버는 로그인 정보를 이용해 JWT 토큰을 만들어 사용자의 브라우저 쿠키에 저장한다
- 사용자는 매번 로그인 인증 절차를 거치지 않고, 쿠키에 저장된 JWT 토큰을 요청(request)과 함께 보냄으로써 인증된 사용자임을 증명할 수 있다

![](/images/backend_theory_4.png)

<div class="bell-para">
    <div class="bell-bar">
      <i class="fa-solid fa-bell"></i>
      JWT 토큰 인증 방식의 장단점
    </div>
    <div class="bell-content">
      <ul>
        <li>장점
          <ul>
            <li>서버의 확장성에 영향을 미치지 않는다</li>
          </ul>
        </li>
        <li>단점
          <ul>
            <li>세션 ID와 비교해 JWT 토큰은 비교적 문자열이 길다. 그래서 네트워크 오버헤드가 비교적 크다</li>
            <li>암호화되어 있긴 하지만, 어쨋든 사용자 정보가 클라이언트 측에 저장된다 (보안에 치명적인 데이터는 담지 않는게 좋다)</li>
            <li>해커에게 탈취되었을 때, 딱히 취할 수 있는 대처방법이 없다</li>
          </ul>
        </li>
      </ul>
    </div>
</div>

## OAuth 인증 방식

- **O**pen Standard for **Auth**orization
- 개방형 Authorization 표준
- 여러 웹사이트에 사용자의 민감한 정보를 저장하지 않고, 신뢰할 수 있는 외부 서비스(ex. 구글, 네이버 등)에 저장된 사용자 정보로 인증/인가 하는 방식이다
- OAuth는 제 3자의 클라이언트(보통 우리가 만든 웹서비스를 말함)에게 보호된 리소스를 제한적으로 접근하게 해주는 프레임워크를 말한다
- OAuth 프레임워크에는 다음과 같은 주체들이 있다
  - **리소스 소유자**: 사용자
  - **클라이언트**: 사용자의 정보를 접근하는 제 3자의 서비스
  - **인증 서버**: 클라이언트의 접근을 관리하는 서버
  - **리소스 서버**: 리소스 소유자의 데이터를 관리하는 서버

![](/images/backend_theory_5.png)

# 인가(Authorization)

- 인가는 인증을 성공한 사용자가 특정 요청에 대해 권한이 있는지를 확인한다
- ex. 로그인 후 내가 작성한 댓글 수정 요청을 보낼 때, 요청을 보낸 사용자가 댓글 작성자와 일치하는지 확인한다
- 보통 사용자의 이메일(email)을 통해 사용자를 확인하거나 또는 사용자의 역할(role)을 통해 권한이 있는지 확인한다

# 참고

- [Basic 인증과 Bearer 인증의 모든, 토스 페이먼츠](https://www.tosspayments.com/blog/articles/dev-2)
- [[Web] 로그인 인증 방식, dee_thinking](https://velog.io/@dee0518/%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%9D%B8%EC%A6%9D-%EB%B0%A9%EC%8B%9D)
- [[10분 테코톡] 토닉, 후디의 인증과 인가, 우아한테크 유튜브](https://www.youtube.com/watch?v=BotXDfBPvDA)