---
layout: post
title:  '[NestJS] TypeORM으로 MySQL 조작하기(1)'
description: 
date:   2024-06-05 15:01:35 +0300
image:  '/images/typeorm_logo.png'
logo_image: '/images/typeorm_logo.png'
category: backend
tag: typeorm
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---


```js
nest new .
```

```js
nest g mo user
nest g co user
```

```js
nest g mo product
nest g co product
```

# 관련 라이브러리 설치

```
npm install --save @nestjs/typeorm typeorm mysql2
```

# 데이터베이스 연결

```
CREATE DATABASE typeorm_test_ecommerce
```

```js
// app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3316,
      username: 'client',
      password: 'client',
      database: 'typeorm_test_ecommerce',
      autoLoadEntities: true,
      synchronize: true
    }),
    UserModule, 
    ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

- 옵션에는, 크게 특정 데이터베이스(ex. MySQL) **자격증명**(ex. host, port, username, ..), **연결**(type, timezone, ..) 그리고 **TypeORM**(ex. autoLoadEntities) 관련 옵션이 있다
- 몇 가지 알아두면 유용한 선택적인 옵션에는 다음이 있다
  - `autoLoadEntities`: `@Entity` 데코레이터로 감싸진 모든 엔티티를 자동으로 테이블로 생성한다
  - `synchronize`: 엔티티 변경에 맞춰 데이터베이스 스키마를 자동 변경한다
  - `timezone`: 
- 설정값들을 직접 코드 안에 표기하지 않고, 환경변수와 같이 간접적으로 전달하고 싶다면 아래와 같이 비동기적인 방식으로 TypeOrmModule을 임포트해야 한다
- (TypeOrmModule 이전에 ConfigModule이 먼저 실행 되어야 하므로)

```js
TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: async (
    configService: ConfigService,
    ): Promise<TypeOrmModuleOptions> => {
    return {
        type: configService.get<'mysql'>('DB_TYPE'),
        database: configService.get<string>('DB_DATABASE'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        autoLoadEntities: true,
        synchronize: true,
    };
    },
})
```

# 엔티티 생성

```js
// product.entity.ts
@Entity('tb_product')
export default class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ type: 'enum', enum: ['black', 'white', 'red', 'blue'] })
    color: 'black' | 'white' | 'red' | 'blue'

    @CreateDateColumn({ name: 'created_at', type: 'datetime' })
    createdAt?: Date
  
    @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
    updatedAt?: Date
}
```

```js
// product.module.ts

import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import ProductEntity from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductController]
})
export class ProductModule {}
```

# Create

- `create()` 메서드는 메모리상에 엔티티 객체를 만드는 작업을 수행한다
- `save()` 메서드는 엔티티 객체를 실제로 DB에 저장하는 작업을 수행한다

```js
// product.create.dto.ts

export default class CreateProductDto {
    name: string

    color: 'black' | 'white' | 'red' | 'blue'
}
```

```js
// product.controller.ts

@Controller('products')
export class ProductController {

    constructor(
        @InjectRepository(ProductEntity) private productRepo: Repository<ProductEntity>
    ) {}

    @Post()
    async createProduct(@Body() createProductDto: CreateProductDto) {
        const body = createProductDto
        const product = this.productRepo.create(body)
        const productInDB = await this.productRepo.save(product)
        return product
    }
}
```

![](/images/nestjs_typeorm_1.png)

```
{
    "name": "아이폰 프로 15",
    "color": "black",
    "id": 1,
    "createdAt": "2024-07-01T05:46:09.565Z",
    "updatedAt": "2024-07-01T05:46:09.565Z"
}

```

- the most efficient way in terms of performance to insert rows into your database.
- You can also perform bulk insertions this way

```js
Post()
async createProduct(@Body() createProductDto: CreateProductDto) {
    const body = createProductDto
    const query = this.productRepo.createQueryBuilder()
        .insert()
        .into(ProductEntity)
        .values([createProductDto])
    const product = await query.execute()
    return product
}
```

![](/images/nestjs_typeorm_2.png)

```
{
    "identifiers": [
        {
            "id": 3
        }
    ],
    "generatedMaps": [
        {
            "id": 3,
            "createdAt": "2024-07-01T06:05:34.435Z",
            "updatedAt": "2024-07-01T06:05:34.435Z"
        }
    ],
    "raw": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 3,
        "info": "",
        "serverStatus": 2,
        "warningStatus": 0,
        "changedRows": 0
    }
}
```

## 충돌이 났을 때

- 원래는 에러가 난다
- 업데이트 방식으로 전환할 수 있다
- 에러를 무시하고, 아무 일도 안 일어나도록 할 수도 있다
- `orUpdate()`에서 첫 번째 인수로 `overwrites`에는 업데이트 할 컬럼 목록, 두 번째 인수로 `conflictTarget`은 충돌 조건을 넣어주면 된다

```js
@Unique('name_color_uk', ['name', 'color'])
@Entity('tb_product')
export default class ProductEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ type: 'enum', enum: ['black', 'white', 'red', 'blue'] })
    color: 'black' | 'white' | 'red' | 'blue'

    @Column()
    price: number

    @CreateDateColumn({ name: 'created_at', type: 'datetime' })
    createdAt?: Date
  
    @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
    updatedAt?: Date
}
```

```js
@Post()
async createProduct(@Body() createProductDto: CreateProductDto) {
    const body = createProductDto
    const query = this.productRepo.createQueryBuilder()
        .insert()
        .into(ProductEntity)
        .values(body)
        .orUpdate(['price'], ['name', 'color'])
        
    const result = await query.execute()
    
    return result
}
```

```sql
INSERT INTO `tb_product`(`id`, `name`, `color`, `price`, `created_at`, `updated_at`)
VALUES (DEFAULT, ?, ?, ?, DEFAULT, DEFAULT)
ON DUPLICATE KEY UPDATE `price` = VALUES(`price`)
```

# Select

## getMany, getRawMany

- DB의 엔티티를 결과물로 가져오고 싶을 때는 `getMany()` 를 사용한다

```js
@Get()
async readProducts() {
    const query = this.productRepo.createQueryBuilder('product')
    const products = await query.getMany()
    return products
}
```

```
[
    {
        "id": 1,
        "name": "아이폰 프로 15",
        "color": "black",
        "createdAt": "2024-07-01T05:46:09.565Z",
        "updatedAt": "2024-07-01T05:46:09.565Z"
    },
    {
        "id": 2,
        "name": "아이폰 프로 15",
        "color": "white",
        "createdAt": "2024-07-01T05:50:40.922Z",
        "updatedAt": "2024-07-01T05:50:40.922Z"
    },
    {
        "id": 3,
        "name": "갤럭시 S24",
        "color": "black",
        "createdAt": "2024-07-01T06:05:34.435Z",
        "updatedAt": "2024-07-01T06:05:34.435Z"
    },
    {
        "id": 4,
        "name": "갤럭시 S24 plus",
        "color": "black",
        "createdAt": "2024-07-01T06:14:15.986Z",
        "updatedAt": "2024-07-01T06:14:15.986Z"
    }
]
```

- DB에 있는 엔티티가 아닌, SUM, MAX 와 같이 DB의 데이터를 조작한 결과물을 얻고 싶은 경우, `getRawMany()`를 쓴다

```js
@Get('colors')
    async readProductsPerColor() {
        const query = this.productRepo.createQueryBuilder('product')
            .select(['product.color AS color', 'COUNT(product.id) AS count'])
            .groupBy('product.color')
        const products = await query.getRawMany()
        return products
    }
```

```
[
    {
        "color": "black",
        "count": "3"
    },
    {
        "color": "white",
        "count": "1"
    }
]
```

## 파라미터

- 파라미터는 `:변수명` 같은 형식으로 작성한다
- 파라미터는 쿼리 빌더 하나에 대해 파라미터 이름이 중복되서는 안된다
- 배열 형태의 파라미터는 `(:...변수명)` 형식으로 작성한다

```js
@Get()
    async readProducts(@Query('color') color: string) {
        const query = this.productRepo.createQueryBuilder('product')
            .where('product.color = :color', { color })
        const products = await query.getMany()
        return products
    }
```

![](/images/nestjs_typeorm_4.png)

```
[
    {
        "id": 2,
        "name": "아이폰 프로 15",
        "color": "white",
        "createdAt": "2024-07-01T05:50:40.922Z",
        "updatedAt": "2024-07-01T05:50:40.922Z"
    }
]
```

```js
@Get()
async readProducts(@Query('colors') colors: string) {
    const colorArr = colors.split(",")
    const query = this.productRepo.createQueryBuilder('product')
        .where('product.color IN (:...colors)', { colors: colorArr })
    const products = await query.getMany()
    return products
}
```

![](/images/nestjs_typeorm_5.png)

```
[
    {
        "id": 1,
        "name": "아이폰 프로 15",
        "color": "black",
        "createdAt": "2024-07-01T05:46:09.565Z",
        "updatedAt": "2024-07-01T05:46:09.565Z"
    },
    {
        "id": 2,
        "name": "아이폰 프로 15",
        "color": "white",
        "createdAt": "2024-07-01T05:50:40.922Z",
        "updatedAt": "2024-07-01T05:50:40.922Z"
    },
    {
        "id": 3,
        "name": "갤럭시 S24",
        "color": "black",
        "createdAt": "2024-07-01T06:05:34.435Z",
        "updatedAt": "2024-07-01T06:05:34.435Z"
    },
    {
        "id": 4,
        "name": "갤럭시 S24 plus",
        "color": "black",
        "createdAt": "2024-07-01T06:14:15.986Z",
        "updatedAt": "2024-07-01T06:14:15.986Z"
    }
]
```

## AND, OR

- `A or (B and C)` 와 같은 조건문을 사용하고 싶은 경우 아래와 같이 작성하면 된다

```js
@Get()
async readProducts() {
    const query = this.productRepo.createQueryBuilder('product')
        .where('A')
        .orWhere('B AND C')
    const products = await query.getMany()
    return products
}
```

# Delete

```js
@Delete()
async deleteProducts() {
    const query = this.productRepo.createQueryBuilder()
        .delete()
        .from(ProductEntity)
        .where('color = "black"') // 리터럴 값 (쌍)따옴표로 감싸줘야함
    const result = await query.execute()
    return result
}
```

```
{
    "raw": [],
    "affected": 3
}
```

- (나중에 product.category.name = "phone" 인 ProductEntity 삭제 해보는 실습 추가하자)

# Update

```js
@Patch()
async updateProducts() {
    const query = this.productRepo.createQueryBuilder()
        .update(ProductEntity)
        .set({ color: 'red' })
        .where('color = "white"')
    
    const result = await query.execute()
    return result
        
}
```

![](/images/nestjs_typeorm_6.png)

# Relation



# Subquery

# Validation

# Index

# Transaction

# Migration