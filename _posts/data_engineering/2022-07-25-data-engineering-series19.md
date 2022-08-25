---
layout: post
title:  'Data Engineering Series [Part19]: 로그 공부하기'
description: 
date:   2022-07-25 15:01:35 +0300
image:  '/images/log_logo.webp'
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

# Log

- A log, in a computing context, is the automatically produced and time-stamped documentation of events relevant to a particular system. Virtually all software applications and systems produce log files. 

- Logs are everywhere in software development. Without them there’d be no relational databases, git version control, or most analytics platforms.  

- A log can be useful for keeping track of computer use, emergency recovery, and application improvement.  

**A few common types of logs**:  
- **Transaction Log (Redo Log, Undo Log)**: contains a history of database changes. The term is usually associated with RDBMS. When you insert, update or delete database rows, the changes are journaled in the Transaction Log. Real-world RDBMS systems are based on one of the following types of the journal.
- **Commit Log**: includes only committed transactions in their commit order. Every committed transaction is appended to the log sequentially as a group of change events. Rolled-back transactions will not appear in the Commit Log.
- **Binary Log**: binary log 에는 데이터베이스에 대한 모든 변경 사항(데이터 및 구조)과 각 명령문 실행 시간이 기록되어 있다. binary log 의 목적은 백업 작업을 지원할뿐만 아니라, 하나 이상의 마스터에서 하나 이상의 슬레이브 서버로 데이터가 전송되어 복제하도록 하기 위한 것이다.
- **Access Log**: lists all requests for individual files that people have requested from a website
- **Audit Log**: Audit logg is the record of activity within the software systems used across your organization. Audit logs record the occurrence of an event, the time at which it occurred, the responsible user or service, and the impacted entity
- **System Log**: syslog are records of the operating system (OS) events that indicate how the system was running. Information, errors, and warnings related to the computer operating system are displayed in the syslog.

Transaction Log, Redo Log, Commit Log, Binary Log들은 좀 혼용되서 사용하는 것 같다. DB마다 같은 용어인데 다르게 사용되기도 하고, 또 사람들도 결과적으로 혼용해서 사용하고 설명해서, 명확히 글로 적어내기가 힘들다. 그래서 그냥 자신이 사용하는 DB에 맞게 정리해야 할 것 같다. 참고로 MySQL은 Redo Log, Undo Log 그리고 Binary Log 이 3가지로 롤백(Rollback), 커밋(Commit), 복구(Recovery), 복제(Replication) 기능을 구현한다.  


# Log in Distributed System

The log is a totally-ordered, append-only data structure. Whether it’s application logs, system logs, or access logs, logging is something every developer uses on a daily basis. Essentially, it’s a timestamp and an event, a when and a what, and typically appended to the end of a file. But when we generalize that pattern, we end up with something much more useful for a broad range of problems. It becomes more interesting when we look at the log not just as a system of record but a **central piece in managing data and distributing it across the enterprise efficiently**.  

There are a number of implementations of this idea: Apache Kafka, Amazon Kinesis, NATS Streaming, Tank, and Apache Pulsar to name a few. We can probably credit Kafka with popularizing the idea.  

There are three key priorities of these types of systems: **performance, high availability, and scalability**. If it’s not fast enough, the data becomes decreasingly useful. If it’s not highly available, it means we can’t reliably get our data in or out. And if it’s not scalable, it won’t be able to meet the needs of many enterprises.  

# Kafka Log

## Commit Log

Usually, Commit Log is associated with relational database systems. In fact, you can think about Commit Log as a part of your architecture where every transaction is written to some reliable log. The transactions are then read from the log and processed by consumers. This architecture can be implemented using the Event Streaming pattern. Kafka is designed for event streaming and acts very similar to a Commit Log. Kafka has a concept of partitions to parallelize the processing of events.  

# RDBMS Log

## PostgreSQL
PostgreSQL is based on the Write-Ahead Log. The log represents a binary stream of low-level physical instructions. PostgreSQL provides Logical Decoding to extract the changes in an eye-friendly format.  

## MySQL / MariaDB
MySQL has a concept of storage engines that represent different strategies for storing your database. There are many storage engines and you can write your own but the most interesting are InnoDB (B-tree index), MyRocks (LSM index), and MyISAM. This architecture is flexible but requires a separate WAL log used by a storage engine.  

Binary Log (also known as binlog) is the Commit Log used for replication and decoupled from storage engines. It has a simple defined format that can be easily parsed. Additionally, every storage engine maintains its own WAL log. The format of the log is specific to the storage engine.  

In MySQL, every transaction is written to the Commit Log and a WAL. Transactions are considered distributed as they require a two-phase commit (2PC) in the two log files.  

As mentioned above, rolled-back transactions will not appear in the Commit Log. In MySQL, this is true only for transactional storage engines like InnoDB and MyRocks. In non-transactional storage engines like MyISAM rolled-back transactions may appear in the log and make your data inconsistent.  

## Write Ahead Log

Write-Ahead Logging (WAL) is a standard method for ensuring data integrity. A detailed description can be found in most (if not all) books about transaction processing. Briefly, WAL's central concept is that changes to data files (where tables and indexes reside) must be written only after those changes have been logged, that is, after log records describing the changes have been flushed to permanent storage. If we follow this procedure, we do not need to flush data pages to disk on every transaction commit, because we know that in the event of a crash we will be able to recover the database using the log: any changes that have not been applied to the data pages can be redone from the log records. (This is roll-forward recovery, also known as REDO.)  

**Tip**  
Because WAL restores database file contents after a crash, journaled file systems are not necessary for reliable storage of the data files or WAL files. In fact, journaling overhead can reduce performance, especially if journaling causes file system data to be flushed to disk. Fortunately, data flushing during journaling can often be disabled with a file system mount option, e.g., data=writeback on a Linux ext3 file system. Journaled file systems do improve boot speed after a crash.  

Using WAL results in a significantly reduced number of disk writes, because only the log file needs to be flushed to disk to guarantee that a transaction is committed, rather than every data file changed by the transaction. The log file is written sequentially, and so the cost of syncing the log is much less than the cost of flushing the data pages. This is especially true for servers handling many small transactions touching different parts of the data store. Furthermore, when the server is processing many small concurrent transactions, one fsync of the log file may suffice to commit many transactions.  

WAL also makes it possible to support on-line backup and point-in-time recovery, as described in Section 26.3. By archiving the WAL data we can support reverting to any time instant covered by the available WAL data: we simply install a prior physical backup of the database, and replay the WAL log just as far as the desired time. What's more, the physical backup doesn't have to be an instantaneous snapshot of the database state — if it is made over some period of time, then replaying the WAL log for that period will fix any internal inconsistencies.  

## Transaction Log(Redo log + Undo log)

- transaction log in Oracle are knwon as the redo log.
- The redo log is a disk-based data structure used during crash recovery to correct data written by incomplete transactions (MySQL 공식문서)  
- The transaction log serves the same functions as the REDO log in other databases- storing writes in a safe way and recovering in the case of a crash, although there are some details in implementation that differ in functionality from other RDMS
- There are redo logs (ib_logfile0 and ib_logfile1)
- The transaction log (usually in files iblog1 and iblog2) is vital to InnoDB for multiple reasons: ROLLBACK, crash recovery, and possibly more.

## Binary Log
The binary log contains “events” that describe database changes such as table creation operations or changes to table data. It also contains events for statements that potentially could have made changes (for example, a DELETE which matched no rows), unless row-based logging is used. The binary log also contains information about how long each statement took that updated data.  

The binary log has two important purposes:  

- For replication, the binary log on a replication source server provides a record of the data changes to be sent to replicas. The source sends the events contained in its binary log to its replicas, which execute those events to make the same data changes that were made on the source. See Section 16.2, “Replication Implementation”.

- Certain data recovery operations require use of the binary log. After a backup has been restored, the events in the binary log that were recorded after the backup was made are re-executed. These events bring databases up to date from the point of the backup. See Section 7.5, “Point-in-Time (Incremental) Recovery”.  


The binary log is generally resilient to unexpected halts because only complete transactions are logged or read back. The binary log is not used for statements such as SELECT or SHOW that do not modify data. To log all statements (for example, to identify a problem query), use the general query log.

# 참고

- [Quora, What is a DB commit log?](https://www.quora.com/What-is-a-DB-commit-log){:target="_blank"}
- [Building a Distributed Log from Scratch, Part 2: Data Replication](https://bravenewgeek.com/building-a-distributed-log-from-scratch-part-2-data-replication/){:target="_blank"}
- [HEVO, Apache Kafka Logs: A Comprehensive Guide](https://hevodata.com/learn/apache-kafka-logs-a-comprehensive-guide/){:target="_blank"}