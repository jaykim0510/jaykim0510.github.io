---
layout: post
title:  'Kubernetes Series [Part6]: Pod로 배우는 kubectl 명령어'
description: 
date:   2022-01-29 15:01:35 +0300
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

# 환경변수

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello-app
spec:
  containers:
  - name: hello-app-con
    image: yoonjeong/hello-app:1.0
    ports:
    - containerPort: 8080
    resources:
      limits:
        memory: "128Mi"
        cpu: "100m"
```

```sh
kubectl apply -f ./hello-app/pod.yaml
```

```sh
kubectl get pods -o wide
```

![](/images/kube_pod_1.png)

```sh
kubectl exec -it hello-app -- /bin/sh
```

```
env
```

![](/images/kube_pod_2.png)


```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello-app
spec:
  containers:
  - name: hello-app-con
    image: yoonjeong/hello-app:1.0
    ports:
    - containerPort: 8080
    env:
      - name: MY_NAME
        value: "Jay"
    resources:
      limits:
        memory: "128Mi"
        cpu: "100m"
```

```
env
```

![](/images/kube_pod_3.png)



```
kubectl get pod hello-app -o json
```

- 크게 metadata, spec, status 항목이 있음

![](/images/kube_pod_4.png)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello-app
spec:
  containers:
  - name: hello-app-con
    image: yoonjeong/hello-app:1.0
    ports:
    - containerPort: 8080
    env:
      - name: MY_NAME
        value: "Jay"
      - name: POD_IP
        valueFrom:
          fieldRef:
            fieldPath: status.podIP
      - name: NODE_IP
        valueFrom:
          fieldRef:
            fieldPath: status.hostIP
      - name: NODE_NAME
        valueFrom:
          fieldRef:
            fieldPath: spec.nodeName
    resources:
      limits:
        memory: "128Mi"
        cpu: "100m"
```

```
env
```

![](/images/kube_pod_5.png)


# 네트워크

## 파드내에 컨테이너끼리 통신

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: blue-green-app # Pod의 호스트명
spec:
  containers:
  - name: blue-app
    image: yoonjeong/blue-app:1.0
    ports:
    - containerPort: 8080
    resources:
      limits:
        memory: "64Mi"
        cpu: "100m"
```

```
kubectl apply -f blue-green-app/pod.yaml
```

```
kubectl logs blue-green-app -c blue-app
```

![](/images/kube_pod_6.png)

```
kubectl exec -it blue-green-app -c blue-app -- /bin/sh
```

```
# 블루 앱에서 그린 앱에 localhost로 통신
curl -vs localhost:8081/tree
```

![](/images/kube_pod_7.png)

## 서로 다른 파드의 컨테이너간 통신

```
kubectl apply -f red-app/pod.yaml
```

```
kubectl get pods -o wide
```

![](/images/kube_pod_8.png)

```
export RED_POD_IP=$(kubectl get pod red-app -o jsonpath="{.status.podIP}")
```

```
echo $RED_POD_IP
----------------------
10.100.1.3
```

```
kubectl exec blue-green-app -c blue-app -- curl -vs $RED_POD_IP:8080/rose
```

![](/images/kube_pod_9.png)

```
kubectl port-forward blue-green-app 8080:8080
```

```
URL: localhost:8080/sky
```

![](/images/kube_pod_10.png)

# 라벨링

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: red-app
  labels:
    category: nature
    app: rose
spec:
  containers:
  - name: red-app
    image: yoonjeong/red-app:1.0
    ports:
    - containerPort: 8080
    resources:
      limits:
        memory: "64Mi"
        cpu: "100m"
```

```sh
kubectl get pods --show-labels
```

![](/images/kube_pod_11.png)

```sh
# (라벨간에 띄어쓰기 허용 x)
kubectl get pod -L app,category
```

![](/images/kube_pod_12.png)

```sh
# --selector 대신 -l 써도됨
kubectl get pod --selector app=rose -L app
```

![](/images/kube_pod_13.png)

```sh
kubectl get pod -l 'app in (rose,sky-and-tree)' -L app
```

![](/images/kube_pod_14.png)


# 배포할 노드 지정

```sh
# 노드 목록과 레이블 확인
kubectl get nodes
```

```sh
# 노드에 Label 추가
# -- 첫번째, 세번째 노드에 soil=moist
# -- 두번째 노드에 soil=dry
kubectl label node <1번째 노드> <3번째 노드> soil=moist
kubectl label node <2번째 노드> soil=dry
```

![](/images/kube_pod_15.png)

```sh
# soil 노드 레이블 확인
kubectl get node -L soil
```

![](/images/kube_pod_16.png)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: red-app
spec:
  nodeSelector:
    soil: moist
  containers:
  - name: red-app
    image: yoonjeong/red-app:1.0
    ports:
    - containerPort: 8080
    resources:
      limits:
        memory: "64Mi"
        cpu: "100m"
```

![](/images/kube_pod_17.png)

# 파드 삭제하기

```
kubectl delete pod --all
```

```
kubectl delete pod -l app=rose
```