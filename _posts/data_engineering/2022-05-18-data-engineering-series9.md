---
layout: post
title:  'Data Engineering Series [Part9]: 정규표현식(2) 문자 반복'
description: 
date:   2022-05-18 15:01:35 +0300
image:  '/images/regex_logo.png'
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

# 문자 반복

## OR : |

![](/images/regex_17.png)

## 0회 이상 반복 : *

```
* : 바로 앞에 있는 문자가 0회 이상 반복되는 부분과 매칭됩니다
```

![](/images/regex_18.png)

`one*`은 `on`, `one`, `oneee`와 같은 문자에 매칭됩니다.  

## 1회 이상 반복 : +

```
+ : 바로 앞에 있는 문자가 1회 이상 반복되는 부분과 매칭됩니다
```

![](/images/regex_19.png)

`one+`는 `e`가 최소 한 번 이상 등장하는 부분과 매칭되기 때문에 `one`, `oneee`와 같은 문자에 매칭됩니다.  

## n회 이상 m회 이하 반복 : {n, m}

```
{n, m} : 바로 앞에 있는 문자가 n회 이상 m회 이하 반복되는 부분과 매칭됩니다.
```

![](/images/regex_20.png)

## 0회 또는 1회 반복 : ?

```
? : 바로 앞에 있는 문자가 0회 이상 1회 이하 반복되는 부분과 매칭됩니다.
```

![](/images/regex_21.png)

## 탐욕정량자, 나태정량자  

기본적으로 모든 정량자(*, +, {n, m}, ?)는 탐욕정량자입니다.  

```
탐욕정량자 : 일치되는 부분을 찾을 때 최대한 많이 일치되도록 합니다
```
![](/images/regex_22.png)

```
나태정량자 : 정량자 뒤에 ?를 붙여주면 됩니다
```
![](/images/regex_23.png)

# 참고
- [greeksharifa, 파이썬 정규표현식(re) 사용법](https://greeksharifa.github.io/정규표현식(re)/2018/07/20/regex-usage-01-basic/){:target="_blank"}
- [regexone: 정규표현식 문제](https://regexone.com){:target="_blank"}
- [regexr: 정규표현식 테스트](https://regexr.com){:target="_blank"}
- [regexper: 정규표현식 시각화](https://regexper.com){:target="_blank"}
- [프로그래머스: 정규표현식 문제](https://programmers.co.kr/learn/courses/11){:target="_blank"}
- [백준: 정규표현식 문제](https://www.acmicpc.net/workbook/view/6082){:target="_blank"}
