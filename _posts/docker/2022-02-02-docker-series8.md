---
layout: post
title:  'Docker의 볼륨 이해하기'
description: FROM은 빌드를 위한 stage를 초기화하고 이후의 명령어를 위한 기본 이미지를 만듭니다.
date:   2022-02-02 15:01:35 +0300
image:  '/images/docker_17.png'
logo_image:  '/images/docker_logo.png'
categories: devops
tags: Docker
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 도커에서 데이터 관리하기  

기본적으로 컨테이너 안에서 생성된 모든 파일은 **컨테이너 레이어에 저장**됩니다. 그래서, 해당 컨테이너가 삭제되면 데이터도 함께 사라집니다. 따라서 컨테이너의 생명 주기와 관계없이 데이터를 영구적으로 저장하기 위한 방법이 필요합니다. 또한 여러 컨테이너가 데이터를 공유할 수 있으면 데이터를 컨테이너별로 중복 저장할 필요가 없어 컨테이너를 더욱 효율적으로 관리할 수 있게 될 것입니다.  

이러한 이유로 다음과 같은 기능을 가진 옵션을 도커에서는 제공해주고 있습니다.  

- **데이터 영구 저장**
- **컨테이너간 데이터 공유**


도커에서 볼륨을 위해 제공해주는 옵션 중 **volume** 또는 **bind mount**를 사용하면 컨테이너가 중지된 후에도 파일을 호스트 머신에 파일을 저장함으로써 유지할 수 있습니다.  

참고로 도커에서 **tmpfs mount**를 사용하면 호스트의 시스템 메모리에 인-메모리 형식으로 파일을 저장할 수 있습니다. 

# 마운트 종류
 

어떤 종류의 마운트를 사용하더라도 컨테이너 안에서 데이터의 모습은 같습니다. 각 마운트 종류의 차이를 이해하는 쉬운 방법은 데이터가 도커 호스트 내에서 어디 존재하는지 생각해보는 것입니다. 

![](../../images/docker_17.png)  

- **Volume**을 사용하면 도커에 의해 관리되는 호스트 파일 시스템(Linux기준 `/var/lib/docker/volumes/`)에 데이터가 저장됩니다. 비-도커 프로세스들은 여기 파일들을 수정해서는 안됩니다.  

- **Bind mount**는 호스트 머신 어디든 저장될 수 있습니다. 비-도커 프로세스들도 여기 파일들을 언제든 수정할 수 있습니다. 

- **tmpfs mount**는 호스트 메모리 시스템에만 저장됩니다. 호스트 파일 시스템에는 절대 저장되지 않습니다.  

# Volume  

![](../../images/docker_18.png)  

Volume은 **완전히 도커에 의해서만 관리**되어 **호스트 머신의 디렉토리 구조나 OS에 독립적**인, 도커에서 데이터를 유지하기 위한 권장되는 메커니즘입니다.  

또한 볼륨이 컨테이너를 사용하는 컨테이너의 크기를 늘리지 않고 컨테이너의 라이프사이클 외부에 존재하기 때문에 컨테이너 레이어에서 데이터를 유지하는 것보다 더 나은 선택인 경우가 많습니다.  

Volume은 `docker volume create` 명령어를 이용해 명시적으로 볼륨을 생성할 수도 있고, 컨테이너를 생성할 때 같이 볼륨을 생성할 수도 있습니다.  

볼륨은 도커 호스트 내의 디렉토리에 저장됩니다. 컨테이너에 마운트되는 볼륨이 바로 이것 입니다. volume은 bind mount와 비슷하지만 다른 점은 도커에 의해 관리 되고 호스트 머신으로부터 isolated 되었다는 점입니다.  

주어진 볼륨은 여러 컨테이너에 동시에 마운트 될 수 있습니다. 볼륨을 사용해 실행 중인 컨테이너가 없더라도 볼륨이 저절로 제거되지 않습니다. 만약 사용하지 않는 볼륨을 제거하고 싶다면 `docker volume prune` 명령어를 사용하면 됩니다. 

볼륨 드라이버를 사용해 클라우드 또는 리모트 호스트에 데이터를 저장할 수도 있습니다.  

## Volume을 사용하기 좋은 경우  

- 여러 컨테이너에 마운트하고 싶은 경우. 명시적으로 표현한 볼륨이 없으면 자동으로 생성하고 마운트 해줍니다.
- 도커 호스트의 파일 구조를 모르는 경우. bind mount와 달리 Volume은 볼륨 명으로 관리(bind mount는 디렉토리 경로) 
- 로컬이 아닌 리모트 호스트 또는 클라우드 서버에 저장하고 싶은 경우
- 높은 성능의 I/O을 요구하는 경우. 볼륨은 호스트가 아닌 Linux VM에 저장. 따라서 읽고 쓰는데 있어 성능이 훨씬 뛰어납니다.
- Docker Desktop에서 완전히 네이티브한 파일 시스템이 필요한 경우
- 백업, 데이터 통합이 필요한 경우

# Bind Mount

![](../../images/docker_19.png)  

bind mount는 volume에 비해 기능이 제한됩니다. bind mount를 사용하면 **호스트 머신의 파일 또는 디렉토리가 컨테이너에 마운트**됩니다. 파일 또는 디렉토리는 **호스트 시스템의 절대 경로에서 참조**됩니다. 반대로 volume을 사용하면 호스트 머신의 Docker 스토리지 디렉토리 내에 새 디렉토리가 생성되고 Docker가 해당 디렉토리의 내용을 관리합니다.

파일 또는 디렉토리가 도커 호스트에 아직 존재하지 않아도 됩니다. 아직 존재하지 않는 경우 요청 시 생성됩니다. bind mount는 성능이 매우 뛰어나지만 사용 가능한 특정 디렉토리 구조가 있는 호스트 시스템의 파일 시스템에 의존합니다.  

bind mount를 사용하면 **컨테이너에서 실행되는 프로세스를 통해 호스트 파일 시스템을 변경할 수 있습니다.** 이는 호스트 시스템에 Docker가 아닌 프로세스에 영향을 미치는 등 **보안에 안좋은 영향**을 미칠 수 있는 강력한 기능입니다.  

## Bind mount를 사용하기 좋은 경우

- 호스트 머신에 있는 설정 파일을 컨테이너와 공유하고 싶은 경우
- 파일 또는 디렉토리 구조가 항상 일관될 수 있는 경우


# tmpfs Mount

![](../../images/docker_20.png)  


tmpfs 마운트는 도커 호스트 또는 컨테이너 내에서 디스크에 유지되지 않습니다. 컨테이너 수명 동안 컨테이너가 비영구 상태 또는 중요한 정보를 저장하는 데 사용할 수 있습니다. 예를 들어, 내부적으로, swarm 서비스는 tmpfs 마운트를 사용하여 서비스의 컨테이너에 비밀을 탑재한다.

## tmpfs mount를 사용하기 좋은 경우

- 보안상의 이유 또는 대용량 데이터로 인한 성능 저하 우려로 데이터가 호스트 머신 또는 컨테이너에 유지되길 원하지 않는 경우. 

# 사용 방법

## Dockerfile
- Dockerfile에는 볼륨 기능을 위해 **VOLUME**을 제공합니다.  
- 이미지가 빌드되는 호스트 머신은 사용자에 따라 달라지므로 source는 지정할 수 없습니다.
- VOLUME에서 표기하는 것은 오직 **컨테이너안에 있는 볼륨의 destination**입니다.

```dockerfile
VOLUME /myvolume
```

- 데이터가 사라지지 않도록 저장해두는 source는 컨테이너 생성/실행 시 표기할 수 있습니다.  

```sh
docker run -it -v $(pwd)/src:/src my-image
```  

- 사실 Dockerfile에서 **VOLUME은 사용하지 않는 것이 좋습니다**. (어차피 source를 지정할 수 없으므로)

## docker run command
컨테이너를 생성하거나 실행할 때 `-v`(`--volume`) or `--mount` 옵션을 이용해 볼륨을 마운트할 수 있습니다.  

- **-v(\--volume)**  

```sh
# first field
# volume옵션을 사용할 때는 명명된 볼륨이면 볼륨의 이름, 익명 볼륨이면 생략 가능
# bind mount옵션의 경우 호스트 머신의 디렉토리 경로

# second field는 컨테이너내의 마운트하고자 하는 경로

# third field는 옵셔널, 예를 들어 ro(read only라는 의미)

-v <first field>:<second field>:<thrid field>
```

```sh
# 예시
docker run -d \
  --name devtest \
  -v myvol2:/app \
  nginx:latest
```
- **\--mount**

```sh
# type=volume, bind, tmpfs
# source(src)
# target(destination, dst)
# readonly
--mount <key>=<value>, <key>=<value>, ..
```

```sh
# 예시
--mount type=bind,source="$(pwd)"/target,target=/app \
  nginx:latest
```

- **볼륨 생성**

```sh
docker volume create my-vol
```

```sh
docker volume ls
-------------------------------
DRIVER              VOLUME NAME
local               my-vol
```

```sh
docker volume inspect my-vol
[
    {
        "CreatedAt": "2022-02-02T17:03:46Z",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/my-vol/_data",
        "Name": "my-vol",
        "Options": {},
        "Scope": "local"
    }
]
```

```sh
docker volume rm my-vol
```  

- **볼륨과 함께 컨테이너 실행**

```sh
# --mount flag 이용
docker run -d \
  --name devtest \
  --mount source=myvol2,target=/app \
  nginx:latest

# -v flag 이용
docker run -d \
  --name devtest \
  -v myvol2:/app \
  nginx:latest
```
- **읽기 전용 볼륨**

```sh
# --mount flag 이용
docker run -d \
  -it \
  --name devtest \
  --mount type=bind,source="$(pwd)"/target,target=/app,readonly \
  nginx:latest

# -v flag 이용
docker run -d \
  -it \
  --name devtest \
  -v "$(pwd)"/target:/app:ro \
  nginx:latest
```

## docker compose

docker compose에 관한 포스트는 [**여기**](https://jaykim0510.github.io/docker-series4)를 참고해주시면 감사드리겠습니다.  

```yml
version: "3.9"
services:
  frontend:
    image: node:lts
    volumes:
      - myapp:/home/node/app
volumes:
  myapp:
```

# 참고

- [도커 공식문서: Manage data in Docker](https://docs.docker.com/storage/){:target="_blank"}
- [도커 공식문서: Docker-compose volume configuration](https://docs.docker.com/compose/compose-file/compose-file-v3/#volume-configuration-reference){:target="_blank"}
- [DaleSeo: Docker 컨테이너에 데이터 저장 (볼륨/바인드 마운트)](https://www.daleseo.com/docker-volumes-bind-mounts/){:target="_blank"}
- [stack overflow: Understanding "VOLUME" instruction in DockerFile](https://stackoverflow.com/questions/41935435/understanding-volume-instruction-in-dockerfile){:target="_blank"}
