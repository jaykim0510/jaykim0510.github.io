---
layout: post
title:  '[NestJS] 파일 업로드'
description: 'NestJS를 이용해 업로드된 파일을 검증 및 저장 하는 방법에 대해 공부합니다' 
date:   2024-10-03 15:01:35 +0300
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

# 파일 업로드

- HTTP 프로토콜 기반에서 파일을 업로드 하려면, **Content-Type**을 `multipart/form-data` 로 해야한다
- `multipart/form-data` 는 `application/json` 에서 제공하던 배열, 객체, 숫자형과 같은 타입을 제공하지 않는다
- `multipart/form-data` 는 `file` 과 `text` 타입만 지원한다
- 그래서 만약 배열, 객체, 숫자형과 같은 타입이 필요하면 애플리케이션 코드에서 별도의 변환을 거쳐야 한다 

## 업로드된 파일에 대한 검증

## 업로드할 저장소

# NestJS를 이용한 파일 업로드 구현

- NestJS에서는 파일 업로드를 쉽게 구현할 수 있는 도구들을 제공한다
- `@nestjs/platform-express` 패키지에서 제공하는 `Multer`를 사용하면 간단하게 파일 업로드를 처리할 수 있다

```
npm install --save @nestjs/platform-express
```

- 업로드한 파일은 아래와 같은 방식으로 읽어온다

```ts

import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return { message: 'File uploaded successfully', filename: file.originalname };
  }
}
```

- 파일의 형식과 크기를 검증하는 코드는 아래와 같다

```ts

import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const imageFileFilter = (req, file, callback) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    return callback(new BadRequestException('Only image files are allowed!'), false);
  }
  callback(null, true);
};

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
  },
});

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB로 제한
    fileFilter: imageFileFilter,
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { message: 'File uploaded successfully', filename: file.originalname };
  }
}

```

- 보통 파일을 저장할 때에는, 데이터베이스에는 파일 경로를 나타내는 문자열을 저장하고,
- 실제 파일은 일반적으로 로컬 스토리지에 저장하거나, 클라우드 스토리지(예: AWS S3, Google Cloud Storage)와 같은 외부 스토리지를 사용한다
- 로컬 스토리지를 사용하면, 위와 같이 Multer의 스토리지 엔진을 diskStorage 함수로 정의하는 것만으로도 충분하다
- 클라우드 스토리지를 사용할 때는 Multer의 스토리지 엔진을 커스터마이징 해도 되지만, 보통 해당 클라우드 서비스에서 제공하는 SDK 를 사용한다

```ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  private readonly s3Client = new S3Client({ region: 'ap-northeast-2' });

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const uploadParams = {
      Bucket: 'your-bucket-name',
      Key: `uploads/${file.originalname}`,
      Body: file.buffer,
    };

    await this.s3Client.send(new PutObjectCommand(uploadParams));
    return `https://your-bucket-name.s3.amazonaws.com/uploads/${file.originalname}`;
  }
}
```
