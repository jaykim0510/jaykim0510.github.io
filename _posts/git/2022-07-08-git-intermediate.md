---
layout: post
title:  '[Git] 중급'
description: 
date:   2023-01-13 15:01:35 +0300
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

# git add -p
- 파일 한 개 내에서도 라인별로 커밋할지 안할지 결정하고 싶을 때
- (기존 git add는 파일별로 커밋여부를 결정했다면 -p 옵션은 더 세분화해서 라인별로 가능하다는 말)

# git commit --amend
- 마지막 커밋에 코드를 수정하거나 메시지를 변경하고 싶을 때
- 

# stash

# cherry-pick

# rebase --onto
- B라는 브랜치에서 분기된 C 브랜치를 A 브랜치에 rebase하고 싶은 경우
- rebase --onto "브랜치 A" "브랜치 B" "브랜치 C"

# 깃은 어렵다

## 원격이란 존재에 브랜치까지 더해지니 엄청 헷갈림
- 나의 로컬에 있는 브랜치는 다른 사람들에게 안보임
- 나의 로컬에 있는 브랜치를 원격 브랜치와 연결해 푸시하면 다른 사람들에게 원격에 있는 브랜치는 보임

## 만약 로컬에서 커밋하지 않은 작업 내용이 있는 상황에서 원격을 pull 하라는 요청이 들어온다면?

- 작업 내용을 로컬에 저장만 하고, 커밋은 안한 상황이다. 이 때 위에서 현재 원격 코드를 pull하라는 요청이 들어왔다
- 이 상태에서 pull을 하면 내 로컬의 최근 커밋 + 원격의 최근 커밋간의 병합이 일어날 것이고, 
- 내가 저장만 한 작업 내용들은? 이럴때 stash를 쓰면 되겠지?
- 내 작업 내용들이 사라지진 않지만 pull 중에 에러가 난다고 한다


# 참고

- [Happy Git and GitHub for the useR, Pull, but you have local work](https://happygitwithr.com/pull-tricky.html){:target="_blank"}