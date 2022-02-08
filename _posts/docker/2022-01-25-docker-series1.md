---
layout: post
title:  'Dockerfile을 이용한 이미지 빌드(1) FROM LABEL ARG ENV'
description: FROM은 빌드를 위한 stage를 초기화하고 이후의 명령어를 위한 기본 이미지를 만듭니다.
date:   2022-01-25 15:01:35 +0300
image:  '/images/docker_logo.png'
logo_image:  '/images/docker_logo.png'
categories: devops
tags: Docker
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---
**Dockerfile instruction**

- [x] FROM
- [x] LABEL
- [ ] ARG
- [x] ENV


# Dockerfile  

# Dockerfile Instructions  

## FROM  
FROM은 빌드를 위한 stage를 초기화하고 이후의 명령어를 위한 **기본 이미지를 만듭니다**. 그렇기 때문에 유효한 Dockerfile은 반드시 FROM 명령어로부터 시작해야 합니다.  

- `FROM [--platform=<platform>] <image> [AS <name>]`
- `FROM [--platform=<platform>] <image>[:<tag>] [AS <name>]`

```dockerfile
# python:3.8-buster 이미지를 기본 이미지로 만듭니다
FROM python:3.8-buster

# 현재 Dockerfile이 있는 위치에 있는 모든 파일을 새로 만든 이미지의 디렉토리 위치로 복사합니다
COPY . .

# 복사된 requirements.txt 파일에 있는 라이브러리를 설치
RUN pip install -r requirements.txt
```

```sh
# deeplearning:pytorch 라는 새로운 이미지를 만듭니다
docker build -t deeplearning:pytorch .
```

### Multi-Stage Builds  

**이미지를 빌드할 때 가장 중요한 것은 이미지의 사이즈를 줄이는 것**입니다. Dockerfile에서 각각의 명령어는 이미지의 layer를 하나씩 늘려나가게 됩니다. 이를 경량화하는 방법으로 RUN 명령어 사용시 Bash에서 && 연산자를 사용할 수 있습니다.  

또한 만약 여러 개의 이미지로부터 새로운 이미지를 불러와야 하는 상황이라면 **FROM 과 COPY를 사용해 이미지를 경량화** 할 수 있습니다. 이를 이용하면 각각의 이미지에서 **원하는 파일만 선택적으로 복사해 다음 이미지로 전달시키고 필요없는 파일(다운로드 과정에서 필요한 코드와 같은 부수적인 파일들)은 제거할 수 있습니다**. 이 방법을 **Multi-Stage Builds**라고 하는데 이 방법은 여러 개의 이미지로 부터 새로운 이미지를 생성할 때 여러 개의 Dockerfile이 필요없이 **하나의 파일에 관리할 수 있다**는 장점도 있습니다.  

Multi Stage Builds 방법으로 이미지를 만드는 코드의 형태는 다음과 같습니다.  

```dockerfile
# <image> 를 기본 이미지로 한다
FROM <image> AS apple
...

# <image2>를 기본 이미지로 한다
FROM <image2>
...
# <image>의 빌드 결과로 생성된 파일 중 원하는 파일만 복사
COPY --from=apple /dir/you/want/from/apple /dir/of/image2
```

```dockerfile
# 이 방법은 기본 이미지는 <image> 하나만 필요하지만 원하는 파일만 가져오고 싶은 경우 사용하는 것 같다

# <image>를 기본 이미지로 한다
FROM <image> AS apple
...

# apple로 생성된 이미지를 기본 이미지로 한다
FROM apple AS apple_juice
...

# <image>에서 필요한 파일만 복사
COPY /dir/you/want/from/apple /dir/of/apple_juice
```

```dockerfile
# 사용 예시

FROM golang:1.16 AS builder
WORKDIR /go/src/github.com/alexellis/href-counter/
RUN go get -d -v golang.org/x/net/html  
COPY app.go    ./
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .

FROM alpine:latest  
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /go/src/github.com/alexellis/href-counter/app ./
CMD ["./app"]  
```



## LABEL  

LABEL 명령어는 이미지에 메타데이터를 추가하기 위해 사용됩니다.  

```dockerfile
LABEL "com.example.vendor"="ACME Incorporated"
LABEL com.example.label-with-value="foo"
LABEL version="1.0"
LABEL description="This text illustrates \
that label-values can span multiple lines."
```

하나의 명령어에 여러 데이터를 추가하면 이미지 크기를 줄일 수 있습니다.  

```dockerfile
LABEL "com.example.vendor"="ACME Incorporated" \
com.example.label-with-value="foo" \
version="1.0" \ 
description="This text illustrates \
that label-values can span multiple lines."
```

## ARG
빌드 단계에서만 사용하기 위한 변수입니다. 밑에서 배울 ENV와 같은 변수를 지정하게 되면 ENV가 ARG를 오버라이딩합니다.  
 
## ENV  

ENV 명령어는 환경 변수를 키:밸류 형태로 지정하도록 해줍니다. 설정된 환경 변수는 설정 이후의 모든 빌드 단계와 런타임 단계에서 사용됩니다.  

만약 밸류로 띄어쓰기가 필요하다면 쌍따옴표로 감싸주면 됩니다.  

```dockerfile
ENV MY_NAME="John Doe"
ENV MY_CAT=fluffy
```

# 참고

- [Docker 공식문서](https://docs.docker.com/engine/reference/builder/#cmd){:target="_blank"}  
- [Docker 공식문서2](https://docs.docker.com/develop/develop-images/multistage-build/){:target="_blank"}  
- [stack overfolw Nagev 답변](https://stackoverflow.com/questions/33322103/multiple-froms-what-it-means){:target="_blank"}  
- [EARTHLY 블로그: Docker Multistage Builds](https://earthly.dev/blog/docker-multistage/){:target="_blank"}  
- [geeksforgeeks 블로그](https://www.geeksforgeeks.org/how-to-combine-multiple-base-images-using-single-dockerfile/){:target="_blank"}  
