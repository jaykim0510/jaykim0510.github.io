---
layout: post
title:  '[NestJS] 로그인'
description: 
date:   2024-06-01 15:01:35 +0300
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


```js
nest new .
```

```js
nest g mo user
nest g co user
nest g s user
```

```js
nest g mo auth
nest g co auth
nest g s auth
```

![](/images/nest_login_1.png)


```
npm install --save @nestjs/typeorm typeorm mysql2
```

```
CREATE DATABASE study_login
```

```js
// app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3316,
      username: 'client',
      password: 'client',
      database: 'study_login',
      autoLoadEntities: true,
      synchronize: true
    }),
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


```


```js
// src/user/entities/user.entity.ts

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tb_user')
export default class UserEntity {
    
    @PrimaryGeneratedColumn()
    id?: number
    
    @Column()
    name: string
    
    @Column()
    email: string
    
    @Column({ name: 'hashed_password' })
    hashedPassword?: string
    
    @Column({ default: 'client' })
    role?: 'admin' | 'client'
    
    @CreateDateColumn({ name: 'created_at', type: 'datetime' })
    createdAt?: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
    updatedAt?: Date
}
```


```js
// src/user/user.module.ts

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule.forFeature([UserEntity])]
})
export class UserModule {}


```

![](/images/nest_login_2.png)

```js
// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}


```


```
npm i bcrypt
npm i -D @types/bcrypt
```

```js
// src/auth/auth.controller.ts

import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import SignupDto from './dtos/auth.signup.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        const { email, password } = signupDto
        
        // 이메일 중복 확인
        const isUniqueEmail = await this.authService.isUniqueEmail(email)
        if (!isUniqueEmail) {
            throw new HttpException('이미 등록된 이메일입니다', HttpStatus.BAD_REQUEST)
        }
        
        // 비밀번호 해싱
        const hashedPassword = await this.authService.hashing(password)
        
        // 회원가입
        const body = { ...signupDto, hashedPassword }
        delete body['password']
        const newUser = await this.authService.signup(body)
        
        if (!newUser) {
            throw new HttpException('회원가입에 실패했습니다', HttpStatus.BAD_REQUEST)
        }
        
        return newUser
    }
}
```

- 유저를 읽어보면, 유저가 회원가입을 한 날짜 `createdAt`의 값이 UTC 기준시간으로 되어 있다

```js
// src/user/user.controller.ts

import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {

    constructor(private userService: UserService) {}
    
    @Get(':id')
    async readUser(@Param('id') id: number) {
        const user = await this.userService.readUserById(id)
        return user
    }
}
```

![](/images/nest_login_3.png)


```js
{
    "id": 1,
    "name": "Michel",
    "email": "michel55@example.com",
    "hashedPassword": "$2b$10$GK/Ze7dItv1LaxBsaXJwfuHCeNpzP/UgiWshuukmCLSSCi44X79QC",
    "role": "client",
    "createdAt": "2024-06-10T07:38:04.438Z",
    "updatedAt": "2024-06-10T07:38:04.438Z"
}
```

- `createdAt`의 값이 `"2024-06-10T07:38:04.438Z"` 이라고 나오지만, 내가 실제로 저장한 시점은 `T16:38:04.438`이다
- 가장 간단한 해결책은, DB에 설정된 타임존(timezone)을 가져와서 우리의 애플리케이션에 똑같이 적용되도록 하는 것이다

```js
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      ...
      timezone: 'Z' // here
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

- 이렇게 하면 문제는 나는 한국인인데 DB가 미국에 있으면, 나의 가입날짜를 확인했을 때 미국 시간 기준으로 나올 것이다
- `user.createdAt.toLocaleString()` 또는 `user.createdAt.getHours()` 이렇게 읽어오면 UTC 값을 타임존에 맞게 변환되어 나온다
- 그래서 만약 여기서 말하는 타임존이 요청을 보낸 유저의 위치가 기준이라면 더 고민할게 없다. 이렇게 하면 된다
- 하지만 여기서 말하는 타임존이 애플리케이션이 실행되고 있는 서버의 위치가 기준이라면 아직 문제가 해결된게 아니다
- (DB가 미국에 있는데, 애플리케이션이 실행되고 있는 서버가 인도에 있다면, 한국에 사는 내가 가입날짜를 확인하면 인도시간이 기준이 되어 있을 것이다)

<br>

- 일단 이부분은 나중에 다른 포스트에서 다루기로 하고, 여기서는 로그인에 계속 집중하자
- 일단 지금까지 회원가입은 잘됐다
- 하지만 여기도 문제가 있다. 데이터 검증이다 `IsEnum(['admin', 'client'])`라고 했지만, 'foo' 이런 식으로 다른 값을 요청에 넣어도 요청이 허용된다
- `app.useGlobalPipes(new ValidationPipe())` 가 필요하다

```js
// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()) // here
  await app.listen(3000);
}
bootstrap();
```

- 이제 DTO 클래스에 맞지 않는 데이터를 바디에 넣어 보내면 HTTP 400 예외가 발생한다

```js
// 요청 바디
{
    "name": 123,
    "email": 123,
    "password": "admin",
    "role": "admins"
}

// 응답 바디
{
    "message": [
        "name must be a string",
        "email must be an email",
        "role must be one of the following values: "
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```

# Login

- 이메일, 비밀번호 기반의 로그인의 경우, 이메일이 존재하는지 먼저 확인하고, 존재하면 이메일로 유저를 찾아 해당 유저의 비밀번호가 일치하는지 확인한다
- 유저의 이메일과 비밀번호가 알맞은 경우, 로그인 상태를 유지하기 위해, jwt 토큰을 쿠키로 저장해둔다


```
npm install --save @nestjs/jwt
```

```js
// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    JwtModule // here
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}

```

```js
// src/auth/auth.controller.ts

import { Body, Controller, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private jwtService: JwtService
    ) {}
    
    @Post('login')
    async login(@Body('email') email: string, @Body('password') password: string, @Res({ passthrough: true }) res: Response) {
        // 이메일 확인
        const user = await this.userService.readUserByEmail(email)
        
        if (!user) {
            throw new HttpException('등록된 이메일이 없습니다', HttpStatus.NOT_FOUND)
        }
        
        // 비밀번호 확인
        const isValidUser = this.authService.isValidUser(user, password)
        if (!isValidUser) {
            throw new HttpException('비밀번호가 일치하지 않습니다', HttpStatus.BAD_REQUEST)
        }

        // JWT 토큰 생성
        const payload = { sub: user.id, email: user.email }

        const token = {
            access_token: this.jwtService.sign(payload, { secret: 'tHIsisSECreT' }),
            refresh_token: '12345'
        }

        // 토큰 응답에 부착
        res.cookie('jwt', JSON.stringify(token))
        
        const result = {
            id: user.id,
            email: user.email,
            role: user.role
        }

        return result
    }
}

```

```js
// src/auth/auth.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import UserEntity from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
    
    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    ) {}
    
    isValidUser(user: UserEntity, plainPassword: string) {
        const isValid = bcrypt.compareSync(plainPassword, user.hashedPassword)
        return isValid
    }
}

```

```js
// src/user/user.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) {}
    
    async readUserByEmail(email: string) {
        const user = await this.userRepo.findOneBy({ email })
        return user
    }
}

```


![](/images/nest_login_4.png)



# Authentication

- 대부분의 서비스에는 로그인 여부를 확인해야 하는 라우트가 있다 (ex. 결제, 글 올리기 등)
- 로그인 여부를 확인하는 방법은, 쿠키의 jwt 값을 확인하는 것이다
- jwt가 없거나, 유효하지 않은 경우 로그인이 필요한 상황이라 간주한다
- 유효한 jwt를 가진 경우 로그인 됐다고 간주한다

<br>

- 쿠키 값을 읽으려면 `cookie-parser` 를 설치해야 한다

```
npm i cookie-parser
npm i -D @types/cookie-parser
```

```js
// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieParser()); // here
  
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000);
}
bootstrap();

```

```js
import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import SignupDto from './dtos/auth.signup.dto';
import { UserService } from 'src/user/user.service';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private jwtService: JwtService
    ) {}
    
    @Get('myprofile')
    async readMyProfile(@Req() req: Request) {
        
        const jwt = req.cookies['jwt']
        if (!jwt) {
            throw new HttpException('로그인이 필요합니다', HttpStatus.FORBIDDEN)
        }
        
        // Verify
        const jwtObject = JSON.parse(jwt)
        const accessToken = jwtObject['access_token']
        const userPayload = await this.jwtService.verifyAsync(accessToken, { secret: 'tHIsisSECreT' })
        if (!userPayload) {
            throw new HttpException('로그인 정보가 유효하지 않습니다', HttpStatus.FORBIDDEN)
        }
        
        // Business Logic
        const userId = userPayload['sub']
        const user = await this.authService.readMyProfile(userId)
        return user
    }
}

```

## Guard

- 위와 같이 요청(request) 객체에서 쿠키에 저장된 jwt 값을 읽어오고 유효성을 판단함으로써 로그인 여부를 확인할 수 있다
- 하지만 로그인 여부를 확인해야 하는 라우트가 여러개라면 위와 같은 코드를 해당 라우트들에 모두 작성해야 한다
- 위와 같은 반복을 피하기 위해 미들웨어로 만들어 필요한 라우트 앞에서 실행되도록 하면 좋다
- 이를 위해 NestJS에서는 `Guard` 라는 인증/인가를 위한 용도의 클래스를 제공한다


```js
// src/auth/guards/jwt.guard.ts

import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export default class JwtGuard implements CanActivate {

    constructor(private jwtService: JwtService) {}
    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest()
        try {
            const jwt = request.cookies['jwt']
            const jwtObj = JSON.parse(jwt)
            const accessToken = jwtObj['access_token']
            this.jwtService.verify(accessToken, { secret: 'tHIsisSECreT' })
            return true
        } catch(e) {
            console.log(e)
            return false
        }
    }
}
```

```js
// src/auth/auth.controller.ts

import { Controller, Get, UseGuards } from '@nestjs/common';
import JwtGuard from 'src/auth/guards/jwt.guard';

@Controller('auth')
export class AuthController {
    
    @UseGuards(JwtGuard)
    @Get('myprofile')
    async readMyProfile() {
        ...
    }
}

```

- `Guard`는 요청을 처리할지 아니면 거부할지에 대해 true/false를 리턴하는 역할을 한다
  - true를 리턴하면, 해당 요청을 라우트 핸들러가 계속 처리하고, 
  - false를 리턴하면 라우트 핸들러를 만나기 전에 거부하고, 아래와 같은 메세지를 리턴한다

```js
{
    "message": "Forbidden resource",
    "error": "Forbidden",
    "statusCode": 403
}
```

- 근데 보통 로그인 여부를 확인하는 라우트는 비즈니스 로직에 유저의 정보를 필요로 하는 경우가 많다
- 예를 들어, '나의 프로필 읽기'의 경우 자신의 정보를 필요로 하고, '글 올리기'의 경우도 작성자가 누구인지 저장하기 위해 자신의 정보가 필요하다
- 그래서 위의 경우, 결국 라우트 핸들러 안에서 다시 jwt 정보를 가져와 유저의 식별 정보(ex. id, email)를 통해 유저 정보를 가져와야 한다
- 이러한 반복 작업을 없애기 위해, Guard에서 요청(request) 객체의 속성으로 유저 정보를 붙여줄 수도 있다

```js
// src/auth/guards/jwt.guard.ts

import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { UserService } from "src/user/user.service";

@Injectable()
export default class JwtGuard implements CanActivate {

    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest()
        try {
            const jwt = request.cookies['jwt']
            const jwtObj = JSON.parse(jwt)
            const accessToken = jwtObj['access_token']
            const payload = this.jwtService.verify(accessToken, { secret: 'tHIsisSECreT' })
            const userId = payload['sub']
            const user = await this.userService.readUserById(userId)
            request['user'] = user // here
            return true
        } catch(e) {
            console.log(e)
            return false
        }
    }
}
```

```js
// src/auth/auth.controller.ts

import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import JwtGuard from 'src/auth/guards/jwt.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    
    @UseGuards(JwtGuard)
    @Get('myprofile')
    async readMyProfile(@Req() req: Request) {
        const user = req['user'] // here
        return user
    }
}

```

## Passport

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

```js
// src/auth/aut.module.ts

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import LocalStrategy from './guards/local.strategy';
import JwtStrategy from './guards/jwt.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}

```

```js
// src/auth/guards/local.strategy.ts

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserService } from "src/user/user.service";
import { AuthService } from "../auth.service";

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UserService,
        private authService: AuthService
    ) {
        super({ usernameField: 'email' })
    }
    
    async validate(username: string, password: string) {
        const user = await this.userService.readUserByEmail(username)
        if (!user) {
            throw new HttpException('등록된 이메일이 없습니다', HttpStatus.NOT_FOUND)
        }
        
        const isValid = this.authService.isValidUser(user, password)
        if (!isValid) {
            throw new HttpException('비밀번호가 일치하지 않습니다', HttpStatus.BAD_REQUEST)
        }
        
        return user
    }
}
```

```js
// src/auth/guards/local.guard.ts

import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export default class LocalGuard extends AuthGuard('local') {}
```

```js
// src/auth/auth.controller.ts

import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import LocalGuard from './guards/local.guard';

@Controller('auth')
export class AuthController {
    
    @UseGuards(LocalGuard)
    @Post('local-login')
    async localLogin(@Req() req: Request) {
        const user = req['user']
        return user
    }
}

```

### JWT Strategy


```
npm install passport-jwt
npm install -D @types/passport-jwt
```

```js
// src/auth/guards/jwt.strategy.ts

import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private userService: UserService) {
    
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'tHIsisSECreT'
        })
    }
    
    async validate(payload: any) {
        const userId = payload['sub']
        const user = this.userService.readUserById(userId)
        return user
    }

}
```

```js
// src/auth/guards/jwt.guard.ts

import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export default class JwtGuard extends AuthGuard('jwt') {}
```

```js
// src/auth/auth.controller.ts

import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import JwtGuard from 'src/auth/guards/jwt.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    
    @UseGuards(JwtGuard)
    @Get('myprofile')
    async readMyProfile(@Req() req: Request) {
        const user = req['user'] // here
        return user
    }
}
```


# 참고

- [Passport (authentication), NestJS ](https://docs.nestjs.com/recipes/passport)
- [[NestJS] Passport 알아보기 (feat. authentication), cdragon](https://cdragon.tistory.com/entry/NestJS-Passport-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0-feat-authentication)