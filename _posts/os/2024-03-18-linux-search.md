---
layout: post
title:  '[Linux]: 커맨드라인 툴(2) 검색'
description: 
date:   2024-03-18 15:01:35 +0300
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
# 파일 찾는데 사용할 수 있는 옵션

find [최상위 경로] -name [파일명]

find [최상위 경로] -regex [정규표현식] # 정규표현식에 매치되는 파일들

find [최상위 경로] -empty # 빈 파일 또는 빈 디렉터리

find [최상위 경로] -type d # d: 디렉터리, f: 파일, l: 소프트링크, s: 소켓

# [최상위 경로] 에 . 과 같은 상대 경로 형태로 입력하면 출력도 상대 경로 형태
# [최상위 경로] 에 `pwd` 과 같은 절대 경로 형태로 입력하면 출력도 절대 경로 형태로 나온다


# 찾았을 때 할 수 있는 행동

find [최상위 경로] -name [파일명] # 디폴트는 -print

find [최상위 경로] -name [파일명] -exec [실행할 명령어] {} \; # {}에 찾은 파일명이 차례로 하나씩 들어간다. 항상 끝에는 \; 붙여준다

# ex. find . -name '*.py' -exec stat {} \;

find [최상위 경로] -name [파일명] -execdir [실행할 명령어] {} \; # -exec 와 비슷하다. 차이점은 -execdir은 해당 파일이 있는 위치로 이동해서 명령어를 실행한다

find [최상위 경로] -name [파일명] -ok [실행할 명령어] {} \; # -exec와 비슷하다. 차이점은 실행 전에 물어본다 ok?

# ex. find . -name '*.py' -exec rm -f {} \;
```





```sh


grep [찾고 싶은 문자열] [파일명] # 파일 내용중 찾는 문자열을 포함한 줄을 출력한다

# grep "shm_open" *.c --> c 파일에서 shm_open 문자열이 포함된 부분 출력


grep [찾고 싶은 문자열] [파일명] -i # 대소문자 무시한다

grep [찾고 싶은 문자열] [파일명] -v # 매치되는 줄을 출력하는게 아니고, 오히려 제외하고 나머지 부분을 출력한다 (invert match)

# [찾고 싶은 문자열] 과 정확히 매치되는 줄만 출력하고 싶은 경우 \<[찾고 싶은 문자열]\>
# grep "\<for\>" *.c 이렇게 하면 for ~ 는 출력하지만, fork, ford 같은 단어를 포함한 줄은 출력하지 않는다
```