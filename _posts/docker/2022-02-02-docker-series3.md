---
layout: post
title:  'Docker Series [Part3]: Dockerfile COPY VOLUME WORKDIR'
description: CMD 명령어의 가장 큰 목적은 컨테이너가 실행될 때 디폴트 명령어, 또는 인자값을 주고 싶은 경우입니다.
date:   2022-02-02 15:01:35 +0300
image:  '/images/docker_logo.png'
categories: devops
tags: Docker
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---
**Dockerfile instruction**


- [x] COPY
- [x] VOLUME
- [x] WORKDIR


# WORKDIR

WORKDIR 명령은 Docker 파일에서 이어지는 모든 RUN, CMD, ENTRIPOINT, COPY 및 ADD 명령에 대한 **작업 디렉토리를 설정**합니다. WORKDIR이 존재하지 않으면 이후 Dockerfile 명령어에 사용되지 않더라도 생성됩니다.

WORKDIR 명령은 Docker 파일에서 여러 번 사용할 수 있습니다. 상대 경로가 제공되는 경우 이전 WORKDIR 명령의 경로에 상대적입니다. 예를 들어 다음 명령어의 결과는 `/a/b/c`입니다.  

```dockerfile
WORKDIR /a
WORKDIR b
WORKDIR c
RUN pwd
```  

또한 ENV를 이용해 Dockerfile에서 명시한 환경 변수의 경우 WORKDIR 명령어에서 해석할 수 있습니다. 아래 예를 보면 DIRPATH는 Dockerfile에서 정의를 했기 때문에 `/path`로 인식되고, DIRNAME은 해석되지 않아 `/path/$DIRNAME`과 같은 결과가 나옵니다. 

```dockerfile
ENV DIRPATH=/path
WORKDIR $DIRPATH/$DIRNAME
RUN pwd
```

# VOLUME  

VOLUME 명령은 **지정된 이름으로 마운트 지점을 생성하고 네이티브 호스트 또는 다른 컨테이너와 마운트**됩니다.  

docker run 명령어를 실행하면 기본 이미지 내의 디렉토리 중 명시된 디렉토리에 있는 파일들로 마운트된 디렉토리를 초기화합니다. 

VOLUME 명령어로 볼륨을 생성한 뒤 이후의 빌드과정에서 생기는 볼륨의 변경값은 모두 무시됩니다.  

**호스트 디렉터리는 컨테이너를 생성하거나 실행할 때 지정해야 합니다**.  호스트 디렉토리(마운트 지점)는 본질적으로 호스트에 종속됩니다. 이는 지정된 호스트 디렉토리를 모든 호스트에서 사용할 수 있다고 보장할 수 없기 때문에 이미지 이식성을 유지하기 위한 것입니다. 따라서 도커 파일 내에서 호스트 디렉토리를 마운트할 수 없습니다.    

# COPY

The COPY instruction copies new files or directories from <src> and adds them to the filesystem of the container at the path <dest>.   

The <dest> is an absolute path, or a path relative to WORKDIR, into which the source will be copied inside the destination container.  

```dockerfile
# t로 시작하는 모든 txt파일을 <WORKDIR>/relativeDir/ 로 복사한다
COPY t*.txt relativeDir/
```

```dockerfile
# test.txt, teso.txt, tesi.txt과 같은 파일을 /absoluteDir/ 로 복사한다
COPY tes?.txt /absoluteDir/
```

# 참고

- [Docker 공식문서](https://docs.docker.com/engine/reference/builder/#cmd){:target="_blank"}  
