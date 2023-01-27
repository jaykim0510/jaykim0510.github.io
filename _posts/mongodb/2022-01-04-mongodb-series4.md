---
layout: post
title:  'MongoDB Series [Part4]: MongoDB CRUD(3): Aggregation'
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


- Find로 처리할 수 없는 Group By, Join과 같은 복잡한 분석을 가능하게 한다

![](/images/mongo_5.png)

![](/images/mongo_6.png)


```py
import pymongo
import dateutil.parser

client = pymongo.MongoClient("mongodb+srv://ziont0510:ziont0510@cluster0.zao0oj4.mongodb.net/?retryWrites=true&w=majority")

db = client.test
```

```py
db.orders.insert_many( [
   { "_id": 0, "name": "Pepperoni", "size": "small", "price": 19,
     "quantity": 10, "date": dateutil.parser.parse( "2021-03-13T08:14:30Z" ) },
   { "_id": 1, "name": "Pepperoni", "size": "medium", "price": 20,
     "quantity": 20, "date" : dateutil.parser.parse( "2021-03-13T09:13:24Z" ) },
   { "_id": 2, "name": "Pepperoni", "size": "large", "price": 21,
     "quantity": 30, "date" : dateutil.parser.parse( "2021-03-17T09:22:12Z" ) },
   { "_id": 3, "name": "Cheese", "size": "small", "price": 12,
     "quantity": 15, "date" : dateutil.parser.parse( "2021-03-13T11:21:39.736Z" ) },
   { "_id": 4, "name": "Cheese", "size": "medium", "price": 13,
     "quantity":50, "date" : dateutil.parser.parse( "2022-01-12T21:23:13.331Z" ) },
   { "_id": 5, "name": "Cheese", "size": "large", "price": 14,
     "quantity": 10, "date" : dateutil.parser.parse( "2022-01-12T05:08:13Z" ) },
   { "_id": 6, "name": "Vegan", "size": "small", "price": 17,
     "quantity": 10, "date" : dateutil.parser.parse( "2021-01-13T05:08:13Z" ) },
   { "_id": 7, "name": "Vegan", "size": "medium", "price": 18,
     "quantity": 10, "date" : dateutil.parser.parse( "2021-01-13T05:10:13Z" ) }
] )
```

```py
cur = db.orders.aggregate([
            {"$match": {"size": "medium"}}
        ]
    )

for doc in cur:
    print(doc)
```

![](/images/mongo_7.png)


```py
cur = db.orders.aggregate([
            {"$match": {"size": "medium"}},
            {"$group": {"_id": {"$getField": "name"}, # getField로 해도 되고,
                       "totalQuantity": {"$sum": "$quantity"} # $ 를 써서 축약해서 나타낼 수도 있다 ($quantity)
                       }
            }
        ]
    )

for doc in cur:
    print(doc)
```

![](/images/mongo_8.png)

```py
cur = db.orders.aggregate([
            {"$match": {"date": {"$gte": dateutil.parser.parse( "2020-01-30" ), "$lt": dateutil.parser.parse( "2022-01-30" )}}},
            {"$group": {"_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$date"}},
                       "totalOrderValue": {"$sum": {"$multiply": ["$price", "$quantity"]}},
                        "averageOrderQuantity": {"$avg": "$quantity"}
                       }
            },
            {"$sort": {"totalOrderValue": -1}} # 여기서는 $ 표시 안쓰네
        ]
    )

for doc in cur:
    print(doc)
```

![](/images/mongo_9.png)

```py
db.books.insert_many([
    { "_id" : 8751, "title" : "The Banquet", "author" : "Dante", "copies" : 2 },
    { "_id" : 8752, "title" : "Divine Comedy", "author" : "Dante", "copies" : 1 },
    { "_id" : 8645, "title" : "Eclogues", "author" : "Dante", "copies" : 2 },
    { "_id" : 7000, "title" : "The Odyssey", "author" : "Homer", "copies" : 10 },
    { "_id" : 7020, "title" : "Iliad", "author" : "Homer", "copies" : 10 }
])
```



```py
cur = db.books.aggregate([
        {"$group": {
                    "_id": "$author",
                    "books": {"$push": "$title"}
                    }
        }
    ])

for doc in cur:
    print(doc)
```

![](/images/mongo_10.png)

```py
# https://www.mongodb.com/docs/manual/reference/aggregation-variables/
cur = db.books.aggregate([
        {"$group": {
                    "_id": "$author",
                    "books": {"$push": "$$ROOT"}
                    }
        }
    ])

for doc in cur:
    print(doc)
```

![](/images/mongo_11.png)

# 참고

- [MongoDB 공식문서, Aggregation Pipeline Stages](https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/#std-label-aggregation-pipeline-operator-reference){:target="_blank"}
- [](){:target="_blank"}
- [](){:target="_blank"}
- [](){:target="_blank"}
- [](){:target="_blank"}