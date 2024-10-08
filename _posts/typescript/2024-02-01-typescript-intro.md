---
layout: post
title:  '[Typescript] Intro'
description: 타입스크립트란 무엇이고 타입스크립트의 특징, 타입스크립트를 사용함으로써 얻게되는 이점에 대해 공부한다
date:   2024-02-02 15:01:35 +0300
image:  '/images/typescript_logo.png'
logo_image: '/images/typescript_logo.png'
category: language
tag: typescript
---
---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 타입스크립트란

- 타입스크립트는 자바스크립트의 동적 타입 언어라는 특징 때문에 생겨나는 단점들을 보완하기 위해 등장한 언어이다
- 타입스크립트는 <span class='very__important'>자바스크립트에 타입을 부여한 자바스크립트의 확장편</span>이라고 할 수 있다
- 타입스크립트를 사용함으로 얻게되는 장점들은 다음과 같다
  - **정적 타입 검사**: 코드를 실행하기 전 개발 단계에서 오류를 발견할 수 있다
  - **코드 자동 완성**: VScode, WebStorm 등과 같은 에디터를 사용하면 특정 부분에 어떤 코드를 쓸 수 있는지 알 수 있다
  - **가이드**: 코드를 읽는 사람의 입장에서 코드에서 사용되는 값들이 어떤 타입이고 어떤 특징을 가지는지 쉽게 이해할 수 있다



# 타입스크립트의 특징

- 타입스크립트는 자바스크립트 코드를 작성하기 위한 수단일 뿐, 실제로 브라우저 또는 node.js에서 동작하는 코드는 자바스크립트이다. 그래서 <span class='very__important'>타입스크립트는 결국 자바스크립트로 변환되어야 한다</span>. 이 때 사용하는 것이 **타입스크립트 컴파일러(tsc)**이다
- 변환된 자바스크립트 코드를 보면, 타입스크립트에서 작성한 코드들이 일부 남아있는 것도 있고, 사라지는 것들도 있다. 

# 타입스크립트 설정

- 타입스크립트에는 설정 가능한 여러가지 값들이 있는데, 이를 위해 타입스크립트는 `tsconfig.json` 파일을 사용한다 (`tsc --init` 명령어로 생성)
- `tsconfig.json` 파일에는, 정적 타입을 얼마나 엄격하게 검사할지, 자바스크립트 어떤 버전으로 변환할지, 변환한 파일은 어디 저장할지 등을 지정할 수 있다