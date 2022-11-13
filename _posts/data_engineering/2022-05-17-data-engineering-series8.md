---
layout: post
title:  'Data Engineering Series [Part8]: 정규표현식(1) 문자 한 개와 매치'
description: 
date:   2022-05-17 15:01:35 +0300
image:  '/images/regex_logo.png'
logo_image:  '/images/data_engineering_logo.png'
categories: data_engineering
tags: DE
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 정규표현식의 기초

정규표현식은 문자열 안에서 특정 **패턴을 매칭**하도록 도와줍니다. 정규표현식을 이용하면 단순한 패턴부터, 복잡한 패턴까지 수식화할 수 있습니다. 정규표현식을 배우면 문자열 내에서 html 태그 제거, 주민등록번호 뒷자리 가리기, 특수문자 제거, 전화번호 표기 통일 등 다양한 방법으로 문자열 데이터의 품질을 향상시킬 수 있습니다.  

정규표현식 안에서 메타문자를 제외한 모든 문자 하나는 일반 문자열 하나와 매칭됩니다.    
(메타문자는 리터럴 문자와 다르게 어떤 기능을 가진 문자를 말합니다)

![](/images/regex_1.png)

## 대괄호: []  

```
~중에 문자 1개
```

`[]` 사이에 원하는 문자를 여러 개 넣으면, 문자열이 넣은 문자 중 하나와 일치하면 매칭이 이루어집니다. 여기서 중요한 것은 무조건 **딱 한 문자와 일치**된다는 것입니다.  

![](/images/regex_2.png)

위에서 정규표현식이 `[ab]`일 때, `a`에도 매칭되고, `b`에도 매칭되는데 중요한 것은 `ab`가 아니라 `a` 또는 `b` 문자 한 개라는 것입니다.   

그리고 대괄호 안에서는 메타문자 역할을 하는 것은 오직 `\`, `^`, `-`, `]` 4개뿐입니다.  

```
\ : 대괄호 안에서 메타문자 역할을 하는 \, ^, -, ]가 리터럴 문자가 되도록합니다
```

![](/images/regex_3.png)

```
^ : NOT 기능을 합니다
```

![](/images/regex_4.png)

```
- : 범위 기능을 합니다 (알파벳 소문자: a-z, 알파펫: a-zA-Z)
```

![](/images/regex_5.png)

## 마침표: .

```
아무 문자 1개
```

![](/images/regex_6.png)

## 단어 문자: \w, 비 단어 문자: \W

```
\w : 단어 문자 1개와 일치됩니다. (단어 문자는 영문 대소문자, 숫자 0-9, 언더바 ‘_’ 를 포함)
```

![](/images/regex_7.png)

```
\W : \w와 반대로 매칭됩니다. (특수문자, 공백문자)
```

![](/images/regex_8.png)

## 숫자 문자: \d, 비 숫자 문자: \D

```
\d : 숫자 문자 1개와 일치됩니다.
```
![](/images/regex_9.png)

```
\D : 비 숫자 문자 1개와 일치됩니다.
```

![](/images/regex_10.png)

## 공백 문자: \s, 비 공백 문자: \S

```
\s : 스페이스, 탭, 개행 문자 1개와 일치됩니다
```

![](/images/regex_11.png)

```
\S : 공백 문자가 아닌 문자 1개와 일치됩니다.
```

![](/images/regex_12.png)

## 단어 경계: \b, 비 단어 경계: \B

```
\b : 문자열과 비문자열 사이 경계, 문자열 시작 또는 끝과 일치됩니다
```

![](/images/regex_14.png)

```
\B : 문자열과 문자열 사이 경계, 비문자열과 비문자열 사이 경계와 일치됩니다
```

![](/images/regex_13.png)

## 문자열 시작: ^

![](/images/regex_15.png)

## 문자열 끝: $

![](/images/regex_16.png)


# 참고
- [greeksharifa, 파이썬 정규표현식(re) 사용법](https://greeksharifa.github.io/정규표현식(re)/2018/07/20/regex-usage-01-basic/){:target="_blank"}
- [regexone: 정규표현식 문제](https://regexone.com){:target="_blank"}
- [regexr: 정규표현식 테스트](https://regexr.com){:target="_blank"}
- [regexper: 정규표현식 시각화](https://regexper.com){:target="_blank"}
- [프로그래머스: 정규표현식 문제](https://programmers.co.kr/learn/courses/11){:target="_blank"}
- [백준: 정규표현식 문제](https://www.acmicpc.net/workbook/view/6082){:target="_blank"}
