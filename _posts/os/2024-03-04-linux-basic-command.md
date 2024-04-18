---
layout: post
title:  '[Linux]: 리눅스 쉘 필수 명령어'
description: 
date:   2024-03-04 15:01:35 +0300
image:  '/images/linux_logo.png'
logo_image:  '/images/linux_logo.png'
category: CS
tag: OS
related_tags: [Linux]
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}
---

# 파일∙디렉터리 관련 명령어


## 디렉터리

### 현재 작업 디렉터리

```sh
pwd
```

![](/images/os_linux_basic_1.png)

### 디렉터리 생성

```sh
mkdir [생성할 디렉터리 이름]
```

### 디렉터리 내에 있는 목록 조회

```sh
ls
ls -al
```

![](/images/os_linux_basic_2.png)

![](/images/os_linux_basic_3.png)

### 디렉터리 삭제

```sh
rm -rf [삭제할 디렉터리 이름]
```

![](/images/os_linux_basic_4.png)

### 디렉터리 이동

```sh
cd [디렉터리 이름]

cd .. # 상위 디렉터리로 이동

cd - # 이전 디렉터리로 이동
```

![](/images/os_linux_basic_5.png)

![](/images/os_linux_basic_6.png)

![](/images/os_linux_basic_7.png)

## 파일

### 파일 생성

```sh
touch [생성할 파일의 이름] # 파일 생성 (이미 존재하면 실행하지 않음)

echo [원하는 문자열] > [생성할 파일의 이름] # 문자열 내용을 담은 파일 생성 (이미 존재하면 덮어씀)

echo [원하는 문자열] >> [생성할 파일의 이름] # 문자열 내용을 담은 파일 생성 (이미 존재하면 뒤에 내용 덧붙임)
```

![](/images/os_linux_basic_8.png)

![](/images/os_linux_basic_9.png)

![](/images/os_linux_basic_10.png)

### 파일 삭제

```sh
rm [삭제하고 싶은 파일의 이름]
```

![](/images/os_linux_basic_11.png)

### 파일 내용 출력

```sh
cat [파일명]

head [파일명]

tail [파일명]
```

![](/images/os_linux_basic_12.png)

### 파일 복사

```sh
cp [복사하고 싶은 파일의 이름] [새로 만들 파일의 이름]
```

![](/images/os_linux_basic_13.png)

### 파일 이동 (잘라내기)

```sh
mv [이동시키고 싶은 파일의 이름] [이동할 디렉터리] # 같은 이름의 파일이 있으면 덮어씀

mv [이동시키고 싶은 파일의 이름] [이동할 디렉터리]/[새로운 파일 이름] # 이동시키면서 파일명을 바꿀 수도 있음. 그래서 그냥 파일명 바꾸는 용도로 사용하기도 함
```

![](/images/os_linux_basic_14.png)

![](/images/os_linux_basic_15.png)

### 파일 이름 변경

```sh
mv [파일명] [새로운 파일명]
```

![](/images/os_linux_basic_16.png)

### 파일 편집

```sh
echo [문자열] >> [편집할 파일의 이름] # 간단하게 문자열을 기존 파일의 내용 뒤에 추가만 하고 싶은 경우

cat >> [편집할 파일의 이름] # 표준입력으로 파일에 내용 추가. 종료는 Ctrl + D

nano [편집할 파일의 이름] # nano 에디터를 통한 파일 편집 (nano는 리눅스 기본 에디터)
vim [편집할 파일의 이름] # vim 에디터를 통한 파일 편집 (vim 에디터는 설치해야함) (vim 에디터는 따로 다룰 예정)
```

### 파일 내용에서 원하는 문자열 찾기

```sh
grep [찾고 싶은 문자열] [파일명]

cat [파일명] | grep [찾고 싶은 문자열]
```

![](/images/os_linux_basic_17.png)

![](/images/os_linux_basic_18.png)

### 파일 찾기


```sh
find . # 현재 디렉터리와 모든 하위 디렉터리에 있는 디렉터리/파일명 출력

find [탐색할 최상위 경로] -name [파일명] # 하위 경로에 대해서도 모두 탐색함

find [탐색할 최상위 경로] -name [파일명] -depth [깊이]
```

![](/images/os_linux_basic_19.png)

![](/images/os_linux_basic_20.png)

## 압축 관련 명령어

### 파일 압축

```sh
gzip [파일명]
```

![](/images/os_linux_basic_21.png)

### 압축 풀기

```sh
gzip -d [파일명].gz

gunzip [파일명].gz
```

![](/images/os_linux_basic_26.png)

### 파일 묶기

```sh
tar -cvf [파일명].tar [묶고 싶은 파일/디렉터리]

tar -cvf [파일명].tar [묶고 싶은 파일/디렉터리] [묶고 싶은 파일/디렉터리] # 여러 개 나열해도됨
```

![](/images/os_linux_basic_22.png)


### 파일 풀기

```sh
tar -xvf [파일명].tar
```

![](/images/os_linux_basic_23.png)

### 파일 묶어서 압축하기

```sh
tar -zcvf [파일명].tar.gz [묶어서 압축하고 싶은 파일/디렉터리]
```

![](/images/os_linux_basic_24.png)

### 묶여서 압축된 파일 풀기

```sh
tar -zxvf [파일명].tar.gz
```

```
# tar 관련 옵션
-c : tar 로 묶는다
-x : tar 를 푼다
-z : gzip 압축/푸는 경우
-v : 진행 상황을 자세히 본다
-f : 압축을 풀 파일을 지정한다
-C : 압축을 풀 위치를 지정한다
```

![](/images/os_linux_basic_25.png)

## 패키지 매니저 관련 명령어

### Debian 계열 (Ubuntu)

```sh
apt install [설치할 패키지명]
apt remove [삭제할 패키지명]

apt update # 패키지들 업데이트

apt list --installed # 설치된 패키지 목록
```