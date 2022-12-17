---
layout: post
cssclass: yellowCab, wideTable
title:  'Kubernetes Series [Part2]: Kubernetes Object'
description: Pod는 쿠버네티스에서 배포할 수 있는 가장 작은 단위의 오브젝트로 한 개 이상의 컨테이너와 스토리지, 네트워크 속성을 가집니다.  
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


## Workload Object
> Workloads are objects that set deployment rules for pods. Based on these rules, Kubernetes performs the deployment and updates the workload with the current state of the application. Workloads let you define the rules for application scheduling, scaling, and upgrade.  

[(Rancher문서 참고)](https://rancher.com/docs/rancher/v2.5/en/k8s-in-rancher/workloads/){:target="_blank"}

![](/images/kube_10.png)  

### Pod

![](/images/kube_11.png)  

Pod는 쿠버네티스에서 배포할 수 있는 가장 작은 단위의 오브젝트로 한 개 이상의 컨테이너와 스토리지, 네트워크 속성을 가집니다. Pod에 속한 컨테이너는 스토리지와 네트워크를 공유하고 서로 `localhost`로 접근할 수 있습니다. 컨테이너를 하나만 사용하는 경우도 반드시 Pod으로 감싸서 관리합니다.  

Pod가 생성되는 과정은 다음과 같습니다.  

![](/images/kube_12.png)  

Scheduler는 계속 할당할 새로운 Pod가 있는지 체크하고 있으면 노드에 할당합니다. 그러면 노드에 있는 Kubelet은 컨테이너를 생성하고 결과를 API서버에 보고합니다.  

🐨 __오브젝트 생성을 위한 YAML파일__

Pod를 포함해 쿠버네티스의 오브젝트를 만들기 위해서는 YAML파일이 필요합니다. YAML파일에 오브젝트를 위한 설정들을 작성할 수 있는데, 이 때 필수적으로 사용되는 key값들이 있습니다.  

|Key|설명|예|
|---|---|---|
|apiVersion|오브젝트 버전|v1, app/v1, ..|
|kind|오브젝트 종류|Pod, ReplicaSet, Deployment, ..|
|metadata|메타데이터|name, label, ..|
|spec|오브젝트 별 상세 설정|오브젝트마다 다름|

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

### ReplicaSet

![](/images/kube_13.png)  

ReplicaSet은 Pod을 여러 개(한 개 이상) 복제하여 관리하는 오브젝트입니다. 단일 노드 환경이면 Pod는 모두 단일 노드에서 생성되고, 여러개의 노드를 가지고 있는 상황이면, Pod는 노드에 각각 분산되어 배포됩니다.(노드 장애 대비) 이 때 Pod를 어떤 노드에 배치할지는 스케줄러가 결정하게 됩니다. 보통 직접적으로 ReplicaSet을 사용하기보다는 Deployment등 다른 오브젝트에 의해서 사용되는 경우가 많습니다.  

ReplicaSet은 다음과 같이 동작합니다.  

![](/images/kube_14.png)  

ReplicaSet controller가 desired state에 맞춰 Pod를 생성합니다. 그러면 Scheduler는 생성된 Pod를 노드에 할당해줍니다.  

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: echo-rs
spec:
  replicas: 3
  selector:
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

### Deployment  

![](/images/kube_18.png)  

Deployment는 쿠버네티스에서 가장 널리 사용되는 오브젝트입니다. ReplicaSet을 이용하여 Pod을 업데이트하고 이력을 관리하여 롤백Rollback하거나 특정 버전revision으로 돌아갈 수 있습니다.

Deployment 오브젝트가 Pod의 버전을 관리하는 과정은 다음과 같습니다.  

![](/images/kube_17.png)  

Deployment Controller가 Deploy 조건을 체크하면서 원하는 버전에 맞게 Pod의 버전을 맞춥니다. 이 때 ReplicaSet에 있는 Pod들을 보통 한 번에 바꾸지 않고 조건에 맞게(예를 들어, 25%씩) 바꿔나감으로써 버전을 바꾸더라도 중간에 서비스가 중단되지 않도록 합니다. (무중단배포)

![](/images/kube_19.png)  

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

## Service관련 리소스
> In many use cases, a workload has to be accessed by other workloads in the cluster or exposed to the outside world.

### Service  

![](/images/kube_20.png)  


Service는 네트워크와 관련된 오브젝트입니다. Pod은 자체 IP를 가지고 다른 Pod와 통신할 수 있지만, 쉽게 사라지고 생성되는 특징 때문에 직접 통신하는 방법은 권장하지 않습니다. 쿠버네티스는 Pod와 직접 통신하는 방법 대신, 별도의 고정된 IP를 가진 서비스를 만들고 그 서비스를 통해 Pod에 접근하는 방식을 사용합니다.  
Pod을 외부 네트워크와 연결해주고 여러 개의 Pod을 바라보는 내부 로드 밸런서를 생성할 때 사용합니다. 내부 DNS에 서비스 이름을 도메인으로 등록하기 때문에 서비스 디스커버리 역할도 합니다.  

- ClusterIP: Pod가 동적으로 소멸/생성 되더라도 IP는 고정될 수 있도록 하는 역할
- NodePort: 외부에서 접근가능하도록 하는 포트 역할
- LoadBalancer: 살아있는 노드로 자동으로 연결해주는 역할

NodePort는 기본적으로 ClusterIP의 기능을 포함하고 있고, LoadBalancer는 NodePort의 기능을 포함하고 있습니다.  

```yaml
# ClusterIP
# redis라는 Deployment 오브젝트에 IP할당
apiVersion: v1
kind: Service
metadata:
  name: redis
spec:
  ports:
    - port: 6379 # clusterIP의 포트 (targetPort따로 없으면 targetPort(pod의 포트)도 6379가 됨)
      protocol: TCP
  selector: # 어떤pod로 트래픽을 전달할지 결정
    app: counter
    tier: db
```

```yaml
# NodePort
apiVersion: v1
kind: Service
metadata:
  name: counter-np
spec:
  type: NodePort
  ports:
    - port: 3000 # ClusterIP, Pod IP의 포트
      protocol: TCP
      nodePort: 31000 # Node IP의 포트
  selector:
    app: counter
    tier: app
```

```yaml
# LoadBalancer
apiVersion: v1
kind: Service
metadata:
  name: counter-lb
spec:
  type: LoadBalancer
  ports:
    - port: 30000
      targetPort: 3000
      protocol: TCP
  selector:
    app: counter
    tier: app
```

### Ingress  

![](/images/kube_21.png)  

Ingress는 경로 기반 라우팅 서비스를 제공해주는 오브젝트입니다.  

LoadBalancer는 단점이 있습니다. LoadBalancer는 한 개의 IP주소로 한 개의 서비스만 핸들링할 수 있습니다. 그래서 만약 N개의 서비스를 실행 중이라면 N개의 LoadBalancer가 필요합니다. 또한 보통 클라우드 프로바이더(AWS, GCP 등)의 로드밸런서를 생성해 사용하기 때문에 로컬서버에서는 사용이 어렵습니다.   

Ingress는 경로 기반 라우팅 서비스를 통해 N개의 service를 하나의 IP주소를 이용하더라도 경로를 통해 분기할 수 있습니다.  

Ingress는 Pod, ReplicaSet, Deployment, Service와 달리 별도의 컨트롤러를 설치해야 합니다. 컨트롤러에는 대표적으로 `nginx`, `haproxy`, `traefik`, `alb`등이 있습니다.

minikube를 이용할 경우 다음 명령어로 설치할 수 있습니다.  

```sh
# nginx ingress controller
minikube addons enable ingress
```

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: echo-v1
spec:
  rules:
    - host: v1.echo.192.168.64.5.sslip.io
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: echo-v1
                port:
                  number: 3000
# 들어오는 요청의 host가 v1.echo.192.168.64.5.sslip.io이면 host echo-v1이라는 서비스가 가지는 IP 주소의 3000번 포트로 보내라
```

spec에는 `rules`, `defaultBackend`(어느 rule에도 속하지 않을 경우) 등이 있습니다.  
[(Ingress 공식문서 참고)](https://kubernetes.io/docs/reference/kubernetes-api/service-resources/ingress-v1/){:target="_blank"}

## Config and Storage관련 리소스

### ConfigMap  

![](/images/kube_22.png)  

ConfigMap은 설정, 환경 변수들을 담는 오브젝트입니다. 예를 들어 개발/운영에 따라 환경 변수값이 다른 경우, ConfigMap 을 활용해 Pod 생성시 넣어줄 수 있습니다.  

ConfigMap을 다양한 방법으로 만들 수 있습니다.  
- ConfigMap yaml 파일로 오브젝트 생성
- 환경 변수 설정을 담고 있는 yaml파일을 ConfigMap 오브젝트로 생성
- 그냥 환경 변수를 담고 있는 임의의 파일을 ConfigMap 오브젝트로 생성

```yaml
# ConfigMap yaml파일
apiVersion: v1 # 참고로 v1이면 core API group
kind: ConfigMap
metadata:
  name: my-config
data:
  hello: world
  kuber: netes
```

```sh
kubectl apply -f config-map.yml
```

```yaml
# 환경 변수 설정을 담고 있는 yaml파일
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: prometheus
    metrics_path: /prometheus/metrics
    static_configs:
      - targets:
          - localhost:9090
```

```sh
# yaml 파일로 ConfigMap 파일 생성
kubectl create cm my-config --from-file=config-file.yml

# ConfigMap 적용
kubectl apply -f my-config.yml
```

```sh
# config-env.yml파일 (yml파일 아니지만 그냥 확장자 yml로 해놓아도됨)
hello=world
haha=hoho
```

```sh
# 임의의 파일로 ConfigMap 파일 생성
kubectl create cm env-config --from-env-file=config-env.yml

# ConfigMap 적용
kubectl apply -f env-config.yml
```

여러 가지 방법으로 ConfigMap을 Pod에 적용할 수 있습니다.  
- 디스크 볼륨 마운트
- 환경변수로 사용

```yaml
# ConfigMap yaml파일이 있는 볼륨 마운트
apiVersion: v1
kind: Pod
metadata:
  name: alpine
spec:
  containers:
    - name: alpine
      image: alpine
      command: ["sleep"]
      args: ["100000"]
      volumeMounts:
        - name: config-vol
          mountPath: /etc/config
  volumes:
    - name: config-vol
      configMap:
        name: my-config
```

```yaml
# ConfigMap yaml파일 직접 환경변수로 설정
apiVersion: v1
kind: Pod
metadata:
  name: alpine-env
spec:
  containers:
    - name: alpine
      image: alpine
      command: ["sleep"]
      args: ["100000"]
      env:
        - name: hello
          valueFrom:
            configMapKeyRef:
              name: my-config
              key: hello
```

### Volume  
Volume은 저장소와 관련된 오브젝트입니다. 지금까지 만들었던 컨테이너는 Pod을 제거하면 컨테이너 내부에 저장했던 데이터도 모두 사라집니다. MySQL과 같은 데이터베이스는 데이터가 유실되지 않도록 반드시 별도의 저장소에 데이터를 저장하고 컨테이너를 새로 만들 때 이전 데이터를 가져와야 합니다.  
저장소를 호스트 디렉토리를 사용할 수도 있고 EBS 같은 스토리지를 동적으로 생성하여 사용할 수도 있습니다. 사실상 인기 있는 대부분의 저장 방식을 지원합니다.  

저장소의 종류에는 다음과 같은 것들이 있습니다.  

- 임시 디스크
  - emptyDir
    - Pod 이 생성되고 삭제될 때, 같이 생성되고 삭제되는 임시 디스크
    - 생성 당시에는 아무 것도 없는 빈 상태
    - 물리 디스크(노드), 메모리에 저장
- 로컬 디스크
  - hostpath
    - 노드가 생성될 때 이미 존재하고 있는 디렉토리
- 네트워크 디스크
  - awsElasticBlockStore, azureDisk 등
  
```yaml
# emptydir
apiVersion: v1
kind: Pod
metadata:
  name: shared-volumes 
spec:
  containers:
  - name: redis
    image: redis
    volumeMounts:
    - name: shared-storage
      mountPath: /data/shared
  - name: nginx
    image: nginx
    volumeMounts:
    - name: shared-storage
      mountPath: /data/shared
  volumes:
  - name : shared-storage
    emptyDir: {}
```

```yaml
# hostpath
apiVersion: v1
kind: Pod
metadata:
  name: host-log
spec:
  containers:
    - name: log
      image: busybox
      args: ["/bin/sh", "-c", "sleep infinity"]
      volumeMounts:
        - name: varlog
          mountPath: /host/var/log
  volumes:
    - name: varlog
      hostPath:
        path: /var/log
```

# 참고자료
- [subicura님의 kubenetes안내서](https://subicura.com/2019/05/19/kubernetes-basic-1.html){:target="_blank"}
- [하나씩 점을 찍어나가며 블로그](https://dailyheumsi.tistory.com/208#7.-configmap){:target="_blank"}
- [Kubernetes 공식문서](https://kubernetes.io/docs/reference/kubernetes-api/){:target="_blank"}
- [Rancher 공식문서](https://rancher.com/docs/rancher/v2.5/en/k8s-in-rancher/){:target="_blank"}