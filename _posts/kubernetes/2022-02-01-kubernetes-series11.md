---
layout: post
title:  'Kubernetes Series [Part11]: StatefulSet과 Headless의 조합'
description: 
date:   2022-02-01 15:01:35 +0300
image:  '/images/kubernetes_logo.png'
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

# DemonSet

- 데몬셋은 레플리카셋의 특수한 형태
- 데몬셋은 파드를 각 노드에 한 개씩 배치하는 리소스
- 노드를 늘리면 파드도 자동으로 늘어남
- 모든 노드에서 반드시 동작해야 하는 프로세스에 유용하게 사용된다
- (ex. 로그를 호스트 단위로 수집하는 Fluentd, 파드 리소스 사용 현황 및 노드 상태를 모니터링하는 Datadog)

## 업데이트 전략

  - **OnDelete**: 노드가 정지된 경우에만 다시 실행할 때 업데이트 된다 -> 운영상 이유로 가급적 정지되면 안되는 경우 사용
  - **RollingUpdate**: 즉시 파드를 업데이트한다 -> 버전 업데이트가 바로바로 필요한 경우 사용

## 매니페스트 파일

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

```sh
kubectl apply -f sample-ds.yaml
```

```sh
kubectl get pods -o wide
```

# StatefulSet

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

# Headless

- 대상이 되는 개별 파드의 IP 주소가 직접 반환되는 서비스
- 로드 밸런싱을 위한 별도의 IP 주소를 제공하지 않는다
- DNS 라운드 로빈을 사용한 엔드포인트를 제공한다
- 스테이트풀셋이 헤드리드 서비스를 사용하는 경우에만 파드명으로 IP 주소를 디스커버리할 수 있다
- (즉, `sample-statefulset-0` 등의 파드명으로 IP 주소를 가져올 수 있다)

- 헤드리스 서비스는 다음 두 가지 조건을 만족해야 한다
  - `spec.type`이 `ClusterIP`
  - `spec.clusterIP`가 `None`
- 추가로 `metadata.name` 과 스테이트풀셋의 `spec.serviceName`이 같으면, 스테이트풀셋의 파드명으로 디스커버리 가능

```yaml
# Headless 서비스

apiVersion: v1
kind: Service
metadata:
  name: sample-headless #
spec:
  type: ClusterIP
  clusterIP: None
  ports:
  - name: "http-port"
    protocol: "TCP"
    port: 80
    targetPort: 80
  selector:
    app: sample-app
```

```yaml
# StatefulSet

apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: sample-statefulset-headless
spec:
  serviceName: sample-headless #
  replicas: 3
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
        image: amsy810/echo-nginx:v2.0
```