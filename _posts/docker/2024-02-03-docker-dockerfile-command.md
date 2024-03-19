---
layout: post
title:  '[Docker] Dockerfile(2) RUN CMD ENTRYPOINT'
description: 도커 이미지를 만드는 방법에 대해 배운다
date:   2024-02-03 15:01:35 +0300
image:  '/images/docker_logo.png'
logo_image:  '/images/docker_logo.png'
category: devops
tag: docker
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---



# shell form exec form

`RUN`, `CMD`, 그리고 `ENTRYPOINT` 인스트럭션은 두 가지 작성법이 있다

- **exec form**: `INSTRUCTION ["executable","param1","param2"]`
- **shell form**: `INSTRUCTION command param1 param2`

- The shell form automatically uses a command shell, whereas the exec form does not.

## exec form

- 안의 값들은 반드시 쌍따옴표로 감싸줘야 한다
<!-- - exec form은 `ENTRYPOINT` 인스트럭션에 `CMD` 인스트럭션의 디폴트 인자를 설정하기에 가장 적합한 형태이다 -->
- shell processing이 안 일어나기 때문에 $HOME 과 같은 변수의 치환이 발생하지 않는다. 필요하면 쉘을 직접 표기해야 한다 (`[ "sh", "-c", "echo $HOME" ]`)

## shell form

- shell form은 자동으로 커맨드 쉘(`/bin/sh -c`)을 적용한다
- 백슬래쉬(╲)로 하나의 인스트럭션을 여러 줄에 걸쳐 쓸 수 있다

```dockerfile
RUN source $HOME/.bashrc && ╲
echo $HOME

# They're equivalent to the following line:

RUN source $HOME/.bashrc && echo $HOME
```

- SHELL 인스트럭션으로 기본 쉘을 바꿀 수 있다

```
SHELL ["/bin/bash", "-c"]
RUN echo hello
```

# RUN

```dockerfile
RUN apt-get update
RUN apt-get install -y curl
```

- `RUN` 인스트럭션은 빌드 단계에 실행할 명령어를 정의한다
- `RUN` 인스트럭션은 새로운 레이어를 만든다
- shell form이 주로 사용된다
- 주로 패키지 설치, 빌드 명령어 등에 사용된다
- Dockerfile에서 처음 빌드될 때 실행된 `RUN` 인스트럭션은 캐시되었다가 다음 빌드 때 사용된다. 캐시를 무효화 시키려면 `docker build --no-cache` 이런 식으로 `--no-cache` 플래그를 써줘야 한다


# CMD

- `CMD` 인스트럭션은 컨테이너가 실행될 때 실행할 명령어를 정의한다
- `CMD` 인스트럭션은 Dockerfile에 하나만 있을 수 있다
- `CMD`의 주목적은 실행중인 컨테이너에 디폴트를 제공하기 위함이다
- 컨테이너가 생성될 때 실행된다 (stop되었다가 start될 때는 실행되지 않는다)
- 디폴트에는 실행 가능한 것도 포함될 수도 있고, 생략한다면 `ENTRYPOINT` 인스트럭션에 반드시 포함시켜야 한다
- `CMD`의 디폴트는 `docker run`에 의해 덮어씌어질 수도 있다
- `CMD`가 `ENTRYPOINT`에 디폴트를 제공하기 위한 용도로 사용된다면 둘 다 exec form으로 작성해야 한다



# ENTRYPOINT

- 컨테이너가 실행될 때마다 실행된다 (stop되었다가 start 될 때마다 실행된다)
- exec form이 선호된다 (shell form 쓰면 ₩ 인스트럭션이 사용되지 않는다)
- `ENTRYPOINT` 인스트럭션은 `CMD`나 `docker run`과 다르게 덮어씌어지지 않는다


# 정리

- 빌드 타임에만 필요한 명령어는 RUN 인스트럭션에 shell form으로 정의한다
- 메인 프로세스와 같은 컨테이너가 실행될 때마다 같이 실행되어야할 명령어는 ENTRYPOINT에 exec form으로 정의한다
- 디폴트로 전달하고 싶은 인자는 CMD에 exec form으로 정의한다