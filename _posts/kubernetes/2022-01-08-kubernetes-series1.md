---
layout: post
title:  'Kubernetes Series [Part1]: Kubernetes Intro'
description: 쿠버네티스는 컨테이너를 쉽고 빠르게 배포/확장하고 관리를 자동화해주는 오픈소스 플랫폼입니다.  
date:   2022-01-08 15:01:35 +0300
image:  '/images/kube_23.svg'
logo_image:  '/images/kubernetes_logo.png'
categories: devops
tags: Kubernetes
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 들어가기 전에

## 도커의 등장
2013년 도커가 등장하기 전까지 서버 관리는 굉장히 어렵고 컨트롤하기 어려운 것으로 여겨졌습니다. 하나의 서비스를 제공하기 위해서는 보통 수십에서 수백개의 애플리케이션이 서로 연결되어 동작하는데, 이 때 오류가 나게 되면 어디서 문제가 생긴건지 파악하기가 쉽지 않았습니다.  

이러한 문제를 해결하기 위해 사람들은 **가상화 기술**을 이용해 서버를 애플리케이션별로 격리시키고자 하였습니다. 이 때 크게 두가지 방법으로 접근할 수 있는데, 하나는 **가상머신**을 이용해 컴퓨팅 리소스를 따로 분리하여 사용하도록 하는 것이었습니다. 하지만 이 방법은 컴퓨팅 성능을 떨어트립니다.  
두 번째 방법은 LXC(LinuX Containers)라는 **리눅스 커널 기술**로 기존의 하드웨어 레벨에서 하던 방식을 운영체제 레벨에서 해결하도록 했습니다. 이렇게 하면 컴퓨팅 성능도 떨어트리지 않으면서, 파일시스템, 리소스(CPU, 메모리, 네트워크)를 분리할 수 있습니다. 하지만 이 방법은 사용하기에는 운영체제에 대한 깊은 이해를 필요로 해서 많은 개발자들이 쉽게 쓰기는 힘들었습니다.  

이 때 등장한 것이 바로 도커입니다. 도커가 등장하게 되면서 **컨테이너 기술**에 대한 접근성이 훨씬 좋아지게 되자, 개발자들은 이제 모든 애플리케이션을 컨테이너화하여 사용하기 시작했습니다. 이렇게 도커는 인프라 세계를 컨테이너 세상으로 바꿔버렸습니다. 수많은 애플리케이션이 컨테이너로 배포되고 도커파일을 만들어 이미지를 빌드하고 컨테이너를 배포하는 게 흔한 개발 프로세스가 되었습니다.  

(도커에 관한 더 자세한 내용은 [여기]()를 참고하시기 바랍니다)

이제 모든 것들을 컨테이너화하기 시작하면서 우리의 서비스는 다음과 같은 모습을 가지게 되었습니다.  

![](/images/kube_1.png)  

이렇게 서비스 하나를 배포하기 위해 수많은 컨테이너를 띄우고, 연결하고, 버전업을 해야하는 상황이 생긴겁니다. 그래서 개발자들은 이제 컨테이너들을 동시에 띄우고 관리까지 해주는 **컨테이너 오케스트레이션**기술이 필요해지게 되었습니다.  

![](/images/kube_2.png) 

# Kubernetes

## 쿠버네티스 소개

__쿠버네티스는 컨테이너를 쉽고 빠르게 배포/확장하고 관리를 자동화해주는 오픈소스 플랫폼입니다.__  

쿠버네티스는 단순한 컨테이너 플랫폼을 넘어 마이크로서비스, 클라우드 플랫폼을 지향하고 컨테이너로 이루어진 것들을 손쉽게 담고 관리할 수 있는 그릇 역할을 합니다. 또한 CI/CD, 머신러닝 등 다양한 기능이 쿠버네티스 플랫폼 위에서 동작합니다.  

쿠버네티스는 컨테이너 규모, 컨테이너의 상태, 네트워크, 스토리지, 버전과 같은 것들을 관리하며 이를 자동화합니다.  

## 쿠버네티스 아키텍쳐  

![](/images/kube_23.svg)  

![](/images/kube_5.png) 

- 마스터: 전체 클러스터를 관리하는 서버
- 노드: 컨테이너가 배포되는 서버

쿠버네티스에서 모든 명령은 마스터의 API 서버를 호출하고 노드는 마스터와 통신하면서 필요한 작업을 수행합니다. 특정 노드의 컨테이너에 명령하거나 로그를 조회할 때도 노드에 직접 명령하는 게 아니라 마스터에 명령을 내리고 마스터가 노드에 접속하여 대신 결과를 응답합니다.  

![](/images/kube_4.png)  

마스터의 API 서버는 할일이 굉장히 많기 때문에, 함께 도와줄 일꾼들이 필요합니다. 이들을 스케줄러와 컨트롤러라고 합니다. 보통 하나의 스케줄러와 역할별로 다양한 컨트롤러가 존재합니다.  

- 컨트롤러: 자신이 맡은 오브젝트의 상태를 계속 체크하고 Desired 상태를 유지, API서버 요청 처리
- 스케줄러: 새로 생성되는 Pod(컨테이너와 비슷)가 있는지 계속 체크, 생성되면 가장 적절한 노드 선택

컨트롤러는 자신이 맡고 있는 오브젝트의 상태를 계속 체크하고 상태를 유지합니다. 또한 API 서버에서 어떤 새로운 상태를 요구할 경우, 맞춰서 또 상태를 바꿔서 유지하고 이 때 새롭게 Pod가 생성되거나 삭제되면 스케줄러가 그에 맞춰서 노드에서 삭제, 할당합니다.   

## Desired State

![](/images/kube_6.png)

쿠버네티스에서 가장 중요한 것은 **desired state(원하는 상태)**라는 개념입니다. 원하는 상태라 함은 관리자가 바라는 환경을 의미하고 좀 더 구체적으로는 얼마나 많은 웹서버가 떠 있으면 좋은지, 몇 번 포트로 서비스하기를 원하는지 등을 말합니다.  
쿠버네티스는 복잡하고 다양한 작업을 하지만 자세히 들여다보면 현재 상태current state를 모니터링하면서 관리자가 설정한 원하는 상태를 유지하려고 내부적으로 이런저런 작업을 하는 로직을 가지고 있습니다.  

![](/images/kube_7.png)

이렇게 상태가 바뀌게 되면 API서버는 차이점을 발견하고 컨트롤러에게 보내 desired state로 유지할 것을 요청합니다. 그리고 컨트롤러가 변경한 후 결과를 다시 API서버에 보내고 API서버는 다시 이 결과를 etcd(상태를 저장하고 있는 곳)에 저장하게 됩니다.  

![](/images/kube_8.png)

# 마치며

쿠버네티스는 여러 컨테이너를 자동으로 배포해주고 관리해준다는 점에서 정말 좋은 기술입니다. 그리고 마이크로서비스, 클라우드 환경과도 정말 잘 어울리기 때문에 배워두면 정말 쓸모가 많을 것 같습니다. 하지만 쿠버네티스는 많은 영역을 커버하다보니 배워야할 것들이 굉장히 많습니다. 그리고 컨테이너들을 띄우는 서버를 관리하기 위한 서버를 더 사용하게 되는 것이기 때문에, 컴퓨팅 자원이 충분하지 않다면 사용하는 것이 적절하지 않을 수도 있습니다. (쿠버네티스를 운영환경에 설치하기 위해선 최소 3대의 마스터 서버와 컨테이너 배포를 위한 n개의 노드 서버가 필요)

![](/images/kube_9.png)  

다음 포스트에서는 서버가 넉넉하지 않은 상황에서 사용할 수 있는 **minikube**를 설치, 그리고 쿠버네티스에 명령어를 전달할 때 사용하는 **kubectl** 설치해보겠습니다.  
그리고 도커에서는 컨테이너를 띄우지만 쿠버네티스에서는 컨테이너를 관리할 수 있도록 조금 더 패키징한 다양한 오브젝트를 띄우게 되는데 이 때 어떠한 오브젝트들이 있는지도 배워보도록 하겠습니다.  


# 참고자료  
- [subicura님의 kubenetes안내서](https://subicura.com/2019/05/19/kubernetes-basic-1.html){:target="_blank"}