---
layout: post
title:  '[Backend Thoery] 데이터베이스'
description: 
date:   2023-12-04 15:01:35 +0300
image:  '/images/backend_theory_logo.png'
logo_image: '/images/backend_theory_logo.png'
category: backend
tag: backend_theory
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 데이터베이스 선택

## RDBMS

- 데이터 구조가 일관된 경우
- 저장된 데이터가 분석에 많이 활용되어야 하는 경우

## NoSQL

- 데이터 모델링이 아직 안되거나, 아니면 데이터 구조의 변경이 잦아 schema-less를 선호하는 경우
- 데이터 볼륨이 예측되지 않아 확장성이 높아야 하는 경우

### Elasticsearch

- 뛰어난 검색엔진을 필요로 하는 경우

<div class="fan-para">
    <div class="fan-bar">
      <i class="fa-solid fa-fan"></i>
      MySQL의 확장성
    </div>
    <div class="fan-content">
      <p>RDBMS의 수직 확장은 마이그레이션을 통해 가능하다</p>
      <p>RDBMS의 수평 확장은 가능하지만, 수평 확장을 고려해 설계하면 성능이 많이 떨어지게 되고, 다시 축소하는게 거의 불가능하다</p>
    </div>
</div>

# 쿼리문 작성

# 인덱싱

# 트랜잭션

# 마이그레이션