---
layout: post
title:  'Tech Interview Series [Part8]: Data Engineering(1)'
description: 
date:   2022-09-01 15:01:35 +0300
image:  '/images/tech_interview_logo.png'
logo_image:  '/images/tech_interview_logo.png'
categories:   tech_interview
tags: tech_interview
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

- PostgreSQL의 장점은 무엇일까요?
- 인덱스는 크게 Hash 인덱스와 B+Tree 인덱스가 있습니다. 이것은 무엇일까요?
- 인덱스 Scan 방식은 무엇이 있나요?
- 인덱스 설계시 NULL값은 고려되야 할까요?
- Nested Loop 조인은 무엇일까요?
- Windows 함수는 무엇이고 어떻게 작성할까요?
- MySQL에서 대량의 데이터(500만개 이상)를 Insert해야하는 경우엔 어떻게 해야할까요?
- RDB의 char와 varchar의 차이는 무엇일까요?
- 구글의 BigQuery, AWS의 Redshift는 기존 RDB와 무슨 차이가 있을까요? 왜 빠를까요?
- 쿼리의 성능을 확인하기 위해 어떤 쿼리문을 작성해야 할까요?
- MySQL이 요새 느리다는 신고가 들어왔습니다. 첫번째로 무엇을 확인하시고 조정하시겠나요?
- 동작하는 MySQL에 Alter table을 하면 안되는 이유를 설명해주세요. 그리고 대안을 설명해주세요
- 빡세게 동작하고 있는 MySQL을 백업뜨기 위해서는 어떤 방법이 필요할까요?
- Apache Beam에 대해 아시나요? 기존 하둡과 어떤 차이가 있을까요?
- 좋게 만들어진 MapReduce는 어떤 프로그램일까요? 데이터의 Size 변화의 관점에서 설명할 수 있을까요?
- 여러 MR작업의 연쇄로 최종결과물이 나올때, 중간에 작업이 Fail날수 있습니다. 작업의 Fail은 어떻게 모니터링 하시겠습니까? 작업들간의 dependency는 어떻게 해결하시겠습니까?
- 분산환경의 JOIN은, 보통 디스크, CPU, 네트워크 중 어디에서 병목이 발생할까요? 이를 해결하기 위해 무엇을 해야 할까요?
- 암달의 법칙에 대해 말해봅시다. 그러므로 왜 shared-nothing 구조로 만들어야 하는지 설명해봅시다.
- shared-nothing 구조의 단점도 있습니다. 어떤 것이 해당할까요?
- Spark이 Hadoop보다 빠른 이유를 I/O 최적화 관점에서 생각해봅시다.
- 카산드라는 망한것 같습니다. 왜 망한것 같나요? 그래도 활용처가 있다면 어디인것 같나요.
- TB 단위 이상의 기존 데이터와 시간당 GB단위의 신생 로그가 들어오는 서비스에서 모든 가입자에게 개별적으로 계산된 실시간 서비스(웹)를 제공하기 위한 시스템 구조를 구상해봅시다.
- 대용량 자료를 빠르게 lookup해야 하는 일이 있습니다. (100GB 이상, 100ms언더로 특정자료 찾기). 어떤 백엔드를 사용하시겠나요? 느린 백엔드를 사용한다면 이를 보완할 방법은 뭐가 있을까요?
- 데이터를 여러 머신으로 부터 모으기 위해 여러 선택지가 있을 수 있습니다. (flume, fluentd등) 아예 소스로부터 kafka등의 메시징 시스템을 바로 쓸 수도 있습니다. 어떤 것을 선호하시나요? 왜죠?
- K8s가 무엇인가요?
- CD/CD가 무엇인가요? > 사용한 경험 같이 설명(Jenkins)
- NAT(Bridge)가 무엇인가?
- AWS 중에 어떤 것을 사용해보았는가?
- GIT을 써보았는가? > 사용한 경험 같이 설명
- wh가 무엇인가요?
- rdb가 무엇인가요?
- rdb와 wh 차이점에 대해 설명해보세요
- ETL, ELT의 차이에 대해 설명하고, 각각의 장점에 대해 설명해보세요
- 모니터링 서비스 사용경험? > 프로메테우스 그라파나에서 컴퓨터 문제가 생겼다고 하면 후처리를 어떻게 할 것인지
- KAFKA 설명 > KAFKA 로드밸런싱을 한 이유, 내,외부 네트워크를 나눈 이유
- 사용한 저장소 설명(ES, HDFS, S3) > 여러개를 사용한 이유
- ELK(EFK) Stack을 사용한 이유
- DDP 설명
- 왜 ELK를 사용했는가?
- 자신이 ETL 만든 것중 가장 잘 만든 것은?
- BigData가 무엇인가?
- RDMBS 뭐 사용해봤는지
- RDMBS의 장점은(정형 데이터 vs 비정형 데이터)

# 참고
- [Team-Neighborhood/I-want-to-study-Data-Science데이터 엔지니어](https://github.com/Team-Neighborhood/I-want-to-study-Data-Science/wiki/%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%97%94%EC%A7%80%EB%8B%88%EC%96%B4){:target="_blank"}
- [zzsza, 데이터 사이언스 인터뷰 질문 모음집](https://zzsza.github.io/data/2018/02/17/datascience-interivew-questions/#%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4){:target="_blank"}
- [OBenner/data-engineering-interview-questions](https://github.com/OBenner/data-engineering-interview-questions){:target="_blank"}
- [spamdong, [면접] 데이터 엔지니어 면접 질문](https://velog.io/@spamdong/%EB%A9%B4%EC%A0%91-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%97%94%EC%A7%80%EB%8B%88%EC%96%B4-%EB%A9%B4%EC%A0%91-%EC%A7%88%EB%AC%B8){:target="_blank"}
- [spamdong, [면접] 데이터 엔지니어 면접 질문2](https://velog.io/@spamdong/%EB%A9%B4%EC%A0%91-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%97%94%EC%A7%80%EB%8B%88%EC%96%B4-%EB%A9%B4%EC%A0%91-%EC%A7%88%EB%AC%B82){:target="_blank"}
- [[인터뷰] 하둡 관련 면접 질문 ](https://m.blog.naver.com/sunny_86_/221503974389){:target="_blank"}
- [shelling203, Spark 기술 면접 질문](https://shelling203.tistory.com/33?category=304167){:target="_blank"}