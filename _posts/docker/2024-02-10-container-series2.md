---
layout: post
title:  '[Docker]: 진화하는 컨테이너 표준'
description: 
date:   2024-02-10 15:01:35 +0300
image:  '/images/container_7.png'
logo_image:  '/images/docker_logo.png'
category: devops
tag: docker
related_tags: [container]
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 도커와 컨테이너 기술  
Docker는 컨테이너 기술을 사용하여 애플리케이션에 필요한 환경을 신속하게 구축하고 테스트 및 배포를 할 수 있게 해주는 플랫폼으로 접근 장벽이 비교적 높았던 컨테이너 기술의 상용화를 앞당겼습니다.  

컨테이너 기술은 하드웨어와 호스트 OS는 그대로 둔 채 애플리케이션 영역만 캡슐화하여 독립적인 환경을 제공해주는 가상화 방식입니다. 이 덕분에 이전의 가상화 방식에서는 애플리케이션마다 완전한 OS가 필요했지만 컨테이너 기술에서는 이러한 완전한 OS의 불필요한 중복(redundancy)을 제거하였습니다. 이러한 컨테이너 기술 덕분에 CPU, RAM 및 스토리지와 같은 시스템 리소스를 더 많이 확보할 수 있게 되었으며, 라이센스 비용 절감, OS 패치 및 유지보수에 들어가는 오버헤드를 제거할 수 있게 되었습니다.  

# 도커 엔진
이러한 컨테이너 기술을 실현하기 위해서는 컨테이너를 실행시킬 수 있는 환경을 구축해야 하는데 이를 컨테이너 엔진이라고 하고, 도커에서는 도커 엔진에 해당됩니다.  

## 초기 도커 엔진의 모습
초기 도커 엔진은 크게 dockerd와 LXC로 이루어져 있었습니다.  

![](/images/docker_26.png)

- **dockerd**  
  초기 도커 엔진의 `dockerd` 지금의 `dockerd`보다 훨씬 많은 역할을 하고 있었습니다. 그 이유는 도커가 처음 등장할 당시 도커 개발자들의 목표는 컨테이너 기술의 대중화였습니다. 그렇기 때문에 최대한 사용성을 간편하게 하고 싶었고 이러한 목적으로 도커 개발자들은 컨테이너 기술을 사용하는데 필요한 많은 기능들을 `dockerd`에 담아두었었습니다.  

  이 당시 `dockerd`에는 현재의 Docker Client, Docker API, Docker Runtime, Image Build와 같은 역할들을 모두 담당하고 있었습니다.  

- **LXC**  
  `LXC`는 단일 호스트 상에서 여러개의 고립된 리눅스 시스템(컨테이너)들을 실행하기 위한 운영 시스템 레벨 가상화 방법입니다. `LXC`는 `dockerd`에게 Linux kernel에 존재하는 컨테이너의 기본 building block의 `namespaces`나 `cgroups`(control groups)에 대한 접근을 제공했습니다.  

  **namespaces**: 운영 시스템을 논리적으로 나누어 고립된 환경을 제공하는 역할  
  **cgroups**: 고립된 환경에서 사용할 자원을 제한하는 역할  


## 새롭게 바뀐 도커 엔진의 모습
도커는 2016년 12월 14일 쿠버네티스, AWS Fargate, Rancher와 같은 컨테이너 기술 기반의 소프트웨어에 `dockerd`안에 포함되어 있던 `containerd`라는 컨테이너 런타임을 제공해주기 위해 컨테이너를 모듈화하였습니다. ([**도커 공식문서 참고**](https://www.docker.com/press-release/docker-extracts-and-donates-containerd-its-core-container-runtime-accelerate/){:target="_blank"})

### Client
도커 클라이언트는 개발자들이 도커를 사용할 때 Docker CLI로 도커 서버에 명령어를 전달하는 역할을 합니다. 흔히 저희가 사용하는 `docker run`과 같은 명령어가 REST API로 형태로 `dockerd`에게 전달됩니다.  

### dockerd
도커 데몬(dockerd)은 Docker API 요청을 수신하며 이미지 관리, 이미지 빌드, REST API, 인증, 보안, 코어 네트워킹, 오케스트레이션 등과 같은 역할을 담당합니다.  

### containerd
`containerd`는 Container의 생명주기를 관리합니다 (= container lifecycle operations).
`containerd`는 원래 작고, 가벼운 Container lifecycle operations으로 설계되었는데, 
시간이 지나면서 image pulls, volumes and networks와 같은 기능들이 확장되었습니다.  

### shim
앞에서 containerd가 새로운 컨테이너를 만들기 위해 runc를 사용한다고 했는데요. 
생성되는 모든 container 당 runc의 새로운 인스턴스를 fork 합니다. 
그러나 각 컨테이너가 생성되면, 상위 runc 프로세스가 종료됩니다.
수백 개의 runc 인스턴스를 실행하지 않고도 수백 개의 container를 실행할 수 있습니다.  

컨테이너의 할당된 부모 runc 프로세스가 종료되면, 연결된 containerd-shim 프로세스가 컨테이너의 부모프로세스가 됩니다.  

이는 containerd에게 컨테이너의 file descriptor(e.g. stdin/out)와 종료 상태를 관리하는 데 필요한 최소한의 코드를 메모리에 남깁니다.  

### runc
`runc`는 `libcontainer`용 CLI Wrapper로, 독립된 container runtime입니다.
docker가 container 관련된 기능들을 쉽게 사용할 수 있도록 해주는 가볍고 이식가능한 툴입니다.
다시 말해, container 동작 환경이 갖추어진 가볍고 이식 가능한 툴입니다.
Docker에서 runc는 목적은 단 하나인데요, 바로 **Container 생성**입니다.

![](/images/docker_25.png)

# OCI

# CRI

# 참고
- [Johan Fischer, Comparing Container Runtimes: containerd vs. Docker](https://earthly.dev/blog/containerd-vs-docker/){:target="_blank"}
- [tutorialworks: The differences between Docker, containerd, CRI-O and runc](https://www.tutorialworks.com/difference-docker-containerd-runc-crio-oci/){:target="_blank"}
- [LinkedIn: containerd는 무엇이고 왜 중요할까?](https://kr.linkedin.com/pulse/containerd는-무엇이고-왜-중요할까-sean-lee){:target="_blank"}
- [cloud native wiki: 3 Types of Container Runtime and the Kubernetes Connection](https://www.aquasec.com/cloud-native-academy/container-security/container-runtime/){:target="_blank"}
- [pageseo: Docker Engine, 제대로 이해하기 (1)](https://gngsn.tistory.com/128){:target="_blank"}
- [Devin Jeon, Kubernetes의 Docker container runtime 지원 중단에 대하여](https://blog.hyojun.me/5){:target="_blank"}
- [Selecting a container runtime for use with Kubernetes](https://joejulian.name/post/kubernetes-container-engine-comparison/){:target="_blank"}
- [A Comprehensive Container Runtime Comparison](https://www.capitalone.com/tech/cloud/container-runtime/){:target="_blank"}
- [Don't Panic: Kubernetes and Docker](https://kubernetes.io/blog/2020/12/02/dont-panic-kubernetes-and-docker/){:target="_blank"}