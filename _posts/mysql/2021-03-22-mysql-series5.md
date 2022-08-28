---
layout: post
title:  'MySQL Series [Part5] 데이터 관리(2): 테이블 설정을 통해 데이터 관리하기'
description: 
date:   2021-03-22 15:01:35 +0300
image:  '/images/sql_2.png'
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

이번 포스트에서는 테이블을 처음 구축할 때 필요한 설정을 하기 위한 SQL문에 대해 배워보겠습니다. 

# 테이블 다루기  

## 테이블의 컬럼 구조 확인하기  

```
DESCRIBE [테이블 이름]
```  

## 컬럼 추가, 이름 변경  

```
ALTER TABLE [테이블 이름] 
ADD [추가할 컬럼] CHAR(10) NULL;
```

```
ALTER TABLE [테이블 이름]
RENAME COLUMN [원래 컬럼명] TO [바꿀 컬럼명];
```

## 컬럼 삭제

```
ALTER TABLE [테이블 이름]
DROP COLUMN [삭제할 컬럼명];
```

## 컬럼 타입 변경  

```
ALTER TABLE [테이블 이름]
MODIFY [변경할 컬럼명] INT;
```  

## 컬럼 속성 변경  

```
# NOT NULL 속성
ALTER TABLE [테이블 이름]
MODIFY [변경할 컬럼명] INT NOT NULL;

# DEFAULT 속성
ALTER TABLE [테이블 이름]
MODIFY [변경할 컬럼명] INT NOT NULL DEFAULT [주고 싶은 default값];

# DATETIME, TIMESTAMP 타입에 줄 수 있는 특별한 속성
# DEFAULT CURRENT_TIMESTAMP: 값 입력 안되면 default로 현재 시간 입력
ALTER TABLE [테이블 이름]
MODIFY [변경할 컬럼명] DATETIME DEFAULT CURRENT_TIMESTAMP;

# 처음 default로 현재 시간 넣어주고, 데이터 갱신될 때 마다 갱신된 시간 넣어줌  
ALTER TABLE [테이블 이름]
MODIFY [변경할 컬럼명] DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

# UNIQUE 속성
# UNIQUE는 PRIMARY KEY와 다르게 NULL 허용
ALTER TABLE [테이블 이름]
MODIFY [변경할 컬럼명] INT UNIQUE;
```  

## 테이블에 제약 사항 걸기  

```
ALTER TABLE [테이블 이름]
ADD CONSTRAINT [제약 사항 네이밍] CHECK [제약 사항(ex. age < 100)];
```  

## 테이블의 제약 사항 삭제

```
ALTER TABLE [테이블 이름]
DROP CONSTRAINT [제약 사항 이름];
```

## 컬럼 순서 앞으로 당기기  

```
ALTER TABLE [테이블 이름]
MODIFY [컬럼명] INT FIRST;
```

## 컬럼 순서 정하기

```
ALTER TABLE [테이블 이름]
MODIFY [뒤에 올 컬럼명] INT AFTER [앞에 있는 컬럼명];
```  

## 컬럼명 속성 동시에 바꾸기

```
ALTER TALBE [테이블 이름]
CHANGE [원래 컬럼명] [바꿀 컬럼명] VARCHAR(10) NOT NULL;
```  

## 테이블 복제하기

```
CREATE TABLE [복제한 테이블의 이름]
AS SELECT * FROM [원본 테이블의 이름]
```

## 테이블 뼈대만 복제하기

```
CREATE TABLE [복제한 테이블의 이름]
LIKE [원본 테이블의 이름]
```  

# 외래키 설정하기  

외래키(Foreign Key)란 한 테이블의 컬럼 중에서 **다른 테이블의 특정 컬럼을 식별할 수 있는 컬럼**을 말합니다. 그리고 외래키에 의해 참조당하는 테이블을 **부모 테이블(parent table)**, **참조당하는 테이블(referenced table)**이라고 합니다. 외래키를 이용하면 **테이블간의 참조 무결성**을 지킬 수 있습니다. 참조 무결성이란 아래 그림과 같이 두 테이블 간에 참조 관계가 있을 때 각 데이터 간에 유지되어야 하는 정확성과 일관성을 의미합니다.  

예를 들어, 강의 평가인 review 테이블에는 '컴퓨터 개론'에 관한 평가 데이터가 남아있지만, 강의 목록을 나타내는 course 테이블에는 '컴퓨터 개론' 과목이 삭제된다면 이상한 상황이 벌어질 것입니다. 이 때 외래키를 통해 지정해 놓으면 이런 상황을 해결할 수 있습니다. 

![](/images/sql_2.png)  

이렇게 외래키는 두 개 이상의 테이블에서 중요한 역할을 하기 때문에 외래키 속성을 어떻게 설정하는지는 굉장히 중요한 문제입니다.  

## 외래키 설정

```
ALTER TABLE [테이블 이름]
ADD CONSTRAINT [제약 사항 네이밍]
    FOREIGN KEY (자식테이블의 컬럼)
    REFERENCES 부모테이블 (부모테이블의 컬럼)
    ON DELETE [DELETE정책]
    ON UPDATE [UPDATE정책];
```  

## 외래키 정책
- **RESTRICT**: 자식 테이블에서 삭제/갱신해야만 부모 테이블에서도 삭제/갱신 가능
- **CASCADE**: 부모 테이블의 데이터 삭제/갱신하면 관련 자식 테이블 데이터도 같이 삭제/갱신
- **SET NULL**: 부모 테이블의 데이터 삭제/갱신하면 관련 자식 테이블 데이터의 컬럼에 NULL 지정  

## 외래키 삭제

```
ALTER TABLE [테이블 이름]
DROP FOREIGN KEY [제약 사항이 걸린 테이블];
```

## 외래키 파악

```
SELECT
    i.TABLE_SCHEMA, i.TABLE_NAME, i.CONSTRAINT_TYPE, i.CONSTRAINT_NAME,
    k.REFERENCED_TABLE_NAME, k.REFERENCED_COLUMN_NAME
FROM information_schema.TABLE_CONSTRAINTS i
LEFT JOIN information_schema.KEY_COLUMN_USAGE k
USING(CONSTRAINT_NAME)
WHERE i.CONSTRAINT_TYPE = 'FOREIGN KEY';
```