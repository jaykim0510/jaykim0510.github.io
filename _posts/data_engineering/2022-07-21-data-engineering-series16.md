---
layout: post
title:  'Data Engineering Series [Part16]: 분산 시스템(2) Consensus Algorithm'
description: 
date:   2022-07-21 15:01:35 +0300
image:  '/images/distributed_logo.png'
logo_image:  '/images/data_engineering_logo.png'
categories: DE
tags: Data_Engineering
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Consensus Algorithm

합의 알고리즘은 데이터 동기화 문제, 부분 장애 문제를 해결해준다. 

![](/images/dis_sys_8.png)

- whether a transaction has been committed or not
- whether a message has been delivered or not

# RAFT

- Raft는 분산 시스템에서 합의 알고리즘을 구현한 프로토콜
- Raft는 합의 알고리즘을 크게 3개의 부분 문제로 분해한다
  - Leader Election: A new leader needs to be elected in case of the failure of an existing one.
  - Log replication: The leader needs to keep the logs of all servers in sync with its own through replication.
  - Safety: If one of the servers has committed a log entry at a particular index, no other server can apply a different log entry for that index.
- 모든 서버는 leader, follower, or candidate 중 하나의 상태를 가진다

![](/images/dis_sys_9.png)

- 분산 시스템이 유지하고자 하는 상황은 하나의 서버는 리더, 나머지는 모두 팔로워인 상태이다
- 팔로워들은 요청을 보내지 않는다. 리더나 후보자의 요청에 응답만 한다

- Raft 에게 시간 단위는 term이다. term의 길이는 임의의 값이다
- term 시간내에 리더가 정해질 수도 있고, 표가 흩어지면 리더가 없는 상태로 term이 끝날 수도 있다
- term은 단조증가하는 숫자를 갖는다. 각각의 서버는 모두 자신의 term 숫자를 저장하고 서로 교환한다
- 만약 자신의 term 값보다 더 큰 term 값을 만나면 자신의 term 값을 update 한다
- 만약 리더 또는 후보자들이 자신의 term 값보다 더 큰 term 값을 만나면 팔로워 상태로 내려온다
- 자신보다 작은 term 값은 무시한다

- Raft는 Leader Election, Log Replication을 위해 서버끼리 RPC 통신을 한다

## Leader Election

- 리더는 주기적으로 자신의 입지를 유지하기 위해 하트비트를 팔로워들에게 보낸다
- 리더로부터 하트비트를 기다리던 팔로워가 시간내에 하트비트를 받지 못하면 리더 선출을 일으킨다
- 리더 선출을 일으킨 팔로워가 후보자 상태가 되고 자신의 term 숫자를 증가시킨다
- 투표를 진행하게 되면, 다음과 같은 3가지 결과가 나올 수 있다
  - 후보자가 대다수의 표를 받고 리더가 된다. 이후에는 자신이 팔로워들에게 하트비트를 보낸다
  - 만약 후보자가 자기 뿐만이 아니였고, 심지어 자기보다 높은 term 숫자를 가지고 있다면, 후보자에서 팔로워로 내려온다
  - 만약 후보자끼리 투표에서 리더를 결정짓지 못했다면, 가장 처음으로 타임 아웃을 외친 후보자가 다시 투표를 진행한다
- 서버마다 term 길이를 다르게 가져가는 이유는 가장 먼저 타임 아웃된 후보자가 단독 투표 진행을 하기 위해서다
- 그래야 최대한 투표가 split되서 리더가 선출되지 못하는 문제를 방지할 수 있다

## Log Replication

- 일단 지금은 클라이언트의 요청을 Write-Only 라고 가정하겠다
- 리더가 클라이언트로부터 요청을 받으면 하나의 로그로 추가한다
- 로그는 클라이언트가 요청한 명령어, 로그 파일에서의 index (로그의 위치), term (로그의 시간) 정보를 포함한다
- 이 로그는 모든 노드에 복제되어야 한다. 리더는 모든 노드에 복제될 때 까지 AppendEntries RPC 를 계속 보낸다
- 이 로그가 대다수의 서버에 복제되고 나면 커밋된 것으로 간주한다
- 리더는 마침내 로그에 포함된 명령어를 실행하고, 그 결과를 클라이언트에게 돌려준다 (여기서는 Write니까 성공 여부)
- 그리고 팔로워들은 리더가 저장한 값을 전달받고 마찬가지로 저장한다


When sending an AppendEntries RPC, the leader includes the term number and index of the entry that immediately precedes the new entry. If the follower cannot find a match for this entry in its own log, it rejects the request to append the new entry.  

This consistency check lets the leader conclude that whenever AppendEntries returns successfully from a follower, they have identical logs until the index included in the RPC.  

But the logs of leaders and followers may become inconsistent in the face of leader crashes.  

In Raft, the leader handles inconsistencies by forcing the followers’ logs to duplicate its own. This means that conflicting entries in follower logs will be overwritten with entries from the leader’s log.  

The leader tries to find the last index where its log matches that of the follower, deletes extra entries if any, and adds the new ones.  

The leader maintains a nextIndex for each follower, which is the index of the next log entry the leader will send to that follower. When a leader first comes to power, it initializes all nextIndex values to the index just after the last one in its log.  

Whenever AppendRPC returns with a failure for a follower, the leader decrements the nextIndex and issues another AppendEntries RPC. Eventually, nextIndex will reach a value where the logs converge. AppendEntries will succeed when this happens and it can remove extraneous entries (if any) and add new ones from the leaders log (if any). Hence, a successful AppendEntries from a follower guarantees that the leader’s log is consistent with it.  

With this mechanism, a leader does not need to take any special actions to restore log consistency when it comes to power. It just begins normal operation, and the logs automatically converge in response to failures of the Append-Entries consistency check. A leader never overwrites or deletes entries in its own log.  

## Safety

Raft makes sure that the leader for a term has committed entries from all previous terms in its log. This is needed to ensure that all logs are consistent and the state machines execute the same set of commands.  

During a leader election, the RequestVote RPC includes information about the candidate’s log. If the voter finds that its log it more up-to-date that the candidate, it doesn’t vote for it.  

Raft determines which of two logs is more up-to-date by comparing the index and term of the last entries in the logs. If the logs have last entries with different terms, then the log with the later term is more up-to-date. If the logs end with the same term, then whichever log is longer is more up-to-date.  

# 참고

- [Video Demo,  Raft: Understandable Distributed Consensus](http://thesecretlivesofdata.com/raft/){:target="_blank"}
- [Understanding the Raft consensus algorithm: an academic article summary](https://www.freecodecamp.org/news/in-search-of-an-understandable-consensus-algorithm-a-summary-4bc294c97e0d/){:target="_blank"}
- [Building a Distributed Log from Scratch, Part 2: Data Replication](https://bravenewgeek.com/building-a-distributed-log-from-scratch-part-2-data-replication/){:target="_blank"}