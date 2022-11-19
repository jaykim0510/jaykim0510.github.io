---
layout: post
title:  'Kubernetes Series [Part8]: Replicaset로 배우는 kubectl 명령어'
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

- spec에 `selector`와 `replicas`가 추가
  - `selector`: Replicaset 오브젝트가 담당할 파드 매칭
  - `replicas`: 복제할 파드의 개수

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: blue-replicaset
spec:
  selector:
    matchLabels:
      app: blue-app
  replicas: 3
  template:
    metadata:
      labels:
        app: blue-app
    spec:
      containers:
      - name: blue-app
        image: yoonjeong/blue-app:1.0
        ports:
        - containerPort: 8080
        env:
        - name: NODE_NAME
          valueFrom:
            fieldRef:
              fieldPath: spec.nodeName
        resources:
          limits:
            memory: "64Mi"
            cpu: "50m"
```

```
kubectl get rs blue-replicaset -o wide
```

![](/images/kube_pod_19.png)


```
kubectl apply -f ./blue-app/replicaset.yaml 
```

![](/images/kube_pod_18.png)

# 오브젝트 정보 확인

```
kubectl describe rs blue-replicaset
```

![](/images/kube_repli_1.png)

```
kubectl get rs blue-replicaset -o json
```

![](/images/kube_repli_2.png)

# 쿠버네티스 명령 수행 순서 확인하기

```
kubectl get events --sort-by=.metadata.creationTimestamp
```

![](/images/kube_repli_3.png)

# Replicaset 오브젝트 삭제하기

```
kubectl delete rs blue-replicaset
```

(파드부터 삭제하면 Replicaset 오브젝트가 계속 새로 생성함 -> 삭제할 때는 Replicaset 오브젝트)

# Scale up/down

```
kubectl scale rs blue-replicaset --replicas=1
```

![](/images/kube_repli_5.png)

# Replicaset 템플릿 변경후 다시 적용하면

- Replicaset 생성 후, 템플릿 변경 후 다시 apply 적용하면?
- 이미 배포된 파드에는 변경이 적용 안됨 (이미 replicas 수만큼 배포돼 있으므로)
- 만약 의도적으로 파드 한 개를 삭제하면, 그 다음부터 새로 띄어지는 파드는 템플릿 변경 후의 파드
- 이를 자동으로 버전 롤업/롤백해주는 오브젝트가 Deployment