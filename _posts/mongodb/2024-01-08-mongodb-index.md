---
layout: post
title:  '[MongoDB] 인덱스 (준비중)'
description: 
date:   2024-01-08 15:01:35 +0300
image:  '/images/mongo_logo.png'
logo_image: '/images/mongo_logo.png'
category: data_engineering
tag: mongodb
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 인덱스

- 인덱스는 쿼리를 더욱 효율적으로 실행하도록 도와준다
- 만약 인덱스가 없으면 쿼리를 실행하기 위해 컬렉션내의 모든 도큐먼트를 스캔해야 한다
- 인덱스가 있으면 쿼리 결과를 반환하기 위해 스캔해야 하는 도큐먼트의 수를 제한시킬 수 있다
- 하지만 인덱스는 쓰기 실행에 있어서는 안좋은 영향을 미친다
- 그래서 쓰기 비율이 훨씬 높은 컬렉션의 경우에는 인덱스를 사용하는 것을 신중히 해야한다
- 몽고DB에서 인덱스는 B-tree 구조이다
- 인덱스는 도큐먼트의 1개 이상의 특정 필드를 정렬된 상태로 저장한다
- 몽고DB는 컬렉션 생성시 자동으로 `_id` 필드로 구성된 유니크 인덱스를 생성한다


# 인덱스 만들기

- 인덱스명은 변경할 수 없다. 새로운 이름을 얻기 위해서는 삭제후 새로 생성해야 한다
- 대부분의 케이스에 ESR 원칙을 적용해 인덱스를 만들면 효율적인 인덱스를 만들 수 있다

## 인덱스명 표기하기

- 인덱스명을 직접 만들면 나중에 쿼리 결과를 분석할 때 어떤 인덱스가 사용됐는지 식별하기 쉽다

```js
db.<collection>.createIndex(
   { <field>: <value> },
   { name: "<indexName>" }
)
```

- 인덱스명을 따로 지정하지 않으면 다음과 같은 규칙으로 인덱스명이 자동 설정된다

|**Index**|**Default Name**|
|{ score : 1 }|score_1|
|{ content : "text", "description.tags": "text" }|content_text_description.tags_text|
|{ category : 1, locale : "2dsphere"}|category_1_locale_2dsphere|
|{ "fieldA" : 1, "fieldB" : "hashed", "fieldC" : -1 }|fieldA_1_fieldB_hashed_fieldC_-1|


# 인덱스 종류

## Single FIeld Index

- 필드 하나로 이루어진 인덱스를 말한다
- 단일 필드 인덱스를 만드는 방법은 아래와 같다

```js
db.<collection>.createIndex( { <field>: <sortOrder> } )
```

- 정렬 기준은 `1`이 오름차순, `-1`이 내림차순 정렬이다

```js
db.students.createIndex( { gpa: 1 } )
```

- 내장된 도큐먼트가 가지는 필드에 대해서도 인덱스를 생성할 수 있다
- 아래와 같은 형태의 도큐먼트가 있을 때,

```js
{
    "name": "Bob",
    "gpa": 3.2,
    "location": { city: "Albany", state: "New York" }
}
```

- 다음과 같이 `location` 필드의 내장 필드인 `state`에 대해서 인덱스를 만들 수 있다

```js
db.students.createIndex( { "location.state": 1 } )
```

## Compound Index

- 여러 필드로 이루어진 인덱스를 말한다

```js
{ "item": 1, "location": 1, "stock": 1 }
```

- 위와 같은 인덱스는 다음과 같은 필드 조합으로 이루어진 쿼리에 사용될 수 있다
  - `item`
  - `item`, `location`
  - `item`, `location`, `stock`
  - `item`, `stock` (여기서는 item만 인덱스 효과를 누릴 수 있음)

- 아래와 같은 필드 조합의 쿼리는 인덱스를 사용하지 않는다
  - `location`
  - `stock`
  - `location`, `stock`

- 만약 `item`을 사용하는 쿼리와, `item`, `location` 을 사용하는 쿼리가 있다면 `{ "item": 1, "location": 1}` 인덱스 하나만 있으면 된다. `{ "item": 1 }` 인덱스도 만드는 것은 낭비이다

## Multikey Index

- 배열 필드로 이루어진 인덱스를 말한다

- 다음과 같은 형태의 도큐먼트가 있을 때,

```js
{ _id: 5, type: "food", item: "apple", ratings: [ 5, 8, 9 ] }
```

- 아래와 같이 `ratings` 필드를 이용해 멀티키 인덱스를 만들 수 있다

```js
db.inventory.createIndex( { ratings: 1 } )
```

## Text Index

# 인덱스 특징

