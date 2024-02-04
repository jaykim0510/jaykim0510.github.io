---
layout: post
title:  'MySQL Command Series [Part6] DCL: GRANT, REVOKE'
description: 
date:   2021-03-26 15:01:35 +0300
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

# 유저 목록

```sql
USE mysql;
SELECT user FROM user;
```

# 유저 생성하기

```sql
-- 유저명, 호스트, 비밀번호는 따옴표로 감싸줘도 된다
-- 호스트는 보통 localhost 또는 % 또는 IP주소를 사용한다. %는 모든 IP주소를 허용한다는 의미
CREATE USER <유저명>@<호스트> IDENTIFIED BY <비밀번호>
```

# 권한 부여

```sql
-- 모든DB, 모든 테이블은 각각 *(asterisk)로 표현 가능하다
-- *.*: 모든 DB의 모든 테이블에 대해 권한을 준다
GRANT ALL PRIVILEGES ON <DB명>.<테이블명> TO <유저명>@<호스트>
```

# 권한 적용

```sql
-- 권한 적용하기
FLUSH PRIVILEGES
```

# 권한 확인

```sql
SHOW GRANTS FOR <유저명>>@<호스트>
```

# 권한 삭제

```sql
REVOKE ALL PRIVILEGES ON <DB>.<테이블> FROM <유저>@<호스트>
```

# 유저 삭제

```sql
DROP USER <유저>@<호스트>
```

# 현재 서버 사용중인 유저

```sql
SELECT CURRENT_USER()
```


# root 비밀번호 분실시

https://harrydony.tistory.com/873 참고

```
# 안전모드로 데몬 실행 (비밀번호 없이 mysql 접속 가능)
mysqld_safe --skip-grant-tables &
```

```
mysql -u root mysql
```

```
UPDATE user SET authentication_string=null WHERE user='root';
flush privileges;
```

```
exit;
mysql -u root
```

```
ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY '변경할 패스워드';
```

```
ps aux | grep mysql
kill -9 '안전모드로 켜져있는 mysql의 PID'
```


# MySQL 서버 실행

https://velog.io/@taelee/mysql-%EC%84%9C%EB%B2%84-%EC%8B%9C%EC%9E%91-%EB%98%90%EB%8A%94-%EC%9E%AC%EC%8B%9C%EC%9E%91-%ED%95%98%EA%B8%B0MAC

```
MAC

- mysql 서버 시작
    mysql.server start
- mysql 서버 중지
    mysql.server stop
- mysql 서버 재시작
    mysql.server restart
```

```
Linux

- mysql 서버 시작
    service mysql start
    systemctl start mysql.service
- mysql 서버 재시작
    service mysql restart
    systemctl restart mysql.service
```
