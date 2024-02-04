---
layout: post
title:  'Kubernetes Series [Part10]: Service로 배우는 kubectl 명령어'
description: 
date:   2022-02-01 15:01:35 +0300
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
apiVersion: v1
kind: Service
metadata:
  name: order # <서비스명>
  namespace: snackbar 
  labels:
    service: order
    project: snackbar
spec:
  type: ClusterIP
  selector: # <Deployment 오브젝트 매핑>
    service: order
    project: snackbar
  ports:
  - port: 80 # <서비스 오브젝트의 포트>
    targetPort: 8080 # <Deployment 오브젝트에서 원하는 컨테이너의 포트>

---

apiVersion: v1
kind: Service
metadata:
  name: payment
  namespace: snackbar
  labels:
    service: payment
    project: snackbar
spec:
  type: ClusterIP
  selector:
    service: payment
    project: snackbar
  ports:
  - port: 80
    targetPort: 8080

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: order
  namespace: snackbar
  labels: # <서비스가 매핑하기 위해 찾는 부분>
    service: order
    project: snackbar
spec:
  replicas: 2
  selector: # <복제할 파드 매핑>
    matchLabels:
      service: order
      project: snackbar
  template:
    metadata:
      labels:
        service: order
        project: snackbar
    spec:
      containers:
      - name: order
        image: yoonjeong/order:1.0
        ports:
        - containerPort: 8080 # <서비스 오브젝트의 targetPort와 일치시키는 부분>
        resources:
          limits:
            memory: "64Mi"
            cpu: "50m"

--- 

apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment
  namespace: snackbar
  labels:
    service: payment
    project: snackbar
spec:
  replicas: 2
  selector:
    matchLabels:
      service: payment
      project: snackbar
  template:
    metadata:
      labels:
        service: payment
        project: snackbar
    spec:
      containers:
      - name: payment
        image: yoonjeong/payment:1.0
        ports:
        - containerPort: 8080
        resources:
          limits:
            memory: "64Mi"
            cpu: "50m"
```

```sh
kubectl create namespace snackbar
```

```sh
kubectl apply -f ./snackbar/service-deployment.yaml
```

```sh
kubectl get all -n snackbar
```

![](/images/kube_c_1.png)

```sh
kubectl get svc -o wide -n snackbar
```

![](/images/kube_c_2.png)

```sh
kubectl get endpoints -n snackbar
```

- 서비스 오브젝트를 만들면 컨테이너에 엔드포인트 오브젝트 자동 생성

![](/images/kube_c_3.png)

```sh
kubectl exec -it order-5d45bf5796-j4g7w -c order -n snackbar -- /bin/sh
```

```sh
cat /etc/resolv.conf
```

![](/images/kube_c_4.png)

서비스 관련 환경변수는 모든 오브젝트에 저장됨

![](/images/kube_c_5.png)

order 컨테이너에 payment 서비스 관련 환경변수도 저장되어 있음 -> 환경 변수로 통신할 수 있게함  

```sh
curl ${PAYMENT_SERVICE_HOST}:${PAYMENT_SERVICE_PORT}
```

![](/images/kube_c_6.png)

payment 서비스를 이용해서 통신하는 방법  

```sh
# 여기서 payment는 Service 오브젝트의 metadata.name에 해당한다
curl payment:80
```

![](/images/kube_c_7.png)

만약 다른 네임스페이스에 있는 파드인 경우 <서비스명>.<네임스페이스명> 으로 하면된다.  

```
curl payment.snackbar:80
```