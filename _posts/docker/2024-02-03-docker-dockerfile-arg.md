---
layout: post
title:  '[Docker] Dockerfile(1) FROM LABEL ARG ENV'
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

# 도커 이미지 만들기

- 도커 이미지는 우리가 원하는 애플리케이션을 실행하는데 필요한 변수, 명령어, 파일 등이 정의되어 있는 프로그램과 같다
- 도커 컨테이너는 도커 이미지가 실행된 프로세스와 같다

![](/images/docker_4.png){: width="70%"}

# Dockerfile

- 도커 이미지는 Dockerfile 이라는 파일로 만들 수 있다
- Dockerfile에 도커 이미지를 만들기 위한 인스트럭션을 작성한 후, `docker build` 명령어를 이용하면 도커 이미지가 만들어진다
- 도커 인스트럭션 목록은 아래와 같다

|**Instruction**|	**Description**|
|**ADD**|	Add local or remote files and directories.|
|**ARG**|	Use build-time variables.|
|**CMD**|	Specify default commands.|
|**COPY**|	Copy files and directories.|
|**ENTRYPOINT**|	Specify default executable.|
|**ENV**|	Set environment variables.|
|**EXPOSE**|	Describe which ports your application is listening on.|
|**FROM**|	Create a new build stage from a base image.|
|**HEALTHCHECK**|	Check a container's health on startup.|
|**LABEL**|	Add metadata to an image.|
|**ONBUILD**|	Specify instructions for when the image is used in a build.|
|**RUN**|	Execute build commands.|
|**SHELL**|	Set the default shell of an image.|
|**STOPSIGNAL**|	Specify the system call signal for exiting a container.|
|**USER**|	Set user and group ID.|
|**VOLUME**|	Create volume mounts.|
|**WORKDIR**|	Change working directory.|


# FROM

```dockerfile
FROM [--platform=<platform>] <image>[:<tag>] [AS <name>]
```

- `FROM`은 빌드를 위한 stage를 초기화하고 이후의 인스트럭션을 위한 기본 이미지를 설정한다
- 그렇기 때문에 유효한 Dockerfile은 반드시 `FROM` 명령어로부터 시작해야 한다
- `AS` 뒤에 이름을 설정함으로써 이후 나오는 `FROM` 인스트럭션이 만드는 stage에 `COPY --from=<name>` 인스트럭션을 통해 데이터를 전달할 수 있다
- 이 때 각각의 `FROM`은 이전 인스트럭션이 만든 상태를 없앤다

```dockerfile
FROM <image> AS apple
...

FROM <image2>
...
# <image>의 빌드 결과로 생성된 파일 중 원하는 파일만 복사
COPY --from=apple /dir/you/want/from/apple /dir/of/image2
```


- `FROM` 앞에 올 수 있는 유일한 인스트럭션은 `ARG`로, `ARG`는 이미지 빌드 시간동안 사용될 임시 변수를 저장할 수 있다

```dockerfile
ARG  CODE_VERSION=latest
FROM base:${CODE_VERSION}
CMD  /code/run-app
```

# LABEL

```dockerfile
LABEL <key>=<value> <key>=<value> <key>=<value> ...
```

- `LABEL` 인스트럭션은 이미지에 메타데이터를 추가하기 위해 사용된다

```dockerfile
LABEL "com.example.vendor"="ACME Incorporated" ╲
com.example.label-with-value="foo" ╲
version="1.0" 
```

# ARG

```dockerfile
ARG <name>[=<default value>]
```

- 이미지 빌드 단계에서 사용될 변수를 정의한다

```dockerfile
ARG author=kim
```

- `docker build --build-arg author=lee` 이런식으로 빌드 명령어에서 덮어쓸 수도 있다
- `ENV` 인스트럭션에서 같은 이름의 변수를 정의하면, `ENV`가 덮어쓰게 된다

# ENV  

```dockerfile
ENV <key>=<value> ...
```

- 환경변수를 정의한다
- 지정한 환경변수는 빌드 단계와 컨테이너 실행 단계에서 사용 가능한 변수다 


```dockerfile
ENV MY_NAME="John Doe"
ENV MY_CAT=fluffy
```