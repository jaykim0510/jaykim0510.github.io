---
layout: post
title:  '[NestJS] 로깅'
description: NestJS를 이용해 서비스의 로그를 남기는 방법을 공부합니다
date:   2024-10-04 15:01:35 +0300
image:  '/images/nestjs_practice_logo.png'
logo_image: '/images/nestjs_practice_logo.png'
category: backend
tag: NestJS
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 로그

## 정보성 로그 (Info)

- 상황: 중요한 비즈니스 로직이 정상적으로 실행되었을 때, 시스템의 상태를 추적하기 위해 남기는 로그
- 목적: 사용자 활동 기록, 주요 작업의 정상적인 완료, 시스템의 상태 등을 기록

```ts
// 사용자가 주문을 성공적으로 생성했을 때 주문 ID와 사용자 ID를 함께 기록. 이 로그는 시스템이 정상적으로 동작하고 있다는 것을 보여줍니다.
this.logger.log(`User ${userId} successfully created a new order with orderId: ${orderId}`);
```

## 경고 로그 (Warn)

- 상황: 큰 문제가 발생하지는 않았지만, 잠재적으로 위험하거나 예외적인 상황이 발생할 가능성이 있을 때 남기는 로그
- 목적: 특정 상황에 대한 경고를 기록하여 잠재적인 문제를 사전에 파악

```ts
// 사용자가 더 이상 사용되지 않는 API에 접근했을 때 경고 로그를 남김. 이 로그는 나중에 시스템에서 해당 API를 제거할 때 참고할 수 있습니다
this.logger.warn(`Attempt to access a deprecated API: ${apiEndpoint}, user: ${userId}`);
```

## 오류 로그 (Error)

- 상황: 예외적인 상황이 발생하거나, 비즈니스 로직이 실패했을 때
- 목적: 오류를 기록하고 문제를 디버깅하기 위한 로그. 가능한 스택 트레이스와 함께 기록하여 문제의 원인을 쉽게 추적할 수 있어야 함

```ts
// 외부 서비스 호출 시 오류가 발생했을 때, 에러 메시지와 스택 트레이스를 기록하여 문제의 원인을 추적할 수 있도록 함.
try {
  const result = await someExternalService();
} catch (error) {
  this.logger.error(`Error occurred while calling external service: ${error.message}`, error.stack);
}
```

## 디버그 로그 (Debug)

- 상황: 개발 단계에서, 혹은 상세한 정보가 필요한 경우. 일반적으로 운영 환경에서는 비활성화하는 것이 좋음
- 목적: 변수 값, 내부 상태, 실행 경로 등 상세한 정보를 기록하여 디버깅에 도움을 줌

```ts
// 주문 처리 중 내부 데이터를 디버깅 목적으로 기록. 운영 환경에서는 너무 많은 정보를 남길 수 있으므로 주로 개발 환경에서만 사용
this.logger.debug(`Processing order with data: ${JSON.stringify(orderData)}`);
```

## 성능 모니터링 로그 (Performance)

- 상황: 성능이 중요한 함수나 외부 API 호출에서 걸린 시간을 기록할 때
- 목적: 성능 병목 구간을 파악하기 위해 시간을 기록

```ts
// 오래 걸리는 함수 실행 시간을 기록하여 성능 분석 및 최적화에 사용할 수 있습니다
const start = Date.now();
await this.someLongRunningFunction();
const end = Date.now();
this.logger.log(`Execution time for someLongRunningFunction: ${end - start}ms`);
```

## 보안 로그 (Security)

- 상황: 보안과 관련된 중요한 이벤트(로그인 시도, 권한 부족, 의심스러운 활동 등)가 발생했을 때
- 목적: 보안상의 이슈를 추적하고, 보안 침해를 감지하는 데 도움을 주기 위한 로그

```ts
// 사용자 로그인 시도 실패 시 로그를 남겨 보안 위협을 모니터링. 여러 번 실패한 로그인 시도를 기록하여 차단 정책을 설정하는데 활용할 수 있음
this.logger.warn(`Failed login attempt for user: ${username} from IP: ${ipAddress}`);
```

## 의도적 로깅 (Audit)

- 상황: 시스템 내에서 중요한 변경사항이 발생했을 때(데이터 변경, 중요한 설정 수정 등)
- 목적: 감사(Audit) 목적으로 중요한 변경 이력을 남기기 위한 로그

```ts
// 관리자에 의해 사용자 역할이 변경될 때 그 이력을 기록. 이는 감사 추적을 위해 매우 유용한 정보가 될 수 있습니다 
this.logger.log(`Admin ${adminId} updated user role to ${newRole} for user: ${userId}`);
```

# 로그 남기는 요령

## 일관성 유지
- 로그 메시지는 일관된 형식으로 남겨야 합니다. 예를 들어, 항상 userId, orderId 등 관련된 데이터와 함께 로그를 남기는 것이 좋습니다

## 적절한 수준 사용
- 상황에 맞는 로그 레벨(info, warn, error, debug)을 사용하여 로그가 너무 많거나 적지 않도록 조정해야 합니다

## 민감한 정보 배제
- 비밀번호나 개인 정보(Personal Identifiable Information, PII)는 절대로 로그에 남기지 않도록 주의합니다

## 로그 구조화
- 로그는 문자열만 나열하는 것보다는 JSON 포맷 등을 사용하여 구조화된 형태로 남기는 것이 분석하기에 더 효율적입니다

# NestJS를 이용한 로깅 구현

## 커스텀 프로바이더

- 장점
  - 중앙 집중화: 모든 서비스나 컨트롤러에서 주입받아 사용할 수 있기 때문에 애플리케이션 전역에서 로깅을 쉽게 일관성 있게 구현할 수 있습니다.
  - 커스터마이징 가능: 다양한 설정을 쉽게 적용하고, 여러 가지 추가 기능을 쉽게 결합할 수 있습니다.
  - 다양한 환경 적용: 외부 로깅 서비스(ex: Datadog, Sentry)나 로깅 라이브러리와 쉽게 통합 가능합니다.
- 단점
  - 로깅 위치의 분산: 요청과 응답 수준에서의 로깅은 각 서비스나 컨트롤러 내부에 삽입되므로 코드가 분산되어 관리가 어려울 수 있습니다.
  - 반복적 코드: 서비스나 컨트롤러에 로깅을 위한 코드를 매번 주입하고 호출해야 하므로 중복된 코드가 생길 수 있습니다.
- 사용 사례
  - 특정 서비스 또는 특정 기능에 대해 별도의 로깅 전략이 필요할 때.
  - 서비스별로 개별적인 로깅 동작을 정의해야 할 때.

```ts
// src/logging/logging.module.ts

import { Global, Module } from '@nestjs/common';
import { MyLoggerService } from './logging.service';

@Global()
@Module({
  providers: [MyLoggerService],
  exports: [MyLoggerService],
})
export class LoggingModule {}

```

```ts
// src/logging/logging.service.ts

import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class MyLoggerService implements LoggerService {
  // [level] [scope] [method] [url] [time] [message]
  error(message: any, ...optionalParams: any[]): any {
    console.error('[ERROR]', message);
  }

  log(message: any, ...optionalParams: any[]): any {
    console.log('[LOG]', message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]): any {
    console.warn('[WARN]', message);
  }

  info(message: any, ...optionalParams: any[]): any {
    console.info('[INFO]', message);
  }
}
```

```ts
// src/product/product.service.ts

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity) private productRepo: Repository<ProductEntity>,
    private readonly loggerService: MyLoggerService // here
  ) {}
  
  async readProduct(id: number) {
    this.loggerService.info(`user read product ${id}`) // here
    return await this.productRepo.findOneBy({ id })
  }
}
```


## 인터셉터

- 장점
  - 중앙화된 로깅: 모든 요청과 응답에 대해 인터셉터에서 로깅을 처리할 수 있기 때문에 일관된 로깅을 쉽게 구현할 수 있습니다. 코드를 한 곳에 모아서 관리할 수 있습니다.
  - 자동화: 요청과 응답을 자동으로 가로채기 때문에 로깅 코드가 컨트롤러나 서비스에 침투하지 않으며, 중복된 코드를 줄일 수 있습니다.
  - 유연성: 인터셉터는 전역, 특정 컨트롤러, 또는 특정 메서드에서 적용할 수 있어 필요한 범위에만 로깅을 적용할 수 있습니다.
  - 성능 모니터링: 인터셉터를 사용하면 요청 처리 시간을 측정하여 성능 모니터링에 활용할 수 있습니다.
- 단점
  - 복잡한 로깅: 단순히 요청과 응답의 정보를 넘어서 특정 비즈니스 로직의 상태나 변수를 로깅하려면 인터셉터만으로는 한계가 있을 수 있습니다.
  - 세부 제어 부족: 서비스나 메서드별로 세부적인 로깅 처리가 필요한 경우 인터셉터 하나로는 제어가 어려울 수 있습니다.
- 사용 사례
  - 모든 요청과 응답에 대한 로깅이 필요할 때.
  - 전역적인 로깅이 요구될 때(예: 모든 API 요청의 로그를 남겨야 할 때).
  - 성능 모니터링: 요청 처리 시간을 측정하는 로깅이 필요할 때.

```ts
// src/logging/logging.interceptor.ts

import {CallHandler, ExecutionContext, Injectable, NestInterceptor,} from '@nestjs/common';
import {Observable, tap} from 'rxjs';
import {MyLoggerService} from "./logging.service";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: MyLoggerService) {
  }
  intercept(
          context: ExecutionContext,
          next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    this.loggerService.log(`Incoming request: ${req.method} ${req.url}`);
    return next
            .handle()
            .pipe(
                tap(() => this.loggerService.log(`Outgoing response: ${req.method} ${req.url} - ${Date.now() - now}ms`)),
            );
  }
}
```