---
layout: post
title:  '[MongoDB] CRUD 쿼리 기본편'
description:
date:   2024-01-06 15:01:35 +0300
image:  '/images/mongo_logo.png'
logo_image: '/images/mongo_logo.png'
category: data_engineering
tag: [mongodb]
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 몽고DB CRUD 연산

- 다양한 언어를 지원한다 (ex. MongoDB Shell, Python, Node.js 등)
- (나는 MongoDB Shell 기준으로 작성했다)
- Read, Update, Delete 관련 작업은 SQL의 `WHERE`와 같은 필터(filter)를 잘 작성하는 것이 중요하다
- [(공식문서 참고)](https://www.mongodb.com/docs/manual/crud/) 

## Insert

- 데이터베이스에 데이터를 **삽입하는 작업**과 관련된 쿼리이다
- `insertOne()`, `insertMany()` 명령어를 주로 사용한다
- Update 관련 명령어에서 `upsert: true` 옵션을 주면 Insert 역할을 수행할 수도 있다
  - (ex. `findOneAndReplace(filter, replacement, { upsert: true })`)
- 몽고DB는 데이터를 저장할 때 `_id` 필드를 반드시 포함해야 한다. 그래서 데이터를 삽입할 때 `_id` 필드를 생략하면, 몽고DB가 `ObjectId` 타입의 `_id` 필드를 자동으로 생성한다
- 반환 값은 삽입된 문서가 아닌, 결과에 관한 메타정보를 포함하는 도큐먼트를 반환한다

```shell
# 하나의 도큐먼트 삽입 예시
db.inventory.insertOne(
   { item: "canvas", qty: 100, tags: ["cotton"], size: { h: 28, w: 35.5, uom: "cm" } }
)

# 여러 도큐먼트 삽입 예시
db.inventory.insertMany([
   { item: "journal", qty: 25, tags: ["blank", "red"], size: { h: 14, w: 21, uom: "cm" } },
   { item: "mat", qty: 85, tags: ["gray"], size: { h: 27.9, w: 35.5, uom: "cm" } },
   { item: "mousepad", qty: 25, tags: ["gel", "blue"], size: { h: 19, w: 22.85, uom: "cm" } }
])
```

```shell
# 반환 도큐먼트 예시
{
   "acknowledged" : true,
   "insertedIds" : [
      ObjectId("562a94d381cb9f1cd6eb0e1a"),
      ObjectId("562a94d381cb9f1cd6eb0e1b"),
      ObjectId("562a94d381cb9f1cd6eb0e1c")
   ]
}
```

## Delete

- 데이터베이스에 데이터를 **삭제하는 작업**과 관련된 쿼리이다
- `deleteOne()`, `deleteMany()` 명령어를 주로 사용한다
  - `deleteOne()`의 경우 필터에 여러 도큐먼트가 매칭되어도 가장 첫 번째 매칭된 도큐먼트만 삭제한다
  - `deleteOne()`이 의도한대로 동작하도록 하기 위해서는 필터에서 사용하는 필드는 `_id` 같은 유니크 인덱스를 갖는 필드를 쓰는게 좋다
  - `findOneAndDelete()` 명령어는 `sort` 옵션이 있어서, 정렬된 결과에서 첫 번째 도큐먼트를 삭제하도록 유도할 수 있다
- 컬렉션의 모든 도큐먼트를 삭제하더라도 컬렉션 안에 포함된 인덱스는 여전히 남아있다


```shell
# 컬렉션 안에 있는 모든 도큐먼트 삭제 예시
db.inventory.deleteMany({})

# 필터에 매칭되는 도큐먼트 한 개 삭제 예시
db.inventory.deleteOne( { status: "D" } )

# 필터에 매칭되는 도큐먼트 모두 삭제 예시
db.inventory.deleteMany( { status : "A" } )
```

## Find

- 데이터베이스의 데이터를 **읽는 작업**과 관련된 쿼리이다
- `findOne()`, `find()` 명령어를 주로 사용한다
  - (`findOne()`은 내부적으로 `find()`에서 `limit: 1` 옵션을 주는 것과 똑같이 동작한다 )
- 쿼리에 사용되는 필터를 어떻게 작성할지가 가장 중요하면서도 어렵다
  - 제공되는 연산자가 다양하다 [(공식문서 참고)](https://www.mongodb.com/docs/manual/reference/operator/query/)
  - 어떤 경우에는 필드가 먼저오고, 또 어떤 경우에는 연산자가 먼저온다
  - 몽고DB는 필드의 타입으로 도큐먼트, 배열도 가능해서 이와 관련한 필터 작성법도 익혀야 한다


```shell
# 컬렉션 내에서 전체 도큐먼트 조회 예시
db.inventory.find( {} )
```

```shell
# 필드 값의 동등 비교를 통한 도큐먼트 조회 예시
db.inventory.find( { status: "D" } )

# 필드 값의 조건 비교를 통한 도큐먼트 조회 예시

## 대소 비교 
## (관련 연산자: $gt, $gte, $lt, $lte)
db.inventory.find( { quantity: { $gt: 20 } } )

## 동등 비교 
## (관련 연산자: $eq, $ne) (위에서 살펴본 것과 같이 $eq는 생략해 축약 표현 가능하다)
db.inventory.find( { qty: { $eq: 20 } } )

## 포함 여부 비교 
## (관련 연산자: $in, $nin)
db.inventory.find( { quantity: { $in: [ 5, 15 ] } }, { _id: 0 } )
```

```shell
# AND, OR 을 이용한 도큐먼트 조회 예시
# (관련 연산자: $and, $or)

## AND (콤마(,) 또는 $and 를 통해 구현할 수 있다)
db.inventory.find( { status: "A", qty: { $lt: 30 } } )

## 같은 필드에 대한 AND 쿼리문은 콤마로 사용하면 편하다
db.inventory.find( { $and: [ { price: { $ne: 1.99 } }, { price: { $exists: true } } ] } )
db.inventory.find( { price: { $ne: 1.99, $exists: true } } )

## OR
db.inventory.find( { $or: [ { status: "A" }, { qty: { $lt: 30 } } ] } )

## x AND (y OR Z) 
db.inventory.find( {
     status: "A",
     $or: [ { qty: { $lt: 30 } }, { item: /^p/ } ]
} )

## AND Queries With Multiple Expressions Specifying the Same Operator
## (The query cannot use an implicit AND operation because it uses the $or operator more than once.)
## (정확히 잘 모르겠지만 아래처럼 같은 연산자(여기서는 $or)를 여러 번 쓰는 경우에는 콤마가 아닌 반드시 $and 연산자로 묶어야 하는 것 같다)
db.inventory.find( {
    $and: [
        { $or: [ { qty: { $lt : 10 } }, { qty : { $gt: 50 } } ] },
        { $or: [ { sale: true }, { price : { $lt : 5 } } ] }
    ]
} )

## AND 쿼리는, 같은 필드에 대한 경우에만 콤마 연산자로 간단히 쓰고, 좀 복잡해지는 경우에는 $and 연산자를 쓰는게 좋은 것 같다
```

```shell
# 필드의 존재 여부를 통한 도큐먼트 조회
# (관련 연산자: $exists)
db.inventory.find( { qty: { $exists: true, $nin: [ 5, 15 ] } } )

# 필드의 타입 체크를 통한 도큐먼트 조회
# (관련 연산자: $type)
db.addressBook.find( { "zipCode" : { $type : "number" } } )
```

```shell
# 표현식을 이용한 도큐먼트 조회
# (관련 연산자: $expr)

## 도큐먼트 안의 다른 필드 값을 참조
db.monthlyBudget.find( { $expr: { $gt: [ "$spent" , "$budget" ] } } ) // 도큐먼트의 spent 필드 값이 budget 필드 값보다 큰 도큐먼트

// Aggregation expression to calculate discounted price

let discountedPrice = {
   $cond: {
      if: { $gte: ["$qty", 100] },
      then: { $multiply: ["$price", NumberDecimal("0.50")] },
      else: { $multiply: ["$price", NumberDecimal("0.75")] }
   }
};

// Query the supplies collection using the aggregation expression

db.supplies.find( { $expr: { $lt:[ discountedPrice,  NumberDecimal("5") ] } }); // 컬렉션 내에서 각 도큐먼트마다 discountedPrice를 구한 후, 그 값이 5보다 작은지 비교
```

```shell
# Aggregation을 이용한 도큐먼트 조회 (이건 분량이 많다)
```

```shell
# 배열 필드를 이용한 도큐먼트 조회
# (관련 연산자: $all, $elemMatch, $size)

## 일치
db.inventory.find({ tags: [’red’, ‘blank’] }) // tags 필드가 정확히 [‘red’, ‘blank’]인 도큐먼트 (순서까지 같아야함)

db.inventory.find({ tags: { $all: [’red’, ‘blank’] } }) // tags 필드가 정확히 [‘red’, ‘blank’]인 도큐먼트 (순서는 상관 없음)


## 포함
db.inventory.find({ tags: ‘red’ }) // tags 필드에 red가 포함된 도큐먼트

db.inventory.find({ dim_cm: { $gt: 30 } }) // dim_cm 필드에 30보다 큰 원소가 하나라도 포함된 도큐먼트

db.inventory.find({ dim_cm: { $gt: 15, $lt: 20 } }) // dim_cm 필드에 15보다 큰 원소 또는 20보다 작은 원소 또는 15~20인 원소를 하나라도 포함하는 도큐먼트

db.inventory.find({ dim_cm: { $elemMatch: { $gt: 15, $lt: 20 } } }) // dim_cm 필드에 15~20인 원소가 하나라도 포함된 도큐먼트


## 일부
db.inventory.find({ dim_cm.1: { $gt: 25}) // dim_cm 필드의 2번째 원소 값이 25보다 큰 도큐먼트


## 개수
db.inventory.find({ dim_cm: { $size: 3}) //dim_cm 필드의 원소 개수가 3개인 도큐먼트

```


## Update

- 데이터베이스의 데이터를 **수정하는 작업**과 관련된 쿼리이다
- `updateOne()`, `updateMany()`, `replaceOne()` 명령어를 주로 사용한다
- 위의 Find 처럼 필터로 특정 도큐먼트를 찾고, 추가로 해당 도큐먼트를 어떻게 업데이트 할지에 관해서도 나타내야 한다


```shell
# 관련 연산자: $currentDate, $min, $max, $inc, $mul, $rename, $set, $unset, $setOnInsert

## db.collection.updateMany(<filter>, <update>, <options>)
db.inventory.updateMany(
   { "qty": { $lt: 50 } },
   {
     $set: { "size.uom": "in", status: "P" },
     $currentDate: { lastModified: true }
   }
)

## db.collection.replaceOne(<filter>, <update>, <options>)
db.inventory.replaceOne(
   { item: "paper" },
   { item: "paper", instock: [ { warehouse: "A", qty: 60 }, { warehouse: "B", qty: 40 } ] }
)
```