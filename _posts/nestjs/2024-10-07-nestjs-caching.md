---
layout: post
title:  '[NestJS] 캐싱'
description: 'NestJS를 이용해 서비스에 캐싱을 적용하는 방법에 대해 공부합니다'
date:   2024-10-07 15:01:35 +0300
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

- Nest의 인터셉터는 요청을 가로채어 캐싱된 응답이 있는지 확인하고, 있다면 캐시된 데이터를 바로 반환하며, 없을 경우에만 컨트롤러의 코드를 실행하게 하는 구조로 동작할 수 있다 
- 이를 통해 불필요한 로직 실행을 방지하고 성능을 향상시킬 수 있습니다

```ts
// // src/caching/caching.module.ts

import { Global, Module } from '@nestjs/common';
import { CachingService } from './caching.service';

@Global()
@Module({
  providers: [CachingService],
  exports: [CachingService],
})
export class CachingModule {}

```

```ts
// src/caching/caching.service.ts

import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CachingService {
  private readonly redis: any;

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
    });
  }

  async get(key: string) {
    return await this.redis.get(key);
  }

  async set(key: string, value: any) {
    return await this.redis.set(key, value);
  }
}
```

```ts
// src/caching/caching.interceptor.ts

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';
import { CachingService } from './caching.service';

@Injectable()
export class CachingInterceptor implements NestInterceptor {
  constructor(private readonly cachingService: CachingService) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    
    const cachedData = await this.cachingService.get('foo');
    
    if (cachedData) {
      console.log('캐시 있음 -> 캐시 데이터 불러옴');
      return of(JSON.stringify(cachedData));
    } else {
      console.log('캐시 없음 -> 결과물 캐싱하고 결과 불러옴');
      return next.handle().pipe(
        tap(async (response) => {
          await this.cachingService.set('foo', JSON.stringify(response));
        }),
      );
    }
  }
}

```