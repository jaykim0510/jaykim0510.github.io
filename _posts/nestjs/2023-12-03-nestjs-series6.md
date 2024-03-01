---
layout: post
title:  '[NestJS] 구성요소(4) Guards'
description: 
date:   2023-12-03 15:01:35 +0300
image:  '/images/nest_logo.png'
logo_image: '/images/nest_logo.png'
category: backend
tag: NestJS
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Guards

- 인증/인가 용도의 클래스
- `CanActivate` 를 implements 하면 됨
- 가드 또한 `constructor()` 생성자 함수로 의존성 주입할 수 있음

## Guard 만들기

- `CanActivate` 를 implements -> `canActivate()` 메서드 구현해야함
- `canActivate()` 함수는 boolean을 리턴해야함
  - true면 요청을 처리함 
  - false면 요청을 거부함
- `canActivate()` 함수는 Execution Context가 인자로 제공됨 -> 이를 통해 요청 객체를 참조할 수 있음

```ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest()
    const isAdmin = req.user.roles == 'admin'
    return isAdmin
  }
}
```

## Guard 적용하기

### 컨트롤러에 적용하고 싶은 경우


```ts
@Controller('users')
@UseGuards(RolesGuard)
export class UserController {}
```

### 라우트 핸들러에 적용하고 싶은 경우

```ts
@Controller('users')
export class UserController {

  @UseGuards(RolesGuard)
  @Get()
  readUser() {}

}
```

### 글로벌하게 적용하고 싶은 경우

- 의존성 주입이 적용되지 않은 방법
- 모듈 밖에서 가드가 등록되었기 때문에 의존성 주입이 적용되지 않음

```ts
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard());
```

- 의존성 주입이 적용되는 방법
- 아무 모듈중 하나에 다음과 같은 방법으로 의존성 주입할 수 있음

```ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
```

