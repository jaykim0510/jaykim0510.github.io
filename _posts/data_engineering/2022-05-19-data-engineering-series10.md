---
layout: post
title:  'Data Engineering Series [Part8]: 정규표현식(3) 그루핑'
description: 
date:   2022-05-19 15:01:35 +0300
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

# ()

정규표현식에서 `()`는 크게 다음과 같은 기능을 가집니다.  

```
그룹핑
캡처링
재참조
```

## 문자 그루핑

![](/images/regex_24.png)

`yahoo+` 정규표현식은 앞의 문자 `o`가 1회 이상 반복되는 `yahoo`, `yahooooo`와 같은 문자와 매칭됩니다.  

`yahoo`라는 문자가 반복되는 부분과 매칭하고 싶을때 그루핑을 사용할 수 있습니다.  

![](/images/regex_25.png)

## 이중 그루핑

![](/images/regex_26.png)

## 문자 캡처링

정규표현식을 사용할 때 매칭되는 문자열의 특정 부분만 추출하고 싶은 경우가 있습니다. 이런 경우에도 `()` 문자를 사용해서 캡처링할 수 있습니다.  

그루핑은 정규표현식으로 패턴을 만들기 위한 목적이고, 캡처링은 매칭된 문자열 중 특정 부분을 사용하기 위한 목적입니다.  

캡처링만 원하는 경우에는 그냥 `()`만 사용하고 뒤에 별다른 정량자를 사용하지 않으면 됩니다. 반면 그루핑만 원하는 경우에는 해당 괄호가 캡처링되지 않도록 하기 위해 '이 괄호는 비캡처 그루핑이다'라는 표기로 `(?:)`과 같이 표기합니다.  

## 그루핑만 원하는 경우: (?:)

원래 그루핑을 하게되면 캡처링도 자동적으로 따라오게 됩니다. 하지만 단순 문자열 반복의 목적으로 그루핑만 원하고, 캡처링되지 않기를 원하는 경우도 있습니다. 이 때는 해당 `()`안에 `?:`를 넣어서 정규표현식을 작성하면 됩니다.  

```
(?:<regex>) : 그루핑용으로만 사용하고 캡처링되지 않도록 처리합니다.
```

## 재참조: \숫자

캡처링한 부분과 똑같은 문자열을 다시 참조하고 싶은 경우 `\숫자` (숫자는 캡처링 숫자와 일치)를 사용할 수 있습니다.  

자주 사용되는 예시는 '토마토', '기러기', 'zabz'와 같이 똑같은 문자로 시작해서 끝나는 단어를 매칭하고 싶을 때 입니다.  

![](/images/regex_26.png)

## 활용

`()`의 캡처링은 정규표현식을 활용한 메서드에서 자주 활용되기 때문에 다음 포스트에서 자세히 다루도록 하겠습니다.  


# 참고
- [greeksharifa, 파이썬 정규표현식(re) 사용법](https://greeksharifa.github.io/정규표현식(re)/2018/07/20/regex-usage-01-basic/){:target="_blank"}
- [regexone: 정규표현식 문제](https://regexone.com){:target="_blank"}
- [regexr: 정규표현식 테스트](https://regexr.com){:target="_blank"}
- [regexper: 정규표현식 시각화](https://regexper.com){:target="_blank"}
- [프로그래머스: 정규표현식 문제](https://programmers.co.kr/learn/courses/11){:target="_blank"}
- [백준: 정규표현식 문제](https://www.acmicpc.net/workbook/view/6082){:target="_blank"}
