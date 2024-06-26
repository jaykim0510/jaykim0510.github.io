---
layout: post
title:  '[Git] 커밋'
description: 
date:   2022-07-06 15:01:35 +0300
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

# 시작하기 전에

시작하기 전에 한 가지 커밋을 추가하도록 하자.  

![](/images/git_32.png)

현재 yalco 디렉토리의 commit 이력은 다음과 같다.  

![](/images/git_33.png)

# git restore

- Working direcotry 또는 Staging Area에 기록된 변경 사항을 되돌리는 방법

![](/images/git_34.png)

# git reset

- 특정 커밋으로 돌아간다
- soft, mixed, hard 옵션이 있음
- git reset --**soft** "원하는 시점의 커밋ID"
  - 돌아온 시점 이후의 변경사항들이 사라지지 않고 Staging Area에 올라와 있음
    ![](/images/git_35.png)
  - 당연히 Working directory에도 반영되어 있음
  - 돌아온 시점을 반영하고 싶으면 `git restore --staged .`를 쓰면 됨
    ![](/images/git_36.png)
  - 가장 안전한 방법 
- git reset --**mixed** "원하는 시점의 커밋 ID"
  - 돌아온 시점 이후의 변경사항들이 사라지지 않고 Working directory에 올라와 있음
  - 돌아온 시점을 반영하고 싶으면 `git restore .`
- git reset --**hard** "원하는 시점의 커밋 ID"
  - 3가지 영역에서의 상태가 모두 돌아온 시점으로 동기화 되어 있음
  - 가장 과감한 방법
- 돌아왔는데 다시 앞의 커밋으로 돌아가고 싶으면,
  - `git reflog` 통해 앞의 커밋을 나타내는 HEAD${숫자} 또는 커밋id를 확인한다 (빠져나올때는 `q`)
  - `git reset --hard HEAD${숫자} or 커밋id` 를 하면 다시 앞의 커밋으로 돌아오고, 그동안의 커밋도 그대로 tree에 남게된다

# git revert

- 특정 커밋에서 이루어진 작업을 취소하는 커밋을 새로 생성

![](/images/git_37.png)

![](/images/git_38.png)

![](/images/git_39.png)

- 만약 특정 커밋에서 이루어진 작업을 취소까지는 하는데 일단 Staging Area까지만 완성해놓고 커밋은 미루어 두고 싶다면
  - git revert --no-commit "되돌릴 커밋 ID"