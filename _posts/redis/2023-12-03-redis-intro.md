---
layout: post
title:  '[Redis] Intro'
description: 레디스의 특징과 레디스를 사용하는 이유에 대해 배운다
date:   2023-12-03 15:01:35 +0300
image:  '/images/redis_logo.png'
logo_image: '/images/redis_logo.png'
category: data_engineering
tag: redis
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Redis

- Redis: **Remote Dictionary Server**
- 레디스는 <span class='very__important'>인메모리(In-Memory) 저장소</span>이다
- 레디스는 <span class='very__important'>키-값(Key-Value) 형태로 값을 저장</span>하고 있다
- 값에 들어갈 수 있는 데이터 형태로는 **String, Hash, Set, Sorted Set 등으로 다양한 데이터 타입을 지원**한다
- 레디스의 주요 저장 장치인 메모리는 휘발성이기 때문에 **세션 데이터 또는 캐시 데이터를 저장하는 용도로 주로 사용**된다


# Redis를 쓰는 이유

- 메모리 기반, 해시 기반의 키-값 저장소이기 때문에 <span class='very__important'>빠르다</span>
- 다양한 데이터 타입을 지원해 <span class='very__important'>카운터(ex. 좋아요, 조회수), 랭킹 등과 같은 기능들을 쉽게 구현</span>할 수 있다
- 해시값으로 데이터에 접근하는 키-값 형태의 저장소이기 때문에 <span class='very__important'>수평적 확장(Scale-Out)</span>이 가능하다