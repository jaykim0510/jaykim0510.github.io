---
layout: post
title:  '[NestJS] 구성요소(2) Providers'
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

# Provider

- NestJS 어플리케이션에서 의존성으로서 주입될 수 있는 클래스들 (ex. Service, Repository 등)
- `@Injectable()` 데코레이터를 이용하면 Nest IoC Container에 의해 클래스가 관리됨
- 별도의 스코프를 지정해주지 않으면 일반적으로 싱글턴 인스턴스가 생성
- Nest는 typescript의 type을 이용해 클래스들간의 의존성 관계를 쉽게 파악하고, 필요한 인스턴스를 생성, 리턴함
- (일반적으로 사용되는 싱글턴의 경우, 다른 곳에서 이미 인스턴스가 생성됐으면, 새로 생성되지 않고, 다른 곳에서 만들었던 인스턴스를 리턴)

```ts
@Controller('cats')
export class CatsController {
  // 컨트롤러에서는 서비스 프로바이더를 생성자 함수를 통해 주입한다
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

? Strategy, Guard 도 `@Injectable()` 붙는데 프로바이더인가? 근데 왜 Module의 `providers`에 등록하지 않아도 별다른 에러가 없는걸까?  

## Service

- 비즈니스 로직을 수행하는 프로바이더의 일종
- 또한 Service 프로바이더는 Repository 프로바이더를 의존성으로 가지고 있음

```ts
// items.service.ts

@Injectable()
export class ItemService {
  constructor(@InjectRepository(ItemEntity) private itemRepo: Repository<ItemEntity>) {}

  async readItem(id: number) {
    const item = await this.itemRepo.findOneBy({ id })
    return item
  }
}
```

```ts
// item.controller.ts

@Controller('items')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get(':id')
  async readItem(@Param('id') id: number) {
    const item = await this.itemService.readItem(id)
    return item
  }
}
```

```ts
// items.module.ts

@Module(
  {
    controllers: [ItemController],
    providers: [ItemService],
    exports: [ItemService]
  }
)
export class ItemModule {}


// app.module.ts

@Module(
  {
    imports: [ItemModule],
    controllers: [AppController],
    providers: [AppServie],
    exports: [AppService]
  }
)
export class AppModule {}
```

## Repository

- 데이터베이스와 관련된 작업을 담당하는 프로바이더의 일종
- 리포지토리 프로바이더를 제공하는 모듈을 직접 만들어도 되지만, 이미 해당 ORM에서 훌륭한 모듈 제공해줌
- 여기서는 TypeORM을 사용할 예정이므로, `TypeOrmModule` 사용
- `TypeOrmModule`에서는 엔티티 정의, CRUD 메서드, 관계 정의 등 DB와 관련된 기능들을 제공해줌

```ts
// items.service.ts

@Injectable()
export class ItemService {
  constructor(@InjectRepository(ItemEntity) private itemRepo: Repository<ItemEntity>) {}

  async readItem(id: number) {
    const item = await this.itemRepo.findOneBy({ id })
    return item
  }
}
```

```ts
// items.module.ts


@Module({
  imports: [
    TypeOrmModule.forFeature([ItemEntity]),
  ],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService]
})
export class ItemModule {}
```

```ts
// app.module.ts

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3300,
      username: 'admin',
      password: 'admin',
      database: 'mydb',
      entities: [ItemEntity]
    }),
    ItemModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```