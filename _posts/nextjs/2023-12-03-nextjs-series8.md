---
layout: post
title:  'NestJS Series [Part7]: NestJS 구성요소(6) DTO'
description: 
date:   2023-12-03 15:01:35 +0300
image:  '/images/next_logo.png'
logo_image: '/images/next_logo.png'
category: backend
tag: nextjs
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# DTO

- Data Transfer Object의 약자
- 들어오고 나가는 데이터의 형태를 애플리케이션에서 규격화한 클래스(DTO)에 맞는지 검증하는 데이터 검증 방식
- (DTO는 Nest에서 정해진 형태로 제공하는 구성요소는 아니지만, 여러 백엔드 애플리케이션에서 데이터 검증 목적으로 많이 사용)

## DTO 사용에 필요한 라이브러리

- Nest에서 DTO를 적용하려면 아래의 라이브러리를 설치해야함
- **class-validator**: DTO 클래스에서 프로퍼티를 검증할 때 사용할 유용한 데코레이터를 제공해줌
- **class-transformer**: plain json과 class object 간의 직렬화/역직렬화에 유용한 기능을 제공

? Nest에서 제공하는 빌트인 파이프인 ValidationPipe가 직렬화/역직렬화 기능을 함. 그래서 class-transformer가 꼭 필요한 건 아닌 것 같음. (하지만 여전히 다른 유용한 기능도 많이 제공하기 때문에 설치해두면 좋음)  

```
npm i class-validator class-transformer
```

## DTO 만들기

```ts
// create-cat.dto.ts

import { IsString, IsInt } from 'class-validator';

export class CreateCatDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  breed: string;
}
```

```ts
// main.ts

const app = await NestFactory.create(AppModule);
app.useGlobalPipes(new ValidationPipe())
```

```ts
// controller.ts

@Post()
create(@Body() createCatDto: CreateCatDto) {
  ...
}
```
