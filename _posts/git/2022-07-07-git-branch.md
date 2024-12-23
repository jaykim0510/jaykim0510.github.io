---
layout: post
title:  '[Git] 브랜치'
description: 
date:   2022-07-07 15:01:35 +0300
image:  '/images/git_logo.png'
logo_image: '/images/git_logo.png'
category: devops
tag: git
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Branch

브랜치는 크게 다음과 같은 2가지의 경우에 사용된다

- 브랜치는 기존 브랜치에서 독립적인 작업을 하고 싶을 때 -> 신기능 개발
- 하나의 메인 브랜치를 두고 여러 모습으로 코드를 제공하고 싶을 때 -> 배포용, 테스트용, 개발용

여기서는 신기능 개발과 같은 독립적인 작업을 하고 싶은 상황을 예로 들어 실습해 볼 것이다.  
(그래야 다시 브랜치를 합치는 상황도 예로 만들어 해볼 수 있기 때문에)  

먼저 브랜치와 관련된 기본적인 명령어들을 한 번 짚고 넘어가자.  

# Branch와 관련한 기본 명령어

## 브랜치 생성

```
git branch "생성할 브랜치명"
```

## 브랜치 목록

```
git branch
```

## 브랜치 이동

```
git switch "이동할 브랜치명"
```

## 브랜치 이름 변경

```
git branch -m "기존 브랜치명" "새 브랜치명"
```

## 브랜치 삭제

```
git branch -d "삭제할 브랜치명"

# 만약 다른 브랜치에는 없고, 오직 "삭제할 브랜치"만 가지는 내용의 커밋이 있으면 -d 옵션으로 삭제 안됨 -> Forcing 느낌의 -D 옵션 필요
git branch -D "삭제할 브랜치명"
```

![](/images/git_40.png)

# Branch 만들어보기

- 기존의 main 브랜치
- 각 yaml 파일의 상단 멤버를 coach로 승격한 add-coach 브랜치
- Zebra team을 새로 추가한 new-team 브랜치

![](/images/git_41.png)

# Branch 합치기

![](/images/git_42.png)

## git merge

- 두 브랜치를 하나로 합치는 커밋을 새로 생성
- 브랜치가 많아지면 히스토리가 복잡해짐  
    ![](/images/git_43.png)
- merge는 "기준 브랜치"에서 "대상 브랜치"를 merge 함
  ```
  git switch "기준 브랜치"
  git merge "대상 브랜치"
  ```
- 만약 merge한 "대상 브랜치"가 마음에 안들면 git reset --hard "이전 커밋" 명령어로 돌아가도 됨
- merge를 완료했으면 "대상 브랜치"는 삭제해도 됨

![](/images/git_44.png)

## git rebase 

- 하나의 브랜치를 다른 브랜치 뒤에 이어 붙이는 방법
- 히스토리 내역이 깔끔해짐
- 협업할 때 이미 공유된 커밋들은 rebase 하지 않는 것이 좋음
- rebase는 나 혼자 여러 개 브랜치를 만든 상황에서 하나로 정리할 때 사용하기 좋음
- rebase는 merge와 반대로 "대상 브랜치"로 이동 후, "기준 브랜치"를 rebase 함
  ```
  git switch "대상 브랜치"
  git rebase "기준 브랜치"
  ```
- rebase 하고나면 "대상 브랜치"가 "기준 브랜치" 뒤에 잘 붙음. 근데 "기준 브랜치"가 아직 뒤에 머물러 있음. 앞으로 이동해야함
  ```
  # 왜 merge인지 모르겠지만, 일단 merge를 해야 "기준 브랜치"가 rebase된 커밋까지 이동함
  # 이런 merge를 Fast-forward라고 함
  git switch "기준 브랜치"
  git merge "대상 브랜치"
  ```

![](/images/git_45.png)

# Branch 충돌 해결하기

- **두 사람이 만든 커밋**이 **같은 파일 같은 줄에 서로 다른 내용**을 입력했을 때
- **두 브랜치의 커밋**이 **같은 파일 같은 줄에 서로 다른 내용**을 입력했을 때
- 해결 방법: 처음부터 방지. 그럴 수 없다면 **merge를 한 사람이 직접 수정해야함**

## git merge 도중 충돌이 생긴 경우

![](/images/git_46.png)

![](/images/git_47.png)

## git rebase 도중 충돌이 생긴 경우

위의 예시로 main 브랜치가 변경되었다. 이 부분을 먼저 reset 명령어를 이용해 다시 돌려놓고 rebase 실습을 하겠다.  

![](/images/git_48.png)

이제 rebase로 브랜치를 합쳐보자.  

![](/images/git_49.png)

![](/images/git_50.png)

# HEAD

- 현재 속한 브랜치의 최신 커밋

## git checkout

- HEAD를 이동시킴
- 보통 특정 커밋에서 새로운 브랜치를 분기하고 싶은 경우 사용
- 또한 로컬내의 Remote branch로 이동할 때는 switch가 아닌 checkout 사용
  ```
  git checkout origin/main
  ```
- git checkout을 사용하는 몇 가지 방법
  ```
  git checkout "이동하고 싶은 커밋 ID"
  
  # 현재 HEAD에서 뒤로 이동하고 싶은만큼 ^를 붙인다
  git checkout HEAD^^^

  # ^ 대신 물결표시(~)를 붙여도 된다. 물결표시(~)는 뒤로 이동하고 싶은 칸 수를 숫자로 적을 수 있다
  git checkout HEAD~~~
  git checkout HEAD~3
  ```


![](/images/git_52.png)

- 위 그림을 보면 HEAD를 이동하는 즉시 새로운 브랜치가 생기는 것을 알 수 있음
- 이렇게 하는 이유는 git checkout의 주요 용도인 "새로운 브랜치 분기"의 특성을 최대한 살리기 위함
- 나는 그냥 과거의 코드 내용을 살피기 위한 목적으로 checkout한건데 이럴 때마다 브랜치 생긴다고? 그럼 너무 부담되는데
  - 걱정할 필요 없음 -> 기존에 존재하던 브랜치중 아무데로 이동하는 즉시 임시 브랜치는 사라짐
    ![](/images/git_53.png)

- 새로운 브랜치를 분기해보자

![](/images/git_54.png)