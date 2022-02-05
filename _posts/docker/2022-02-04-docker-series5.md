---
layout: post
title:  'Docker Series [Part5]: Docker Compose 속성 알아보기'
description: 도커 컴포즈는 파일 하나만 실행하면 프로젝트 배포에 필요한 모든 서비스를 실행하고 연결 시켜줍니다. 
date:   2022-02-04 15:01:35 +0300
image:  '/images/docker_logo.png'
categories: devops
tags: Docker
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---
# 도커 컴포즈(Docker Compose)
보통 하나의 프로젝트에는 여러 가지 서비스를 포함하고 있습니다. 예를 들어 웹 서버 기반의 프로젝트를 진행한다고 할 때 프로젝트의 기본적인 아키텍처는 다음과 같습니다.  

![](/images/docker_2.png)  
[(Netflix Tech Blog 참고)](https://medium.com/storyblocks-engineering/web-architecture-101-a3224e126947){:target="_blank"}  

위의 그림을 보면 웹 서버뿐만 아니라 데이터 웨어하우스, 데이터베이스, 검색 서비스 등과 같은 것들이 서로 유기적으로 연결되어 있습니다. 이런 경우 프로젝트를 상용화 하기 위해서는 어떻게 해야 할까요? 각각의 서비스를 도커를 이용해 컨테이너로 띄우고 서로를 연결시켜주어야 합니다. 이는 앞에서 배웠던 도커 이미지를 만들기 위한 Dockerfile 단계에서는 할 수 없고 도커 컨테이너를 실행(`docker run`)하는 단계에서 컨테이너를 띄우는 순서, 데이터 공유, 환경변수 등을 설정해서 실행해야 합니다.  

우리가 도커를 배우는 이유는 서비스를 컨테이너화하고 간결한 코드로 관리하여 어디서든 배포가능 하도록 하기 위한 것인데 컨테이너 실행 단계에서 이렇게 복잡한 과정이 필요하다면 생각보다 힘이 빠질 것 같습니다.  

이러한 문제를 해결하기 위해 도커에서는 **도커 컴포즈**라는 도구를 제공하였습니다. 도커 컴포즈는 기존의 여러 서비스를 연결하기 위해 컨테이너 실행 단계에서 복잡한 옵션을 주는 상황에서 벗어나 처음부터 **YAML 파일 형태로 관리하여** `docker-compose.yml` **파일 하나만 실행하면 프로젝트 배포에 필요한 모든 서비스를 실행하고 연결 시켜주는 것**입니다. 다음은 웹 서버와 데이터베이스를 연결해 하나의 프로젝트로 배포하도록 해주는 도커 컴포즈 파일의 예시입니다.  

```yml
version: '3'

services:
  db:
    image: postgres
    volumes:
      - ./docker/data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=sampledb
      - POSTGRES_USER=sampleuser
      - POSTGRES_PASSWORD=samplesecret
      - POSTGRES_INITDB_ARGS=--encoding=UTF-8

  django:
    build:
      context: .
      dockerfile: ./compose/django/Dockerfile-dev
    environment:
      - DJANGO_DEBUG=True
      - DJANGO_DB_HOST=db
      - DJANGO_DB_PORT=5432
      - DJANGO_DB_NAME=sampledb
      - DJANGO_DB_USERNAME=sampleuser
      - DJANGO_DB_PASSWORD=samplesecret
      - DJANGO_SECRET_KEY=dev_secret_key
    ports:
      - "8000:8000"
    command: 
      - python manage.py runserver 0:8000
    volumes:
      - ./:/app/
```  
[(44bits 블로그 참고)](https://www.44bits.io/ko/post/almost-perfect-development-environment-with-docker-and-docker-compose#개발-환경-구성이라는-어려움){:target="_blank"}  

지금부터 도커 컴포즈 파일의 구성요소를 한 번 살펴보도록 하겠습니다.  

# Top-level keys  
도커 컴포즈 파일의 최상위 키값에는 version, services, networks, volumes과 같은 항목이 있습니다.  
- **version**: 도커 컴포즈 파일 포맷의 버전을 지정 [(도커 엔진과의 호환성 체크 문서)](https://docs.docker.com/compose/compose-file/compose-versioning/){:target="_blank"}  
- **services**: 컨테이너 각각에 대한 세부사항 설정으로 도커 컴포즈에서 가장 많은 비중 차지 
- **networks**: 컴포즈가 제공하는 디폴트 네트워크가 아닌 커스텀 네트워크 생성을 원할 때 지정 [(참고)](https://docs.docker.com/compose/networking/){:target="_blank"}  
- **volumes**: 볼륨에 이름을 지정할 수 있으며, 여러 컨테이너에서 공유하는 볼륨을 제공

# services
- **image**  
원하는 컨테이너의 이미지를 이미지 저장소에서 불러와 설정합니다. 불러오는 방법은 다음과 같은 방법이 있습니다.  

```yml
# 이미지 이름
image: redis

# 이미지 이름:태그
image: ubuntu:18.04

# 이미지 작성자/이름
image: tutum/influxdb

# 이미지 url
image: example-registry.com:4000/postgresql
```  
- **build**  
`build`를 사용하면 이미지를 불러오지 않고, Dockerfile을 이용해 빌드할 수 있습니다.  
  - **context**: Dockerfile이 위치한 디렉토리 또는 깃 레포지토리의 url
  - **dockerfile**: context에 Dockerfile이 없을 경우 사용할 대체 Dockerfile (단독으로 못쓰고 context필요)
  - **args**: 이미지 빌드 단계에서만 사용되는 환경변수의 값 (Dockerfile ARG 명령어에 미리 명시되어야함)  

```dockerfile
ARG buildno

RUN echo "Build number: $buildno"
```

```yaml
services:
  webapp:
    build:
      context: ./dir
      dockerfile: Dockerfile-alternate
      args:
        buildno: 1
```

`build`**와** `image가` **함께 표기된 경우** `build`로 이미지를 만들고 이미지의 이름에 `image` 값을 사용합니다.  
```yaml
build: ./dir
image: webapp:tag
```
- **environment**  
컨테이너에 환경변수를 추가해줍니다. 아래의 `SESSION_SECRET`와 같이 value를 표기하지 않으면 컴포즈가 실행중인 머신 안에서 정의된 value로 해석가능 합니다. 이것은 value를 secret하게 할 수 있으며 또한 host-specific value로 사용할 수 있습니다.  

```yml
environment:
  RACK_ENV: development
  SHOW: 'true'
  SESSION_SECRET:
```
- **ports**  
포트를 노출해줍니다. 간단한 short syntax와 추가적으로 필드를 추가할 수 있는 long syntax가 있습니다.  
  - **Short Syntax 표기법**  
    보통 `HOST PORT: CONTAINER PORT` 방법으로 표기합니다  
    번호 하나만 작성되면 CONTAINER PORT를 의미합니다
    IP 주소를 표기하여 해당 IP 주소의 트래픽만 허용할 수도 있습니다 (default: `0.0.0.0`)  
    쌍따옴표를 안쓰면 시간으로 인식되기 때문에 반드시 쌍따옴표로 감싸줍니다  
    ```yaml
      ports:
        - "3000"
        - "3000-3005"
        - "8000:8000"
        - "9090-9091:8080-8081"
        - "49100:22"
        - "127.0.0.1:8001:8001"
        - "127.0.0.1:5000-5010:5000-5010"
        - "127.0.0.1::5000"
        - "6060:6060/udp"
        - "12400-12500:1240"
    ```  
  - **Long Syntax 표기법**  
    - **target**: the port inside the container
    - **published**: the publicly exposed port
    - **protocol**: the port protocol (tcp or udp)
    - **mode**: host for publishing a host port on each node, or ingress for a swarm mode port to be load balanced.  

    ```yaml
      ports:
        - target: 80
          published: 8080
          protocol: tcp
          mode: host
    ```
- **volumes**  
호스트 경로의 디렉토리 또는 네임드 볼륨을 컨테이너에 마운트합니다. 하나의 서비스를 위한 볼륨으로는 호스트 경로를 사용해도 괜찮지만, 여러 서비스가 공유하는 볼륨이 필요하다면 top-level `volumes`에 네임드 볼륨을 정의해야 합니다.  
  - **Short Syntax 표기법**  
    - 일반적인 표기방법: `[SOURCE:]TARGET[:MODE]`  
      
      ```yaml
        volumes:
            # Just specify a path and let the Engine create a volume
            - /var/lib/mysql

            # Specify an absolute path mapping
            - /opt/data:/var/lib/mysql

            # Path on the host, relative to the Compose file
            - ./cache:/tmp/cache

            # Named volume
            - datavolume:/var/lib/mysql
      ```
  - **Long Syntax 표기법**  
    - **type**: 마운트 타입. `volume`, `bind`, `tmpfs`, `npipe`
    - **source**: 마운트 하고자 하는 호스트 경로의 디렉토리 또는 네임드 볼륨
    - **target**: 볼륨이 마운트 될 컨테이너에서의 경로  

      ```yaml
        version: "3.9"
        services:
          web:
            image: nginx:alpine
            ports:
              - "80:80"
            volumes:
              - type: volume
                source: mydata
                target: /data
                volume:
                  nocopy: true
              - type: bind
                source: ./static
                target: /opt/app/static

        networks:
          webnet:

        volumes:
          mydata:
      ```
- **depends_on**  
서비스간의 실행순서를 통해 디펜던시를 지키도록 해줍니다. 이 설정은 종속되는 다른 서비스가 실행되기만을 기다릴 뿐 준비(ready)가 되었는지 까지는 고려하지 않습니다. 준비 상태가 필요하다면 추가적인 설정이 필요합니다. [(참고)](https://docs.docker.com/compose/startup-order/){:target="_blank"}아래 예시는 `web` 서비스 컨테이너가 실행되기 전에 `db`와 `redis`의 실행을 기다립니다. 보통 데이터베이스, 주키퍼와 같은 선행되어야 하는 서비스가 있는 경우 많이 사용합니다.  

```yaml
version: "3.9"
services:
  web:
    build: .
    depends_on:
      - db
      - redis
  redis:
    image: redis
  db:
    image: postgres
```
- **command**
기본 커맨드 명령어를 오버라이딩합니다.  

```yaml
command: bundle exec thin -p 3000

command: ["bundle", "exec", "thin", "-p", "3000"]
```

# 참고

- [Docker 공식문서](https://docs.docker.com/engine/reference/builder/#cmd){:target="_blank"}  
- [44bits 블로그](https://www.44bits.io/ko/post/almost-perfect-development-environment-with-docker-and-docker-compose#개발-환경-구성이라는-어려움){:target="_blank"}  
