---
layout: post
title:  'Network Series [Part7]: 네트워크 활용편(1) 웹 브라우저'
description: 
date:   2022-07-13 15:01:35 +0300
image:  '/images/cs_logo.jpeg'
logo_image: '/images/cs_logo.jpeg'
categories: CS
tags: Network
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}
---

# 웹 브라우저 렌더링 과정

```
대기열: 브라우저는 주소창을 통해 입력한 요청을 대기열에 넣는다
```

```
캐싱: 요청에 대한 응답값을 프록시 서버 캐시 또는 웹 브라우저 캐시에 저장하고 재요청시 캐싱된 값을 리턴

브라우저 캐시: 쿠키, 로컬 스토리지, 세션 스토리지 등을 포함한 캐시

공유 프록시 캐시: 서버 앞 단에 클라이언트와 가깝게 프록시 서버를 배치한다. 프록시 서버에 저장된 응답값이 프록시 캐시
(Node.js 앞에 있는 nginx)
```

```
DNS: URL의 도메인명을 IP주소로 변환한다. 이 과정 또한 바로 DNS로 요청을 보내지 않고, 호스트 파일과 같이 캐시된 데이터가 있는지 먼저 확인한다
```

```
라우팅: DNS가 resolve한 IP주소와 ARP 과정을 통해 얻은 MAC 주소를 이용해 목적지 IP 주소로 라우팅 한다.
```

```
초기연결: 라우팅할 때 처음부터 데이터를 요청하는 것이 아니라 먼저 TCP 3 way handshake를 이용해 연결을 한다
```

```
다운로드: 이제 요청에 대한 응답값과, 그외에 필요한 HTML, CSS, 이미지 등을 서버로부터 받는다
```

```
렌더링: 웹 브라우저가 서버로부터 받아온 데이터를 이용해 렌더링하여 사용자에게 제공한다
```

![](/images/network_33.png)

# 캐시와 쿠키

## 캐시

> The goal of a caching is to store some resource "closer" to the access point than it was before

> 나중에 요청올 결과를 미리 저장해두었다가 빠르게 돌려주는 것  


### 웹 브라우저 캐시와 CPU 캐시  

> The CPU cache consists of special circuits within the CPU that are designed to cache memory, i.e. the cache is implemented in hardware as part of the physical CPU. This special cache hardware has absolutely nothing to do with the browser cache

- **웹 브라우저 캐시**

> We all have cache stored in our internet browser. It’s essentially a folder which contains small pieces of information taken from our browsing experience and the sites we visit. The aim is to make pages we revisit load faster.  

- **CPU 캐시**

> The purpose of the cache memory component is to increase speed. It’s located physically closer to the processor than the RAM component making it 10 to 100 times faster than RAM. However, its function is very different. The cache memory stores instructions and data that are used repeatedly by programs, enhancing the overall performance. 

### 웹 브라우저 캐시의 종류

- 로컬 스토리지
  - 키/값 쌍의 형태로 클라이언트 브라우저에서 데이터를 저장하는 방법
  - 수동으로 삭제하지 않는 한 영구적으로 저장소에 남아 있습니다.
    ```
    mac의 경우
    ~/Library/Application Support/Google/Chrome/Default/Local Storage/
    ```
- 세션 스토리지
  - 로컬 스토리지와 유사하지만 탭을 닫을 때 삭제됨
- 쿠키

![](/images/network_35.png)

### 프록시 캐시

공유 프록시 캐시: 서버 앞 단에 클라이언트와 가깝게 프록시 서버를 배치한다. 프록시 서버에 저장된 응답값이 프록시 캐시  
(Node.js 앞에 있는 nginx, AWS의 CloudFront)    

## 쿠키

쿠키는 웹 서버가 생성하여 웹 브라우저로 보내는 정보의 작은 파일입니다. 웹 브라우저는 미리 정해진 시간 동안 또는 웹 사이트에서 사용자의 세션 기간 동안 받은 쿠키를 저장합니다. 사용자가 웹 서버에 대해 향후 요청할 경우 관련 쿠키를 첨부합니다.  

쿠키는 웹 사이트가 사용자 경험을 개인화할 수 있도록 사용자에 대한 정보를 웹 사이트에 제공하는 데 도움이 됩니다. 예를 들어, 전자 상거래 웹사이트는 사용자들이 쇼핑 카트에 어떤 상품을 넣었는지 알기 위해 쿠키를 사용한다. 또한 일부 쿠키는 인증 쿠키와 같은 보안 목적으로 필요합니다(아래 참조).  

인터넷에서 사용되는 쿠키는 "HTTP 쿠키"라고도 불립니다. 대부분의 웹과 마찬가지로 쿠키는 HTTP 프로토콜을 사용하여 전송됩니다.   

```
cat ~/Library/Application Support/Google/Chrome/Default/Cookies
```

![](/images/network_37.png)

## 세션


# Do web browsers use different outgoing ports for different tabs?

Each connection to a website uses a different socket with default destination TCP port 80 for plain HTTP and 443 for HTTPS. For the socket to be unique, the combination of the source IP address, source TCP port, destination IP address and destination TCP port must be different.  

If you have multiple connections to the same website (assuming the website uses only 1 IP address) from the same computer, a different source TCP port must be used. This way, each connection is unique.  

![](/images/network_41.png)

# 참고

- [CLOUD FLARE: What are cookies?, Cookies definition](https://www.cloudflare.com/ko-kr/learning/privacy/what-are-cookies/){:target="_blank"}