---
layout: post
title:  'MySQL Series [Part15] MySQL의 로그'
description: 
date:   2022-07-29 15:01:35 +0300
image:  '/images/mysql_logo.webp'
logo_image: '/images/mysql_logo.webp'
categories: DE
tags: MySQL
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Log의 중요성

MySQL is open-source relational databases, and you should learn how to use MySQL database logs to improve efficiency and security. It is crucial to understand how to diagnose and monitor the performance of a MySQL instance in the long run.  

While using a MySQL instance in production, you will come across issues like **slow queries, deadlocks, and aborted connections**. **Logging is essential to diagnosing these issues**. A good understanding of your MySQL database logs will help you improve operations by reducing the mean time to recovery and the mean time between failures. Logs are also key to detecting and diagnosing **security issues** within your MySQL instance.  

# MySQL의 로그

There are six types of log files in MySQL: redo log(WAL), undo log, binlog, error log, slow query log, general log, relay log. Redo logs and undo logs are closely related to transaction operations. Binlogs are also related to transaction operations. These three types of logs are important for understanding transaction operations in MySQL.  

# MySQL 모니터링을 위한 로그

While using a MySQL instance in production, you will come across issues like **slow queries, deadlocks, and aborted connections**. **Logging is essential to diagnosing these issues**. A good understanding of your MySQL database logs will help you improve operations by reducing the mean time to recovery and the mean time between failures.  

Logs are also key to detecting and diagnosing security issues within your MySQL instance. In the event of a compromise, logs track the details of an attack and the actions taken by the attackers. This information provides context to your data and helps you take remedial action.  


```
- General Query Log
- Slow Query Log
- Error Log
- Binary Log
```

```
mysql> show variables;
```

```sh
# Enable Logging on MySQL
mysql>SET GLOBAL general_log = ‘ON’;

# Log가 저장되는 파일 경로
mysql>SET GLOBAL general_log_file = ‘path_on_your_system’;
```

```sh
# Enable Logging on MySQL
mysql>SET GLOBAL slow_query_log = ‘ON’;

# Log가 저장되는 파일 경로
mysql>SET GLOBAL slow_query_log_file = ‘path_on_your_system’;
```

## General Query Log

As the name implies, the general query log is a general record of what MySQL is doing. Information is written to this log when clients connect or disconnect to the server. The server also logs each SQL statement it receives from clients. If you suspect an error in a client, you can know exactly what the client sent to the MySQL instance by looking at the general query log.  

You should be aware that MySQL writes statements to the general query log in the order in which it receives them. The order might differ from the order in which the queries are executed because, unlike other log formats, the query is written to this log file before MySQL even attempts to execute the query. MySQL database logs are therefore perfect for debugging MySQL crashes.  

Since the general query log is a record of every query received by the server, it can grow large quite quickly. If you only want a record of queries that change data, it might be better to use the binary log instead (more on that later).  

## Slow Query Log

As applications scale in size, queries that were once extremely fast can become quite slow. When you’re debugging a MySQL instance for performance issues, the slow query log is a good starting place to see which queries are the slowest and how often they are slow.  

The slow query log is the MySQL database log queries that exceed a given threshold of execution time. By default, all queries taking longer than 10 seconds are logged.   

**Configuration options**  
You can change the threshold query execution time by setting the value of the `long_query_time` system variable. It uses a unit of seconds, with an optional milliseconds component.

```sql
SET GLOBAL long_query_time = 5.0;
```
To verify if the slow query log is working properly, you can execute the following query with a time greater than the value of the `long_query_time`.  

```sql
SELECT SLEEP(7);
```

Queries not using indexes are often good candidates for optimization. The `log_queries_not_using_indexes` system variable can be switched on to make MySQL log all queries that do not use an index to limit the number of rows scanned. In this case, logging occurs regardless of execution time of the query.   

```sql
SHOW variables LIKE 'slow%';

# 슬로우 로그 조회하기
SELECT * FROM mysql.slow_log;
# 또는
SELECT start_time, user_host, query_time, lock_time, rows_sent, rows_examined, db, CONVERT(sql_text USING utf8 ) sql_text
FROM mysql.slow_log;
```

## Error Log

MySQL uses the error log to record diagnostic messages, warnings, and notes that occur during server startup and shutdown, and while the server is running. The error log also records MySQL startup and shutdown times.  

Error logging is always enabled. On Linux, if the destination is not specified, the server writes the error log to the console and sets the log_error system variable to stderr. On Windows, by default, the server writes the error log to the host_name.err file in the data directory. You can customize the path and file name of the error log by setting the value of the log_error system variable.  

**Commonly logged errors**

- Permission errors
- Configuration errors
- Out of memory errors
- Errors with initiation or shutdown of plugins and InnoDB

## Binary Log

The binary log is used by MySQL to record events that change the data within the tables or change the table schema itself. For example, binary logs record `INSERT`, `DELETE` and `UPDATE` statements but not `SELECT` or `SHOW` statements that do not modify data. Binary logs also contain information about how long each statement took to execute.  

The logging order of a binary login is in contrast with that of the general query log. Events are logged only after the transaction is committed by the server.  

MySQL writes binary log files in binary format. To read their contents in text format, you need to use the mysqlbinlog utility. For example, you can use the code below to convert the contents of the binary log file named binlog.000001 to text.  

```
mysql> mysqlbinlog binlog.0000001
```

MySQL database logs offer three formats for binary logging.  

- Statement-based logging: In this format, MySQL records the SQL statements that produce data changes. Statement-based logging is useful when many rows are affected by an event because it is more efficient to log a few statements than many rows.
- Row-based logging: In this format, changes to individual rows are recorded instead of the SQL statements. This is useful for queries that require a lot of execution time on the source but result in just a few rows being modified.
- Mixed logging: This is the recommended logging format. It uses statement-based logging by default but switches to row-based logging when required.


The binary logging format can be changed using the code below. However, you should note that it is not recommended to do so at runtime or while replication is ongoing.  

```sql
SET GLOBAL binlog_format = 'STATEMENT';
SET GLOBAL binlog_format = 'ROW';
SET GLOBAL binlog_format = 'MIXED';
```

Enabling binary logging on your MySQL instance will lower the performance slightly. However, the advantages discussed above generally outweigh this minor dip in performance.  

# 트랜잭션 처리를 위한 로그

데이터베이스는 보통 트랜잭션 수행을 위해 로그를 사용한다. 보통 이러한 역할을 수행하는 로그를 트랜잭션 로그라고 하며 MySQL의 경우 Redo Log, Undo Log, Binary Log가 이에 해당한다. Undo Log는 트랜잭션의 Atomicity, Redo Log는 Durability를 제공해준다.  

MySQL은 디스크의 I/O으로 인한 성능 저하를 줄이기 위해 캐싱 메커니즘을 사용한다. 

데이터베이스를 수정하는 쿼리가 들어오면, InnoDB는 먼저 메모리에 데이터가 있는지 확인하고, 없으면 디스크에서 불러와 메모리에 올리고 데이터를 수정한다. 이렇게 메모리에서만 계속 읽고 쓰게되면 장애로 서버가 종료될 때 데이터가 날아가게 된다. 이 문제를 해결하기 위해 MySQL에서는 Redo Log를 사용한다. 더 자세한 내용은 밑에서 살펴볼 것이다. 또한 데이터 수정 쿼리가 들어올 때마다 메모리의 데이터를 바로 수정하지는 않고, 이 전 값을 Undo Log에 보관해두고 수정을 가함으로써, 트랜잭션이 실패할 경우 데이터를 롤백(Roll back)할 준비를 한다. 이 내용도 밑에서 더 자세히 살펴보자.  

(참고로 디스크에 있는 파일중 데이터를 저장하는 파일을 데이터 파일, 로그를 저장하를 파일을 로그 파일이라고 함)  

(메모리에 있는 버퍼중 데이터 페이지를 캐시해놓는 위치를 데이터 버퍼, 로그를 캐시해놓는 위치를 로그 버퍼라고 함)

(InnoDB엔진이 데이터를 읽고 쓸 때는 해당하는 데이터와 인덱스를 메모리 버퍼 풀에 올려둔다.)  

**Memory Buffer pool**: occupies the largest block of memory. The cache used to store various data includes index pages, data pages, undo pages, insert buffers, adaptive hash indexes, lock information stored in innodb, data dictionary information, etc. The working method always reads the database file into the buffer pool by page (16k per page), and then retains the cached data in the buffer pool according to the least recently used (lru) algorithm. If the database file needs to be modified, always modify the page in the buffer pool first (dirty page after the modification occurs), and then flush the dirty page of the buffer pool to the file at a certain frequency.  

## Undo Log

Undo log is to achieve atomicity of transactions. Undo Log is also used to implement multi-version concurrency control (referred to as: MVCC).  

- Undo log는 트랜잭션의 Atomicity 특성을 지키기 위한 로그
- Undo log는 MVCC(multi-version concurrency control)를 위해서도 사용

**Internal mechanism of delete/update operation**

When the transaction is not committed, InnoDB will not delete the undo log immediately, because the undo log may be used later. For example, when the isolation level is repeatable read, the transaction reads the latest committed row version when the transaction is started, as long as the transaction is not over, the row version cannot be deleted, that is, the undo log cannot be deleted.  

But when the transaction is committed, the undo log corresponding to the transaction will be put into the delete list, and will be deleted by purge in the future.  

The principle of Undo Log is very simple. In order to satisfy the atomicity of transactions, before operating any data, first back up the data to a place (this place where data backup is stored is called Undo Log). Then modify the data. If an error occurs or the user executes a ROLLBACK statement, the system can use the backup in Undo Log to restore the data to the state before the transaction started.  

Suppose there are two data, A and B, with values 1, 2 respectively. Perform a +2 transaction operation. A. The transaction begins.   

```
- Record A=1 to undo log. 
- Modify A=3. 
- Record B=2 to undo log. 
- Modify B=4. 
- Write undo log to disk. 
- Write data to disk. 
```


The reason why atomicity and persistence can be guaranteed at the same time is because of the following characteristics:  

- Record Undo log before updating data. 
- In order to ensure durability, data must be written to disk before the transaction is committed. As long as the transaction is successfully submitted, the data must have been persisted. 
- Undo log must be persisted to disk before data. If the system crashes between transaction, the undo log is complete and can be used to roll back the transaction. 


## Redo Log

Redo log is to save the executed SQL statement to a specified Log file. When mysql performs data recovery, you can re-execute the SQL operation recorded by the redo log. The introduction of the buffer pool will cause the updated data to not be persisted to the disk in real time. When the system crashes, although the data in the buffer pool is lost and the data is not persisted, the system can restore all data to the latest according to the content of the Redo Log status. The redo log exists as a separate file on the disk. There will be two files by default, named ib_logfile0 and ib_logfile1.  

The parameter innodb_log_file_size specifies the size of the redo log innodb_log_file_in_group specifies the number of the redo log, and the default is 2; innodb_log_group_home_dir specifies the path where the redo log is located.  

```
innodb_additional_mem_pool_size = 100M
innodb_buffer_pool_size = 128M
innodb_data_home_dir =/home/mysql/local/mysql/var
innodb_data_file_path = ibdata1:1G: autoextend
innodb_file_io_threads = 4
innodb_thread_concurrency = 16
innodb_flush_log_at_trx_commit = 1
innodb_log_buffer_size = 8M
innodb_log_file_size = 128M
innodb_log_file_in_group = 2
innodb_log_group_home_dir =/home/mysql/local/mysql/var
```

In order to satisfy the atomicity of the transaction, before operating any data, first back up the data to Undo Log, and then modify the data. If an error occurs or the user executes the ROLLBACK statement, the system can use the backup in Undo Log to restore the data to the state before the transaction started. Unlike redo log, there is no separate undo log file on the disk, it is stored in a special segment (segment) inside the database, which is called the undo segment, and the undo segment is located in the shared table space.    

The undo log and redo log itself are separate. Innodb's undo log is recorded in the data file (ibd), and innodb regards the content of the undo log as data, so the operation of the undo log itself (such as inserting an undo record into the undo log, etc.) will record redo log. The undo log does not need to be persisted to disk immediately. Even if it is lost, it can be restored through redo log. So when inserting a record:  

- Insert an undo log record into the undo log.
- Insert a redo log record of "insert undo log record" into the redo log.
- Insert data.
- Insert an "insert" redo log record into the redo log.

**Redo log io performance**  

In order to ensure that Redo Log has better IO performance, InnoDB's Redo Log is designed with the following features:  

Try to keep Redo Log stored in a continuous space. Therefore, the log file space is completely allocated when the system is first started. The Redo Log is recorded in sequential addition.  
Write logs in batches. The log is not written directly to the file, but first written to the redo log buffer, and then the data in the buffer is written to the disk every second
Concurrent transactions share the storage space of Redo Log, and their Redo Logs are recorded together alternately according to the execution order of statements to reduce the space occupied by the log.  
Redo Log only performs sequential append operations. When a transaction needs to be rolled back, its Redo Log records will not be deleted from Redo Log.  

Contrary to Undo Log, Redo Log records a backup of new data. Before the transaction is committed, only the Redo Log needs to be persisted, and the data does not need to be persisted. When the system crashes, although the data is not persisted, Redo Log has persisted. The system can restore all data to the latest state according to the content of Redo Log.  

**Simplified process of Undo + Redo transaction**  

```
A. Transaction start. B. Record A=1 to undo log. 
C. Modify A=3. 
D. Record A=3 to redo log. 
E. Record B=2 to undo log. 
F. Modify B=4. 
G . Record B=4 to redo log. 
H. Write redo log to disk. 
I. Transaction commit
```

The AG process is carried out in memory, and the corresponding operations are recorded in redo log buffer (B&E), redo log buffer (E&G), transaction execution results (not submitted at this time) are also stored in db buffer (C&F), and the buffer is full If the number of transactions stored in the buffer is all 1, it means that the log is flushed to the disk immediately, and the data consistency is well guaranteed. If there are multiple storages, the redo log will be synchronized to the disk after a transaction is completed and there will be a status bit to record whether it is committed, then the transaction is actually committed, and the data in the db buffer will be synchronized to the disk of the DB. . To ensure that the contents of the db buffer are written to the disk database file, the contents of the log buffer should be written to the disk log file. This approach can reduce disk IO and increase throughput. However, this method is suitable for scenarios where consistency is not high. Because if there is a system failure such as a power failure, the completed transactions in the log buffer and db buffer have not been synchronized to the disk will be lost. For banks such as banks that require higher transaction consistency, it is necessary to ensure that each transaction is recorded to the disk. If the server is down, go to the redo log to recover and redo the committed transaction.  

**the role of redo & undo log**  

- Data persistence
    - The buffer pool maintains a linked list in the order of dirty page modification, called flush_list. Flush data to persistent storage according to the order of pages in flush_list. The pages are arranged in the order of the earliest modification. Under normal circumstances, when is the dirty page flushed to the disk?  
      - When the redo space is full, part of the dirty page will be flushed to the disk, and then part of the redo log will be released.
      - When you need to allocate a page in the Buffer pool, but it is full, you must flush dirty pages to disk. Generally, this situation can be controlled by the startup parameter innodb_max_dirty_pages_pct. When the dirty page in the buffer pool reaches this ratio, the dirty page is flushed to the disk.
      - When the system is detected to be idle, it will flush.

- Data Recovery
  - Over time, Redo Log will become very large. If you start to recover from the first record every time, the recovery process will be very slow and cannot be tolerated. In order to reduce the recovery time, the Checkpoint mechanism is introduced. Suppose that at a certain point in time, all dirty pages have been flushed to disk. All Redo Logs before this time point do not need to be redone. The system records the end of the redo log at this point in time as the checkpoint. When restoring, just start from this checkpoint position. The log before the checkpoint point is no longer needed and can be deleted.

## Binary Log

The redo log is specific to the InnoDB engine and keeps data safe, but how do other engines log data?  

At the Server level, MySQL has its own log, that is bin-log (an archived log). You must look at MySQL in isolation. MySQL = Server + different data storage engines, not as a whole.  

Binlog records a binary log of all changes to the MySQL database table structure and table data, but not the select and show queries. bin-loglogs are logged as events and include the time consumed by the statements.  

The two most important scenarios for turning on Binlog logging are as follows:  

- Parent-Child replication: enable the Binlog function in the primary library, so that the primary library can pass Binlog to the secondary library, and the secondary library can get Binlog and achieve data recovery to achieve primary-secondary data consistency.
- Data recovery: recover data through tools such as mysqlbinlog.
Bin-log files are logged in three modes: statement, rowand mixed, with row mode usually being used.  

**The difference between bin log and redo log.**  

- The content is different: redo log is a physical log and the content is based on the Page on disk, bin-log content is binary and depending on the binlog_format parameter, may be based on SQL statements, on the data itself, or a mixture of the two.
- Different levels: redo log works with InnoDB and the engine, bin-log is located at the MySQL Server level and is available to all engines.
- Different forms of disk storage: redo log writes cyclically, bin-log accumulates, so it can be used for data recovery or primary-secondary synchronization
- The timing of writing is different: bin-logare written when a transaction usually commits or when N transactions commit once, redo log are written at a variety of times, either every time a transaction commits, by another threaded transaction, or every second when the disk is flushed. (Note: uncommitted transactions in redo log may also be flushed to disk)
- Different roles: redo log is used for crash recovery to ensure that MySQL downtime does not affect persistence; bin-log is used for point-in-time recovery to ensure that the server can recover data based on the point in time, in addition bin-log is also used for primary-secondary replication.

**Two-phase Commit**  
Because redo-logis in the InnoDB tier and bin-logis in the Server tier, this introduces a new problem.  

If the redo log is written successfully and the bin-log crashes before it is written to disk, the transaction has not yet been committed, so the new data written to the redo-log is invalid.  

Restarting the database for data recovery restores the data in the redo-log to disk, which creates invalid data.  

In this case, as you wisely know, a two-phase commit is introduced.  

In the first stage, the redo-log is written and in the prepared state. After the Server layer saves the bin-log data and drops it to disk, the transaction commits the redo-log at the same time, so that the redo-log becomes committed, which ensures the consistency of the redo-log data and the bin-log data.  

**The Execution of an Update Statement**  

With the previous knowledge, you can now explore how the update statement is executed in MySQL.  

Suppose we now execute the SQL : update table_test set a = a+1 where id = 2;  

- First, the client connects via the connector and determines the permissions.
- After verification, the SQL goes through the parser for lexical and syntax analysis (AST) and if it is an Update statement, MySQL will clear all the query cache for the query table table_test. (As you can see, it is not recommended to turn on the query cache)
- The optimizer optimizes the validated SQL, plans to match the id index, and generates an execution plan.
- The executor gets the final SQL and calls the interface of the corresponding storage engine to start executing the update SQL.
- The InnoDB engine opens a transaction, the execution engine first queries from memory whether there is data with id=2, if it matches then the corresponding data with field+1, and then saves it to memory. If it does not query the data with id=2 then it will go to the disk, the query will read the data into memory in pages, then update it and save it to memory.
- The InnoDB engine will then save the data rows to redo-log, which is pre-committed, notifying the Server’s executor that it is ready to commit the transaction.
- The executor will generate the corresponding bin-log and write it to disk.
- The transaction is committed and the redo-log is then committed.
- This is where the execution of a transaction is complete.

# 참고
- [해커의 개발일기, 데이터베이스의 무결성을 보장해주는 Write-Ahead-Log](https://bourbonkk.tistory.com/86){:target="_blank"}
- [alibabacloud, What are the Differences and Functions of the Redo Log, Undo Log, and Binlog in MySQL?](https://www.alibabacloud.com/blog/what-are-the-differences-and-functions-of-the-redo-log-undo-log-and-binlog-in-mysql_598035){:target="_blank"}
- [Coralogix, 5 Essential MySQL Database Logs To Keep an Eye On](https://coralogix.com/blog/5-essential-mysql-database-logs-to-keep-an-eye-on/){:target="_blank"}
- [scaling.dev, Transaction Log. Commit Log. WAL.](https://scaling.dev/replication/log){:target="_blank"}
- [PostgreSQL 공식문서, Write-Ahead Logging (WAL)](https://www.postgresql.org/docs/current/wal-intro.html){:target="_blank"}
- [Dwen, MySQL’s RedoLog and BinLog](https://betterprogramming.pub/mysqls-redolog-and-binlog-1a35bc052489){:target="_blank"}
- [developPAPER, You must understand the three MySQL logs – binlog, redo log and undo log](https://developpaper.com/you-must-understand-the-three-mysql-logs-binlog-redo-log-and-undo-log/){:target="_blank"}
- [MySQL 공식문서, 14.6.6 Redo Log](https://dev.mysql.com/doc/refman/5.7/en/innodb-redo-log.html){:target="_blank"}
- [Katastros, InnoDB transaction log (redo log and undo log) detailed](https://blog.katastros.com/a?ID=01200-5fbbae7f-7eb9-4570-876c-23048d66fb82){:target="_blank"}
- [heesuk-ahn, [데이터베이스] binary log 란?](https://github.com/heesuk-ahn/today-I-learned/blob/master/database/binary-log.md){:target="_blank"}
- [The Binary Log](https://docs.oracle.com/cd/E17952_01/mysql-5.7-en/binary-log.html){:target="_blank"}
- [Log-structured storage](https://jvns.ca/blog/2017/06/11/log-structured-storage/){:target="_blank"}
- [ghyeong, 슬로우 쿼리(Slow Query) 조회 쿼리(Oracle, MS-SQL, Mysql, postgreSQL)](https://dreamcoding.tistory.com/62){:target="_blank"}
- [MySQL 공식문서, The Slow Query Log](https://dev.mysql.com/doc/refman/8.0/en/slow-query-log.html){:target="_blank"}