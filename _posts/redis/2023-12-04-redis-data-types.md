---
layout: post
title:  '[Redis] 데이터 타입'
description: 레디스에서 지원하는 다양한 데이터 타입의 종류에 대해 배운다
date:   2023-12-04 15:01:35 +0300
image:  '/images/redis_logo.png'
logo_image: '/images/redis_logo.png'
category: data_engineering
tag: redis
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# String

- 레디스에서는 문자열과 관련하여 아래와 같은 명령어를 제공한다

![](/images/redis_data_type_string_1.png)

- 복잡해 보이지만 약간의 규칙이 있다
  - 앞에 `M`이 붙어있는 것은 여러 개의 데이터를 다룰 수 있다는 의미다
  - 뒤에 `EX`가 붙어있는 것은 만료 시간을 함께 지정한다는 의미다
  - 뒤에 `NX`가 붙어있는 것은 키(key)가 존재하지 않을 때 명령어를 실행한다는 의미다
- 위에서 살펴본 `EX`, `NX` 같은 요소들은 레디스에서 제공하는 옵션의 일부를 붙여서 새로운 명령어로 만든 것에 불과하다
  - `SET key apple EX 60` 와 `SETEX key 60 apple` 는 같은 기능을 수행한다

- 레디스 공식문서를 보면 아래와 같이 명령어에 어떤 옵션을 사용할 수 있는지 알려준다
![](/images/redis_data_type_string_2.png)


## 간단한 실습

```sql
SET apple red -- OK
GET apple -- red
```

```sql
-- 3초간 유효한 문자열 데이터를 저장한다

SET banana yellow EX 3 -- OK
-- 3초 뒤
GET banana -- null
```

```sql
-- 문자열의 길이를 리턴한다. 없으면 0

STRLEN apple -- 3
STRLEN banana -- 0
```

```sql
-- 여러 개의 데이터를 읽고 쓴다

MSET grape violet pear white avocado green -- OK
MGET grape pear banana -- [ "violet", "white", null]
```

```sql
-- 일부 문자열을 교체한다

SETRANGE apple 2 dish -- 6
GET apple -- redish
```

# Number

- 레디스에는 숫자형 데이터를 따로 구분하지 않지만, 여기서는 그냥 편의상 구분했다
- 좋아요나 조회수 같은 카운터 기반 기능 구현할 때 유용하다

![](/images/redis_data_type_number_1.png){: width="70%"}

## 간단한 실습

```sql
SET like 5 -- OK

INCR like -- 6

INCRBY like 100 -- 106

INCRBYFLOAT like 0.6 -- "106.6"
```

# Hash

- 레디스에서는 해시 데이터 타입과 관련된 명령어를 다음과 같이 제공한다

![](/images/redis_data_type_hash.png)

- 해시 데이터 타입은 아래와 같이 값(value)이 딕셔너리 형태로 되어 있다

![](/images/redis_data_type_hash_2.png){: width="50%"}

## 간단한 실습

```sql
HSET user name kim age 20 address Seoul -- 3

HGET user name -- "kim"
```

```sql
HGETALL user -- { "name": "kim", "age": "20", "address": "Seoul" }
```

# Set

- 레디스에서는 셋 데이터 타입과 관련된 명령어를 다음과 같이 제공한다

![](/images/redis_data_type_set_1.png)

- 셋 데이터 타입은 아래와 같이 값(value)이 셋 형태로 되어 있다

![](/images/redis_data_type_set_2.png){: width="50%"}

## 간단한 실습

```sql
SADD color red blue green -- 3
```

```sql
SMEMBERS color -- [ "red", "blue", "green"]
```

```sql
SADD myfavorite blue -- 1
SDIFF color myfavorite -- [ "red", "green" ]
```

# Sorted Set

- 레디스에서는 정렬된 셋 데이터 타입과 관련된 명령어를 다음과 같이 제공한다

![](/images/redis_data_type_ss_1.png)

- 역할별로 구분해서 정리해보면 다음과 같다

![](/images/redis_data_type_ss_2.png)

- 정렬된 셋 데이터 타입은 아래와 같이 값(value)이 실제 값(member)과 점수(score)를 가지는 형태로 되어 있다
- 실제 값(member)은 셋(Set)이기 때문에 유니크(unique)해야 한다. 점수(score)는 유니크할 필요 없다

![](/images/redis_data_type_ss_3.png){: width="50%"}


## 간단한 실습

```sql
ZADD midterm 80 math 60 english 90 science -- 3
```

```sql
-- 오름차순

ZRANK midterm english -- 0
ZRANK midterm math -- 1

ZRANK midterm english WITHSCORE -- [0, "60"]
```

```sql
-- 내림차순

ZREVRANK midterm english -- 2
```