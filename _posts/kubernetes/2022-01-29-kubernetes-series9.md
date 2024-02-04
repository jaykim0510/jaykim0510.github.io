---
layout: post
title:  'Kubernetes Series [Part9]: Deployment로 배우는 kubectl 명령어'
description: 
date:   2022-01-29 15:01:35 +0300
image:  '/images/kubernetes_logo.png'
logo_image:  '/images/kubernetes_logo.png'
category: devops
tag: [kubernetes]
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
        project: fastcampus
        env: production
    spec:
      containers:
      - name: my-app
        image: yoonjeong/my-app:1.0
        ports:
        - containerPort: 8080
        resources:
          limits:
            memory: "64Mi"
            cpu: "50m"
```

```
kubectl apply -f ./my-app/deployment.yaml
```

```
kubectl get pods -L app,env,project
```

![](/images/kube_de_1.png)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
        project: fastcampus
        env: development # 레이블 변경
    spec:
      containers:
      - name: my-app
        image: yoonjeong/my-app:1.0
        ports:
        - containerPort: 8080
        resources:
          limits:
            memory: "64Mi"
            cpu: "50m"
```

```
kubectl apply -f ./my-app/deployment.yaml
```

```
kubectl get pods -L app,env,project
```

![](/images/kube_de_2.png)

위 과정을 `-w` (Watch 모드)를 사용해서 실시간으로 변화를 관찰할 수도 있음

```
kubectl get pods -L app,env,project -w
```

![](/images/kube_de_3.png)

# 배포 전략

- spec의 `strategy`에 설정
- Recreate
  - 기존 버전 모두 삭제한 후, 새로운 버전으로 모두 새로 띄움
  - 중간에 서비스가 중단되는 시점이 생김 -> 개발 단계에서 주로 사용
- RollingUpdate
  - 기존 버전을 단계적으로 줄이고, 새로운 버전을 단계적으로 늘려나감
  - 무중단 업데이트 가능 -> 서비스 단계에서 주로 사용
  - RollingUpdate에는 두 가지 옵션이 있다 (리소스 사용량을 조절하기 위해)
  - maxUnavailable: 업데이트를 위해 한 번에 얼마나 기존 파드를 종료할 것인지 (개수 또는 퍼센트로 표현)
  - maxSurge: 업데이트를 위해 리소스를 기존에 비해 얼마나 초과할 수 있는지 (개수 또는 퍼센트로 표현)
  ```yaml
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 2
      maxSurge: 1
  ```

```yaml
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: my-app
        project: fastcampus
        env: production
        version: v1
    spec:
      containers:
      - name: my-app
        image: yoonjeong/my-app:1.0
        ports:
        - containerPort: 8080
        resources:
          limits:
            memory: "64Mi"
            cpu: "50m"
```

```
kubectl get pods -L app,version
```

![](/images/kube_de_4.png)

version 레이블을 v2로 바꾸고 다시 적용(apply) 해보면,  

![](/images/kube_de_5.png)

변경이 잘 적용되었다. 정말 기존 버전 파드가 모두 삭제되고 새로운 버전이 생긴건지 확인해보자.  

```
kubectl get rw -w
```

![](/images/kube_de_6.png)


strategy 를 RollingUpdate 했을 떄의 과정은 다음과 같다.  

![](/images/kube_de_7.png)