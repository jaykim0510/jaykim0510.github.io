---
layout: post
title: "Kubernetes Series [Part5]: ConfigMap과 Secret"
description:
date: 2022-01-28 15:01:35 +0300
image: "/images/kubernetes_logo.png"
logo_image: "/images/kubernetes_logo.png"
categories: devops
tags: Kubernetes
---

---

**Table of Contents**
{: #toc }

- TOC
  {:toc}

---

- 컨테이너에 대한 설정파일
- 패스워드와 같은 기밀 정보
- 환경 변수

# 기본 방법

- 개별 컨테이너의 설정 내용은 환경 변수나 파일이 저장되어 있는 영역을 마운트하여 전달하는 것이 일반적이다
- 쿠버네티스에서 환경 변수를 전달할 때는 파드 템플릿에 `env` 또는 `envForm`을 지정한다
- `command`나 `args`에 환경 변수 전달할 때는 `$()` 표기법으로 나타낸다 (또한 매니페스트에서 정의한 환경 변수만 사용할 수 있다)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-env
  labels:
    app: sample-app
spec:
  containers:
    - name: nginx-container
      image: nginx:1.16
      command: ["echo"]
      # K8S_NODE는 환경 변수로 인식, HOSTNAME은 그냥 문자열로 출력 (매니페스트에서 정의한 환경 변수만 사용 가능)
      args: ["$(K8S_NODE)", "$(HOSTNAME)"]
      env:
        # 단순 키,벨류 형태
        - name: MAX_CONNECTION
          value: "100"
        # 파드 정보를 참조할 때
        - name: K8S_NODE
          valueFrom:
            fieldRef:
              fieldPath: spec.nodeName
        # 컨테이너 리소스 정보
        - name: CPU_LIMITS
          valueFrom:
            resourceFieldRef:
              containerName: nginx-container
              resource: limits.cpu
```

# ConfigMap

- 위의 방법처럼 매번 파드에 환경 변수를 설정해도 되지만,
- 여러 파드에 적용해야할 경우 컨피그맵을 사용해 한 번에 적용/관리할 수 있다
- 컨피그맵은 설정파일을 외부화할 수 있게 도와준다
- 키-벨류 형식 외에도 `.conf` 같은 설정 파일 자체도 저장할 수 있다

## 컨피그맵 리소스 만드는 방법

- 보통 리소스는 YAML 형태의 매니페스트 파일을 통해 만들지만, 컨피그맵은 여러 방법으로 리소스를 만들 수 있다
- 파일에서 값을 참조해 생성하는 방법 (`--from-file`)
- 직접 값을 전달해서 생성하는 방법 (`--from-literal`)
- 매니페스트로 생성하는 방법(`-f`)

```sh
# 파일명이 키(key)가되고, 파일안의 내용이 값(value)가 된다
kubectl create configmap <컨피그 리소스명> --from-file <파일명>

(ex. kubectl create configmap my-config --from-file NAME => key는 NAME, value는 'mike')
(만약 NAME.txt 처럼 확장자가 포함된 파일의 경우, --from-file NAME.txt=NAME 이런식으로 적어주면 된다)

# 폴더명을 전달하면 폴더안의 파일과 내용이 각각 키와 값이 된다
kubectl create configmap <컨피그 리소스명> --from-file <폴더명>

# .conf 와 같은 파일을 전달할 수도 있다
kubectl create configmap <컨피그 리소스명> --from-file ./server.conf
```

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: sample-configmap
data:
  thread: "16"
  nginx.conf: |
    user nginx;
    worker_processes auto;
    pid /run/nginx.pid;
  test.sh: |
    #!/bin/bash
    echo "hello"
    sleep infinity
```

```sh
kubectl create configmap <컨피그 리소스명> -f myconfig.yaml
```

## 컨피그맵 리소스 사용하는 방법

- 환경 변수를 전달하는 방법

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-pod
spec:
  containers:
    - name: configmap-container
      image: nginx:1.16
      env:
        - name: CONNECTION_MAX
          valueFrom:
            configMapKeyRef: # 특정 키만
              name: <컨피그 리소스명>
              key: connection.max
      envFrom:
        - configMapRef: # 컨피그맵에 정의된 전체 키 (키 값이 매니페스트 파일에 직접 명시되지 않아 가독성 조금 떨어짐)
            name: <컨피그 리소스명>
```

- 볼륨으로 마운트하는 방법

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-pod
spec:
  containers:
  - name: my-container
    image: nginx:1.16
    volumeMounts:
    - name: <볼륨명>
      mountPath: <마운트할 컨테이너 경로>
  volumes:
  - name: <볼륨명>
    configMap:
      name: <컨피그 리소스명>
      items: # 특정 키만
      - key: nginx.conf
        path: <컨테이너에 저장될 파일명> (보통 key와 똑같이 함)
        # 최종적으로 컨테이너에 mountPath/path 로 저장됨
    configMap:
      name: <컨피그 리소스명> # 컨피그 맵에 정의된 전체 키
```

## 컨피그맵 업데이트

- 환경 변수로 전달했으면, 업데이트 하기 위해 파드를 재기동 해야 한다
  - `kubectl rollout restart`
- 볼륨 마운트로 전달했으면 60초마다 자동 업데이트 된다

# Secret

- 기밀 정보를 취급하기 위한 리소스
- 시크릿 데이터는 etcd에 저장된다
- 시크릿을 사용하는 파드가 있는 경우에만 etcd에서 쿠버네티스 노드에 데이터를 보낸다
- 이 때 노드상에 영구적으로 데이터가 남지 않도록 tmpfs(메모리상에 구축된 임시 파일시스템)에 저장된다
- 시크릿이 안전한 또 다른 이유는 kubectl 명령어로 표시했을 때 값이 보기 어렵게 되어있다는 점이다

# 참고

- [kubernetes 공식문서, ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/#using-configmaps-as-files-from-a-pod)
