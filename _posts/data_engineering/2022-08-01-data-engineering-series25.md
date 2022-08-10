---
layout: post
title:  'Data Engineering Series [Part25]: I 🤍 Logs(1) Introduction'
description: 
date:   2022-08-01 15:01:35 +0300
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

# What Is a Log?

Yet other than perhaps occasionally tailing a log file, most engineers don't think much about logs. To help remedy that, I'll give an overview of how logs work in distributed systems, and then give some practical applications of these concepts to a variety of common uses: data integration, enterprise architecture, real-time data processing, and data system design.  

```
[2022-07-02 05:30:44] method=POST user=crazyboy0510 path=/movies/comment-create/ movie_id=16
[2022-07-02 05:30:57] method=GET user=crazyboy0510 path=/movies/movie-play/7 movie_id=7
[2022-07-02 05:31:15] method=GET user=crazyboy0510 path=/movies/movie-play/16 movie_id=16
[2022-07-02 05:31:18] method=GET user=crazyboy0510 path=/movies/movie-play/7 movie_id=7
[2022-07-02 05:31:19] method=GET user=crazyboy0510 path=/movies/movie-play/7 movie_id=7
```


Every programmer is familiar with this kind of log - a series of loosely structured requests, errors, or other messages in a sequence of rotating text files.  

The purpose of logs quickly becomes an input to queries in order to understand behavior across many machines, something that English text in files is not nearly as appropriate for as the kind of structured log I'll be talking about.  

The log I'll be discussing is a little more general and closer to what in the database or systems called a 'commit log'. It is append-only sequence of records ordered by time.  

![](/images/logs_1.png)

Each rectangle represents a record that was appended to the log. Records are stored in the order they were appended. The contents and format of the records aren't important for the purposes of this discussion. To be concrete, we can just imagine each record to be a JSON blob.  

The log entry number can be thought of as the 'timestamp' of the entry. this is convenient property of being decoupled from any particular physical clock. This property is essential as we get to distributed systems.  

A log is just kind of table or file where the records are sorted by time  

```
table: array of records  
file: array of bytes  
```

However it is important that we thing about the log as an **abstract data structure, not a text file**.  

Logs have a specific purpose: **they record what happened and when**. For distributed data systems, this is the heart of the problem.  


# Logs in Database

The usage in databases has to do with keeping in sync a variety of data structures and indexes in the presence of crashes. To make this atomic and durable, a database uses a log to write out information about the records it will be modifying before applying the changes to all the various data structures that it maintains.  

The log is the record of what happened, and each table or index is a projection of this history into some useful data structure or index.  

Over time, the usage of the log grew from **an implementation detail of the ACID database properties** to a **method for replicating data between databases**. It turns out that the sequence of changes that happened on the database is exactly what is needed to keep a remote replica database in sync. Oracle, MySQL, PostreSQL, and MongoDB include log shipping protocols to transmit portions of a log to replica databases that act as slaves. The slaves can then apply the changes recorded in the log to their own local data structures to stay in sync with the master.  

In fact, the use of logs is variations on the two uses in database internals:  

- The log is used as a publish/subscribe mechanism to transmit data to other replicas
- The log is used as a consistency mechanism to order the updates that are applied to multiple replicas

# Logs in Distributed System

The same problems that databases solve with logs (like distributing data to replicas and agreeing on update order) are among the most fundamental problems for all distributed systems.  

The log-centric approach to distributed systems arises from a simple observation  

> If two identical, deterministic processes begin in the same state and get the same inputs in the same order, they will produce the same output and end in the same state

(Desterministic means that the processing isn't timing dependent)  

The application to distributed computing is pretty obvious. You can reduce the problem of making multiple machines all do the same thing to the problem of implementaing a consistent log to feed input to theses processes. The purpose of the log here is to squeeze all the nondeterminism out of the input stream to ensure that each replica stays in sync.  

Discrete log entry numbers act as a clock for the state of the replicas - you can describe the state of each replica by a single number: the timestamp for the maximum log entry that it has processed. Two replicas at the same time will be in the same state.  

## Log-Centric Design Pattern

There are many variations on how this principle can be applied., depending on what is put in the log. For example, we can log the incoming requests to a service and have each replica process these independently. Or we can have one instance that processed requests and log the state changes that the service undergoes in response to a request.  

Database people generally differentiate between physical and logical logging. Physical or row-based logging means logging the contents of each row that is changed (로우별 실제 변경된 데이터를 저장하는 것). Logical or statement logging  means logging the SQL commands that lead to the row changes (insert, update, and delete statements).  

The distributed systems distinguished two broad approaches to processing and replication. The **state machine model** keep a log of the incoming requests and **each replica processes each request** in log order. **primary backup** elect one replica as the leader. This leader processes requests in the order they arrive and logs the changes to its state that occur as a result of processing the requests.  

![](/images/logs_2.png)