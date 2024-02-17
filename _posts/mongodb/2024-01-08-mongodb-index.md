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

- Indexes support efficient execution of queries in MongoDB. Without indexes, MongoDB must scan every document in a collection to return query results. If an appropriate index exists for a query, MongoDB uses the index to limit the number of documents it must scan.
- Although indexes improve query performance, adding an index has negative performance impact for write operations. For collections with a high write-to-read ratio, indexes are expensive because each insert must also update any indexes.

- Indexes are special data structures that store a small portion of the collection's data set in an easy-to-traverse form. MongoDB indexes use a B-tree data structure.

- The index stores the value of a specific field or set of fields, ordered by the value of the field. The ordering of the index entries supports efficient equality matches and range-based query operations. In addition, MongoDB can return sorted results using the ordering in the index.

- MongoDB creates a unique index on the _id field during the creation of a collection. The _id index prevents clients from inserting two documents with the same value for the _id field. You cannot drop this index.

# 인덱스 만들기

- You cannot rename an index once created. Instead, you must drop and recreate the index with a new name.
- The best indexes for your application must take a number of factors into account, including the kinds of queries you expect, the ratio of reads to writes, and the amount of free memory on your system.
- An index that references multiple fields is a compound index. Compound indexes can dramatically improve query response times.
- Index keys correspond to document fields. In most cases, applying the ESR (Equality, Sort, Range) Rule to arrange the index keys helps to create a more efficient compound index.
  
# 인덱스 종류

# 인덱스 특징

