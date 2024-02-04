---
layout: post
title:  'Kubernetes Series [Part6]: Volume'
description: 
date:   2022-01-28 15:01:35 +0300
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

# Volume

- 파드에 정적으로 볼륨을 지정하는 형태
- ex. `emptyDir`, `hostPath` 등

## emptyDir

- 파드용 임시 디스크 영역 (파드가 종료되면 삭제)
- 파드안에 직접 지정한다
- 호스트의 임시영역을 마운트 할 수도 없고, 호스트에 있는 파일을 참조할 수도 없다
- 쿠버네티스 노드의 디스크 영역이 할당된다

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: # 파드명
spec:
  containers:
  - image: # 사용할 이미지
    name: # 컨테이너명
    volumeMounts:
    - name: # 사용할 볼륨명
      mountPath: # 컨테이너 안에서 마운트할 경로
  volumes:
  - name: # 볼륨명
    emptyDir:
   #  medium: memory # 메모리 영역을 사용할 수도 있다
      sizeLimit: # 사용할 리소스 용량
```

## hostPath

- 마운트가 가능하다 (그래서 호스트 영역 지정해야함)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: # 파드명
spec:
  containers:
  - image: # 사용할 이미지
    name: # 컨테이너명
    volumeMounts:
    - name: # 사용할 볼륨명
      mountPath:
  volumes:
  - name: # 볼륨명
    hostPath:
      path: # 마운트할 호스트 경로
      type: # Directory / DirectoryOrCreate / File
```

# Persistent Volume

- 볼륨(Volume)은 파드 안에 직접 지정하는 형태로 연결한다
- 영구볼륨은 매니페스트를 통해 개별 리소스를 생성한다
- 네트워크를 통해 디스크를 어태치하는 디스크 타입이다
- (미리 영구 디스크를 생성한 후에 적용해야 한다)
- ex. GCE Persistent Disk, AWS Elastic Block Store 등

## 매니페스트 파일

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name:
  labels: # 볼륨에 레이블링 해두면 나중에 파드에서 요청할 때 알맞은 영구 볼륨 요청할 수 있음
spec:
  capacity:
    storage:
  accessModes:
  - # 접근 모드: ReadWriteOnce / ReadWriteMany / ReadOnlyMany
              # ReadWriteOnce: 단일 노드에서 읽기와 쓰기 가능
              # ReadWriteMany: 여러 노드에서 읽기와 쓰기 가능
              # ReadOnlyMany: 여러 노드에서 읽기 가능
  persistentVolumneReclaimPolicy: # 영구 볼륨을 사용한 후 처리방법: Delete / Retain / Recycle
  gcePersistentDisk: # GCE Perstent Disk 사용하는 경우
    pdName:
```

# PersistentVolumeClaim

- 영구볼륨을 요청하는 리소스
- 영구볼륨은 영구볼륨클레임을 통해 사용한다
- 영구볼륨클레임에서 지정된 조건을 기반으로 영구볼륨을 요청하면, 스케줄러는 현재 가지고 있는 영구볼륨중에서 적당한 볼륨을 할당한다

## 매니페스트 파일

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name:
spec:
  selector:
    matchLabels:
    matchExpressions:
    - key:
      operator:
      values:
  resources:
    requests:
      storage:
  accessModes:
  - ReadWriteOnce
  storageClassName:
```

```yaml
# 파드에서 영구볼륨클레임 사용 예시

apiVersion: v1
kind: Pod
metadata:
  name:
spec:
  containers:
  - image:
    name:
    volumeMounts:
    - mountPath:
      name:
  volumes:
    - name:
    persistentVolumeClaim:
      claimName: # 영구볼륨클레임명
```

```
1. 저장소 생성(Local, GCP, AWS 등)
2. PersistentVolume 생성
3. PersistentVolumeClaim 생성
4. 워크로드 오브젝트에서 사용
5. 정적으로 PersistentVolume 할당 (자원 낭비)
```

# StorageClass

- 위의 방법은 사전에 영구 볼륨을 생성해야 하는 번거로움
- 용량을 동적으로 확보할 수 없어서 리소스를 낭비할 수 있다
- StorageClass로 어디서(Local, GCP, AWS 등) 저장소를 사용할지만 정의하고, 볼륨의 크기는 PersistentVolumeClaim 에서 동적으로 프로비저닝 하자
- 동적 프로비저닝을 이용하면, 영구볼륨클레임이 생성될때 동적으로 영구볼륨을 생성하고 할당한다
- 동적 프로비저닝을 사용하려면, 사전에 어떤 영구 볼륨을 생성할지 정의하는 스토리지클래스를 정의해야 한다

```
1. 저장소 생성(Local, GCP, AWS 등)
2. StorageClass 생성
3. PersistentVolumeClaim 생성
4. 워크로드 오브젝트에서 사용
5. 동적으로 PersistentVolume 생성 및 할당
```

## 매니페스트 파일

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: # 스토리지클래스명 
parameters:
provisioner: kubernetes.io/gce-pd
reclaimPolicy:
```

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name:
spec:
  storageClassName: # 스토리지클래스명
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 3Gi
```

# 스테이트풀셋에서 영구볼륨클레임 사용

- 스테이트풀셋에서는 영구 데이터 영역을 사용하는 경우가 많다
- `spec.volumeClaimTemplate` 항목을 통해 영구볼륨클레임을 별도로 정의하지 않고도, 자동으로 영구볼륨클레임을 생성할 수 있다 (스토리지클래스 + 스테이트풀셋)

```
1. 저장소 생성(Local, GCP, AWS 등)
2. StorageClass 생성
3. 워크로드 오브젝트에서 spec.volumeClaimTemplate을 이용해 PersistentVolumeClaim 생성
4. 동적으로 PersistentVolume 생성 및 할당
```

## 매니페스트 파일

```yaml
apiVersion: apps/v1
kind: StatefulSet
...
spec:
  template:
    ...
    spec:
      containers:
      - name:
        image:
        volumeMounts:
        - name: pvc-template-volume
          mountPath: /tmp
  volumeClaimTemplates:
  - metadata:
      name: pvc-template-volume
    spec:
      storageClassName:
      accessModes:
      - ReadWriteOnce
      resources:
        requests:
          storage: 10Gi
```