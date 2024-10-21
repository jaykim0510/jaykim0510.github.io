---
layout: post
title:  '[NestJS] 트랜잭션'
description: 
date:   2024-10-05 15:01:35 +0300
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

```ts
// src/common/interceptors/transaction.interceptor.ts
import {CallHandler, ExecutionContext, Injectable, InternalServerErrorException, NestInterceptor} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { catchError, Observable, tap } from 'rxjs';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    req.isTransactional = true;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    return next.handle().pipe(
      catchError(async () => {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        throw new InternalServerErrorException(
          'Transaction is failed while creating book entity',
        );
      }),
      tap(async () => {
        await queryRunner.commitTransaction();
        await queryRunner.release();
      }),
    );
  }
}
```

```ts
// src/common/decorators/transaction.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IsTransactional = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.isTransactional;
  },
);

```

```ts

@UseInterceptors(TransactionInterceptor)
async createProduct(@Body() createProductDto: CreateProductDto, @IsTransactional() isTransactional: boolean) {
  return await this.productService.createProduct(createProductDto, isTransactional);
}
```

```ts

getProductRepository(isTransactional: boolean) {
  if (isTransactional) {
    const queryRunner = this.dataSource.createQueryRunner();
    return queryRunner.manager.getRepository(ProductEntity);
  }
  return this.productRepo;
}

async createProduct(createProductDto: CreateProductDto, isTransactional: boolean) {
  const repo = this.getProductRepository(isTransactional);
  const product = repo.create(createProductDto);
  return await repo.save(product);
}
```