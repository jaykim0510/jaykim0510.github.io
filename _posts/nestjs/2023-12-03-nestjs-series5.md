---
layout: post
title:  '[NestJS] 구성요소(3) Interceptors'
description: 
date:   2023-12-03 15:01:35 +0300
image:  '/images/nest_logo.png'
logo_image: '/images/nest_logo.png'
category: backend
tag: [nestjs]
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Interceptors

- 미들웨어와 비슷한 용도
- `NestInterceptor` 를 implements 하면 됨
- 인터셉터 또한 `constructor()` 생성자 함수로 의존성 주입할 수 있음

## Interceptor 기능

- 메서드 실행 전/후로 추가적인 로직을 실행하도록 해줌
- 함수로부터 리턴 받은 결과를 변환하도록 해줌
- 함수로부터 던져진 예외를 변환하도록 해줌
- 특별한 상황에서 함수를 완전 오버라이딩 하도록 해줌 (ex. 캐싱)

## Interceptor 만들기

- `NestInterceptor` 를 implements -> `intercept()` 메서드 구현해야함
- `intercept()` 는 두 개의 인자 제공됨 (Execution Context, Call Handler)
  - **Execution Context**
    - 현재 상태에 대한 정보를 가지고 있는 utility class(helper class)
    - 컨트롤러, 메서드, 실행 문맥 등 다양한 환경에 제네릭한 execution process를 제공
  - **Call Handler**
    - `handle()` 메서드를 호출함으로써 Observable을 리턴하고, 핸들러를 트리거
    - 핸들러의 response stream이 Observable 안에서 흐르게 되고, Observable 안에서는 이 response에 추가적인 연산을 수행할 수 있음
    - (Observable을 쓰는 이유는 RxJS 라이브러리의 강력한 연산들을 사용할 수 있기 때문)

```ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    // context 통해 요청객체(req)에 접근할 수 있음
    const req = context.switchToHttp().getRequest()

    // 응답객체에 별다른 작업이 필요 없다면, next.handle()만 호출하면 됨
    return next.handle()

    // 응답객체에 별도의 작업을 원하면, handle.pipe(map( data => data + 1 )) 이런식으로 map() 함수 사용
    // 응답객체에 별다른 작업 필요 없지만, 별개의 함수 실행 원하면, handle.pipe(tap( () => console.log('tap! tap!') )) 이런식으로 tap() 함수 사용
    return next.handle().pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)),);
  }
}
```

## Interceptor 적용하기

### 컨트롤러에 적용하고 싶은 경우

```ts
@UseInterceptors(LoggingInterceptor)
export class UserController {}
```

### 라우트 핸들러에 적용하고 싶은 경우

```ts
export class UserController {

  @UseInterceptors(LoggingInterceptor)
  @Get()
  readUser() {}
}
```

### 글로벌하게 적용하고 싶은 경우

- 의존성 주입이 적용되지 않은 방법
- 모듈 밖에서 인터셉터가 등록되었기 때문에 의존성 주입이 적용되지 않음

```ts
// main.ts

const app = await NestFactory.create(AppModule)
app.useGlobalInterceptors(new LoggingInterceptor() )
```

- 의존성 주입이 적용되는 방법
- 아무 모듈중 하나에 다음과 같은 방법으로 의존성 주입할 수 있음

```ts
// app.module.ts

import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
```