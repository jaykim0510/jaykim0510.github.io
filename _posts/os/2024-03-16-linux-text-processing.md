---
layout: post
title:  '[Linux]: 커맨드라인 툴(1) 텍스트 처리'
description: 
date:   2024-03-16 15:01:35 +0300
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

```sh
head [파일명]

head [파일명] -n [보고 싶은 상위 줄 개수]

head [파일명] -n -[밑에서 제외하고 싶은 줄 개수]
```

```sh
tail [파일명]

tail [파일명] -n [보고 싶은 하위 줄 개수]

tail [파일명] -n +[출력을 시작하고 싶은 줄 숫자] # ex. tail /etc/password -n +5 --> 5번 째 줄부터 끝까지 출력

tail [파일명] -f # follow 를 뜻하는 옵션으로, 뒤에 추가되는 내용을 기다렸다가 계속 출력한다

tail [파일명] -F # -f와 비슷하다. 추가되는 점은, 파일이 삭제되었다가 다시 열리는 상황 까지도 기다려준다는 것이다
```

```sh
wc [파일명] # 기본적으로 줄 / 단어 / 바이트 크기를 출력한다

wc [파일명] -l # 줄 수만 출력

wc [파일명] [파일명] # 여러 파일에 대해 조회할 수도 있다

wc *.py # py 파일에 대해 조회한다

wc -l [파일명] | awk '{ print $1 }' # 줄 수 값만 출력
```

```sh
nl [파일명] # 줄 숫자와 파일 내용을 함께 출력 (공백에 대해서는 줄 카운팅 안함)

nl -ba [파일명] # 공백에 대해서도 줄 카운팅 -> 전체 줄 수가 wc가 카운팅한 줄 수와 같아짐
```

```sh
sort [파일명]

sort [파일명] -t [필드 구분자] # 하나의 로우를 여러 필드로 나누고, 특정 필드에 대해 정렬하고 싶을 때 (기본값은 공백문자)

sort [파일명] -t [필드 구분자] -k [키로 사용할 필드 지정]

# cat /etc/password | sort -t : -k 3 -n    
# : 로 구분된 필드중 3번째 이후 모든 컬럼에 대해 numeric 정렬
# 3번째 컬럼에 대해서만 정렬하려면, cat/etc/password | sort -t : -k 3,3

# 3번 째 컬럼에 대해 정렬 후 2번 째 컬럼에 대해 정렬하고 싶으면, cat/etc/password | sort -t : -k 3,3, -k 2,2
```

```sh
uniq [파일명]

uniq [파일명] -d # 중복된 내용만 출력
uniq [파일명] -u # 중복되지 않은 내용만 출력
uniq [파일명] -i # 대소문자 무시

# uniq는 sort 명령문 이후에 많이 쓰는데, 그 이유는 uniq는 연속된 내용에 대해서만 중복 여부 체크한다
# A A B C 이렇게 하면 A가 중복된 거 발견하는데, A B A C 이렇게 하면 A가 중복됐다고 판단 안함 -> 정렬(sort) 먼저 많이 함


sort [파일명] | uniq -u
```

```sh
cut [파일명] -d [구분자] -f [잘라낼 컬럼]

# ex. cut /etc/password -d ':' -f 1,7
```

```sh
tr [파일명] [치환될 원래 문자] [치환 문자]

tr [파일명] -d [삭제할 문자]
```

```sh
# 줄단위 작업
# ex. 특정 범위의 줄 출력/삭제, 특정 패턴에 매칭되는 줄 출력/삭제

cat [파일명] | sed -n "1,3p" # 출력된 파일의 첫 번째 ~ 세 번째 줄 출력

# -n 옵션은 앞의 파이프라인의 출력문을 출력하지 않도록 함

cat [파일명] | sed "1,3d" # cat 에서의 출력문 한 줄식 출력하다가 범위 내의 줄들은 삭제

cat [파일명] | sed -n "/game/p" # game 과 일치하는 줄만 출력

cat [파일명] | sed "s/root/ROOT/" # 각 줄에서 첫 root 부분 ROOT로 변경

cat [파일명] | sed "s/root/ROOT/g" # 각 줄에서 모든 root 부분 ROOT로 변경

cat [파일명] | sed -n "/game/,10p" # game 매칭된 줄 부터 ~ 열 번째 줄 까지 출력

cat [파일명] | sed -n "/game/,+3p" # game 매칭된 줄 부터 ~ 뒤에 세 줄 출력
```

```sh
awk '[script]' [파일명]

awk '{ print }' /etc/password # 그냥 모두 출력

awk -F : '{ print $1 }' /etc/password # 각 줄의 첫 번째 필드만 출력

awk -F : '{ print NR "===>" $1 }' /etc/password

# 주요 내장 변수
# $1: 첫 번째 필드
# NR: 줄 수
# NF: 필드 수
# FS: 필드 구분자


```