---
layout: post
title:  '[Backend Thoery] 쿠키와 세션'
description: 
date:   2023-12-06 15:01:35 +0300
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

# 쿠키

- 쿠키(cookie)란 웹 사이트에 접속할 때 서버에 의해 사용자의 컴퓨터에 저장되는 정보를 의미한다
- 웹 사이트는 이렇게 저장된 사용자의 정보를 클라이언트(client) 측의 컴퓨터에 남겨서 필요할 때마다 재사용 한다
- 즉, 특정 호스트에서 생성된 쿠키는 이후 모든 요청마다 서버로 쿠키를 다시 전송한다
- 사용자의 컴퓨터에 마치 과자 부스러기가 남아 있는 것과 같다고 해서 '쿠키(cookie)'라는 명칭이 붙었다
- 쿠키는 로그인 정보나 비회원의 장바구니 정보를 저장하는 용도로 많이 활용된다
- 하지만 사용자의 정보가 컴퓨터에 고스란히 남기 때문에 사생활 침해의 우려가 있으며, 보안과 관련된 이슈를 가지고 있다


# 세션

- 세션(Session)이란 HTTP 프로토콜을 사용하는 인터넷 사용자가 어떤 웹사이트를 방문해서 브라우저를 닫기까지의 기간, 그리고 그 기간동안 임시 데이터를 저장하는 공간을 일컫는 말이다
- 방문자가 웹서버에 접속해 있는 상태를 하나의 단위로 보고 세션이라고 한다
- 앞서 살펴본 쿠키는 클라이언트 측의 컴퓨터에 모든 데이터를 저장한다
- 세션은 서버 내부에 저장되며, 세션의 키값만을 클라이언트 측에 남겨둔다
- 브라우저는 필요할 때마다 이 키값을 이용하여 서버에 저장된 데이터를 사용하게 된다
- 저장된 값은 반영구적이며, 사용자가 특정 시간동안 사용되지 않을 경우 폐기될 수 있는 정보이다

<div class="bell-para">
    <div class="bell-bar">
      <i class="fa-solid fa-bell"></i>
      세션의 장단점
    </div>
    <div class="bell-content">
      <ul>
        <li>장점
          <ul>
            <li>클라이언트의 상태 정보가 서버에 저장되므로 상대적으로 안전하다</li>
            <li>서버에서 클라이언트 상태 정보를 저장하므로, 사용자의 로그인 여부 확인이 용이하고, 경우에 따라 강제 로그아웃도 시킬 수 있다</li>
          </ul>
        </li>
        <li>단점
          <ul>
            <li>클라이언트 수에 따라 서버에 걸리는 부하가 커진다</li>
            <li>서버 확장이 어렵다</li>
          </ul>
        </li>
      </ul>
    </div>
</div>