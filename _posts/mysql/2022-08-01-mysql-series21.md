---
layout: post
title:  'MySQL Series [Part21] DDL: CREATE, ALTER, RENAME, DROP, TRUNCATE'
description: 
date:   2022-08-01 15:01:35 +0300
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

# 데이터베이스 생성

```sql
# 데이터베이스 생성
CREATE DATABASE <DB이름>
CREATE DATABASE IF NOT EXISTS <DB이름>

# 데이터베이스 지정
USE <DB이름>

# 데이터베이스 삭제
DROP DATABASE <DB이름>
```

# 테이블 정보 확인

```sql
DESCRIBE <테이블명>
SHOW CREATE TABLE <테이블명>
```

# 테이블 생성

공식문서에서 \[table_options]와 \[partition_options] 부분만 제외하고 (create_definition)만 가지고 와봤다. 공식문서는 아래 참고란에 주석을 달아놓았다. 대략적인 공식문서를 해석하는 방법은 다음과 같다.  

- (): 반드시 필요한 설정
- []: optional한 설정
- {}: \| 기호와 함께 사용되어 {A\|B\|C}인 경우 A 또는 B또는 C중 하나를 반드시 선택해야 한다는 의미

<details>
<summary>공식문서 참고</summary>
<div markdown="1">       

```sql
CREATE [TEMPORARY] TABLE [IF NOT EXISTS] tbl_name
    (create_definition,...)
    [table_options]
    [partition_options]

CREATE [TEMPORARY] TABLE [IF NOT EXISTS] tbl_name
    [(create_definition,...)]
    [table_options]
    [partition_options]
    [IGNORE | REPLACE]
    [AS] query_expression

CREATE [TEMPORARY] TABLE [IF NOT EXISTS] tbl_name
    { LIKE old_tbl_name | (LIKE old_tbl_name) }

create_definition: {
    col_name column_definition
  | {INDEX | KEY} [index_name] [index_type] (key_part,...)
      [index_option] ...
  | {FULLTEXT | SPATIAL} [INDEX | KEY] [index_name] (key_part,...)
      [index_option] ...
  | [CONSTRAINT [symbol]] PRIMARY KEY
      [index_type] (key_part,...)
      [index_option] ...
  | [CONSTRAINT [symbol]] UNIQUE [INDEX | KEY]
      [index_name] [index_type] (key_part,...)
      [index_option] ...
  | [CONSTRAINT [symbol]] FOREIGN KEY
      [index_name] (col_name,...)
      reference_definition
  | check_constraint_definition
}

column_definition: {
    data_type [NOT NULL | NULL] [DEFAULT {literal | (expr)} ]
      [VISIBLE | INVISIBLE]
      [AUTO_INCREMENT] [UNIQUE [KEY]] [[PRIMARY] KEY]
      [COMMENT 'string']
      [COLLATE collation_name]
      [COLUMN_FORMAT {FIXED | DYNAMIC | DEFAULT}]
      [ENGINE_ATTRIBUTE [=] 'string']
      [SECONDARY_ENGINE_ATTRIBUTE [=] 'string']
      [STORAGE {DISK | MEMORY}]
      [reference_definition]
      [check_constraint_definition]
  | data_type
      [COLLATE collation_name]
      [GENERATED ALWAYS] AS (expr)
      [VIRTUAL | STORED] [NOT NULL | NULL]
      [VISIBLE | INVISIBLE]
      [UNIQUE [KEY]] [[PRIMARY] KEY]
      [COMMENT 'string']
      [reference_definition]
      [check_constraint_definition]
}

data_type:
    (see Chapter 11, Data Types)

key_part: {col_name [(length)] | (expr)} [ASC | DESC]

index_type:
    USING {BTREE | HASH}

index_option: {
    KEY_BLOCK_SIZE [=] value
  | index_type
  | WITH PARSER parser_name
  | COMMENT 'string'
  | {VISIBLE | INVISIBLE}
  |ENGINE_ATTRIBUTE [=] 'string'
  |SECONDARY_ENGINE_ATTRIBUTE [=] 'string'
}

check_constraint_definition:
    [CONSTRAINT [symbol]] CHECK (expr) [[NOT] ENFORCED]

reference_definition:
    REFERENCES tbl_name (key_part,...)
      [MATCH FULL | MATCH PARTIAL | MATCH SIMPLE]
      [ON DELETE reference_option]
      [ON UPDATE reference_option]

reference_option:
    RESTRICT | CASCADE | SET NULL | NO ACTION | SET DEFAULT
```

</div>
</details>  


내가 생각했을 때 자주 사용할만한 문법들을 종합했을 때 다음과 같다.  

```sql
CREATE TABLE [IF NOT EXISTS] <테이블명> (
    <컬럼명> <컬럼타입> [UNSIGNED] [NOT NULL] [DEFAULT <디폴트값>] [AUTO_INCREMENT] [COMMENT <코멘트>],
    ...
    [PRIMARY KEY <(프라이머리 키 컬럼명)>,]
    [FOREIGN KEY <(외래 키 컬럼명)> REFERENCES <부모테이블> <(부모 컬럼명)> [ON DELETE <DELETE 정책>] [ON UPDATE <UPDATE 정책>],]
)
```

하지만 보통 테이블 생성을 위해 처음부터 이렇게 스키마를 다 정해서 만들기는 힘들고, 이렇게 꼭 할 필요도 없다.  

왜냐하면 뒤에서 배울 ALTER라는 것이 새로운 컬럼을 추가하거나, 외래키를 설정하거나 하는 모든 추가적인 적용을 가능하게 하기 때문이다.  

또한 기존 테이블의 테이블 구조로 새로운 테이블을 만들 수도 있다.  

```sql
CREATE TABLE <테이블명> LIKE <기존 테이블명>
```

기존 테이블 구조에 데이터까지 가져와 새로운 테이블로 만들 수도 있다.  
(인덱스는 복사 안됨. 그래서 프라이머리 키, 외래키와 같은 설정은 다시 직접 해줘야함)  

```sql
CREATE TABLE <테이블명> AS SELECT * FROM <기존 테이블명>
```

# 테이블 설정 추가

## 컬럼 추가, 이름 변경  

```sql
ALTER TABLE <테이블 이름> 
        ADD <추가할 컬럼> CHAR(10) NULL;
```

```sql
  ALTER TABLE <테이블 이름>
RENAME COLUMN <원래 컬럼명> TO <바꿀 컬럼명>;
```

## 컬럼 삭제

```sql
ALTER TABLE <테이블 이름>
DROP COLUMN <삭제할 컬럼명>;
```

## 컬럼 타입 변경  

```sql
ALTER TABLE <테이블 이름>
     MODIFY <변경할 컬럼명> INT;
```  

## 컬럼 속성 변경  

```sql
# NOT NULL 속성
ALTER TABLE <테이블 이름>
     MODIFY <변경할 컬럼명> INT NOT NULL;

# DEFAULT 속성
ALTER TABLE <테이블 이름>
     MODIFY <변경할 컬럼명> INT NOT NULL DEFAULT <주고 싶은 default값>;

# DATETIME, TIMESTAMP 타입에 줄 수 있는 특별한 속성
# DEFAULT CURRENT_TIMESTAMP: 값 입력 안되면 default로 현재 시간 입력
ALTER TABLE <테이블 이름>
     MODIFY <변경할 컬럼명> DATETIME DEFAULT CURRENT_TIMESTAMP;

# 처음 default로 현재 시간 넣어주고, 데이터 갱신될 때 마다 갱신된 시간 넣어줌  
ALTER TABLE <테이블 이름>
     MODIFY <변경할 컬럼명> DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

# UNIQUE 속성
# UNIQUE는 PRIMARY KEY와 다르게 NULL 허용
ALTER TABLE <테이블 이름>
     MODIFY <변경할 컬럼명> INT UNIQUE;
```  

## 테이블에 제약 사항 걸기  

```sql
   ALTER TABLE <테이블 이름>
ADD CONSTRAINT <제약 사항 네이밍> CHECK <제약 사항(ex. age < 100)>;
```  

## 테이블의 제약 사항 삭제

```sql
    ALTER TABLE <테이블 이름>
DROP CONSTRAINT <제약 사항 이름>;
```

## 컬럼 순서 앞으로 당기기  

```sql
ALTER TABLE <테이블 이름>
     MODIFY <컬럼명> INT FIRST;
```

## 컬럼 순서 정하기

```sql
ALTER TABLE <테이블 이름>
     MODIFY <뒤에 올 컬럼명] INT AFTER <앞에 있는 컬럼명>;
```  

## 컬럼명 속성 동시에 바꾸기

```sql
 ALTER TALBE <테이블 이름>
CHANGE <원래 컬럼명> <바꿀 컬럼명> VARCHAR(10) NOT NULL;
```  

## 외래키 설정
외래키(Foreign Key)란 한 테이블의 컬럼 중에서 **다른 테이블의 특정 컬럼을 식별할 수 있는 컬럼**을 말합니다. 그리고 외래키에 의해 참조당하는 테이블을 **부모 테이블(parent table)**, **참조당하는 테이블(referenced table)**이라고 합니다. 외래키를 이용하면 **테이블간의 참조 무결성**을 지킬 수 있습니다. 참조 무결성이란 아래 그림과 같이 두 테이블 간에 참조 관계가 있을 때 각 데이터 간에 유지되어야 하는 정확성과 일관성을 의미합니다.  

예를 들어, 강의 평가인 review 테이블에는 '컴퓨터 개론'에 관한 평가 데이터가 남아있지만, 강의 목록을 나타내는 course 테이블에는 '컴퓨터 개론' 과목이 삭제된다면 이상한 상황이 벌어질 것입니다. 이 때 외래키를 통해 지정해 놓으면 이런 상황을 해결할 수 있습니다. 

![](/images/sql_2.png)  

```sql
   ALTER TABLE <테이블 이름>
ADD CONSTRAINT <제약 사항 네이밍>
   FOREIGN KEY (자식테이블의 컬럼)
    REFERENCES 부모테이블 (부모테이블의 컬럼)
     ON DELETE <DELETE정책>
     ON UPDATE <UPDATE정책>;
```  

## 외래키 정책
- **RESTRICT**: 자식 테이블에서 삭제/갱신해야만 부모 테이블에서도 삭제/갱신 가능
- **CASCADE**: 부모 테이블의 데이터 삭제/갱신하면 관련 자식 테이블 데이터도 같이 삭제/갱신
- **SET NULL**: 부모 테이블의 데이터 삭제/갱신하면 관련 자식 테이블 데이터의 컬럼에 NULL 지정  

## 외래키 삭제

```sql
     ALTER TABLE <테이블 이름>
DROP FOREIGN KEY <제약 사항이 걸린 테이블>;
```

## 외래키 파악

```sql
SELECT
          i.TABLE_SCHEMA, i.TABLE_NAME, i.CONSTRAINT_TYPE, i.CONSTRAINT_NAME,
          k.REFERENCED_TABLE_NAME, k.REFERENCED_COLUMN_NAME
     FROM information_schema.TABLE_CONSTRAINTS i
LEFT JOIN information_schema.KEY_COLUMN_USAGE k
    USING (CONSTRAINT_NAME)
    WHERE i.CONSTRAINT_TYPE = 'FOREIGN KEY';
```


# 참고

- [MySQL 공식문서13.1.20 CREATE TABLE Statement](https://dev.mysql.com/doc/refman/8.0/en/create-table.html){:target="_blank"}