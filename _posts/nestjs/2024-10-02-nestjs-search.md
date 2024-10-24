---
layout: post
title:  '[NestJS] 검색'
description: 'NestJS와 Elasticsearch를 활용해 검색 기능을 구현하는 방법에 대해 공부합니다'
date:   2024-10-02 15:01:35 +0300
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

## 엘라스틱서치 모듈 설치

```
npm i @nestjs/elasticsearch
```

```ts
// src/search/decorators/search.module.ts

import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import {ElasticsearchModule} from "@nestjs/elasticsearch";
import {ProductModule} from "../product/product.module";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {SearchEventService} from "./search.event.listener";

@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'http://localhost:9200'
    }),
    EventEmitterModule.forRoot(),
    ProductModule
  ],
  controllers: [SearchController],
  providers: [SearchService, SearchEventService]
})
export class SearchModule {}

```

## 엘라스틱서치 사용

- 인덱스 없으면 생성
- 초기에 MySQL에 저장된 데이터 인덱싱할 때 `search/init-indexing` API 실행
- `search` API 로 통합 검색


```ts
// src/search/decorators/search.controller.ts

import {Controller, Get, Query, UseInterceptors} from '@nestjs/common';
import {SearchService} from "./search.service";
import SearchEventInterceptor from "./interceptors/search.event.interceptor";

@UseInterceptors(SearchEventInterceptor)
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('init-indexing')
  async indexAllProducts() {
    await this.searchService.initIndexAllProducts()
  }

  @Get()
  async search(@Query() query: string) {
    return await this.searchService.searchProducts(query)
  }
}
```

```ts
// src/search/decorators/search.service.ts

import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import {ElasticsearchService} from '@nestjs/elasticsearch';
import {ProductEntity} from "../product/entities/product.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class SearchService implements OnApplicationBootstrap {
  constructor(
    private readonly  esService: ElasticsearchService,
    @InjectRepository(ProductEntity) private readonly productRepo: Repository<ProductEntity>,
  ) {}

  onApplicationBootstrap() {
    const indexObjArr = [
      {
        indexName: "train.ecommerce.products",
        indexSetting: {
          index: "train.ecommerce.products",
          settings: {
            number_of_replicas: 3,
            index: {
              analysis: {
                tokenizer: {
                  korean_nori_tokenizer: {
                    type: "nori_tokenizer",
                    decompound_mode: "mixed"
                  },
                  korean_ngram_tokenizer: {
                    type: "ngram",
                    token_chars: ["letter"],
                    min_gram: 2,
                    max_gram: 3
                  }
                },
                filter: {
                  stopwords: {
                    type: "stop",
                    stopwords: " "
                  }
                },
                analyzer: {
                  korean_nori_analyzer: {
                    type: "custom",
                    tokenizer: "korean_nori_tokenizer",
                    filter: ["lowercase", "stop", "trim", "stopwords", "nori_part_of_speech"],
                    char_filter: ["html_strip"]
                  },
                  korean_ngram_analyzer: {
                    type: "custom",
                    tokenizer: "korean_ngram_tokenizer",
                    filter: ["lowercase", "stop", "trim", "stopwords",  "nori_part_of_speech"],
                    char_filter: ["html_strip"]
                  }
                }
              }
            }
          },
          mappings: {
            properties: {
              name: {
                type: "text",
                copy_to: "unified_field"
              },
              description: {
                type: "text",
                copy_to: "unified_field"
              },
              category: {
                type: "text",
                copy_to: "unified_field"
              },
              brand: {
                type: "text",
                copy_to: "unified_field"
              },
              "unified_field": {
                type: "text",
                analyzer: "standard",
                search_analyzer: "standard",
                fields: {
                  nori: {
                    type: "text",
                    analyzer: "korean_nori_analyzer",
                    search_analyzer: "korean_nori_analyzer"
                  },
                  ngram: {
                    type: "text",
                    analyzer: "korean_ngram_analyzer",
                    search_analyzer: "korean_ngram_analyzer"
                  }
                }
              }
            }
          }
        }
      },
    ]
    for (let index of indexObjArr) {
      this.indexInit(index)
    }
  }

  async indexInit(indexObj: object) {
    const index = await this.esService.indices.exists({ index: indexObj["indexName"] })
    if (!index) {
      await this.esService.indices.create(indexObj["indexSetting"])
      console.log('인덱스 추가')
    }
  }

  async searchProducts(q: string) {
    const englishPattern = /[a-zA-Z]/
    const isEnglish = englishPattern.test(q)
    const searchRequest = isEnglish ? {
      index: 'train.ecommerce.products',
      body: {
        query: {
          bool: {
            must: [
              { match: { "unified_field": q } }
            ]
          }
        }
      }
    } : {
      index: 'train.ecommerce.products',
      body: {
        query: {
          bool: {
            must: [
              { bool: { should: [
                    { match: { "unified_field": q } },
                    { match: { "unified_field.nori": q } },
                    { match: { "unified_field.ngram": q } },
                  ] } }

            ]
          }
        }
      }
    }
    const res = await this.esService.search(searchRequest)
    const hits = res.hits.hits

    return hits.map((hit) => {
      return {
        body: {
          id: hit._id,
          name: hit._source["name"],
          description: hit._source["description"],
          category: hit._source["category"],
          brand: hit._source["brand"],
        },
        score: hit._score
      }
    })

  }

  async initIndexAllProducts() {
    const products = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .getMany()

    for (const product of products) {
      await this.esService.index({
        index: 'train.ecommerce.products',
        id: product.id.toString(),
        document: {
          name: product.name,
          description: product.description,
          category: product.category.name,
          brand: product.brand.name,
        }
      })
    }
  }
}
```

## MySQL의 데이터 생성/수정/삭제가 발생할 때 Elasticsearch 동기화 시키기

- 비동기로 처리하기 위해 이벤트로 등록

```
npm i --save @nestjs/event-emitter
```

```ts
// src/search/decorators/search.event.listener.ts

import {Injectable} from "@nestjs/common";
import {ElasticsearchService} from "@nestjs/elasticsearch";
import {OnEvent} from "@nestjs/event-emitter";
import {ProductEntity} from "../product/entities/product.entity";

@Injectable()
export class SearchEventService {
  constructor(private readonly esService: ElasticsearchService) {}

  @OnEvent('create')
  async handleCreate(product: ProductEntity) {
    await this.esService.index({
      index: 'train.ecommerce.products',
      id: product.id.toString(),
      document: {
        name: product.name,
        description: product.description,
        category: product.category.name,
        brand: product.brand.name,
      }
    })
    return product
  }

  @OnEvent('update')
  async handleUpdate(product: Partial<ProductEntity>) {
    await this.esService.update({
      index: 'train.ecommerce.products',
      id: product.id.toString(),
      doc: product
    });
  }

  @OnEvent('delete')
  async handleDelete(id: number) {
    await this.esService.delete({
      index: 'train.ecommerce.products',
      id: id.toString(),
    });
  }
}
```

```ts
// src/search/interceptors/search.event.interceptor.ts

import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {Observable, tap} from "rxjs";
import {EventEmitter2} from "@nestjs/event-emitter";
import {Reflector} from "@nestjs/core";

@Injectable()
export default class SearchEventInterceptor implements NestInterceptor {

  constructor(
    private readonly reflector: Reflector,
    private readonly eventEmitter: EventEmitter2
  ) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

    const target = context.getHandler();
    const eventName = this.reflector.get<string>('event', target);

    if (!eventName) {
      return next.handle();
    }

    return next.handle().pipe(
      tap((product) => {
        this.eventEmitter.emit(eventName, product);
      }),
    );
  }
}
```

```ts
// src/search/decorators/search.emit.event.decorator.ts

import { SetMetadata } from '@nestjs/common';

export const EmitEvent = (eventName: string) => SetMetadata('event', eventName);

```

```ts
import {EmitEvent} from "../search/decorators/search.emit.event.decorator";
import SearchEventInterceptor from "../search/interceptors/search.event.interceptor";


@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('query')
  async getProducts() {
    return await this.productService.getResults()
  }

  @EmitEvent('create')
  @Post()
  @UseInterceptors(
    SearchEventInterceptor,
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads', // 파일 저장 경로
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async createProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Body(new PlainToInstancePipe(CreateProductDto)) createProductDto: CreateProductDto
  ) {
    return await this.productService.createProduct(createProductDto, files)
    // return await this.productService.createProduct(createProductDto)
  }

  @Get()
  async readProducts() {
    return await this.productService.readProducts()
  }

  @Get(':id')
  async readProduct(@Param('id') id: number) {
    await this.productService.readProduct(id)
  }

  @EmitEvent('update')
  @UseInterceptors(SearchEventInterceptor)
  @Patch(':id')
  async updateProduct(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return await this.productService.updateProduct(id, updateProductDto)
  }

  @EmitEvent('delete')
  @Delete(':id')
  @UseInterceptors(SearchEventInterceptor)
  async deleteProduct(@Param('id') id: number) {
    await this.productService.deleteProduct(id)
    return id
  }
}
```