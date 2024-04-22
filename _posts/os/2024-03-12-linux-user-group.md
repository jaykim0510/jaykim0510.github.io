---
layout: post
title:  '[Linux]: 사용자와 그룹'
description: 
date:   2024-03-12 15:01:35 +0300
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

# 사용자와 그룹

- 리눅스는 여러명의 사용자와 그룹을 지원하는 운영체제이다

## 시스템 관리자

- 루트 사용자는 관리자 권한을 가지며 모든 파일에 접근 가능

```sh
# 사용자 추가
sudo adduser
sudo adduser [사용자명]

# 사용자 확인
whoami

# 사용자 변경(=다른 사용자 계정의 쉘 사용)
su - [다른 사용자명]

# 원래 사용자로 돌아오기(=다른 사용자 계정 쉘에서 빠져나오기)
exit

# 사용자 지우기
deluser [사용자명]
sudo deluser [사용자명] --remove-home (홈 디렉토리 함께 제거 -> 깔끔)
```

```sh
# 그룹 생성
sudo addgroup [그룹명]

# 그룹에 사용자 추가
sudo adduser [사용자명] --ingroup [그룹명]
```

# 파일 권한

- 파일의 소유자, 그룹에 따라 유저는 owner, group, others 중 하나에 속하고 해당 범위 만큼의 권한을 가지게 된다

![](/images/os_linux_user_1.png)

![](/images/os_linux_user_2.png)

![](/images/os_linux_user_3.png)


## 파일에 권한 설정하는 방법

- 파일의 권한은 소유자 또는 시스템 관리자가 변경할 수 있다

![](/images/os_linux_user_4.png)


```sh
chmod 664 [파일명]
chmod g+w [파일명] # group에 해당하는 유저들에게 쓰기(w)권한 부여
chmod go+rx [파일명] # group과 ohters에 헤당하는 유저들에게 읽기(r) 실행(x) 권한 부여
```