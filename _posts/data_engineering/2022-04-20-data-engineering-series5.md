---
layout: post
title:  'Data Engineering Series [Part5]: 데이터 멱등성과 ACID Transaction'
description: 
date:   2022-04-20 15:01:35 +0300
image:  '/images/data_engineering_logo.png'
logo_image:  '/images/data_engineering_logo.png'
categories: DE
tags: Data_Engineering
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 참고

- [Avoiding Double Payments in a Distributed Payments System](https://medium.com/airbnb-engineering/avoiding-double-payments-in-a-distributed-payments-system-2981f6b070bb){:target="_blank"}
- [Naver D2: DBMS는 어떻게 트랜잭션을 관리할까?](https://d2.naver.com/helloworld/407507){:target="_blank"}
- [Baeldung: Introduction to Transactions](https://www.baeldung.com/cs/transactions-intro){:target="_blank"}
- [Yuchen Z., A Deep Dive Into Idempotence](https://betterprogramming.pub/a-deep-dive-into-idempotence-1a39393df7e6){:target="_blank"}
- [Youtube: ACID 2.0: Designing Better API's and Messages - Improving Talks Series](https://www.youtube.com/watch?v=12f5wB2qHI8){:target="_blank"}