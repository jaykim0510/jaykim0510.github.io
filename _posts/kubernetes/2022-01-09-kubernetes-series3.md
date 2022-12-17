---
layout: post
title:  'Kubernetes Series [Part3]: Kubernetes Workload Object'
date:   2022-01-09 15:01:35 +0300
image:  '/images/kube_22.png'
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


# 쿠버네티스의 오브젝트

- 애플리케이션을 쿠버네티스 클러스터에 배포할 때 사용할 수 있는 리소스 단위
- 프로젝트를 구성하는 워크로드, 네트워크(서비스), 스토리지(볼륨), 설정 파일 등
- 어떤 애플리케이션을 얼마나 어디에 어떤 방식으로 배포할지에 관한 것들을 Manifest 파일로 정의할 수 있음
- 사용자의 의도를 YAML 형식으로 정의
- REST API로 마스터 노드에 전달
- 오브젝트에는 크게 Workload 관련 오브젝트와 Network 관련 오브젝트가 있음

![](/images/kube_42.png)

**Manifest 파일**  

```yaml
# 간단한 예시

apiVersion: v1
kind: Pod
metadata:
  name: echo
  labels:
    app: echo
spec:
  containers:
    - name: app
      image: ghcr.io/subicura/echo:v1
```

- 쿠버네티스 오브젝트를 명시적으로 관리하도록 해주는 YAML 파일
- 오브젝트의 목적에 따라 kind를 달리해줌
  - kind에는 크게 Pod, Replicaset, Deployment, Service, Ingress
- 우리가 원하는 애플리케이션의 상태를 spec에 정의함
  - 쿠버네티스 컨트롤러는 YAML 파일에 정의된 spec과 자신의 오브젝트 status를 비교
  - 차이점이 발견되면 status를 spec(desired state)에 맞도록 업데이트 후 etcd에 저장


# Workload Object

> Workloads are objects that set deployment rules for pods. Based on these rules, Kubernetes performs the deployment and updates the workload with the current state of the application. Workloads let you define the rules for application scheduling, scaling, and upgrade.  

[(Rancher문서 참고)](https://rancher.com/docs/rancher/v2.5/en/k8s-in-rancher/workloads/){:target="_blank"}

![](/images/kube_10.png)  

## Pod

![](/images/kube_11.png)  

- Pod는 쿠버네티스에서 배포할 수 있는 가장 작은 단위의 오브젝트로 한 개 이상의 컨테이너와 스토리지, 네트워크 속성을 가집니다. 
- Pod에 속한 컨테이너는 스토리지와 네트워크를 공유하고 서로 `localhost`로 접근할 수 있습니다. 
- (IP 주소는 파드 단위로 할당 => 컨테이너들은 서로 같은 IP 주소를 가진다 => 포트 번호로 구분)  
- 컨테이너를 하나만 사용하는 경우도 반드시 Pod으로 감싸서 관리합니다.  

- Scheduler는 계속 할당할 새로운 Pod가 있는지 체크하고 있으면 노드에 파드를 할당. 
- 그리고 노드에 있는 Kubelet은 컨테이너를 생성하고 결과를 API서버에 보고합니다.

### 매니페스트 파일

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: echo
  labels:
    app: echo
spec:
  containers:
    - name: app
      image: ghcr.io/subicura/echo:v1
```

Pod의 spec에는 `containers`, `volumes`, `restartPolicy`, `hostname`, `hostNetwork` 등이 있습니다.  
[(Pod공식문서 참고)](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/){:target="_blank"}


### 파드 디자인 패턴

- 대부분의 경우 하나의 파드에 하나의 컨테이너를 가진다
- 하지만 메인 컨테이너를 지원하는 서브 컨테이너를 가지도록 파드를 디자인할 수도 있다 => 이를 사이드카 패턴이라고 한다
- (서브 컨테이너의 예: 프록시 역할, 설정값을 동적으로 변경시키는 역할, 로컬 캐시 역할 등)

### 파드명 제한

- 이용 가능한 문자: '영어 소문자', '숫자', '-', '.' (언더바(_)는 안됨)
- 시작과 끝은 '영문 소문자'

### 명령어 실행

- `spec.containers.command` 와 `spec.containers.args` 로 나타낼 수 있다
- (`command`는 기본 명령어, `args`는 `command`에 전달할 인자로 생각하면 된다)
- (여기에 명령어를 명시하면, 도커 이미지의 `ENTRYPOINT`와 `CMD`를 덮어 쓴다)
- `kubectl exec -it <파드명> -- <전달할 명령어>` 명령어로 실행중인 컨테이너에 명령어를 실행할 수도 있다
- 특정 컨테이너에 명령어를 전달하고 싶으면 `kubectl exec -it <파드명> -c <컨테이너명> -- <전달할 명령어>` 이렇게 쓴다

### 기타 설정

- `spec.hostNetwork`
  - 호스트(노드) IP 주소를 파드의 IP 주소로 설정할 수 있다
  - 모든 파드가 같은 IP 주소 가지게 되므로 포트 충돌 주의
- `spec.dnsPolicy`
  - 어디있는 DNS를 이용해서 서비스를 디스커버리할 것인지 정의할 수 있다
  - 기본값은 ClusterFIrst로 클러스터 내부 DNS를 이용한다
  - 그 외에 Default 값을 이용하면 각 노드에 정의된 /etc/resolv.conf를 상속받는다
- `spec.hostAliases`
  - 파드 내부 모든 컨테이너의 `/etc/hosts`를 변경할 수 있다
- `spec.containers.workingDir`
  - 작업 디렉터리를 설정할 수 있다
  - 쿠버네티스에서 특정 스크립트를 실행하는 명령어를 실행할 때, 해당 디렉터리에서 스크립트를 실행한다

### 파드 실습






## ReplicaSet

![](/images/kube_13.png)  

- ReplicaSet은 Pod을 여러 개(한 개 이상) 복제하여 관리하는 오브젝트이다
- 단일 노드 환경이면 Pod는 모두 단일 노드에서 생성되고, 여러개의 노드를 가지고 있는 상황이면, Pod는 노드에 각각 분산되어 배포된다
- (Pod를 어떤 노드에 배치할지는 스케줄러가 결정한다)
- Replicaset을 사용하는 이유는 노드 장애 대비(High Availability), 트래픽 분산(Load Balancing) 때문이다
- 보통 직접적으로 ReplicaSet을 사용하기보다는 Deployment등 다른 오브젝트에 의해서 사용되는 경우가 많다  

### 메니페스트 파일

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: echo-rs
spec:
  replicas: 3
  selector: # 어떤 파드의 복제를 관리할 것인가
    matchLabels: # app: echo이고 tier: app인 label을 가지는 파드를 관리
      app: echo
      tier: app
  template: # replicaset이 만드는 pod의 템플릿
    metadata:
      labels:
        app: echo
        tier: app
    spec:
      containers:
        - name: echo
          image: ghcr.io/subicura/echo:v1
```

ReplicaSet의 spec에는 `replicas`, `selector`, `template`, `minReadySeconds`가 있습니다.  
[(ReplicaSet 공식문서 참고)](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/replica-set-v1/#ReplicaSetSpec){:target="_blank"}


### 레플리카셋 실습







## Deployment  

![](/images/kube_18.png)  

- Deployment는 쿠버네티스에서 가장 널리 사용되는 오브젝트중 하나
- Pod를 중단없이 업데이트하거나 특정 버전으로 롤백할 수 있다 (무중단 배포)
- 쿠버네티스에서는 컨테이너 하나를 가동하더라도 디플로이먼트 사용을 권장한다
- 파드에 장애가 발생했을 때 자동으로 파드가 다시 생성된다
- Deployment 오브젝트가 Pod의 버전을 관리하는 과정
  ![](/images/kube_17.png)  

### 메니페스트 파일

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: echo-deploy
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  replicas: 4
  selector:
    matchLabels:
      app: echo
      tier: app
  template:
    metadata:
      labels:
        app: echo
        tier: app
    spec:
      containers:
        - name: echo
          image: ghcr.io/subicura/echo:v2
```

spec에는 `replicas`, `selector`, `template`, `strategy`  등이 있습니다.  
[(Deployment 공식문서 참고)](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/deployment-v1/#DeploymentSpec){:target="_blank"}  

### 디플로이먼트 업데이트 전략

- 기본값은 RollingUpdate 이고 그 밖에 Recreate가 있다

- Recreate
  - 모든 파드를 한 번 삭제하고 다시 파드를 생성 => 다운타임이 발생하지만 추가 리로스를 사용하지 않고 전환이 빠른 장점이 있다
  - (기존 레플리카셋의 레플리카 수를 0으로 한다. 이 후 신규 레플리카셋을 생성해서 파드수를 늘린다
  - (딱 레플리카 수만큼의 컴퓨팅 리소스만 필요)
  - 개발 단계에서 유용


- RollingUpdate
  - 새로운 버전을 배포하면서 이전 버전을 종료한다
  - 레플리카 수 이상의 컴퓨팅 리소스가 일시적으로 필요하게 된다
  - RollingUpdate 옵션: `maxUnavailable`, `maxSurge`
    - `maxUnavailable`: 업데이트 중에 한 번에 정지 가능한 최대 파드 수 (또는 비율)
    - `maxSurge`: 업데이트 중에 가질 수 있는 최대 파드 수 (또는 비율)

![](/images/kube_19.png)  

### 디플로이먼트 실습



## DaemonSet


- 데몬셋은 레플리카셋의 특수한 형태
- 데몬셋은 파드를 각 노드에 한 개씩 배치하는 리소스
- 노드를 늘리면 파드도 자동으로 늘어남
- 모든 노드에서 반드시 동작해야 하는 프로세스에 유용하게 사용된다
- (ex. 로그를 호스트 단위로 수집하는 Fluentd, 파드 리소스 사용 현황 및 노드 상태를 모니터링하는 Datadog)


### 매니페스트 파일

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: sample-ds
spec:
  updateStrategy:
    type: OnDelete
  # type: RollingUpdate
  # rollingUpdate:
  #   maxUnavailable: 2
  selector:
    matchLabels:
      app: sample-app
  template:
    metadata:
      labels:
        app: sample-app
    spec:
      containers:
      - name: nginx-container
        image: nginx:1.16
```


### 업데이트 전략

  - **OnDelete**: 노드가 정지된 경우에만 다시 실행할 때 업데이트 된다 -> 운영상 이유로 가급적 정지되면 안되는 경우 사용
  - **RollingUpdate**: 즉시 파드를 업데이트한다 -> 버전 업데이트가 바로바로 필요한 경우 사용

### 데몬셋 실습

```sh
kubectl apply -f sample-ds.yaml
```

```sh
kubectl get pods -o wide
```


## StatefulSet


- 레플리카셋의 특수한 형태
- 데이터베이스 등과 같은 스테이트풀한 워크로드에 사용하기 위한 리소스

- 생성되는 파드명의 접미사는 숫자 인덱스가 부여된 것
- 파드명이 바뀌지 않는다
- 데이터를 영구적으로 저장하기 위한 구조로 되어있다

- 스테이트풀셋에서는 `spec.volumeClaimTemplates`를 설정함으로써, 각 파드에 영구 볼륨 클레임을 설정할 수 있다
- 영구 볼륨 클레임을 사용하면 클러스터 외부의 영구 볼륨을 파드에 연결할 수 있기 때문에 언제든 데이터를 보유한 상태로 컨테이너가 생성된다. 영구 볼륨은 하나의 파드가 소유할 수도 있고, 여러 파드에서 공유할 수도 있다


- 레플리카셋은 파드를 삭제하면 무작위로 삭제된다
- 스테이트풀셋은 0번째 파드가 항상 가장 먼저 생성되고, 가장 늦게 삭제된다
- 만약 마스터-슬레이브 구조로 파드를 구성한다면 스테이트풀셋의 0번째 파드를 마스터로 사용하면 된다

### 메니페스트 파일

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: sample-statefulset
spec:
  updateStrategy:
    type: OnDelete
  serviceName: sample-statefulset
  replicas: 3
  selector:
    matchLabels:
      app: sample-app
  templates:
    metadata:
      labels:
        app: sample-app
    spec:
      containers:
      - name: nginx-container
        image: nginx:1.16
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
      volumeClaimTemplates:
      - metadata:
          name: www
        spec:
          accessModes:
          - ReadWriteOnce
          resources:
            requests:
              storage: 1G
```

### 스테이트풀셋 실습

```sh
kubectl apply -f sample-statefulset.yaml
```

```sh
kubectl get statefulsets

kubectl get pods -o wide

kubectl get persistentvolumeclaims

kubectl get persistentvolumes
```

```
kubectl scale statefulset sample-statefulset --replicas=5
```

# 참고자료
- [subicura님의 kubenetes안내서](https://subicura.com/2019/05/19/kubernetes-basic-1.html){:target="_blank"}
- [하나씩 점을 찍어나가며 블로그](https://dailyheumsi.tistory.com/208#7.-configmap){:target="_blank"}
- [Kubernetes 공식문서](https://kubernetes.io/docs/reference/kubernetes-api/){:target="_blank"}
- [Rancher 공식문서](https://rancher.com/docs/rancher/v2.5/en/k8s-in-rancher/){:target="_blank"}