---
layout: post
title:  '[Git] 깃허브'
description: 
date:   2022-07-08 15:01:35 +0300
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

# Github

- 깃허브는 깃을 통해 생성한 파일의 여러 버전들을 **원격 저장소에 저장하도록 해주는 웹 서비스**입니다.
- 깃허브를 이용하면 **버전관리 뿐만 아니라 전세계 개발자들과 함께 코드를 공유하며 협업**할 수 있게 됩니다.  

![](/images/git_51.png)

- 깃허브의 중요한 특징 중 하나는 누구든 자신의 커밋을 깃허브에 반영(push)하기 위해서는 먼저, 깃허브의 최신 상태를 자신의 로컬 컴퓨터에 먼저 반영(pull) 해야 한다. 이 과정에서 충돌이 발생할 가능성이 높으며 충돌이 발생한 곳을 잘 병합해야 한다.

# Personal Access Token

# 원격 저장소(Remote Repository) 생성

# 로컬과 원격 저장소 연동을 위한 세팅

- 로컬의 깃으로 관리되는 디렉토리를 원격 저장소와 연결
  ```
  git remote add origin "원격 저장소 주소"
  ```
  - origin은 원격 저장소를 지칭하는 이름. 다른 것으로 해도 되지만 origin이 암묵적 규칙
- 현재 로컬 브랜치를 원격의 브랜치와 연결
  ```
  git push -u origin "원격 저장소 브랜치"

  # 현재 로컬에서 나의 브랜치가 main인 경우
  # origin의 main 브랜치와 연결하겠다
  git push -u origin main
  ```
  - 이렇게 한 번 연결하고 나면 다음부터는 그냥 `git push`하면 됨
- 현재 나의 로컬은 어느 리모트 저장소와 연결되어 있나
  ```
  git remote
  ```

# 원격 저장소를 이용해 협업하기

## git pull

![](/images/git_55.png)

## git push

![](/images/git_56.png)

# 실습

