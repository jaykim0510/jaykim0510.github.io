---
layout: post
title:  '[NestJS] Configuration'
description: 
date:   2024-02-15 15:01:35 +0300
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

# Configuration

- 애플리케이션 안에는 데이터가 저장되어 있는 데이터베이스 관련 설정, 시크릿 키와 같은 암호화 관련 설정값이 필요하게 된다
- 이런 보안과 관련된 요소들은 절대 Github 저장소 같은 퍼블릭한 공간에 공개되어서는 안된다
- 이러한 이유로 설정과 관련된 값들은 `.env`, `toml`, `json`, `yaml` 같은 포맷의 파일에 키-밸류 형태로 안전한 저장소에 따로 보관해야 한다

<br>

- 또한 애플리케이션은 보통 개발(development) 단계, 상용(production) 단계처럼 다른 환경에서 실행된다
- 그리고 이러한 환경들은 서로 다른 설정 값을 가질 수 있다
- 이러한 이유로 `.env.dev`, `.env.prod` 처럼 여러 설정 파일을 가질 수 있다

# process.env.NODE_ENV

- node.js에서는 서버가 개발용 서버인지 상용화를 위한 서버인지 구분하기 위해 `NODE_ENV` 환경변수를 사용한다
- (`NODE_ENV`는 사전에 정의된 환경변수는 아니기 때문에, 다르게 명명해도 상관없다)
- node.js에서는 `process.env` 객체를 통해 환경변수에 접근할 수 있다
- NODE_ENV 값을 환경변수로 지정하고 싶으면 쉘 터미널에 다음과 같이 명령어를 입력하면 된다

```sh
export NODE_ENV=development
```

# 설정 파일 만들기

- node.js에서는 `.env` 포맷을 많이 사용한다

```sh
# .env.dev

DB_HOST = localhost
DB_PORT = 3316
```

- nested한 구조를 위해 `json`, `toml`, `yaml` 같은 포맷을 사용해도 좋다

```js
// dev.json

{
    "database": {
        "host": "localhost",
        "port": 3316
    },

    "credential": {
        "secret": "aAef3Jl14Viz2"
    }
}
```

```sh
# dev.toml

[database]
host = "localhost"
port = 3316

[credential]
secret = "aAef3Jl14Viz2"
```

```yaml
# dev.yaml

database:
  host: "localhost"
  port: 3316

credential:
  secret: "aAef3Jl14Viz2"
```

- 참고로 `toml`, `yaml` 포맷 파일을 파싱하기 위해서는 추가적인 라이브러리를 설치해야 한다
  - toml
    - `npm i toml`
  - yaml
    - `npm i js-yaml`
    - `npm i -D @types/js-yaml`

# 설정 파일의 값 로드하기

- 설정 파일을 만드는 방법을 배웠으니 이제 설정 파일의 값들을 로드하는 방법을 배워보자
- NestJS에서는 설정 값을 관리/접근하는데 있어 유용한 모듈인 `ConfigModule`을 제공한다
- `ConfigModule`은 설정 값을 로드하며, `ConfigModule`에서 제공하는 `ConfigService`는 설정 값에 접근할 수 있는 메서드를 제공한다
- (`ConfigService`로 설정 값에 접근하는 방법은 뒤에 나올 챕터에서 배운다)
- `ConfigModule`은 `@nestjs/config` 패키지를 설치하면 사용할 수 있다

```sh
npm i --save @nestjs/config
```

- `ConfigModule` 모듈을 루트 모듈인 `AppModule`에서 임포트한다
- 아래 코드는 루트 디렉터리의 `.env` 파일에 설정된 값들을 `process.env` 객체에 머지한다

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot()
  ]
})
export class AppModule {}
```

## ConfigModuleOptions

- `forRoot()` 메서드에는 `ConfigModuleOptions` 타입의 객체를 인자로 넘겨줌으로써 설정 값 로드와 관련된 여러가지 유용한 설정을 할 수 있다

### envFilePath

- 루트 디렉터리가 아닌 다른 곳에서 관리하고 싶은 경우에는 `envFilePath` 속성을 사용한다
- -> 머지하고 싶은 환경 변수가 있고, 이를 포함한 `.env` 파일이 루트 디렉터리가 아닌 다른 경로에 있는 경우
- 아래 코드는 `<루트 디렉터리>/config` 디렉터리에 있는 `.env.global` 파일에 설정된 값들을 `process.env`에 머지한다

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
        envFilePath: './config/.env.global'
    })
  ]
})
export class AppModule {}
```

### isGlobal

- `isGlobal`을 사용하면 다른 모듈에서 `ConfigModule`을 특별히 임포트 하지 않아도 사용할 수 있다

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: './config/.env.global'
    }),
  ],
})
export class AppModule {}

```

### load

- 단순 `.env` 파일의 값을 `process.env`에 머지하는게 아니라, 프로그래밍화 하고 싶은 경우,
- `.env` 파일이 아닌 `json`, `yaml` 같은 파일을 로드하고 싶은 경우
- 이럴 때는 `load` 속성을 이용해 자바스크립트 객체를 리턴하는 팩토리 함수를 표기하면 된다

```js
// configuration.ts
import { readFileSync } from "fs"
import * as path from "path"

const configuration = () => {
    const filename = (process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production") ? 'prod' : 'dev'
    const filePath = path.join(process.cwd(), "config", "envs", `${filename}.json`)
    const jsonFile = readFileSync(filePath, 'utf-8')
    return JSON.parse(jsonFile)
}

export default configuration
```

```ts
// app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    })
  ]
})
export class AppModule {}

```

## 커스텀한 로드

- 커스텀하게 설정 값을 로드하고 싶은 경우가 있다
- 자바스크립트 객체를 리턴하는 팩토리 함수를 표기하면 된다


### process.env의 값들을 프로그래밍화해서 동적으로 사용하고 싶은 경우

```js
// config/configuration.ts

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432
  }
});
```


### json, yaml 같은 포맷의 설정 파일을 읽어서 사용하고 싶은 경우


```js
// config/configuration.ts

// 설정 파일이 json 포맷인 경우

import { readFileSync } from "fs"
import * as path from "path"

const configuration = () => {
    const filename = (process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production") ? 'prod' : 'dev'
    const filePath = path.join(process.cwd(), "config", "envs", `${filename}.json`)
    const jsonFile = readFileSync(filePath, 'utf-8')
    return JSON.parse(jsonFile)
}

export default configuration
```

```js
// config/configuration.ts

// 설정 파일이 yaml 포맷인 경우

// 아래 명령어로 먼저 패키지 설치해야한다
// npm i js-yaml
// npm i -D @types/js-yaml

import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = 'config.yaml';

export default () => {
  return yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
};
```



```js
// app.module.ts

import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
})
export class AppModule {}
```


# 설정 파일의 값 사용하기

- `.env` 포맷을 사용한 경우에는 가장 간단하게는 `process.env` 객체로 값을 사용할 수 있다

```js
const dbUser = process.env.DATABASE_USER
```


- 또는 `ConfigModule`의 `ConfigService` 를 통해 설정 값에 접근할 수 있다

```js
constructor(private configService: ConfigService) {}
```

```js
// get an environment variable
const dbUser = this.configService.get<string>('DATABASE_USER');
```


- `ConfigModule.forRoot({load: [configuration]})` 이렇게 커스텀하게 한 경우도 똑같은 방법으로 접근하면 된다

```js
// get a custom configuration value
const dbHost = this.configService.get<string>('database.host');
```

# 실습: 데이터베이스 연결


- 데이터베이스를 연결할 때 필요한 설정 값(ex. 호스트, 포트, DB명 등)은 보통 설정 파일로 따로 관리된다

- `ConfigModule` 모듈 사용하기 위해 `@nestjs/config` 라이브러리 설치

```sh
npm i --save @nestjs/config
```

- 설정 파일 포맷은 json을 사용했다

```js
// 루트디렉터리/config/envs/dev.json
{
    "database": {
        "type": "mysql",
        "db": "dev_portfolio_ecommerce",
        "host": "localhost",
        "port": 3316,
        "username": "client",
        "password": "client"
    }
}
```


- `NODE_ENV` 환경변수는 `.env.global` 파일로 등록


```sh
// 루트디렉터리/config/.env.global
NODE_ENV=dev
```

- JSON파일의 설정 값을 로드하기 위해 `configuration.ts` 파일 작성

```js
// 루트디렉터리/config/configuration.ts
import { readFileSync } from "fs"
import * as path from "path"

const configuration = () => {
    const filename = (process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production") ? 'prod' : 'dev'
    const filePath = path.join(process.cwd(), "config", "envs", `${filename}.json`)
    const jsonFile = readFileSync(filePath, 'utf-8')
    return JSON.parse(jsonFile)
}

export default configuration
```

- `ConfigModule` 등록

```js
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: './config/.env.global'
    })
  ]
})
export class AppModule {}

```

- 여기까지 하면 이제 설정 값이 로드되었다
- 이제 데이터베이스를 연결할 차례다
- 먼저 MySQL 데이터베이스를 실행하고, 데이터베이스(database)를 만든다

```sh
cd /usr/local/mysql

sudo ./support-files/mysql.server start
```

```sql
CREATE DATABASE dev_portfolio_ecommerce;
```

- 연결을 위해 TypeORM을 사용할 것이다. 관련 패키지를 설치하자

```sh
npm install --save @nestjs/typeorm typeorm mysql2
```

- 만약 설정값을 따로 분리하지 않고 하드코딩 한다면 아래와 같이 작성해도 된다

```js
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3316,
      username: 'client',
      password: 'client',
      database: 'dev_portfolio_ecommerce',
      entities: [],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

- 설정 값을 사용하기 위해서는 `ConfigService` 인스턴스를 주입한 후 `TypeOrmModule` 모듈이 생성되어야 한다
- 이를 위해 `TypeOrmModule` 모듈이 `ConfigModule` 모듈이 생성된 이후 생성되도록 해야 한다
- 최종 코드는 아래와 같다

```js
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import configuration from 'config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: './config/.env.global'
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        return {
          type: configService.get<"mysql" | "sqlite" | "mongodb" | "postgres">('database.type'),
          database: configService.get<string>('database.db'),
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          autoLoadEntities: true, // true면 entities: [] 에 일일이 엔티티 클래스 추가하지 않아도 됨
          synchronize: true // Entity에 맞춰 DB 테이블의 스키마가 변경됨 -> 프로덕션 환경에서는 사용하면 안됨
        }
      }
    })
  ],
})
export class AppModule {}

```

# 참고

- [NestJS 공식문서](https://docs.nestjs.com/techniques/configuration)
- [Nest.js TypeORM과 Entity, 개발하는 기획자](https://blog.naver.com/gi_balja/223054972094)