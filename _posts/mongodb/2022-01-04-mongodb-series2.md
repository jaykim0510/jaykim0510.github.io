---
layout: post
title:  'MongoDB Series [Part2]: MongoDB CRUD'
description: 
date:   2022-01-04 15:01:35 +0300
image:  '/images/mongodb_logo.png'
logo_image:  '/images/mongo_logo.png'
categories: data_engineering
tags: MongoDB
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---


# Create

- 도큐먼트를 컬렉션에 추가하는 연산
- 컬렉션이 존재하지 않으면 생성후 추가한다
- 도큐먼트 하나에 대해서 원자성을 가진다 -> 필드 일부만 생기거나 하는 일은 발생하지 않는다
- `_id` 필드를 표기하지 않으면, 자동으로 `ObjectId` 타입의 값이 부여된다


```py
# 몽고 쉘의 경우 카멜 케이스 (insertOne)
# 파이썬의 경우 스네이크 케이스 표기법 (inser_one)

db.<컬렉션명>.insert_one(document, ..)

# 데이터 순서가 중요하지 않은 경우 ordered=False로 설정하면, 성능향상을 위해 도큐먼트를 재배열해서 삽입한다
db.<컬렉션명>.insert_many(document, ordered=True, ..)
```

```py
db.inventory.insert_one(
    {
        "item": "canvas",
        "qty": 100,
        "tags": ["cotton"],
        "size": {"h": 28, "w": 35.5, "uom": "cm"},
    }
)
```

```py
db.inventory.insert_many(
    [
        {
            "item": "journal",
            "qty": 25,
            "tags": ["blank", "red"],
            "size": {"h": 14, "w": 21, "uom": "cm"},
        },
        {
            "item": "mat",
            "qty": 85,
            "tags": ["gray"],
            "size": {"h": 27.9, "w": 35.5, "uom": "cm"},
        },
        {
            "item": "mousepad",
            "qty": 25,
            "tags": ["gel", "blue"],
            "size": {"h": 19, "w": 22.85, "uom": "cm"},
        },
    ], # { ordered: false }
)
```

## 그 밖의 연산

```py
db.collection.update_one() # when (upsert: true) option.
db.collection.update_many() # when (upsert: true) option.
db.collection.find_and_modify() # when (upsert: true) option.
db.collection.find_one_and_update() # when (upsert: true) option.
db.collection.find_one_and_replace() # when (upsert: true) option.
db.collection.bulk_write()
```

# Read (Query)

- 한 개의 컬렉션내에서 도큐먼트를 읽어오는 연산

```py
db.<컬렌션명>.find()
```

```py
db.users.find(
    { age: { $gt: 15 } },
    { name: 1, address: 1 }
).limit(5)
```

## 모든 도큐먼트 조회

```py
db.inventory.find({})
```

## 조건을 이용한 도큐먼트 조회

```py
db.inventory.find({"status": "D"})

db.inventory.find({"status": {"$in": ["A", "D"]}})

# and 조건
db.inventory.find({"status": "A", "qty": {"$lt": 30}})

# or 조건
db.inventory.find({"$or": [{"status": "A"}, {"qty": {"$lt": 30}}]})
```

# Update

- 한 개의 컬렉션내에 존재하는 도큐먼트를 수정하는 연산

```py
# 필터에 매칭되는 도큐먼트 1개(여러개가 매칭되더라도)의 필드값을 수정한다
# upsert=True로 하면, 매칭되는 도큐먼트가 없을 때 update 기반으로 추가한다
# update에 들어가는 연산자는 $currentDate, $inc, $min, $max, $mul, $rename, $set, $unset 등이 있다
db.<컬렉션명>.update_one(filter, update, upsert=False, ..)

# 필터에 매칭되는 모든 도큐먼트의 필드값을 수정한다
# upsert=True로 하면, 매칭되는 도큐먼트가 없을 때 도큐먼트 1개를 추가한다
db.<컬렉션명>.update_many(filter, update, upsert=False, ..)

# 필터에 매칭되는 도큐먼트 1개(여러개가 매칭되더라도)를 replacement로 대체한다
# upsert=True로 하면, 매칭되는 도큐먼트가 없을 때 replacement를 추가한다
db.<컬렉션명>.replace_one(filter, replacement, upsert=False, ..)
```

```py
db.inventory.update_one(
    {"item": "paper"},
    {"$set": {"size.uom": "cm", "status": "P"}, "$currentDate": {"lastModified": True}},
)
```

```py
db.inventory.update_many(
    {"qty": {"$lt": 50}},
    {"$set": {"size.uom": "in", "status": "P"}, "$currentDate": {"lastModified": True}},
)
```

```py
db.inventory.replace_one(
    {"item": "paper"},
    {
        "item": "paper",
        "instock": [{"warehouse": "A", "qty": 60}, {"warehouse": "B", "qty": 40}],
    },
)
```

```
- $currentDate: Sets the value of a field to current date, either as a Date or a Timestamp.
- $inc: Increments the value of the field by the specified amount.
- $min: Only updates the field if the specified value is less than the existing field value.
- $max: Only updates the field if the specified value is greater than the existing field value.
- $mul: Multiplies the value of the field by the specified amount.
- $rename: Renames a field.
- $set: Sets the value of a field in a document.
- $setOnInsert: Sets the value of a field if an update results in an insert of a document. Has no effect on update operations that modify existing documents.
- $unset: Removes the specified field from a document.
```

# Delete

- 한 개의 컬렉션내에서 도큐먼트를 삭제하는 연산

```py
# 필터에 매칭되는 도큐먼트 1개 (여러 개가 매치되더라도)를 삭제
db.<컬렉션명>.delete_one(filter, ..)

# 필터에 매칭되는 모든 도큐먼트를 삭제
db.<컬렉션명>.delete_many(filter, ..)
```

```py
db.inventory.delete_one({"status": "A"})
```

```py
# 모든 도큐먼트 삭제
db.inventory.delete_many({})

db.inventory.delete_many({"status": "A"})
```

# Bulk Write


# 참고

- [몽고DB 공식문서, MongoDB CRUD Operations](https://www.mongodb.com/docs/manual/crud/){:target="_blank"}
- [몽고DB 공식문서, SQL to MongoDB Mapping Chart](https://www.mongodb.com/docs/manual/reference/sql-comparison/){:target="_blank"}
- [몽고DB 공식문서, Update Operators](https://www.mongodb.com/docs/manual/reference/operator/update/#std-label-update-operators){:target="_blank"}