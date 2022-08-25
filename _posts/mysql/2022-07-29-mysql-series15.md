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

- [Coralogix, 5 Essential MySQL Database Logs To Keep an Eye On](https://coralogix.com/blog/5-essential-mysql-database-logs-to-keep-an-eye-on/){:target="_blank"}

```
- General Query Log
- Slow Query Log
- Error Log
- Binary Log
```

```
mysql> show variables;
```

```
mysql>SET GLOBAL general_log = ‘ON’;
mysql>SET GLOBAL general_log_file = ‘path_on_your_system’;
```

```
mysql>SET GLOBAL slow_query_log = ‘ON’;
mysql>SET GLOBAL slow_query_log_file = ‘path_on_your_system’;
```

# 트랜잭션 처리를 위한 로그

- [Dwen, MySQL’s RedoLog and BinLog](https://betterprogramming.pub/mysqls-redolog-and-binlog-1a35bc052489){:target="_blank"}
- [Katastros, InnoDB transaction log (redo log and undo log) detailed](https://blog.katastros.com/a?ID=01200-5fbbae7f-7eb9-4570-876c-23048d66fb82){:target="_blank"}
- [developPAPER, You must understand the three MySQL logs – binlog, redo log and undo log](https://developpaper.com/you-must-understand-the-three-mysql-logs-binlog-redo-log-and-undo-log/){:target="_blank"}


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