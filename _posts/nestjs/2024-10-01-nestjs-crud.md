---
layout: post
title:  '[NestJS] CRUD'
description: 'NestJS를 이용해 ecommerce 도메인에서 데이터의 생성/삭제/수정과 다양한 상품 조회 방법에 대해 공부합니다' 
date:   2024-10-01 15:01:35 +0300
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

![](/images/nest_crud_1.png)

# Create

## 고려 사항

- Create 또는 Insert 작업을 수행하는데 있어 고려해야 할 사항에는 아래와 같은 항목이 있다
  - data validation
  - authorization
  - transaction
  - on conflict
  - file upload

## 데이터 검증

- 나는 POST 메서드 요청의 메세지 바디 데이터를 검증하기 위해 DTO 클래스를 사용했다
- 여기서 `price`가 숫자형인지 검증하기 전에 `@Transform()` 데코레이터로 숫자형으로 변환한 이유는, 파일 업로드를 위해 **Content-Type**의 헤더를 `multipart/form-data` 로 했기 때문에, 파일을 제외한 나머지 데이터는 모두 문자열로 인식된다

```ts
// src/product/dtos/product.create.dto.ts

import {IsNumber, IsString} from "class-validator";
import {Transform} from "class-transformer";

export default class CreateProductDto {

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  price: number;

  @IsString()
  brand: string;

  @IsString()
  category: string;
}
```

```ts
// src/product/product.controller.ts

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async createProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Body(new PlainToInstancePipe(CreateProductDto)) createProductDto: CreateProductDto // here
  ) {
    return await this.productService.createProduct(createProductDto, files)
  }
}
```

- `brand`와 `category`를 문자열로 받은 후, 해당 브랜드와 카테고리가 실제로 있는지 검증한다
- DTO를 통해 1차적으로 검증하고, 비즈니스 로직 안에서 부가적인 2차 검증을 마쳤다

```ts
// src/product/product.service.ts

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepo: Repository<ProductEntity>,
    private readonly productCategoryService: ProductCategoryService,
    private readonly productBrandService: ProductBrandService,
    private readonly productImageService: ProductImageService,
  ) {
  }

  async createProduct(createProductDto: CreateProductDto, files: Express.Multer.File[]) {
    const {category, brand} = createProductDto;
    const categoryObj = await this.productCategoryService.readProductCategoryByName(category); // here
    const brandObj = await this.productBrandService.readProductBrandByName(brand); // here
    const body = {...createProductDto, category: categoryObj, brand: brandObj};
    const product = this.productRepo.create(body);
    const productObj = await this.productRepo.save(product);
    const images = []
    for (let file of files) {
      const url = new URL(file.path, 'http://localhost:8000').href
      const body = {url, product: productObj};
      const image = await this.productImageService.createImage(body)
      images.push(image)
    }
    return {product: productObj, images}
  }
}
```

## 충돌이 생기는 경우

- 충돌 조건: 보통 `@Unique()` 데코레이터를 사용해 `unique constraints`를 만든다 (MySQL 에서는 유니크 인덱스)

```ts

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

- 충돌시 대응
  - `409 Conflict` 예외를 발생시키거나
  - 아예 아무런 작업을 수행하지 않거나
  - 업데이트 작업을 수행한다

```ts

@Post()
async createProduct(@Body() createProductDto: CreateProductDto) {
    const body = createProductDto
    const query = this.productRepo.createQueryBuilder()
        .insert()
        .into(ProductEntity)
        .values(body)
        .orUpdate(['price'], ['name', 'color']) // name-color 의 조합에 중복된 데이터가 있으면 해당 데이터의 price를 업데이트
        
    const result = await query.execute()
    
    return result
}
```


## 응답 코드

- 데이터가 정상적으로 만들어진 경우: `201 Created`
- 정상적으로 처리 했으나 단순히 업데이트 된 경우: `204 No Content` (응답 바디 없음)
- 데이터 검증에 실패한 경우: `400 Bad request` (나는 비즈니스 로직에서는 `404 Not found`도 사용함)

# Update

```ts
// src/product/dtos/product.update.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import CreateProductDto from "./product.create.dto";

export default class UpdateProductDto extends PartialType(CreateProductDto) {}
```

```ts

import {Controller, Param, Patch} from '@nestjs/common';
import {ProductService} from "./product.service";
import UpdateProductDto from "./dtos/product.update.dto";

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  
  @Patch(':id')
  async updateProduct(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    await this.productService.updateProduct(id, updateProductDto)
  }
}
```

```ts
// src/product/product.service.ts

async updateProduct(id: number, updateProductDto: UpdateProductDto) {
  const product = await this.productRepo
          .createQueryBuilder('product')
          .where('product.id = :id', { id })
          .getOne();
  if (!product) {
    throw new HttpException(
            `Not found product with id ${id}`,
            HttpStatus.NOT_FOUND,
    );
  }
  let body = updateProductDto as any
  if (updateProductDto.hasOwnProperty('brand')) {
    const brand = await this.productBrandService.readProductBrandByName(updateProductDto.brand);
    body = { ...updateProductDto, brand }
  }
  if (updateProductDto.hasOwnProperty('category')) {
    const category = await this.productCategoryService.readProductCategoryByName(updateProductDto.category);
    body = { ...updateProductDto, category }
  }

  const newProduct = Object.assign(product, body);
  return await this.productRepo.save(newProduct);
}
```

- 아래 처럼 `update()` 메서드를 사용해도 된다.
- 특징은 무조건 UPDATE 문을 실행하기 때문에, `updated_at` 컬럼을 `@UpdatedDateColumn()` 데코레이터로 만들었다면, 실제로 업데이트가 발생하지 않아도 업데이트 됐다고 판단하고 `updated_at` 시간이 변경된다
- 업데이트가 실제로 발생했는지 유무가 중요하다면 위와 같이 하고, 성능 최적화가 필요하다면 아래와 같이 한다

```ts
// src/product/product.service.ts

const query = this.productRepo
        .createQueryBuilder()
        .update(ProductEntity)
        .set(body)
        .where('id = :productId', { productId });
return await query.execute();
```

## 응답 코드

- 업데이트가 성공적으로 된 경우: `200 OK`
- 업데이트가 실행됐으나 변경된 데이터가 없는 경우: `200 OK` (보통 위의 경우와 응답 메세지로 구분한다)
- 요청이 잘못된 경우: `400 Bad request`


# Delete

```ts
// src/product/product.controller.ts
import {Controller, Delete, Param,} from '@nestjs/common';
import {ProductService} from "./product.service";

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    await this.productService.deleteProduct(id)
  }
}
```

```ts
// src/product/product.service.ts

async deleteProduct(id: number) {
  return await this.productRepo.createQueryBuilder()
          .delete()
          .where('id = :id', { id })
          .execute()
}
```

## 소프트 삭제

- TypeORM은 기본적으로 soft delete된 데이터를 쿼리에서 자동으로 제외한다

```ts

import { Entity, DeleteDateColumn } from 'typeorm';

@Entity()
export class ProductEntity {
  ...

  @DeleteDateColumn()
  deletedAt?: Date; // soft delete 시점이 기록됨
}
```

```ts

await this.productRepo.createQueryBuilder()
  .softDelete()
  .where("id = :id", { id })
  .execute();
```

## 응답 코드

- 성공적으로 삭제된 경우: `200 OK`
- 실행됐으나 삭제된 데이터가 없는 경우: `404 Not found` or `200 OK` (`200 OK`의 경우 메세지로 구분)
- 요청이 잘못된 경우: `400 Bad request`

# Read

## 필터링

- 브랜드가 Apple인 상품 목록

```ts
// src/product/product.controller.ts

@Get('query')
async getProducts(@Query('brand') brand: string) {
  return await this.productService.getResults(brand)
}
```

```ts
// src/product/product.service.ts

async getResults(brand: string) {
    const query = this.productRepo.createQueryBuilder('product')
    if (brand) {
      query
        .leftJoin('product.brand', 'brand')
        .where('brand.name = :brand', { brand })
        .select(['product.id', 'product.name', 'product.price', 'brand.name'])
    }
    return await query.getMany()
```

- 카테고리가 electronics 이며 가격 범위가 50만원 ~ 100만원 사이인 제품을 가격이 저렴한 순으로 정렬

```ts

@Get('query')
async getProducts(
  @Query('category') category: string, 
  @Query('priceMin') priceMin: number, 
  @Query('priceMax') priceMax: number, 
  @Query('priceOrder', new DefaultValuePipe('ASC')) priceOrder: 'ASC' | 'DESC') {
  return await this.productService.getResults(category, priceMin, priceMax, priceOrder)
}
```

```ts

async getResults(category: string, priceMin: number, priceMax: number, priceOrder: 'ASC' | 'DESC') {
    const query = this.productRepo.createQueryBuilder('product')
    if (category) {
      query
        .leftJoin('product.category', 'category')
        .where('category.name = :category', { category })
        .andWhere('product.price BETWEEN :priceMin AND :priceMax', { priceMin, priceMax })
        .select(['product.id', 'product.name', 'product.price'])
        .orderBy('product.price', priceOrder)
    }
    return await query.getMany()
```

## 그룹핑

- 카테고리별 상품 수와 상품의 평균 가격

```ts
async getResults() {
    const query = this.productCategoryRepo
      .createQueryBuilder('category')
      .leftJoin('category.products', 'product')
      .leftJoin('product.orders', 'order')
      .groupBy('category.id')
      .select(['category.name AS category', 'COUNT(product.id) AS product_count', 'AVG(product.price) AS avg_price'])
    return await query.getRawMany()
  }
```

- 상품별 총 주문 수량과 매출액 

```ts

async getResults() {
    const query = this.productRepo
      .createQueryBuilder('product')
      .leftJoin('product.orders', 'order')
      .groupBy('product.id')
      .select(['product.name AS product', 'product.price AS price', 'SUM(order.count) AS total_order_count', 'SUM(product.price * order.count) AS total_sales'])
    return await query.getRawMany()
  }
```

- 상품 평점과 주문수를 이용한 랭킹 top5

```ts

async getResults() {
    const query = this.productRepo
      .createQueryBuilder('product')
      .leftJoin('product.orders', 'order')
      .leftJoin('order.review', 'review')
      .groupBy('product.id')
      .having('SUM(order.count) > 5')
      .andHaving('AVG(review.rating) >= 3')
      .select(['product.name AS product', 'SUM(order.count) AS total_order_count', 'AVG(review.rating) AS avg_review_rating'])
      .orderBy({ 'avg_review_rating': 'DESC', 'total_order_count': 'DESC' })
      .limit(5)
    return await query.getRawMany()
  }
```

- 오늘 가장 많이 판매한 상품 목록

```ts

async getResults() {
    const today = new Date().toLocaleDateString('en-CA').split('T')[0];
    const query = this.productRepo
      .createQueryBuilder('product')
      .leftJoin('product.orders', 'order')
      .where('DATE(order.created_at) = :today', { today }) // 지난 24시간인 경우: order.created_at >= NOW() - INTERVAL 1 DAY
      .groupBy('product.id')
      .select(['product.id AS product_id', 'product.name AS product_name', 'SUM(order.count) AS total_count'])
      .orderBy('total_count', 'DESC')
      .limit(5)
    return await query.getRawMany()
  }
```

## 서브쿼리

- 각 카테고리에서 가장 많이 팔린 상품
- 주문 수가 평균 이상인 카테고리
- 리뷰가 있는 상품만 가져오기
- 유저의 평균 개수 이상의 리뷰를 작성한 유저 목록







## 페이지네이션