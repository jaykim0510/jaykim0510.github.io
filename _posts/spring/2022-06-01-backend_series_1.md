---
layout: post
title:  'Backend Series [Part1]: 백엔드 개요'
description: 
date:   2022-06-01 15:01:35 +0300
image:  '/images/spring_logo.png'
logo_image:  '/images/spring_logo.png'
categories:   web_development
tags: Spring
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---
# Front-end & Back-end

![](/images/backend_1.png)

## Frontend

- The front-end is the code that is executed on the client side. This code (typically HTML, CSS, and JavaScript) runs in the user’s browser and creates the user interface.

## Backend

- The back-end is the code that runs on the server, that receives requests from the clients, and contains the logic to send the appropriate data back to the client. The back-end also includes the database, which will persistently store all of the data for the application. 
- The back-end is all of the technology required to process the incoming request and generate and send the response to the client. This typically includes three major parts:
  - The server. This is the computer that receives requests.
  - The app. This is the application running on the server that listens for requests, retrieves information from the database, and sends a response.
  - The database. Databases are used to organize and persist data.


**Principles for Request-Response Cycle**  

- The server typically cannot initiate responses without requests!
- Every request needs a response, even if it’s just a 404 status code indicating that the content was not found. Otherwise your client will be left hanging (indefinitely waiting).
- The server should not send more than one response per request. This will throw errors in your code.

**Middleware**  

- 미들웨어는 서로 다른 애플리케이션이 서로 통신하는 데 사용되는 소프트웨어입니다. 미들웨어는 더욱 빠르게 혁신할 수 있도록 애플리케이션을 지능적이고 효율적으로 연결하는 기능을 제공합니다. 미들웨어는 단일 시스템에 원활하게 통합할 수 있도록 다양한 기술, 도구, 데이터베이스 간에 다리 역할을 합니다.
- 개발자는 이처럼 미들웨어를 사용하여 초기 코드를 다시 쓰지 않고도 새 프로그램을 초기 시스템과 통합할 수 있게 되었습니다. 미들웨어는 분산 시스템의 중요한 통신 및 데이터 관리 도구가 되었습니다.
- 서로 다른 소프트웨어 구성 요소 사이를 연결하지 않고 자유롭게 비즈니스 로직 및 기능에 중점을 둘 수 있습니다
- 예를 들어, 웹 서버는 웹 사이트를 벡엔드 데이터베이스에 연결하는 미들웨어입니다




# 참고

- [codecademy, Back-End Web Architecture](https://www.codecademy.com/article/back-end-architecture){:target="_blank"}
- [upwork, A Beginner's Guide to Back-End Development](https://www.upwork.com/resources/beginners-guide-back-end-development){:target="_blank"}
- [aws, 미들웨어란 무엇인가요?](https://aws.amazon.com/ko/what-is/middleware/){:target="_blank"}