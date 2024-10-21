---
layout: post
title:  '[NestJS] 로그인'
description: 'NestJS를 이용해 회원가입, 로그인, 인증/인가 기능을 구현하는 방법에 대해 공부합니다' 
date:   2024-06-01 15:01:35 +0300
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

# Setup

## 프로젝트 생성

```
pwd
----------------
/Users/peter/train/nestjs/ecommerce
```

```
nest new .
```

## 데이터베이스 생성 및 연결

```
CREATE DATABASE train_nestjs_ecommerce
```

```
npm install --save @nestjs/typeorm typeorm mysql2
```

```ts
import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({ // here
      type: 'mysql',
      database: 'train_nestjs_ecommerce',
      host: 'localhost',
      port: 3316,
      username: 'client',
      password: 'client',
      autoLoadEntities: true,
      synchronize: true,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

```

```
// 개발용 로컬 서버를 실행했을 때, Connection Error 가 뜨지 않으면 성공
npm run start:dev
```

```
git commit -m "configuration for mysql database"
```

## User, Auth 모듈 생성

```
git checkout -b login
```

```
nest g mo user
nest g co user
nest g s user
```

```
nest g mo auth
nest g co auth
nest g s auth
```

![](/images/nest_login_1.png)


## 유저 엔티티 생성

```ts
// src/user/entities/user.entity.ts

import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Exclude} from "class-transformer";

@Entity('tb_user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  email: string;

  @Exclude({ toPlainOnly: true }) // plain 형태로 네트워크를 통해 프론트엔드에 전달될 때는 제외되도록
  @Column()
  password: string;

  @Column({ default: 'client' })
  role?: 'admin' | 'client'

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt?: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt?: Date
}

```

```ts
// src/user/user.module.ts

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule, UserService]
})
export class UserModule {}
```

## 회원가입 로직

```
npm i class-validator class-transformer
```

```ts
// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UserModule} from "../user/user.module";

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}

```
```ts
// src/auth/dtos/auth.signup.dto.ts

import {IsEmail, IsString} from "class-validator";

export default class SignupDto {

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

```

```ts
// src/auth/auth.controller.ts

import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import AuthSignupDto from "./dtos/auth.signup.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return await this.authService.signup(signupDto)
  }
}

```

```ts
// src/auth/auth.service.ts

@Injectable()
export class AuthService {
  constructor(
          @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
  ) {}

  async signup(body: UserEntity) {
    const { email, password } = body;
    const isEmailExists = await this.isEmailExists(email);

    if (isEmailExists) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await this.hashing(password)

    const user = this.userRepo.create({ ...body, password: hashedPassword });
    return this.userRepo.save(user); // here
  }

  async isEmailExists(email: string) {
    return this.userRepo.existsBy({ email });
  }

  async hashing(plain: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(plain, salt);
  }
}

```

- `insert()` 는 이미 존재하는지 조회하지 않고 바로 레코드를 생성하지만, 반환되는 값이 레코드가 아닌 메타데이터이다
- `save()` 는 이미 존재하면 업데이트 하는 로직을 포함해 성능상 단점이 있지만, 반환되는 값이 레코드이기 때문에 깔끔하다
- 그래서 일단은 레코드를 반환하는게 코드가 명확하다고 생각해 `save()` 메서드를 사용했다. 만약 성능상 개선이 필요하다면 `insert()` 를 사용해도 괜찮을 것 같다

# Login

- 이메일, 비밀번호 기반의 로그인의 경우, 이메일이 존재하는지 먼저 확인하고, 존재하면 이메일로 유저를 찾아 해당 유저의 비밀번호가 일치하는지 확인한다
- 유저의 이메일과 비밀번호가 알맞은 경우, 로그인 상태를 유지하기 위해, jwt 토큰을 쿠키로 저장해둔다

```
npm install --save @nestjs/jwt
```


```ts

import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}
  
  async getVerifiedUser(email: string, password: string) {
    const user = await this.userRepo.findOneBy({ email })
    if (user) {
      const isVerified = await bcrypt.compare(password, user.password);
      if (isVerified) {
        return user;
      }
    }
    throw new HttpException('Email or password is wrong', HttpStatus.UNAUTHORIZED);
  }

  getToken(user: UserEntity) {
    const payload = { sub: user.id, email: user.email }
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' })
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' })
    return { accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const user = await this.getVerifiedUser(email, password);

    return this.getToken(user)
  }
}
```

# Authentication

- 이제 로그인에 성공했으므로, 로그인 여부를 확인해야 하는 경우에 대해 살펴보자
- 대부분의 서비스에는 로그인 여부를 확인해야 하는 라우트가 있다 (ex. 결제, 글 올리기 등)
- 로그인 여부를 확인하는 방법은, 쿠키의 jwt 토큰 값을 확인하는 것이다
- 클라이언트는 jwt 토큰을 `Cookies` 헤더 또는 `Authorization` 헤더에 포함시키면 된다
- jwt가 없거나, 유효하지 않은 경우 로그인이 필요한 상황이라 간주한다
- 유효한 jwt를 가진 경우 로그인 됐다고 간주한다

<br>

- 쿠키 값을 읽으려면 `cookie-parser` 를 설치해야 한다

```
npm i cookie-parser
npm i -D @types/cookie-parser
```


## Guard

- Authentication 이 필요한 라우트마다, 쿠키에 저장된 jwt 값을 읽고, 검증하는 과정을 반복하는 것은 좋지 않다
- NestJS에서는 `Guard` 라는 인증/인가를 위한 용도의 클래스를 제공한다
- NestJS의 Guard 클래스 안에 이러한 로직을 작성해주면, Guard가 라우트 안의 코드가 실행되기 전에 먼저 Authentication 을 한다

```ts
// src/auth/guards/auth.jwt.guard.ts

import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { Request, Response } from 'express'
import {AuthService} from "../auth.service";

@Injectable()
export default class JwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const response: Response = context.switchToHttp().getResponse()

    const accessToken = request?.cookies?.accessToken

    const user = await this.authService.getVerifiedUserByJwt(accessToken)
    if (user) {
      console.log('액세스 토큰 있음')
      request['user'] = user
      return true
    } else {
      const refreshToken = request?.cookies?.refreshToken
      const user = await this.authService.getVerifiedUserByJwt(refreshToken)
      if (user) {
        console.log('액세스 토큰 만료됨. 리프레쉬 토큰으로 액세스 토큰 재발급')
        const { accessToken } = this.authService.getToken(user)
        response.cookie('accessToken', accessToken)
        request['user'] = user
        return true
      } else {
        console.log('리프레쉬 토큰 만료. 로그인 필요')
        return false
      }
    }
  }
}
```

- `jwtService.verify(token)` 는 토큰이 유효하면 `payload`, 유효하지 않거나 만료된 토큰이면 500 에러가 발생한다
- 이를 try-catch 문으로 적절하게 처리해줘야 한다

```ts
// src/auth/auth.service.ts

import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}


  async getVerifiedUserByJwt(token: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      return await this.userRepo.findOneBy({ id: payload.sub });
    } catch (error) {
      if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
        return null
      } else {
        throw new HttpException('An error occurred while verifying the token', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
```

```ts
// src/auth/auth.controller.ts

import {Body, Controller, Get, Post, Req, Res, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import AuthSignupDto from "./dtos/auth.signup.dto";
import { Response } from 'express';
import JwtGuard from "./guards/auth.jwt.guard";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService) {}

  @UseGuards(JwtGuard)
  @Get('test')
  async authTest(@Req() req: Request) {
    return req['user']
  }
}
```

- JwtGuard 는 AuthService 를 주입받고 있다. 그래서 JwtGuard 를 쓰려면 사용하는 곳에서 AuthModule 을 임포트 해야 한다
- JwtGuard 는 여러 곳에서 사용되기 때문에, AuthModule 은 글로벌 모듈로 만들어도 좋다

```ts
// src/auth/auth.module.ts

import {Global, Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UserModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: 'tHIsISsECret'
    }),
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

```

# Passport

- Passport 라이브러리는 node.js 인증 라이브러리 중 하나로 많은 운영 단계의 애플리케이션들에서 성공적으로 사용되고 있다
- 위에서 유저의 유효성을 검증하고, 요청(request) 객체의 속성에 유저 정보를 추가하는 과정을 표준 패턴으로 추상화하여 제공해준다
- 여러 인증 메커니즘을 공통된 패턴으로 구현하도록 도와준다
- (Google, Amazon, Kakao 같은 여러 기업의 계정 정보를 이용해 인증을 진행할 수도 있다) [참고](https://www.passportjs.org/packages/)

```
npm install @nestjs/passport passport
```

- 여기서는 가장 기본적인 인증 메커니즘인, local 방식과, jwt 방식을 알아본다

### Local Strategy

- local strategy는 사실상 username, password로 로그인을 구현하는 것과 같다

```
npm install passport-local
npm install -D @types/passport-local
```


### JWT Strategy


```
npm install passport-jwt
npm install -D @types/passport-jwt
```

# 소셜 로그인

# 참고

- [Passport (authentication), NestJS ](https://docs.nestjs.com/recipes/passport)
- [[NestJS] Passport 알아보기 (feat. authentication), cdragon](https://cdragon.tistory.com/entry/NestJS-Passport-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0-feat-authentication)