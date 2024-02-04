---
layout: post
title:  '[NestJS] 구성요소(5) Pipes'
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

# Pipes

- 들어온 데이터를 검증/변환하는 용도의 클래스
- `PipeTransform` 를 implements 하면 됨


## Built-in Pipes

- Nest에서 기본적으로 다음과 같은 빌트인 파이프 제공

### ValidationPipe 

- 글로벌한 규칙을 적용하고 싶은 경우에 많이 사용
- `ValidationPipeOptions` 객체를 통해 옵션 전달할 수 있음
- ex. `whitelist`, `forbidNonWhitelisted`, `transform` 등과 같은 인자로 글로벌하게 규칙 적용
- 어플리케이션에서 정해둔 인풋 데이터를 `whitelist` 라고 함
- `whitelist: true`
  - 정해둔 인풋 데이터만 받음
  - (정해두지 않은 예상치 않은 인풋 데이터를 허용하면, 보안상 취약점 생길 수 있음)
- `forbidNonWhitelisted: true`
  - 정해두지 않은 예상치 않은 인풋 데이터가 들어오면, 400 예외 발생시킴으로써 아예 어플리케이션에서 추가 실행되지 않도록 할 수 있음
  - (`whitelist: true` 옵션도 함께 줘야 예상대로 동작함)
- `transform: true`
  - 타입 힌팅으로 전달해준 타입으로 알아서 변환해줌
  - (ex. ParseIntPipe 안써도, int로 타입 힌팅해주면 numeric한 문자열을 정수 타입으로 변환해줌)


### DefaultValuePipe

- Parse* 파이프를 통과해야 하는 파라미터는 그냥 단순히 ='기본값' 형태로 디폴트를 줄 수 없음
- `DefaultValuePipe` 파이프를 사용해 디폴트 값을 줘야함

### Parse* Pipe

- `ParseIntPipe`, `ParseFloatPipe`, `ParseBoolPipe`, `ParseArrayPipe`, `ParseUUIDPipe`, `ParseEnumPipe`, `ParseFilePipe`
- Parse* 파이프들은 Int, Float, .. 등으로 데이터를 변환시켜줌으로써 해당 데이터 타입임을 확실할 수 있도록 해줌
- 변환 불가능한 타입이면 Bad Request 예외 발생 (ex. ParseIntPipe에 대해 'Apple': 예외 발생, '1': 1로 변환)
- 대부분 파라미터에 사용

## Pipe 적용하기

### Parameter-level 적용 예시

- @Param(), @Query() 등과 같은 데코레이터에 전달
- 여러 파이프를 순차적으로 전달할 수도 있음
- 의존성 주입 방식으로 그냥 클래스만 전달 할 수도 있고, 옵션을 넣어줌으로써 조금 더 커스텀하게 쓰고 싶은 경우 직접 인스턴스를 전달할 수도 있음

```ts
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

```ts
@Get(':id')
async findOne(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
  id: number,
) {
  return this.catsService.findOne(id);
}
```

- Parse* 파이프들은 항상 어떤 값이 들어오기를 기대 -> `null`, `undefined` 들어오면 예외 발생
- 그래서 Parse* 파이프 앞에 먼저 `DefaultValuePipe` 파이프 넣어주면 좋음

```ts
@Get()
async findAll(
  @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly: boolean,
  @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
) {
  return this.catsService.findAll({ activeOnly, page });
}
```

### Global-level 적용 예시

- `useGlobalPipes()`를 통해 `main.ts` 파일에 적용

```ts
const app = await NestFactory.create(AppModule);
app.useGlobalPipes(new ValidationPipe(
  { 
    whitelist: true,
    forbidNonWhitelisted: true,
  })
)
```

## 커스텀 파이프 만들기

- `PipeTransform` 을 implements 하면 됨
- `transform()` 을 구현해야함. 다음의 두 인자를 받음
  - `value`: 파이프를 지나는 데이터
  - `metadata`: 파이프가 적용된 데이터의 메타데이터
    - `metadata` 객체는 다음과 같은 속성을 가짐
    - `type`: 인자가 요청의 어느 부분으로 들어오는지 ('body', 'query', 'param', 'custom')
    - `metatype`: 데이터에 선언된 타입 (ex. `@Param('id', ParseIntPipe) id: number`) 인 경우 `number`)
    - `data`: 데코레이터에 넘겨진 문자열 (ex. `@Param('id', ParseIntPipe) id: number`) 인 경우 `id`)

```ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class MyValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
```