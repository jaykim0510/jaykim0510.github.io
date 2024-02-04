---
layout: post
title:  'Kubernetes Series [Part2]: Kubernetes 기본 명령어'
description: 
date:   2022-01-01 15:01:35 +0300
image:  '/images/kubernetes_logo.png'
logo_image:  '/images/kubernetes_logo.png'
category: devops
tag: kubernetes
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---


- 쿠버네티스에서 클러스터 조작은 모두 마스터 API 를 통해 이루어진다
- 직접 API에 요청을 보내거나 클라이언트 라이브러리를 사용해 클러스터를 조작할 수도 있지만,
- 수동으로 조작하는 경우에는 CLI 도구인 kubectl을 사용하는 것이 일반적이다
- kubectl은 kubeconfig ( ~/.kube/config)에 쓰여있는 정보를 사용하여 접속한다
- kubectl 명령어 실행은 바로 전달되지만, 바로 처리가 되지는 않는다
- (실제 리소스 처리는 비동기로 실행되기 때문에 바로 완료되지 않을 수 있다)

# 리소스 생성/삭제/갱신

```sh
# 리소스 생성
# 리소스가 있을 경우 에러 발생
kubectl create -f sample-pod.yaml
```

```sh
# 리소스 조회
kubectl get pods
```

```sh
# 리소스 삭제
# 리소스가 없을 경우 에러 발생
kubectl delete -f sample-pod.yaml

# 파일을 사용하지 않고 리소스 종류와 이름으로 지정해 삭제할 수도 있다
kubectl delete pod sample-pod

# 특정 리소스 종류를 모두 삭제
kubectl delete pod --all

# 리소스 처리를 완료하고 명령어 실행을 종료
kubectl delete -f sample-pod.yaml --wait

# 리소스 즉시 강제 삭제
kubectl delete -f sample-pod.yaml --force
```

```sh
# 리소스 수정
# 변경 부분이 있으면 적용하고, 없으면 적용하지 않는다
# 리소스가 없으면 create 명령어와 동일하게 리소스를 새로 생성한다
# 일반적으로 create 보다 apply를 사용하는 것이 편하다

kubectl apply -f sample-pod.yaml
```

# 파드 재기동

```sh
# 디플로이먼트와 같은 리소스에 연결되어 있는 모든 파드를 재기동할 수 있다
# 재실행하고 싶거나, 시크릿 리소스에서 참조되는 환경변수를 변경하고 싶을 때 사용하면 좋다

kubectl rollout restart deployment sample-deployment
```

# 실행 순서를 지켜야 하는 리소스의 경우

- 한 개의 매니페스트에 여러 리소스를 정의할 수 있다
- 매니페스트에 작성된 순서대로 리소스가 적용된다
- 중간에 리소스에 에러가 발생하면, 이후 정의된 리소스는 적용되지 않는다
- 리소스간 구분은 `---`으로 한다

# 여러 매니페스트 파일 적용

- 디렉터리를 경로로 해서 실행하면 디렉터리 안에 리소스들이 함께 적용된다
- 파일명 순으로 매니페스트 파일이 적용되기 때문에 순서를 제어하고 싶을 때는 파일명 앞에 인덱스 번호를 지정하면 된다
- 디렉터리 안에 디렉터리가 있는 경우에는 `-R`을 사용하면 된다

```
kubectl apply -f ./dir

kubectl apply -f ./dir -R
```

# 레이블

- 레이블은 리소스를 구분하기 위한 정보

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-pod
  labels:
    app: A
    env: dev
```

- 레이블은 수많은 리소스에 대해 동일한 레이블로 그룹핑하여 처리하거나, 어떤 처리에 대한 조건으로 사용된다
- 레플리카 리소스는 레이블을 이용해 파드의 수를 일정하게 유지한다
- 서비스 리소스는 레이블을 긱준으로 목적지 파드를 결정한다

```sh
# app 레이블이 A이고 env 레이블을 가진 파드 조회
kubectl get pods -l app=A, env
```

```sh
# 조회할 때 app 레이블 컬럼으로 표시
kubectl get pods -L app
-------------------------------------
NAME READY STATUS RESTARTS AGE APP
```

```sh
# -l -L 옵션 함께 사용 가능
kubectl get pods -l app=A, env -L env
```

```sh
# 모든 레이블을 LABELS 컬럼에 표시
kubectl get pods --show-labels
```

# 리소스 조회: get

```sh
# 레이블이 label1: val인 파드들의 레이블을 LABELS 컬럼에 표시
kubectl get pods -l label1=val1 --show-labels
```

```sh
# 파드 목록 상세 표시
kubectl get pods -o wide

# 파드 목록 yaml 형태로 표시
kubectl get pods -o yaml

# 파드의 특정 항목 표시
kubectl get pods sample-pod -o jsonpath="{.metadata.name}"

# 배열 데이터의 일부 항목 표시
# 배열[] 안에 ?(@.field == value) 형식으로 지정
kubectl get pod sample-pod -o jsonpath="{.spec.containers[?(@.name == 'nginx-container')].image}"

# 노드 목록 표시
kubectl get nodes

# 모든 종류의 리소스 표시
kubectl get all

# 리소스 상태 변화를 실시간으로 출력
kubectl get pods --watch
```

# 리소스 상세 정보: describe

```sh
kubectl describe pod sample-pod

kubectl describe node gke-k8s-default
```

# 실제 리소스 사용량 확인: top

```sh
# describe에 나타난 리소스는 사용량이 아니라 확보한 용량

# 노드의 리소스 사용량 조회
kubectl top node

# 파드별 리소스 사용량 조회
kubectl -n default top pod

# 컨테이너별 리소스 사용량 조회
kubectl -n default top pod --containers
```

# 컨테이너에 명령어 전달: exec

```sh
# -i: 표준 입출력을 패스스루
# -t: 가상 터미널 생성
# -- 다음에 전달할 명령어
kubectl exec -it sample-pod -- /bin/ls

# 특정 컨테이너에 명령어 실행
kubectl exec -it sample-pod -c nginx-container -- /bin/bash
```

# 포트 포워딩: port-forward

```sh
# 로컬 머신에서 파드로 포트 포워딩
kubectl port-forward sample-pod 8888:80

# 파드가 아닌 디플로이먼트 리소스나 서비스 리소스에 연결되는 파드에도 포트 포워딩을 할 수 있다
kubectl port-forward deployment/sample-deployment 8888:80
kubectl port-forward service/sample-service 8888:80
```

# 컨테이너 로그 확인: logs

```sh
kubectl logs sample-pod

# 특정 컨테이너 로그 출력
kubectl logs sample-pod -c nginx-container

# 실시간 로그 출력
kubectl logs -f sample-pod
```

# 컨테이너와 로컬간의 파일 복사: cp

```sh
# 파드의 파일을 로컬 머신에 복사
kubectl cp sample-pod:etc/sample.txt ./sample.txt

# 로컬 파일을 컨테이너로 복사
kubectl cp ./sample.txt sample-pod:/tmp/
```