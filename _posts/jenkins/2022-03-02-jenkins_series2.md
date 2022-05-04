---
layout: post
title:  'Jenkins Series [Part2]: Docker에서 Jenkins 설치하기(Feat.DooD)'
description: 
date:   2022-03-02 15:01:35 +0300
image:  '/images/jenkins_1.png'
logo_image:  '/images/jenkins_logo.png'
categories:   devops
tags: Jenkins
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Jenkins 설치하기  

> Jenkins can be installed through native system packages, Docker, or even run standalone by any machine with a Java Runtime Environment (JRE) installed.


# 도커 컨테이너로 Jenkins 띄우기

도커 이미지를 이용해서 Jenkins를 띄우는 방법은 간단합니다. 사용하다보면 커스터마이징할 필요가 생겨 이미지를 직접 빌드해야 하는 상황이 오겠지만, 아직 저는 Jenkins를 사용해 본 경험이 없기 때문에 단순히 띄우는 데 의의를 두고 이번 포스트를 작성했습니다.  

## 도커 이미지 Pull

우선 도커 허브에서 이미지를 다운받습니다. 저는 arm64 아키텍처를 필요로 하기 때문에 그에 맞는 이미지를 다운 받았습니다.  

![](/images/jenkins_1.png)  

```sh
docker pull jenkins/jenkins:2.332.1-lts-jdk11
```

## Jenkins 컨테이너 실행
```sh
# p: jenkins 웹 UI를 localhost로 접속하기 위해
# u: 내가 사용한 jenkins 이미지 사용자가 root로 안되어 있어 컨테이너 내에서 apt-get update 이런게 안되서 root로 바꿔줌
# v: 나중에 뒤에서 사용할 DooD 패턴을 위해 jenkins 컨테이너와 호스트의 소켓을 마운트해야함  
docker run -p 8080:8080 -u root -v /var/run/docker.sock:/var/run/docker.sock -it jenkins/jenkins:2.332.1-lts-jdk11 /bin/bash
```

```sh
# 웹 브라우저에서 로컬호스트 8080포트로 Jenkins Web UI에 접근
localhost:8080
```

그러면 뭔가 비밀번호 같은거를 입력하라고 뜨는데 이는 컨테이너 로그에 남아있어서 복붙하면 됩니다.  

![](/images/jenkins_3.png)  

```sh
docker logs <컨테이너명>
```

![](/images/jenkins_2.png)  

그러면 플러그인 설치를 어떤 방법으로 할 것인지 묻는데 저는 Jenkins에서 선택해준 것들로 우선 설치하겠습니다.  

![](/images/jenkins_4.png)  

플러그인들을 열심히 설치하고 있습니다. Git이 자주 사용되는지 기본적으로 설치가 되는 모습입니다.  

![](/images/jenkins_5.png)  

설치가 끝나면 계정 설정을 하라고 나오고 간단히 입력하고 나면 Jenkins web UI가 잘 보입니다.  

![](/images/jenkins_6.png)  

# Jenkins 컨테이너에서 도커 CLI가 필요한 순간이 온다

Jenkins는 CI/CD를 위한 기본적인 툴로써 요즘같은 마이크로서비스 패턴이 트렌드인 시대에서 도커는 반드시 필요해 보입니다. 여기서 문제가 있습니다. 저는 방금 Jenkins 서버를 도커 컨테이너로 띄웠는데 컨테이너에서 도커를 또 설치해도 괜찮을까요?  

이렇게 도커 컨테이너 안에 도커를 또 설치하는 패턴을 **Docker in Docker(DinD)**라고 하는데 많은 시니어 개발자들은 이 방식을 권장하지 않는다고 합니다. 다음은 DinD 방식에 대한 장단점을 정리해둔 포스트이니 참고해봐도 좋을 것 같습니다. [(**~jpetazzo/Using Docker-in-Docker for your CI or testing environment? Think twice.** 참고)](http://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/){:target="_blank"}  

![](/images/jenkins_7.png)  

DinD의 단점을 해결하고자 나온 방식이 **Docker out of Docker(DooD)**라고 합니다. 이 방법은 컨테이너에 도커 엔진(도커 클라이언트와 도커 호스트)을 설치하지 않고 도커 클라이언트만 설치하는 방식입니다.  

```sh
# 도커 Client 설치  
# https://docs.docker.com/engine/install/debian/ 데비안 위에서 도커 클라이언트 설치
apt-get update

apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update

apt-get install docker-ce-cli
```

![](/images/jenkins_8.png)  

도커 클라이언트가 잘 설치되었는지 확인하기 위해 `docker ps` 명령어를 실행해봤습니다. 아래의 에러는 위에서 `docker run` 명령어를 실행할 때 v 옵션으로 마운트하지 않은 경우 발생하는 에러입니다.  

```
root@bdab333aab12:/# docker ps
Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
```

위에 설명한 대로 잘 따라오셨다면 아마 다음과 같은 결과가 잘 보일겁니다.  

![](/images/jenkins_9.png)  

여기서 핵심은  

1. 컨테이너 안의 도커 소켓과 호스트의 도커 소켓을 마운트 한다.  

    ```sh
    docker run \
    -v /var/run/docker.sock:/var/run/docker.sock \
    ...
    ```


2. 컨테이너 안의 jenkins 유저에게 호스트의 도커 소켓 실행 권한을 준다.  
   
   ```sh
   # 아직 되는지 확인해보진 않았다
   usermod -u <호스트의사용자아이디> jenkins && \
    groupmod -g <호스트의도커그룹아이디> docker && \
    usermod -aG docker jenkins
   ```


# 참고
- [기억 저장소: DooD (docker-outside-of-docker) 를 통해 Jenkins 컨테이너에서 docker 사용하기](https://bitgadak.tistory.com/3){:target="_blank"} 
- [postlude: Jenkins를 docker 컨테이너로 구축하기(Docker in Docker)](https://postlude.github.io/2020/12/26/docker-in-docker/){:target="_blank"} 
- [아이단은 어디 갔을까: DinD(docker in docker)와 DooD(docker out of docker)](https://aidanbae.github.io/code/docker/dinddood/){:target="_blank"}
- [도커 컨테이너에서 permission denied 해결하는 방법: docker run -u root ...](https://stackoverflow.com/questions/54268180/why-does-simple-dockerfile-give-permission-denied){:target="_blank"}
- [도커 공식문서: 데비안 위에 도커 설치하는 방법](https://docs.docker.com/engine/install/debian/){:target="_blank"}
- [Do we need java for jenkins?](https://www.quora.com/Is-java-mandatory-for-jenkins-installation){:target="_blank"}