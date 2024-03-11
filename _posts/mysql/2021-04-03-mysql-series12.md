---
layout: post
title:  '[MySQL] 내장 함수 모음'
description: 
date:   2021-04-03 15:01:35 +0300
image:  '/images/mysql_logo.png'
logo_image: '/images/mysql_logo.png'
category: data_engineering
tag: mysql
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 샘플 데이터

```
+----+------------+-----------+----------------------------+------+--------+------------+--------------------------------+-----------------------+---------------+---------------------+
| id | first_name | last_name | email                      | age  | gender | state      | street_address                 | city                  | country       | created_at          |
+----+------------+-----------+----------------------------+------+--------+------------+--------------------------------+-----------------------+---------------+---------------------+
|  1 | Justin     | Lee       | justinlee@example.org      |   48 | M      | Cataluña   | 856 Morgan Highway Apt. 238    | Sant Adrià de Besòs   | Spain         | 2019-02-10 04:40:00 |
|  2 | Jennifer   | Garcia    | jennifergarcia@example.net |   28 | F      | Chongqing  | 96683 Cunningham Ports Apt. 20 | Putian                | China         | 2022-06-22 00:41:00 |
|  3 | Renee      | Ramirez   | reneeramirez@example.net   |   15 | F      | Bahia      | 5102 Melanie Turnpike          | Campo Formoso         | Brasil        | 2020-08-24 06:12:00 |
|  4 | Brent      | Webster   | brentwebster@example.com   |   57 | M      | Arizona    | 9041 Kirby Lights Apt. 193     | Phoenix               | United States | 2022-08-21 14:42:00 |
|  5 | Mark       | Bradley   | markbradley@example.com    |   30 | M      | São Paulo  | 3700 Tiffany Radial            | Jardinópolis          | Brasil        | 2019-12-18 12:20:00 |
+----+------------+-----------+----------------------------+------+--------+------------+--------------------------------+-----------------------+---------------+---------------------+
```


# 문자열 함수

```sql
-- CHAR_LENGTH: Returns the length of a string (in characters)

SELECT last_name, CHAR_LENGTH(last_name) AS length
FROM ecommerce.USER
LIMIT 5;
------------------------------------------------------
+-----------+------------------------+
| last_name | CHAR_LENGTH(last_name) |
+-----------+------------------------+
| Lee       |                      3 |
| Garcia    |                      6 |
| Ramirez   |                      7 |
| Webster   |                      7 |
| Bradley   |                      7 |
+-----------+------------------------+
```

```sql
-- CONCAT: Adds two or more expressions together

SELECT CONCAT(state, city, country) AS address
FROM ecommerce.USER
LIMIT 5
------------------------------------------------------
+-------------------------------------+
| address                             |
+-------------------------------------+
| CataluñaSant Adrià de BesòsSpain    |
| ChongqingPutianChina                |
| BahiaCampo FormosoBrasil            |
| ArizonaPhoenixUnited States         |
| São PauloJardinópolisBrasil         |
+-------------------------------------+

SELECT CONCAT(state, ", ", city, ", ", country) AS address 
FROM ecommerce.USER 
LIMIT 5;
------------------------------------------------------
+-----------------------------------------+
| address                                 |
+-----------------------------------------+
| Cataluña, Sant Adrià de Besòs, Spain    |
| Chongqing, Putian, China                |
| Bahia, Campo Formoso, Brasil            |
| Arizona, Phoenix, United States         |
| São Paulo, Jardinópolis, Brasil         |
+-----------------------------------------+
```

```sql
-- CONCAT_WS: Adds two or more expressions together with a separator

SELECT CONCAT_WS(" + ", state, city, country) AS address 
FROM ecommerce.USER 
LIMIT 5;
------------------------------------------------------
+-------------------------------------------+
| address                                   |
+-------------------------------------------+
| Cataluña + Sant Adrià de Besòs + Spain    |
| Chongqing + Putian + China                |
| Bahia + Campo Formoso + Brasil            |
| Arizona + Phoenix + United States         |
| São Paulo + Jardinópolis + Brasil         |
+-------------------------------------------+
```


```sql
-- FORMAT: ,와 . 으로 숫자를 보기좋게 포맷팅 (뒤에 숫자는 반올림하고자 하는 소수점 자리)

SELECT FORMAT(250500.5664, 2);
------------------------------------------
+------------------------+
| FORMAT(250500.5664, 2) |
+------------------------+
| 250,500.57             |
+------------------------+
```

```sql
-- INSERT: 특정 위치에 있는 문자열 대신 다른 문자열을 삽입

SELECT INSERT("Apple.com", 1, 5, "Samsung");
------------------------------------------
+--------------------------------------+
| INSERT("Apple.com", 1, 5, "Samsung") |
+--------------------------------------+
| Samsung.com                          |
+--------------------------------------+
```

```sql
-- INSTR: 특정 문자열을 찾아 첫 번째로 발견된 곳의 위치를 리턴한다

SELECT INSTR("Apple", "p");
------------------------------------------
+---------------------+
| INSTR("Apple", "p") |
+---------------------+
|                   2 |
+---------------------+
```

```sql
-- LCASE: 문자열 전체를 소문자로 변환한다
-- LOWER: LCASE와 같다

SELECT LCASE("SQL Tutorial is FUN!");
------------------------------------------
+-------------------------------+
| LCASE("SQL Tutorial is FUN!") |
+-------------------------------+
| sql tutorial is fun!          |
+-------------------------------+
```

```sql
-- LEFT: 왼쪽 문자열 일부를 추출한다

SELECT LEFT("SQL Tutorial", 3) AS ExtractString;
------------------------------------------
+---------------+
| ExtractString |
+---------------+
| SQL           |
+---------------+
```

```sql
-- LENGTH: Returns the length of a string (in bytes)
-- LENGTH 함수는 문자의 BYTE 길이를 가져오기 때문에 한글 같은 문자는 정확한 길이를 할 수 없는데 이 때 사용하는 것이 CHAR_LENGTH 함수이다
SELECT LENGTH("SQL Tutorial") AS LengthOfString;
------------------------------------------
+----------------+
| LengthOfString |
+----------------+
|             12 |
+----------------+
```

```sql
-- LOCATE: Returns the position of the first occurrence of a substring in a string

SELECT LOCATE("3S", "W3Schools.com") AS MatchPosition;
------------------------------------------
+---------------+
| MatchPosition |
+---------------+
|             2 |
+---------------+

SELECT LOCATE("3a", "W3Schools.com") AS MatchPosition;
------------------------------------------
+---------------+
| MatchPosition |
+---------------+
|             0 |
+---------------+
```

```sql
-- LPAD
SELECT LPAD("SQL Tutorial", 20, "abc");
------------------------------------------
+---------------------------------+
| LPAD("SQL Tutorial", 20, "abc") |
+---------------------------------+
| abcabcabSQL Tutorial            |
+---------------------------------+
```

```sql
-- LTRIM

SELECT LTRIM("     SQL Tutorial") AS LeftTrimmedString;
------------------------------------------
+-------------------+
| LeftTrimmedString |
+-------------------+
| SQL Tutorial      |
+-------------------+
```

```sql
-- REPEAT

SELECT REPEAT("ABC ", 3);
------------------------------------------
+-------------------+
| REPEAT("ABC ", 3) |
+-------------------+
| ABC ABC ABC       |
+-------------------+
```

```sql
-- REPLACE

SELECT REPLACE("Apple in Apple", "Apple", "Samsung");
------------------------------------------
+-----------------------------------------------+
| REPLACE("Apple in Apple", "Apple", "Samsung") |
+-----------------------------------------------+
| Samsung in Samsung                            |
+-----------------------------------------------+
```

```sql
-- REVERSE

SELECT REVERSE("SQL Tutorial");
------------------------------------------
+-------------------------+
| REVERSE("SQL Tutorial") |
+-------------------------+
| lairotuT LQS            |
+-------------------------+
```

```sql
-- RIGHT

SELECT RIGHT("SQL Tutorial is cool", 4) AS ExtractString;
------------------------------------------
+---------------+
| ExtractString |
+---------------+
| cool          |
+---------------+
```

```sql
-- RPAD

SELECT RPAD("SQL Tutorial", 20, "+++");
------------------------------------------
+---------------------------------+
| RPAD("SQL Tutorial", 20, "+++") |
+---------------------------------+
| SQL Tutorial++++++++            |
+---------------------------------+
```

```sql
-- RTRIM

SELECT RTRIM("SQL Tutorial     ") AS RightTrimmedString;
------------------------------------------
+--------------------+
| RightTrimmedString |
+--------------------+
| SQL Tutorial       |
+--------------------+
```

```sql
-- SUBSTR, SUBSTRING

SELECT SUBSTR("SQL Tutorial", 5, 3) AS ExtractString;
------------------------------------------
+---------------+
| ExtractString |
+---------------+
| Tut           |
+---------------+
```

```sql
-- SUBSTRING_INDEX

SELECT SUBSTRING_INDEX("www.naver.com", ".", 1);
+------------------------------------------+
| SUBSTRING_INDEX("www.naver.com", ".", 1) |
+------------------------------------------+
| www                                      |
+------------------------------------------+

SELECT SUBSTRING_INDEX("www.naver.com", ".", 2);
+------------------------------------------+
| SUBSTRING_INDEX("www.naver.com", ".", 1) |
+------------------------------------------+
| www.naver                                |
+------------------------------------------+

SELECT SUBSTRING_INDEX("www.naver.com", ".", 3);
+------------------------------------------+
| SUBSTRING_INDEX("www.naver.com", ".", 3) |
+------------------------------------------+
| www.naver.com                            |
+------------------------------------------+
```

```sql
-- TRIM

SELECT TRIM('    SQL Tutorial    ') AS TrimmedString;
------------------------------------------
+---------------+
| TrimmedString |
+---------------+
| SQL Tutorial  |
+---------------+
```

```sql
-- UCASE, UPPER

SELECT UCASE("SQL Tutorial is FUN!");
------------------------------------------
+-------------------------------+
| UCASE("SQL Tutorial is FUN!") |
+-------------------------------+
| SQL TUTORIAL IS FUN!          |
+-------------------------------+
```



# 날짜 함수

```sql
-- ADDDATE(date, INTERVAL value addunit), DATE_ADD(date, INTERVAL value addunit)
-- (addunit: MICROSECOND, SECOND, MINUTE, HOUR, DAY, WEEK, MONTH, QUARTER, YEAR 등)
-- or ADDDATE(date, days)

SELECT ADDDATE("2017-06-15", INTERVAL 10 DAY);
-----------------------------------------------
+----------------------------------------+
| ADDDATE("2017-06-15", INTERVAL 10 DAY) |
+----------------------------------------+
| 2017-06-25                             |
+----------------------------------------+

SELECT ADDDATE("2017-06-15 09:34:21", INTERVAL -3 HOUR);
----------------------------------------------------------
+--------------------------------------------------+
| ADDDATE("2017-06-15 09:34:21", INTERVAL -3 HOUR) |
+--------------------------------------------------+
| 2017-06-15 06:34:21                              |
+--------------------------------------------------+
```


```sql
-- CURDATE, CURRENT_DATE

SELECT CURDATE();
------------------------------------------
+------------+
| CURDATE()  |
+------------+
| 2023-01-06 |
+------------+
```


```sql
-- CURRENT_TIMESTAMP, SYSDATE, NOW

SELECT CURRENT_TIMESTAMP();
------------------------------------------
+---------------------+
| CURRENT_TIMESTAMP() |
+---------------------+
| 2023-01-06 05:38:06 |
+---------------------+

SELECT CURRENT_TIMESTAMP() + 1;
------------------------------------------
+-------------------------+
| CURRENT_TIMESTAMP() + 1 |
+-------------------------+
|          20230106061229 |
+-------------------------+
```


```sql
-- DATE

SELECT DATE(CURRENT_TIMESTAMP());
------------------------------------------
+---------------------------+
| DATE(CURRENT_TIMESTAMP()) |
+---------------------------+
| 2023-01-06                |
+---------------------------+
```


```sql
-- DATEDIFF

SELECT DATEDIFF("2017-06-25", "2017-06-15");
------------------------------------------
+--------------------------------------+
| DATEDIFF("2017-06-25", "2017-06-15") |
+--------------------------------------+
|                                   10 |
+--------------------------------------+
```


```sql
-- DATE_FORMAT

SELECT DATE_FORMAT("2017-06-15", "%Y %y");
------------------------------------------
+------------------------------------+
| DATE_FORMAT("2017-06-15", "%Y %y") |
+------------------------------------+
| 2017 17                            |
+------------------------------------+

SELECT DATE_FORMAT("2017-06-15", "%D %d");
+------------------------------------+
| DATE_FORMAT("2017-06-15", "%D %d") |
+------------------------------------+
| 15th 15                            |
+------------------------------------+

SELECT DATE_FORMAT("2017-06-15", "%H %h");
+------------------------------------+
| DATE_FORMAT("2017-06-15", "%H %h") |
+------------------------------------+
| 00 12                              |
+------------------------------------+

SELECT DATE_FORMAT("2017-06-15", "%M %m");
+------------------------------------+
| DATE_FORMAT("2017-06-15", "%M %m") |
+------------------------------------+
| June 06                            |
+------------------------------------+

SELECT DATE_FORMAT("2017-06-15", "%i");
+---------------------------------+
| DATE_FORMAT("2017-06-15", "%i") |
+---------------------------------+
| 00                              |
+---------------------------------+

SELECT DATE_FORMAT("2017-06-15", "%j");
+---------------------------------+
| DATE_FORMAT("2017-06-15", "%j") |
+---------------------------------+
| 166                             |
+---------------------------------+

SELECT DATE_FORMAT("2017-06-15", "%S %s");
+------------------------------------+
| DATE_FORMAT("2017-06-15", "%S %s") |
+------------------------------------+
| 00 00                              |
+------------------------------------+

SELECT DATE_FORMAT("2017-06-15", "%T");
+---------------------------------+
| DATE_FORMAT("2017-06-15", "%T") |
+---------------------------------+
| 00:00:00                        |
+---------------------------------+

SELECT DATE_FORMAT("2017-06-15", "%a %b %c");
+---------------------------------------+
| DATE_FORMAT("2017-06-15", "%a %b %c") |
+---------------------------------------+
| Thu Jun 6                             |
+---------------------------------------+
```

|Format|Description|
|------|-----------|
|%a|Abbreviated weekday name (Sun to Sat)|
|%b|Abbreviated month name (Jan to Dec)|
|%c|Numeric month name (0 to 12)|
|%D|Day of the month as a numeric value, followed by suffix (1st, 2nd, 3rd, ...)|
|%d|Day of the month as a numeric value (01 to 31)|
|%e|Day of the month as a numeric value (0 to 31)|
|%f|Microseconds (000000 to 999999)|
|%H|Hour (00 to 23)|
|%h|Hour (00 to 12)|
|%I|Hour (00 to 12)|
|%i|Minutes (00 to 59)|
|%j|Day of the year (001 to 366)|
|%k|Hour (0 to 23)|
|%l|Hour (1 to 12)|
|%M|Month name in full (January to December)|
|%m|Month name as a numeric value (00 to 12)|
|%p|AM or PM|
|%r|Time in 12 hour AM or PM format (hh:mm:ss AM/PM)|
|%S|Seconds (00 to 59)|
|%s|Seconds (00 to 59)|
|%T|Time in 24 hour format (hh:mm:ss)|
|%U|Week where Sunday is the first day of the week (00 to 53)|
|%u|Week where Monday is the first day of the week (00 to 53)|
|%V|Week where Sunday is the first day of the week (01 to 53). Used with %X|
|%v|Week where Monday is the first day of the week (01 to 53). Used with %x|
|%W|Weekday name in full (Sunday to Saturday)|
|%w|Day of the week where Sunday=0 and Saturday=6|
|%X|Year for the week where Sunday is the first day of the week. Used with %V|
|%x|Year for the week where Monday is the first day of the week. Used with %v|
|%Y|Year as a numeric, 4-digit value|
|%y|Year as a numeric, 2-digit value|




```sql
-- DAYOFMONTH, DAY
-- DAYOFWEEK
-- DAYOFYEAR, YEAR
-- SECOND, MINUTE, HOUR, MONTH
SELECT DAYOFMONTH("2017-06-15");
------------------------------------------
+--------------------------+
| DAYOFMONTH("2017-06-15") |
+--------------------------+
|                       15 |
+--------------------------+
```


# 수학 함수


```sql
-- COS

SELECT COS(3.141592)
------------------------------
+---------------------+
| COS(3.141592)       |
+---------------------+
| -0.9999999999997864 |
+---------------------+
```



```sql
-- CEIL, CEILING
-- FLOOR
-- ROUND
-- TRUNCATE


SELECT CEIL(25.75);
------------------------------
+-------------+
| CEIL(25.75) |
+-------------+
|          26 |
+-------------+


SELECT ROUND(135.375, 2);
------------------------------
+-------------------+
| ROUND(135.375, 2) |
+-------------------+
|            135.38 |
+-------------------+


SELECT FLOOR(25.75);
------------------------------
+--------------+
| FLOOR(25.75) |
+--------------+
|           25 |
+--------------+


SELECT TRUNCATE(135.375, 2);
------------------------------
+----------------------+
| TRUNCATE(135.375, 2) |
+----------------------+
|               135.37 |
+----------------------+

SELECT TRUNCATE(135.375, 1);
------------------------------
+----------------------+
| TRUNCATE(135.375, 1) |
+----------------------+
|                135.3 |
+----------------------+

SELECT TRUNCATE(135.375, 0);
------------------------------
+----------------------+
| TRUNCATE(135.375, 0) |
+----------------------+
|                  135 |
+----------------------+

SELECT TRUNCATE(135.375, -1);
------------------------------
+-----------------------+
| TRUNCATE(135.375, -1) |
+-----------------------+
|                   130 |
+-----------------------+
```


```sql
-- GREATEST
-- LEAST

SELECT GREATEST(3, 12, 34, 8, 25);
------------------------------
+----------------------------+
| GREATEST(3, 12, 34, 8, 25) |
+----------------------------+
|                         34 |
+----------------------------+

SELECT LEAST(3, 12, 34, 8, 25);
------------------------------
+-------------------------+
| LEAST(3, 12, 34, 8, 25) |
+-------------------------+
|                       3 |
+-------------------------+
```


```sql
-- COUNT
-- MAX
-- MIN
-- SUM
-- AVG


SELECT COUNT(id) 
FROM ecommerce.USER 
WHERE country="Spain";
------------------------------
+-----------+
| COUNT(id) |
+-----------+
|      3941 |
+-----------+


SELECT MAX(age) FROM ecommerce.USER;
------------------------------
+----------+
| MAX(age) |
+----------+
|       70 |
+----------+


SELECT MIN(age) FROM ecommerce.USER;
------------------------------
+----------+
| MIN(age) |
+----------+
|       12 |
+----------+


SELECT SUM(age) FROM ecommerce.USER;
------------------------------
+----------+
| SUM(age) |
+----------+
|  4103528 |
+----------+


SELECT AVG(age) FROM ecommerce.USER
------------------------------
+----------+
| AVG(age) |
+----------+
|  41.0353 |
+----------+
```


```sql
-- MOD: Return the remainder
-- POW, POWER

SELECT MOD(18, 4);
------------------------------
+------------+
| MOD(18, 4) |
+------------+
|          2 |
+------------+


SELECT POW(4, 2);
------------------------------
+-----------+
| POW(4, 2) |
+-----------+
|        16 |
+-----------+
```




```sql
-- SIGN: 양수면 1, 음수면 -1, 0이면 0
-- ABS
-- SQRT

SELECT SIGN(255.5);
------------------------------
+-------------+
| SIGN(255.5) |
+-------------+
|           1 |
+-------------+


SELECT ABS(-243.5);
------------------------------
+-------------+
| ABS(-243.5) |
+-------------+
|       243.5 |
+-------------+


SELECT SQRT(64);
------------------------------
+----------+
| SQRT(64) |
+----------+
|        8 |
+----------+
```


```sql
-- RAND: 0 <= x < 1 의 랜덤 값

SELECT RAND();
------------------------------
+---------------------+
| RAND()              |
+---------------------+
| 0.10379043789933476 |
+---------------------+
```


# 참고

- [MySQL 공식문서, 12.1 Built-In Function and Operator Reference](https://dev.mysql.com/doc/refman/8.0/en/built-in-function-reference.html){:target="_blank"}
- [W3School, MySQL Functions](https://www.w3schools.com/mysql/mysql_ref_functions.asp){:target="_blank"}
- [](){:target="_blank"}