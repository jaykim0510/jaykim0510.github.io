---
layout: post
title: 'Flink Series [Part3]: 스트림 처리의 핵심(2) 상태관리'
description: 
date: 2022-02-05 15:01:35 +0300
logo_image: '/images/flink_logo.png'
image: '/images/flink_logo.png'
categories: DE
tags: Flink
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# State

대부분의 어플리케이션은 상태를 저장하고 활용(stateful)합니다. 만약 각각의 이벤트를 단순히 변환(transformation)하는 용도의 어플리케이션이라면 상태(state)가 필요하지 않을 수도 있습니다. 하지만 단순한 비즈니스 로직조차도 이전의 이벤트나 중간 결과를 사용하는 경우가 대부분이기 때문에 상태를 저장해 활용하는 것은 대부분의 서비스에 중요한 요소입니다.  

스트림 처리 어플리케이션의 경우 상태(state)의 중요성이 더욱 커지게 됩니다. 스트림 처리 어플리케이션에서 상태가 중요한 이유는 다음과 같습니다.  

- **Low Latency**: 스트림 처리는 짧은 지연을 위해 값을 출력 후 갱신을 통해 정확도를 높이는 방식이기에 이전 값을 기억해야함
- **Recovery**: 장애 발생시 저장된 상태를 통해 다시 복구가 가능

![](/images/flink_17.png)

플링크에서는 상태를 프로그래밍 모델의 일급 시민(first-class citizen)으로 사용하고 있습니다. 플링크에서 상태 핸들링에 관한 주요 특징들에는 다음과 같은 것들이 있습니다.  

- **Multiple State Primitives**: Flink provides state primitives for different data structures, such as atomic values, lists, or maps. Developers can choose the state primitive that is most efficient based on the access pattern of the function.
- **Pluggable State Backends**: Application state is managed in and checkpointed by a pluggable state backend. Flink features different state backends that store state in memory or in RocksDB, an efficient embedded on-disk data store. Custom state backends can be plugged in as well.
- **Exactly-once state consistency**: Flink’s checkpointing and recovery algorithms guarantee the consistency of application state in case of a failure. Hence, failures are transparently handled and do not affect the correctness of an application.
- **Very Large State**: Flink is able to maintain application state of several terabytes in size due to its asynchronous and incremental checkpoint algorithm.
- **Scalable Applications**: Flink supports scaling of stateful applications by redistributing the state to more or fewer workers.

플링크에서 상태는 단순히 변수에 저장되는 하나의 값일 수도 있고, 파일이나 데이터베이스에 저장되는 데이터일 수도 있습니다. 이런 상태의 다양성을 반영하기 위해 플링크에서는 크게 두 가지 종류의 상태를 제공하며 또 각각의 상태별로 표현할 수 있는 기본 상태(State primitive)도 여러가지 입니다.  

## Operator State

![](/images/flink_15.png)

연산자 상태(Operator State)는 태스크별로 자신의 상태를 저장하고 있습니다. 카프카에서 컨슈머 그룹 내 컨슈머별로 토픽의 파티션을 공유하지 않고 자신의 파티션을 가지는 것과 비슷한 용도입니다.  

대부분의 플링크 어플리케이션에서는 연산자 상태가 필요하지 않습니다. 연산자 상태는 대부분 소스나 싱크쪽에서 필요로 하는 상태이기 때문입니다. 이러한 이유로 파이선의 DataStream API에서는 아직 연산자 상태를 지원하지 않습니다.  


## Keyed State

![](/images/flink_16.png)

키 상태(Keyed State)는 스트림 데이터가 가지는 키별로 접근할 수 있는 상태를 말합니다. 예를 들어 태스크로 들어온 데이터가 'Lion'이라는 키를 가지고 있으면 'Lion'키와 관련된 상태에만 접근할 수 있습니다. 따라서 스트림의 형태는 기본적으로 `KeyedStream`이어야 합니다.  

KeyedState로 사용할 수 있는 기본 상태의 종류는 다음과 같습니다.  

- `ValueState<T>` : 키별로 하나의 값만을 저장합니다(ex. 키별 최대값)
- `ListState<T>` : 키별로 리스트를 저장합니다(ex. 키별 회원 이름)
- `MapState<UK, UV>` : 키별로 키-값 쌍을 저장합니다. (ex. 키별 회원 이름과 직업 쌍)

# Recovery

플링크는 중간 결과를 저장하기 위해 상태를 로컬 버퍼에 저장하게 됩니다. 이를 통해 플링크는 짧은 지연으로 결과를 계속 갱신할 수 있습니다. 하지만 로컬 버퍼는 태스크매니저 프로세스가 종료되면 같이 사라지는 휘발성 저장소입니다. 이는 장애 발생시 실행중이던 태스크가 종료될 뿐 아니라 저장해두었던 상태도 함께 사라진다는 뜻입니다. 이를 위해 플링크에서는 상태를 주기적으로 체크포인팅해 원격의 영구저장소로 저장합니다. 

![](/images/flink_18.png)

## Checkpoint

스트림 처리 어플리케이션은 장비, 네트워크 등 예상치 못한 장애로 상태가 유실되거나 일관성을 잃게될 수 있습니다. 이를 위해 플링크는 주기적으로 원격 영구 저장소로 상태를 체크포인팅해야 합니다.  

체크포인트의 naive한 알고리즘은 다음과 같습니다.  

```
1. 입력 데이터의 인입을 멈춘다
2. 어플리케이션에 남아있는 데이터를 처리한다
3. 각 태스크의 상태를 복사해 원격 영구저장소로 체크포인팅한다
4. 입력 데이터를 다시 받는다
```  

플링크에서는 위와같은 naive한 알고리즘을 사용하지는 않습니다. 왜냐하면 위와 같이 체크포인팅을 할 경우 일명 'Stop the world'와 같이 체크포인팅을 하는 동안 어플리케이션 전체가 멈춰버리는 현상이 발생하기 때문에 짧은 지연을 요구하는 스트림 처리 어플리케이션에는 적합하지 않습니다.  

따라서 플링크에서는 전체를 정지하지 않고 체크포인트와 처리간의 결합을 분리하였습니다. 다시 말해 일부 태스크는 상태를 저장하고, 일부 태스크는 데이터를 계속 처리하게 됩니다. 이를 [**챈디-램포트 알고리즘**](https://www.microsoft.com/en-us/research/publication/distributed-snapshots-determining-global-states-distributed-system/?from=http%3A%2F%2Fresearch.microsoft.com%2Fen-us%2Fum%2Fpeople%2Flamport%2Fpubs%2Fchandy.pdf){:target="_blank"} **기반의 분산 스냅샷 체크포인팅**이라고 합니다.  

플링크의 분산 스냅샷의 핵심 요소는 체크포인트 **배리어(barrier)**입니다. 배리어는 이전 포스트에서 봤던 워터마크처럼 특별한 용도의 레코드입니다. 레코드이기 때문에 데이터 스트림에 주입되고 데이터 스트림의 일부로 레코드와 함께 흐릅니다.

![](/images/flink_19.png)

배리어는 데이터 스트림에 주입되어 스트림에 흐르고 있는 **레코드들이 어떤 체크포인트에 속하는지 식별하도록 해주는 식별자** 역할을합니다. 따라서 배리어 이전에 처리된 레코드가 만든 상태 변경은 배리어의 현재 체크포인트에 포함됩니다.  


```
1. 잡 매니저가 모든 소스 태스크에 체크포인트 배리어를 주입한다
2. 태스크가 배리어를 수신하면 모든 입력 스트림에서 배리어가 도착할 때 까지 기다린다
3. 기다리는 동안 배리어를 전송한 스트림에서 들어온 레코드는 버퍼링 해놓는다
4. 기다리는 동안 배리어를 전송하지 않은 스트림에서 들어온 데이터를 계속 처리한다
5. 모든 입력 스트림으로부터 배리어가 도착하면 현재 태스크 상태를 백엔드에 체크포인트한다
6. 이후 태스크에 연결된 모든 하위 병렬 태스크에 배리어를 브로드캐스팅한다
7. 이후 태스크에 버퍼링 되어 있던 레코드를 처리하고 입력 스트림은 체크포인트 시점 위치에서 다시 시작된다
8. 이렇게 소스에서부터 시작된 모든 배리어가 싱크 태스크에 도착하면 잡 매니저는 모든 태스크에서 체크포인트가 완료됐음을 기록한다
9. 완료된 체크포인트는 장애 복구에 사용된다
```

플링크의 체크포인트 수행은 모두 상태백엔드가 책임지고 있습니다. 상태백엔드의 한종류인 `RocksDB`는 **비동기 체크포인팅**을 지원합니다. 따라서 체크포인팅이 시작되면 RocksDB는 상태를 로컬에 복사하고 체크포인팅이 완료되면 이를 태스크 매니저에 알리고 태스크매니저는 이를 잡매니저에 알리며 하던 작업을 별도로 계속 수행하게 됩니다.  

## Savepoint

플링크의 세이브 포인트는 기존 데이터베이스 시스템의 복구 로그와 유사한 방식으로 체크 포인트와 다릅니다.

체크포인트의 주요 목적은 예기치 않은 작업 실패 시 복구 메커니즘을 제공하는 것입니다. 체크포인트의 라이프사이클은 플링크에 의해 관리됩니다. 즉, 체크포인트는 사용자의 개입 없이 플링크에 의해 생성, 소유 및 해제됩니다.  

세이브포인트는 체크포인트와 동일한 메커니즘으로 내부적으로 생성되지만 개념적으로 다르기 때문에 생성 및 복원 비용이 다소 비쌀 수 있습니다. 세이브포인트는 주로 Flink 버전 업데이트, 작업 그래프 변경 등에 사용됩니다.  

세이브포인트는 사용자만 생성, 소유 및 삭제합니다. 즉, Flink는 작업 종료 후나 복원 후에도 저장 지점을 삭제하지 않습니다

아래 표는 세이브포인트와 체크포인트를 비교해 놓은 것입니다.  

![](/images/flink_20.png)  

## Exactly Once

플링크에서 정확히 한 번 보장은 스트림 처리에서 **상태의 일관성**을 의미합니다. 결과를 보장하는 방법 중 가장 엄격한 방식으로 자주 비교되는 보장 방식에는 At Least Once 방식이 있습니다. 정확히 한 번 보장은 스트리밍 시스템이 배치 시스템을 뛰어넘기 위해 반드시 요구되는 조건 중에 하나입니다.  

**At Least Once**  

- 데이터 유실 방지에 최우선
- 결과의 완결만 중요하고 중복은 수용 가능한 조건인 경우(ex. 최대값 구하는 연산)
- 소스나 어떤 버퍼에서 이벤트를 재생(re-play) 기능을 가지고 있어야함

**Exactly Once**  

- 가장 엄격한 보장 방식
- 유실 방지 뿐 아니라, 이벤트마다 정확히 한 번씩만 상태를 갱신해야함
- At Least Once의 **데이터 재생기능**은 필수적으로 내포해야함
- 내부 상태 일관성을 보장하기 위해 **트랜잭션 또는 스냅샷 메커니즘**을 사용

플링크에서는 위에서 설명했듯이 **챈디-램포트 기반의 분산 스냅샷 메커니즘**을 사용해 내부 상태를 체크포인팅함으로써 일관성을 보장합니다. 여기서 한가지 추가되어야 할 점은 체크포인트 수행 당시 마지막으로 소비했던 위치로 재설정 하여 이벤트를 재생(re-play)할 수 있어야 한다는 것입니다.  

데이터 소스의 입력 스트림 **재생기능은 소스의 구현과 인터페이스에 달려있습니다**. 따라서 정확히 한 번 보장을 위해서는 아파치 카프카와 같은 이벤트 로그를 입력 소스로 사용해야 합니다. 카프카는 스트림을 이전 오프셋으로 설정해 과거 레코드를 다시 재생할 수 있도록 구현되어 있습니다.  

# StateBackend

상태 백엔드의 역할은 크게 다음과 같습니다.  

- 로컬 상태 관리
- 원격 저장소에 상태를 체크포인팅

플링크에서 제공하는 대표적인 상태 백엔드 두가지는 다음과 같습니다.  

![](/images/flink_21.png)  

**HashMap StateBackend**  

- Java Heap에 상태를 객체로 저장
- 해시테이블에 변수와 트리거를 저장
- 메모리 사용으로 빠른 처리

**Embedded RocksDB StateBackend**  

- 직렬화한 상태 데이터를 로컬 하드 디스크에 저장
- 디스크와 serialize 사용으로 성능과 처리량간의 트레이드-오프

# 참고  

- [아파치 플링크로 하는 스트림 데이터 처리 책](http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9791161754093&orderClick=LEa&Kc=){:target="_blank"}
- [Flink 공식문서: Stateful Stream Processing](https://nightlies.apache.org/flink/flink-docs-master/docs/concepts/stateful-stream-processing/){:target="_blank"}
- [Flink 공식문서: State Backends](https://nightlies.apache.org/flink/flink-docs-master/docs/ops/state/state_backends/){:target="_blank"}
- [Flink 공식문서: What is Apache Flink? — Applications](https://flink.apache.org/flink-applications.html){:target="_blank"}
- [Flink 공식문서: Working with State](https://nightlies.apache.org/flink/flink-docs-release-1.14/docs/dev/datastream/fault-tolerance/state/#keyed-datastream){:target="_blank"}
- [Ververica: 3 important performance factors for stateful functions and operators in Flink](https://www.ververica.com/blog/performance-factors-stateful-functions-operators-flink){:target="_blank"}
- [mehmetozanguven: Apache Flink Series 8-State Backend & State Example](https://mehmetozanguven.github.io/apache-flink/2020/05/02/state-backend-and-state-example.html){:target="_blank"}
