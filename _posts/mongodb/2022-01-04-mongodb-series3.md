---
layout: post
title:  'MongoDB Series [Part3]: MongoDB CRUD(2) 배열과 내장 도큐먼트 다루기'
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

```py
import pymongo
import dateutil.parser

client = pymongo.MongoClient("mongodb+srv://ziont0510:ziont0510@cluster0.zao0oj4.mongodb.net/?retryWrites=true&w=majority")

db = client.test
```

# Read (Query)


## 내장 도큐먼트

```py
db.sales.find_one()
```

![](/images/mongo_12.png)

```py
# document 필드안의 document 필드는 .을 이용해 접근할 수 있다
db.sales.find_one(
    {'customer.email': 'cauho@witwuta.sv'}
)
```

![](/images/mongo_13.png)


```py
cur = db.sales.find(
        {'customer.age': {'$lt': 20}}
      )

for doc in cur:
    print(doc)
    break
```

![](/images/mongo_14.png)

## 배열

```py
db.inventory.insert_many([
   { "item": "journal", "qty": 25, "tags": ["red"], "dim_cm": [ 14 ] },
   { "item": "journal", "qty": 25, "tags": ["red", "blue"], "dim_cm": [ 14, 21 ] },
   { "item": "notebook", "qty": 50, "tags": ["red", "blank"], "dim_cm": [ 14, 21 ] },
   { "item": "paper", "qty": 100, "tags": ["red", "blue", "plain"], "dim_cm": [ 14, 21 ] },
   { "item": "planner", "qty": 75, "tags": ["blank", "red"], "dim_cm": [ 22.85, 30 ] },
   { "item": "postcard", "qty": 45, "tags": ["blue"], "dim_cm": [ 10, 15.25 ] },
   { "item": "postcard", "qty": 45, "tags": ["blue", "red"], "dim_cm": [ 13, 14 ] }
])
```

```py
# tags에 red만 있는 도큐먼트
cur = db.inventory.find({"tags": ["red"]})

for doc in cur:
    print(doc)
```

![](/images/mongo_15.png)


```py
# tags에 red가 있는 도큐먼트
cur = db.inventory.find({"tags": "red"})

for doc in cur:
    print(doc)
```

![](/images/mongo_16.png)

```py
# tags에 red 또는 blue가 있는 도큐먼트
cur = db.inventory.find({"tags": {"$in": ["red", "blue"]}})

for doc in cur:
    print(doc)
```

![](/images/mongo_21.png)


```py
# tags에 red와 blue가 있는 도큐먼트
cur = db.inventory.find({"tags": {"$all": ["red", "blue"]}})

for doc in cur:
    print(doc)
```

![](/images/mongo_17.png)

```py
# tags에 red랑 blue만 있는 도큐먼트
# cur = db.inventory.find({"tags": ["red", "blue"]}) # 이렇게 하면 순서가 정확히 red, blue 인 데이터만 필터링한다

cur = db.inventory.find({"tags": ["red", "blue"]})

for doc in cur:
    print(doc)
```

![](/images/mongo_18.png)


```py
# dim_cm에 15 이하인 값을 하나라도 가지는 도큐먼트
cur = db.inventory.find({"dim_cm": {"$lte": 15}})

for doc in cur:
    print(doc)
```

![](/images/mongo_19.png)

```py
# dim_cm에 있는 값이 15이상 20이하인 값을 하나라도 가지는 도큐먼트

# elemMatch: 각 요소에 대해 여러 조건을 걸 수 있다
# 만약 {"dim_cm": {"gte": 15, "lte": 20}} 이렇게 하면, 
# (15 이상인 요소를 가지는 도큐먼트) and (20 이하인 요소를 가지는 도큐먼트) 이렇게 된다

cur = db.inventory.find({"dim_cm": {"$elemMatch": {"$gte": 15, "$lte": 20}}})

for doc in cur:
    print(doc)
```

![](/images/mongo_20.png)


```py
# 배열의 첫 번째 값이 15 이상인 도큐먼트

cur = db.inventory.find({"dim_cm.0": {"$gte": 15}})

for doc in cur:
    print(doc)
```

![](/images/mongo_22.png)

```py
# 배열의 크기가 1인 도큐먼트

cur = db.inventory.find({"tags": {"$size": 1}})

for doc in cur:
    print(doc)
```

![](/images/mongo_23.png)

```py
# 여러 조건을 동시에 만족하는 원소가 있는 배열을 가지는 도큐먼트
# 그 도큐먼트의 _id와 saleDate만 출력 (1대신 True해도됨)
cur = db.sales.find({"items": {"$elemMatch": {"name": "binder", "quantity": {"$gte": 10}}}},
                   {"_id": 1, "saleDate": 1})

for doc in cur:
    print(doc)
    break
```



# Update

## Array Update Operators

- (https://www.mongodb.com/docs/manual/reference/operator/update-array/ 참고)

|Name|Description|
|:--:|:---:|
|$|Acts as a placeholder to update the first element that matches the query condition.|
|$[]|Acts as a placeholder to update all elements in an array for the documents that match the query condition.|
|$[\<identifier\>]|Acts as a placeholder to update all elements that match the arrayFilters condition for the documents that match the query condition.|
|$addToSet|Adds elements to an array only if they do not already exist in the set.|
|$pop|Removes the first or last item of an array.|
|$pull|Removes all array elements that match a specified query.|
|$push|Adds an item to an array.|
|$pullAll|Removes all matching values from an array.|


## $

- The positional `$` operator identifies an element in an array to update without explicitly specifying the position of the element in the array.

<div class="pen-para">
    <div class="pen-bar">
      <i class="fas fa-pen"></i>Note
    </div>
    <div class="pen-content">
      <li>To project, or return, an array element from a read operation, see the <a href="https://www.mongodb.com/docs/manual/reference/operator/projection/positional/#mongodb-projection-proj.-">$ projection operator</a> instead.</li>
      <li>To update all elements in an array, see the <a href="https://www.mongodb.com/docs/manual/reference/operator/update/positional-all/#mongodb-update-up.---">all positional operator $[]</a> instead.</li>
      <li>To update all elements that match an array filter condition or conditions, see <a href="https://www.mongodb.com/docs/manual/reference/operator/update/positional-filtered/#mongodb-update-up.---identifier--">the filtered positional operator</a> $[\<identifier\>] instead.</li>
    </div>
</div>



```py
db.students.insert_many( [
   { "_id" : 1, "grades" : [ 85, 80, 80 ] },
   { "_id" : 2, "grades" : [ 88, 90, 80 ] },
   { "_id" : 3, "grades" : [ 85, 100, 90 ] }
] )
```

```py
# 가장 처음 매치되는 도큐먼트(update_one)의 처음 매치되는 요소(grades.$) 를 업데이트 한다
# 모든 도큐먼트의 처음 매치되는 요소를 업데이트 하려면, update_many를 쓰면 된다
db.students.update_one(
   { "grades": 80 },
   { "$set": { "grades.$" : 82 } }
)

cur = db.students.find({})

for doc in cur:
    print(doc)
```

![](/images/mongo_24.png)

## $[]

- The all positional operator `$[]` indicates that the update operator should modify all elements in the specified array field.

```py
# 처음 매치되는 요소가 아니라, 처음 매치되는 요소를 가지는 배열의 모든 요소(grades.$[])를 업데이트 한다
db.students.update_one(
   { "grades": 80 },
   { "$set": { "grades.$[]" : 82 } }
)

cur = db.students.find({})

for doc in cur:
    print(doc)
```

![](/images/mongo_25.png)


## $[identifier]

- The filtered positional operator `$[\<identifier\>]` identifies the array elements that match the arrayFilters conditions for an update operation, e.g. `db.collection.updateMany()` and `db.collection.findAndModify()`.

```py
db.students.insert_many( [
   {
      "_id" : 4,
      "grades" : [
         { "grade" : 80, "mean" : 75, "std" : 6 },
         { "grade" : 85, "mean" : 90, "std" : 4 },
         { "grade" : 85, "mean" : 85, "std" : 6 }
      ]
   },
   {
      "_id" : 5,
      "grades" : [
         { "grade" : 90, "mean" : 75, "std" : 6 },
         { "grade" : 87, "mean" : 90, "std" : 3 },
         { "grade" : 85, "mean" : 85, "std" : 4 }
      ]
   }
] )
```

```py
# `filter`: A query that matches the documents to update. (조건을 만족하는 도큐먼트를 필터링)
# `array_filters` (optional): A list of filters specifying which array elements an update should apply. (배열에 있는 특정 요소에 대해서만 업데이트 적용)

# filter에 의해 _id가 5인 도큐먼트가 선택된다
# array_filters 에 의해 2번째 3번째 요소에만 업데이트 적용된다

db.students.update_many(
    filter={"grades.grade": {"$gt": 85}},
    update={"$set": {"grades.$[element].grade": 100}},
    array_filters=[{"element.mean": {"$gte": 80}}]
)

cur = db.students.find()

for doc in cur:
    print(doc)
```

![](/images/mongo_26.png)