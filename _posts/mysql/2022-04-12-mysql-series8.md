---
layout: post
title:  'MySQL 트랜잭션과 잠금'
description: 
date:   2022-04-12 15:01:35 +0300
image:  '/images/mysql_logo.webp'
logo_image: '/images/mysql_logo.webp'
categories: backend
tags: MySQL
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 트랜잭션

# 버퍼 관리

## 캐싱

## 캐시 만료

## 캐시 고정

## 페이지 교체 알고리즘

# 복구

## 언두(Undo) 로그와 리두(Redo) 로그

## 스틸(Steal)과 포스(Force) 정책

# 동시성 제어

## 잠금

## 격리 수준

# 참고

- [Real MySQL 8.0 (1권) 책](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9791158392703&orderClick=LAG&Kc=){:target="_blank"}
- [데이터베이스 인터널스 책](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9791161754963&orderClick=LEa&Kc=)
- [Naver D2: DBMS는 어떻게 트랜잭션을 관리할까?](https://d2.naver.com/helloworld/407507){:target="_blank"}