---
layout: post
title:  '[Javascript]: 데이터 타입'
description: 이웅모님의 모던 자바스크립트 Deep Dive 책을 읽고 정리한 내용이다
date:   2024-01-17 15:01:35 +0300
image:  '/images/js_logo.png'
logo_image: '/images/js_logo.png'
category: language
tag: javascript
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 데이터 타입

- 원시 타입(Primitive): 숫자, 문자열, 불리언, undefined, null, Symbol
- 객체 타입(Object): 객체, 함수, 배열 등 원시 타입이 아닌 모든 타입

## 숫자 타입

- ECMAScript 사양에 따르면 숫자 타입의 값은 64비트 부동소수점 형식을 따른다
- 즉 모든 수를 실수로 처리하며, 정수만 표현하기 위한 데이터 타입이 별도로 존재하지 않는다
- 숫자 타입은 추가적으로 세 가지 특별한 값도 표현할 수 있다 (`Infinity`, `-Infinity`, `NaN`)

## 문자열 타입

- 일반 문자열: 쌍따옴표(") 또는 작은 따옴표(') 사용
- 템플릿 문자열: 백틱(`) 사용

- 템플릿 문자열을 사용하면, 여러 줄에 걸쳐서 나오는 문자열을 있는 그대로 저장할 수 있다 (탭, 줄바꿈 등 모두 반영된다)
- 또 템플릿 문자열을 사용하면 표현식을 삽입할 수 있다
- 일반 문자열은 탭, 줄바꿈 등을 표현하려면 이스케이프 시퀀스를 사용해야 한다
- (백슬래쉬 하나인데, 하나만 하면 Jekyll Search가 안되서 두 개로 표기)
  - `\\0`: Null
  - `\\b`: 백스페이스
  - `\\t`: 탭
  - `\\'`: 작은 따옴표
  - ...


## 배열

