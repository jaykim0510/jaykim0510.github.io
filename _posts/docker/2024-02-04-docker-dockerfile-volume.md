---
layout: post
title:  '[Docker] Dockerfile(3) COPY ADD VOLUME WORKDIR'
description: 도커 이미지를 만드는 방법에 대해 배운다
date:   2024-02-04 15:01:35 +0300
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

- [x] COPY: 로컬에 있는 파일을 컨테이너로 복사
- [ ] ADD: 로컬에 있는 파일의 압축을 풀고 컨테이너로 복사
- [x] VOLUME: 볼륨 마운트 (거의 안씀)
- [x] WORKDIR: 명령어를 실행할 작업 디렉터리 지정 (디렉터리 없으면 생성)


# WORKDIR

- `WORKDIR` 인스트럭션은 Docker 파일에서 이어지는 모든 `RUN`, `CMD`, `ENTRIPOINT`, `COPY` 및 `ADD` 인스트럭션에 대한 **작업 디렉토리를 설정**한다
- `WORKDIR`을 명시하지 않은 경우, 베이스 이미지의 `WORKDIR`을 이어받는다. 베이스 이미지에도 없으면 디폴트로 루트 경로(`/`)가 된다
- 명시한 경로가 없으면 경로에 필요한 디렉터리를 만든다

- `WORKDIR` 명령은 Docker 파일에서 여러 번 사용할 수 있다
- 상대 경로가 제공되는 경우 이전 `WORKDIR` 명령의 경로에 상대적이다. 예를 들어 다음 `RUN` 인스트럭션의 작업 디렉토리는 `/a/b/c`이다 

```dockerfile
WORKDIR /a
WORKDIR b
WORKDIR c
RUN pwd
```  

- 또한 `ENV`를 이용해 Dockerfile에서 명시한 환경 변수의 경우 `WORKDIR` 명령어에서 해석할 수 있다
- 아래의 `$DIRPATH/$DIRNAME`은 `/path/$DIRNAME`으로 해석된다

```dockerfile
ENV DIRPATH=/path
WORKDIR $DIRPATH/$DIRNAME
RUN pwd
```

# VOLUME  

- 컨테이너의 마운트 지점을 생성한다
- 데이터베이스 같은 유상태 애플리케이션의 경우 사용자가 볼륨을 지정하지 않더라도 데이터를 유실하지 않기 위한 안전장치 용도이다

```dockerfile
VOLUME /data
```

# COPY

- `COPY` 인스트럭션은 호스트 파일 시스템의 파일을 컨테이너에 복사한다
- `COPY <source> <target>`
  - source에는 파일 하나가 올 수도 있고, 와일드카드로 여러 파일을 매치할 수도 있다
  - target에는 절대경로가 올 수도 있고, 상대경로가 올 수도 있다. 상대경로가 올 경우 `WORKDIR`에 대한 상대경로가 된다

```dockerfile
# t로 시작하는 모든 txt파일을 <WORKDIR>/relativeDir/ 로 복사한다
COPY t*.txt relativeDir/
```

```dockerfile
# test.txt, teso.txt, tesi.txt과 같은 파일을 /absoluteDir/ 로 복사한다
COPY tes?.txt /absoluteDir/
```

# ADD

- `COPY` 인스트럭션과 비슷하다
- `ADD`는 추가로 URL을 통해 파일을 다운로드할 수 있고, 압축된 파일을 자동으로 추출할 수 있는 기능도 가지고 있다
- `COPY`가 더욱 명료하고 예측 가능하다는 점 때문에 도커에서 권장한다. 특별한 경우에만 `ADD`를 사용하는 것이 좋다

- 아래 예시는 `big.tar.xz` 파일을 `http://example.com`에서 다운로드하고, `/container_directory`에 압축 해제하여 추가한다

```dockerfile
ADD http://example.com/big.tar.xz /container_directory
```

# 참고

- [Docker 공식문서](https://docs.docker.com/reference/dockerfile/){:target="_blank"}  
- [[Docker] Dockerfile의 COPY와 ADD 명령어 비교, 김징어의 Devlog](https://kimjingo.tistory.com/240)