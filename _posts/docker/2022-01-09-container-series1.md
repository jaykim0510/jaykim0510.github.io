---
layout: post
title:  '[Docker] 가상화 기술의 역사와 컨테이너의 등장'
description: 가상화 기술의 역사와 컨테이너 기술의 등장 배경에 대해 배운다
date:   2022-01-09 15:01:35 +0300
image:  '/images/container_5.png'
logo_image:  '/images/docker_logo.png'
category: devops
tag: docker
related_tags: container
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---



# 물리서버(Bare Metal)

- 물리서버는 서버가 가지고 있는 **컴퓨팅 자원을 오직 하나의 사용자**(여기서 사용자는 서비스 사용자가 아니라 자원을 사용하는 사람)에게 할당하는 것을 말한다
- 그렇기 때문에 물리서버에서는 **자원을 전혀 분리해서 사용하지 않는다**  

![](/images/container_1.png)

## 물리서버의 장점

- 하드웨어간 네트워크 이동이 발생하지 않기 때문에 **네트워크 지연율을 최소화**할 수 있고, **보안**적인 측면에서도 훨씬 안전하다
- 또한 별도의 하드웨어 에뮬레이션이 없기 때문에 하드웨어에 **루트 레벨의 접근**이 가능하고 이를 통해 **뛰어난 커스터마이징**을 할 수 있다
- 그래서 보안을 최우선으로 생각하는 뱅킹시스템이나 데이터베이스 시스템은 이러한 Bare Metal 형태로 컴퓨팅 자원을 사용한다

## 물리서버의 단점

- 단점으로는 서비스 개발에 있어 여러 개의 **애플리케이션을 독립적으로 개발하기가 힘들다**
- 그 이유는 자원이 분리되어 있지 않고 그로 인해 각각의 애플리케이션에 필요한 라이브러리 종속성도 해결하기가 어려워지기 때문이다
- 또한 사용자가 가지고 있는 Bare Metal 서버에 최적화된 방식으로 서비스를 개발하다보니 **다른 서버에 배포가 힘들어진다**
- 이러한 단점은 Scale Out 방식이 아닌 **Scale Up으로 밖에 확장성을 가지지 못한다**는 점으로 이어진다

# 가상머신(Virtual Machine)

- 하드웨어의 기술이 급격하게 발전하는 동안, 소프트웨어의 발전은 한참 뒤쳐져 있었다
- 이로 인해 애플리케이션을 실행하는데 있어, 하드웨어의 자원의 낭비가 커지게 되었다
- 하드웨어 자원을 최대한 활용하고자 애플리케이션 크기만큼만 하드웨어를 사용하여 애플리케이션마다 독립적인 환경을 제공하는 가상화 기술에 대한 요구가 등장했다

![](/images/container_4.png)  

## 호스트 가상화  

- 처음 시중에 등장한 가상화 기술은 **호스트 가상화(Type2 Hypervisor)**이다
- 호스트가상화는 Host OS위에 컴퓨팅 자원이 격리된 가상 머신을 띄우고 그 안에 Guest OS가 구동되는 방식이다
- 종류로는 VM Workstation, VMware Server, VMware Player, MS Virtual Sever, Virtual Box 등이 있다
- 호스트 가상화는 간단하지만 **하드웨어 에뮬레이팅을 위한 하이퍼바이저(Hypervisor)와 Host OS라는 두 개의 소프트웨어를 추가로 실행시켜야 하는 오버헤드**가 있다 

## 하이퍼바이저 가상화

- 그다음 등장한 것이 **하이퍼바이저 가상화(Type1 Hypervisor)**이다
- 현재 서버 가상화 기술에서는 주류 방식으로 사용되고 있다
- 종류로는 Xen, KVM 등이 있다. 이러한 방식의 가상화는 Host OS 없이 사용하는 가상화 방식이기 때문에 불필요한 오버헤드를 줄여준다
- 아마존 AWS와 같은 클라우드의 컴퓨팅 서비스가 대표적으로 이러한 방식의 가상화 기술을 사용한다
- 하지만 Host OS가 없다는 사실에서 생기는 문제는 각각 다른 Guest OS가 하드웨어에 접근할 수 있어야 한다는 것이다

<details>
<summary>이러한 문제를 해결하는데는 두 가지 방법이 있다</summary>
<div markdown="1">

첫 번째는 하이퍼바이저가 구동될 때 DOM0라고 하는 관리용 가상머신을 하나 실행시켜 **DOM0가 중개하는 전가상화 방식**입니다. DOM0의 역할은 각각의 Guest OS에서 발생하는 요청을 하이퍼바이저가 해석할 수 있도록 컴파일해서 하이퍼바이저에 전달하는 것입니다. 이 방법은 **호스트 OS보다는 가벼운 DOM0를 실행**한다는 점에서 오버헤드가 줄게되지만 **여전히 성능상의 단점**이 있습니다.      

![](/images/container_3.png)  

두 번째는 **반가상화 방식(Bare Metal Hypervisor)**입니다. 반가상화는 DOM0를 없애고, 각각의 Guest OS가 하이퍼바이저에게 직접 요청(Hypercall)할 수 있도록 Guest OS의 커널을 수정하는 방법입니다. 이 방법은 별도의 레이어가 필요없기 때문에 가장 오버헤드가 적게 발생합니다. 하지만 이 방법은 OS의 커널을 수정해야하기 때문에 오픈 소스의 OS에서만 가능하고 macOS나 windows같은 운영체제에서는 불가능합니다.  

하지만, 어디까지나 분류는 분류일 뿐 Type 1 하이퍼바이저들이 모두 전가상화에만 속하거나 반가상화에만 속하는 것은 아닙니다. 
최근에는 하이퍼바이저에서 전가상화와 반가상화의 경계가 별 의미가 없어졌습니다.  

- VMware나 KVM이 대표적인 전가상화 제품에 속하고, Xen이 대표적인 반가상화 제품에 속했다(과거형).
- 전가상화는 모든 CPU 명령어를 가상화(애뮬레이션)하므로 아키텍처에 제한을 받지 않지만 느리다.
- 반가상화는 꼭 필요한 CPU 명령어만 가상화한다. 
    - 꼭 필요한 명령어만을 가상화 요청(Hyper Call)하도록 커널 수정 필요

- Xen은 반 가상화 하이퍼바이저로 등장했지만 오래 전부터 전 가상화도 지원한다.
- VMWare이나 KVM도 전 가상화 하이퍼바이저이지만 반 가상화 기능을 제공한다. 
- 전 가상화와 반 가상화 하이퍼바이저의 경계가 거의 없어짐.

</div>
</details>


# 컨테이너(Container)

![](/images/container_10.png)

- 컨테이너 기술은 가상화의 꽃이라고 할 수 있다
- 컨테이너는 **애플리케이션 가상화**로, VM과 달리 OS를 포함하지 않는다. 즉, **하드웨어와 호스트 OS는 그대로 둔 채 애플리케이션 영역만 캡슐화하여 격리하는 방식**이다
- VM에 비해 가볍고, 배포가 빠르며, 자원을 효율적으로 사용할 수 있다는 장점이 있어 최근에 많이 활용되고 있다
- 2013년 도커의 등장으로 컨테이너의 기술이 대중화 되었다

# 컨테이너 기술의 특징

- 컨테이너 기술에서의 Host OS는 보통 OS가 가지는 모든 기능들을 제공하지는 않고, 리눅스 커널 기술까지만 제공한다
- 그 외에 컴포넌트(파일 시스템, 패키지 매니저 등)들은 컨테이너가 만들어진 이미지에 종속적이다. 
- 그래서 도커에서 이미지들을 보게 되면, Ubuntu 기반, Centos 기반 등 다양한 배포판들이 있는 것이다

![](/images/container_linux.png)

# 컨테이너 기술의 역사

- 참고로 도커 이전에도 컨테이너 기반의 가상화는 있었다
- 컨테이너의 역사에 대해 간략히 살펴보면 아래와 같다

![](/images/container_6.png)  

- 2000년, Unix OS 인 FreeBSD 에서 OS 가상화 기능인 FreeBSD Jail를 발표합니다.
- 2001년, Linux에서 커널에 Linux-Vserver 라는 기능을 추가하여 OS 가상화 환경을 이용할 수 있게 되었습니다.  
- 2006년, Google은 **cgroup**는 프로세스 자원 이용량을 제어하는 기능을 발표합니다.
- 2008년, Red Hat 에서 논리적으로 시스템 자원을 분할하는 **Namespace**를 발표합니다.
- 비슷한 시기에 IBM에서 LXC (LinuX Containers)를 발표합니다.
- **LXC가 cgroup 과 Namespace를 사용하여 구현한 최초의 Linux 컨테이너 엔진**입니다.
- 2013년, 도커라는 회사에서 **LXC를 아주 잘 활용할 수 있도록 도커( Docker) 라는 기술을 오픈소스로 발표**합니다.
- 도커는 Dockerfile이란 메니페스트를 만들고, Container Hub를 만들면서, Container기술은 급속히 발전하게 됩니다.
- 2015년, Google에서 **컨테이너를 통합하여 오케스트레이션하는 쿠버네티스**라는 프로젝트를 오픈소스로 발표합니다.
- 2016년, 구글이 **쿠버네티스를 CNCF 재단에 기증**하면서 클라우드네이티브 시대의 서막을 알리게 됩니다.
- 이후 **Containerd** 와 **CRI-O** 그리고 PODMAN 등 컨테이너는 표준기술 중심으로 발전하고 있습니다.
- 이외에도 rht, OCI, CRI-O 등 표준 기술들이 발전하였고, 레드햇은 Kubernetes 기반으로 **OpenShift를** 개발했습니다.  


# 참고

- [KT Cloud: Cloud 인프라 Intro - 물리서버와 가상서버](https://tech.ktcloud.com/62){:target="_blank"}
- [opennaru: 물리서버 , 가상화 , 컨테이너 기술 진화의 역사](http://www.opennaru.com/cloud/physical-server-virtualization-container/){:target="_blank"}
- [phoenixnap: The Definitive Guide to Bare Metal Servers for 2021](https://phoenixnap.com/blog/what-is-bare-metal-server){:target="_blank"}
- [phoenixnap: Bare Metal Vs VM: What Performs Better](https://phoenixnap.com/blog/bare-metal-vs-vm){:target="_blank"}
- [IT Opening: Xen Kvm 반가상화 전가상화 차이 비교 분석](https://www.itopening.com/4396/){:target="_blank"}
- [NDS: [소개] 가상화의 종류3가지](https://tech.cloud.nongshim.co.kr/2018/09/18/가상화의-종류3가지/){:target="_blank"}
- [하드웨어 가상화(Virtualization) 뜻, 가상화 기술 종류 4가지, 가상머신(Virtual Machine)의 단점 3가지](https://eunjinii.tistory.com/10){:target="_blank"}
- [Rain.i: 하이퍼바이저(Hypervisor)의 종류](http://cloudrain21.com/hypervisor-types){:target="_blank"}
- [openmaru: 컨테이너 기술의 발전과 역사](https://www.openmaru.io/컨테이너-기술의-역사와-발전/){:target="_blank"}