---
layout: post
title:  '[Network] 네트워크 용어(5): ssh'
description: 
date:   2022-07-17 15:01:35 +0300
image:  '/images/network_logo.png'
logo_image: '/images/network_logo.png'
category: CS
tag: network
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}
---

- ssh 설치
  - `apt update`
  - `apt install openssh-server` (양쪽 다 서버로 설치하면 됨)
- 접속을 시도할 클라이언트에서 개인키/공용키를 만든다
  - 클라이언트: `ssh-keygen -t rsa`
- 만약 접속할 서버의 종류가 점점 늘어난다면 config 파일로 관리하는 것도 좋은 방법이다
  - 클라이언트: `vim ~/.ssh/config`
    ```
    Host spark-worker1 (ssh 명령어 뒤에 붙일 호스트 ex. ssh spark-worker1)
        HostName worker1 (실제 호스트명)
        IdentityFile ~/.ssh/id_rsa (내가 가지고 있는 개인키)
    ```
- 이제 서버에 .ssh 폴더를 만들고 그 안에 authorized_keys 라는 파일에 공용키를 복사해 붙여넣는다
  - 접속할 서버: `mkdir ~/.ssh`
  - 접속할 서버: `vim authorized_keys`
  - 접속할 서버: 클라이언트의 `~/.ssh/id_rsa.pub` (공용키) 복사해 붙여넣는다
- 이제 클라이언트에서 `ssh <호스트>` 또는 `ssh <호스트명>:<포트번호>` 로 접속되면 성공
- 에러가 나면 일단 양쪽 다 `.ssh` 폴더는 700, `authorized_keys` 는 600 권한을 맞춰준다
- 만약 ssh: `connect to host 192.168.0.6 port 22: Connection refused` 에러가 뜬다면 서버의 22번 포트를 열어줘야 한다
  - 접속할 서버: `/etc/ssh/sshd_config` 파일에서 Port 22 앞에 #을 제거한다
  - 접속할 서버: `netstat -ntl` 로 22번 포트 LISTEN 중인지 확인 (설치는 `apt update` 후 `apt install net-tools`)
  - 접속할 서버: `/etc/init.d/ssh restart` 로 ssh 재시작
- 만약 패스워드를 물어본다면 서버의 PubkeyAuthentication 설정을 바꿔줘야 한다
  - 접속할 서버: `/etc/ssh/sshd_config` 파일에서 `PubkeyAuthentication yes`를 추가해 준다
  - 접속할 서버: `/etc/init.d/ssh restart` 로 ssh 재시작


# 참고

- [TAEWAN.KIM ssh config 설정 방법](http://taewan.kim/post/ssh_config/)
- [JAMES YOON, sh 공개키 인증시 Permission denied (publickey,password) 오류 해결](https://butteryoon.github.io/tools/2021/01/12/ssh_publickey.html)
- [IBM Support, Configuring an SSH login without password](https://www.ibm.com/support/pages/configuring-ssh-login-without-password)