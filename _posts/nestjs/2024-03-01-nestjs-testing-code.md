---
layout: post
title:  '[NestJS] 테스트 코드 (with JEST)'
description: 
date:   2024-03-01 15:01:35 +0300
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

# 테스트 코드

- 테스트 코드는 소프트웨어의 기능과 동작을 테스트하는 데 사용되는 코드를 말한다
- 테스트 코드를 작성함으로써 기능을 추가 또는 수정하면서 발생할 수 있는 부작용을 사전에 방지할 수 있다
- 또 배포 전 테스트를 진행함으로써 서비스의 안정성을 높일 수 있다

# 테스트 코드의 종류

![](/images/backend_nestjs_test_1.png){:width="80%"}

- **단위 테스트**
  - 특정 기능을 담당하는 작은 단위의 코드를 테스트하는 것을 말한다
  - ex. 회원가입, 로그인, 장바구니, 팔로우 등

- **통합 테스트**
  - 단위 테스트에서 검증된 개별 모듈을 결합해 , 코드의 주요 흐름들을 통합적으로 테스트하는 것을 말한다
  - 데이터베이스와 같은 외부 의존성도 함께 묶어 검증할 때 사용한다

- **E2E 테스트**
  - 실제 사용자의 시나리오를 테스트하는 것을 말한다
  - ex. 사용자 상품 구매 시나리오: 상품 탐색 - 상품 선택 - 상품 장바구니 추가 - 상품 구매

# 테스트 코드를 작성하는 이유

## 디버깅 비용 절감

- 디버깅을 하다보면 문제를 해결하는 시간보다 문제가 발생한 지점을 찾는데 더 많은 시간을 소요하게 된다
- 테스트 코드를 단위별로, 시나리오별로 구분해 작성함으로써 문제가 어떤 시나리오, 어떤 기능에서 생겼는지 빠르게 찾아낼 수 있다

## 코드 변경에 대한 불안감 해소

- 어떤 문제를 해결했더니, 이전에 제대로 동작하던 것들에 문제가 생기는 경우가 있다
- 이를 회귀 버그라고 하는데, 이러한 회귀 버그는 예방하는 것이 아니라 관리하고 대처해야 한다
- 대처하는 방법 중 하나가 바로 회귀 테스트 코드를 작성하는 것이다
- 회귀 테스트 코드를 작성함으로써 코드 변경에 자신감을 불어넣고 지속적으로 리팩토링을 가능하게 하며 서비스가 꾸준히 발전하도록 해준다

## 더 나은 문서자료

- 우리가 작성한 코드를 처음 접하는 사람들에게 도움을 주고자 문서화를 하지만, 코드의 수정에 맞춰 문서 최신화가 이뤄지지 않는 경우가 많다
- 테스트 코드는 잘 작성하면 좋은 문서자료로서의 역할도 수행할 수 있다
- 테스트 코드를 작성할 때 명세를 잘 작성하면, 이 코드가 어떤 역할을 하는지 이해하는데 도와준다

```js
// 상품 구매 시나리오
  // 상품을 구매하기 위해서는 로그인을 해야한다
  ...test code

  // 상품을 구매하기 위해서는 상품의 재고가 있어야 한다
  ...test code

```

# 좋은 테스트 코드 작성하는 방법

## DRY 보다는 DAMP 하게 작성

- **D**escriptive **A**nd **M**eaningful **P**hrases
- 테스트 코드에서는 중복 제거에 열중할 필요 없다
- 그보다는 더 서술적이고 어떤 것을 테스트하려는지의 의도가 명확하게 드러나는 방향으로 작성하는 것이 좋다
- DAMP 원칙을 지키면서 중복을 줄이는 방안으로는 테스트 픽스쳐 함수나 클래스 등을 사용할 수 있다

## 구현이 아닌 결과를 검증하도록 한다

- 내부 구현이나 비공개(private) 메소드들은 언제든지 바뀔 여지가 있는 코드이기 때문에 굳이 꺼내서 테스트하는 것은 좋지 않다
- 따라서 테스트 코드는 내부 구현보다는 실행 결과에 집중하는 것이 리팩토링 내성을 높일수 있다

## 읽기 좋은 테스트를 작성하라

- 테스트 코드도 결국 유지보수의 대상이기 때문에 가독성이 좋아야 한다
- 좋은 테스트 코드는 읽는 사람 입장에서 이 테스트를 이해하는데 필요한 모든 정보를, 테스트 케이스 본문에 담고 있는 테스트를 말한다
- 또한 테스트 코드를 준비, 실행, 검증 3개의 구절로 나누어 구조를 잘 잡는 것이 좋다

## 테스트 명세에 비즈니스 행위를 담도록 한다

- 개발자 용어 보다는 누구든 이해할 수 있는 비즈니스 행위를 담은 명세가 좋다
- ex. 관리자를 생성한다 -> 관리자로 가입한다


# Jest

- 페이스북에서 만든 자바스크립트 테스팅 라이브러리
- 출시 초기에는 프론트엔드에서 주로 쓰였지만 최근에는 백엔드에서도 많이 사용되고 있다
- Test Runner, Test Matcher 그리고 Test Mock 과 같은 테스트 코드에 필요한 모든 요소를 갖추고 있다

## 레이아웃

- **describe**
  - 여러 테스트를 문맥적으로 묶을 때 사용한다
  - `describe`를 중첩해서 사용할 수도 있다
- **test**
  - 하나의 테스트를 정의할 때 사용한다
  - `it`은 `test`의 별칭일 뿐 기능은 같다

```js
describe('first describe', () => {
  test(...);
  it(...);

  describe('nested describe', () => {
    test(...)
  })
});
```

## 단위 테스트 작성

- 작은 단위의 테스트 코드를 작성해보자
- 크게 다음과 같은 3개의 구성요소가 있다
  - **Expect**
    - `expect` 함수를 이용해 테스트하고 싶은 값을 정의한다
  - **Modifiers**
    - `not` 수정자를 이용해 어떤 값의 부정을 테스트할 수 있다
    - `resolves` 수정자를 이용해 어떤 Promise 객체가 fulfilled 상태일 때의 값을 테스트할 수 있다
    - `rejects` 수정자를 이용해 어떤 Promise 객체가 rejected 상태일 때의 값을 테스트할 수 있다
    - ```js
      // not 수정자
      test('the best flavor is not coconut', () => {
        expect(bestLaCroixFlavor()).not.toBe('coconut');
      });

      // resolves 수정자
      test('resolves to lemon', () => {
        // make sure to add a return statement
        return expect(Promise.resolve('lemon')).resolves.toBe('lemon');
      });

      // rejects 수정자
      test('rejects to octopus', () => {
        // make sure to add a return statement
        return expect(Promise.reject(new Error('octopus'))).rejects.toThrow(
          'octopus',
        );
      });
      ```

  - **Matchers**
    - `toXX` 형태의 함수를 이용해 테스트하고 싶은 값의 검증 값을 정의한다
    - [준비 - 실행 - 검증]에서 검증에 해당한다고 생각하면 된다
    - 다양한 문맥의 테스트 방법을 제공한다
      - ex. `toBe(5)`: ~이 `5`인지 검증한다, `toBeNull()`: ~이 `null`인지 검증한다
    - Mathers 목록은 [**공식문서를 참고**](https://jestjs.io/docs/expect#matchers){:target="_blank"}하자


## 특정 조건에 실행

- **매번 실행**
  - `beforeEach`
    - 각각의 테스트 함수가 실행되기 전에 매번 실행하고 싶은 코드가 있을 때 사용한다
    - ex. 중복 코드를 제거하고 싶을 때 사용
  - `afterEach`
    - 각각의 테스트 함수가 실행되고 난 후 매번 실행하고 싶은 코드가 있을 때 사용한다
    - ex. 각 테스트에서 만들어낸 데이터를 제거하고 초기화하고 싶을 때 사용
- **딱 한 번 실행**
  - `beforeAll`
    - 함수마다 매번 호출되는 것이 아니라, 맨 처음에 딱 한 번만 호출하고 싶은 코드가 있을 때 사용한다
    - ex. 데이터베이스 초기 연결
  - `afterAll`
    - 맨 마지막에 딱 한 번만 호출하고 싶은 코드가 있을 때 사용한다
    - ex. 데이터베이스 연결 종료
- **특정한 것만 실행 또는 스킵**
  - `only`
    - 디버깅할 때 유용한 함수로, 테스트 파일 안에서 특정 테스트 함수만 실행해보고 싶은 경우 사용한다
  - `skip`
    - 디버깅할 때 유용한 함수로, 테스트 파일 안에서 특정 테스트 함수만 제외하고 싶은 경우 사용한다

## 모킹

- 모킹(mocking)은 단위 테스트를 작성할 때, 해당 코드가 의존하는 부분을 가짜(mock)로 대체하는 방법을 말한다
- 특정 기능만을 테스트 하겠다는 단위 테스트 본연의 목적에만 집중하도록 해준다
- **비즈니스 로직이 테스트 대상**이 되며, **데이터베이스와 같은 외부 의존성 작업은 모킹**한다

### 무엇을 모킹해야 하나

- 외부 의존성을 차단할 때
  - 데이터베이스, API 호출, 파일 시스템 등 외부에 의존하는 코드가 테스트에 영향을 미치는 것을 막기 위해 모킹을 사용한다
  - 이렇게 하면 테스트 환경을 독립적으로 만들 수 있다
- 테스트 범위를 좁히기 위해
  - 특정 함수의 내부 로직만 테스트하고 싶을 때, 의존하는 다른 함수들은 모킹할 수 있다


###  함수 모킹

- 모킹 함수는 진짜 함수는 아니고, 겉모습만 정의된 가짜 함수를 말한다
- 모킹 함수는 감시 대상이 되어, 몇 번 호출 되고 어떤 값을 리턴했는지와 같은 행동이 기록으로 남는다
- 테스트 대상이 되지 않는 외부 의존성에 해당하는 함수를 모킹 함수로 만든다

<br>

- `jest.fn`
  - 모킹 함수를 직접 만들 때는 `jest.fn()`를 사용한다
  - 실제 비즈니스 로직을 구현할 필요 없이, 리턴해야 할 값을 리턴하도록 정의만 해도 된다
  - ```js
      // 진짜 함수
      real_add_function = (a, b) => {
        return a + b
      }

      // 모킹 함수
      const mockAddFn = jest.fn();
      mockAddFn.mockReturnValue(3);
      mockAddFn(1, 2)
      ```
  - 모킹 함수는 자신이 어떻게 호출되었는지를 모두 기억한다
  - ```js
      mockFn("a");
      mockFn(["b", "c"]);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith("a");
      expect(mockFn).toHaveBeenCalledWith(["b", "c"]);
    ```
- `jest.spyOn`
  - 직접 모킹 함수를 만들지는 않고, 어떤 객체에 정의된 메서드를 모킹 함수로 만들어 감시하고자 할 때 사용한다
  - ```js
      const calculator = {
        add: (a, b) => a + b,
      };

      const spyFn = jest.spyOn(calculator, "add");

      const result = calculator.add(2, 3);

      expect(spyFn).toHaveBeenCalledTimes(1);
      expect(spyFn).toHaveBeenCalledWith(2, 3);
      expect(result).toBe(5);
    ```

### 모듈 모킹

- 모듈이란 특정 역할을 위해 필요한 기능들을 묶어 하나의 파일로 만든 것을 말한다
- 이러한 모듈 파일들은 해당 프로젝트의 내부 디렉터리에 존재할 수도 있고, `npm`을 통해 설치한 외부 패키지가 될 수도 있다

<br>

- `jest.mock`
  - 모듈을 모킹할 때는 `jest.mock()` 함수를 사용한다
  - `userService` 모듈을 테스트하기 위해, `messageService` 모듈을 모킹하는 경우 코드는 아래와 같다
  - ```js
      // 내부 모듈 모킹

      // userService.test.js

      import { register, deregister } from "./userService";
      import { sendEmail, sendSMS } from "./messageService";

      jest.mock("./messageService");

      beforeEach(() => {
        sendEmail.mockClear();
        sendSMS.mockClear();
      });

      const user = {
        email: "test@email.com",
        phone: "012-345-6789",
      };

      test("register sends messages", () => {
        register(user);

        expect(sendEmail).toHaveBeenCalledTimes(1);
        expect(sendEmail).toHaveBeenCalledWith(user.email, "회원 가입을 환영합니다!");

        expect(sendSMS).toHaveBeenCalledTimes(1);
        expect(sendSMS).toHaveBeenCalledWith(user.phone, "회원 가입을 환영합니다!");
      });

      ```
  - 외부 모듈을 모킹할 때도 똑같다
  - ```js
      // 외부 모듈 모킹

      const axios = require("axios");
      const userService = require("./userService");

      jest.mock("axios");

      test("findOne fetches data from API endpoint", async () => {
        axios.get.mockResolvedValue({
          data: {
            id: 1,
            name: "Dale Seo",
          },
        });

        const user = await userService.findOne(1);

        expect(user).toHaveProperty("id", 1);
        expect(user).toHaveProperty("name", "Dale Seo");
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(
          `https://jsonplaceholder.typicode.com/users/1`
        );
      });
    ```

### 클래스 모킹

- AuthService 클래스는 UserService 클래스를 사용하고 있습니다
- 생성자를 통해서 UsersService 클래스의 인스턴스를 받는다
- 이런 방식으로 애플리케이션 코드를 작성하면 테스트 코드를 작성할 때 모킹한 클래스의 가짜 인스턴스를 매우 유연하게 주입할 수 있는 이점이 있다

```sh
npm add -D jest-mock-extended
```

- jest-mock-extended 패키지에서 제공하는 mock() 함수를 사용하면 간편하게 가짜 인스턴스를 생성할 수 있습니다. 그리고 jest-mock-extended 패키지에서 제공하는 MockProxy로 mock() 함수가 반환하는 가짜 인스턴스를 타입을 지정해줍니다.


```js
import { type MockProxy, mock } from "jest-mock-extended";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";

describe("AuthService", () => {
  let usersService: MockProxy<UsersService>;
  let authService: AuthService;

  beforeEach(() => {
    usersService = mock<UsersService>();
    authService = new AuthService(usersService);
  });

  it("throws an error if user is not found", () => {
    usersService.findByEmail.mockReturnValue(null);

    expect(() => authService.logIn("test@email.com", "NOT_FOUND")).toThrow(
      "Not Found"
    );

    expect(usersService.findByEmail).toHaveBeenCalledTimes(1);
    expect(usersService.findByEmail).toHaveBeenCalledWith("test@email.com");
  });

  it("throws an error if password does not match", () => {
    usersService.findByEmail.mockReturnValue({
      id: 200,
      email: "test@email.com",
      password: "PASSWORD",
    });

    expect(() => authService.logIn("test@email.com", "WRONG_PASSWORD")).toThrow(
      "Wrong Password"
    );

    expect(usersService.findByEmail).toHaveBeenCalledTimes(1);
    expect(usersService.findByEmail).toHaveBeenCalledWith("test@email.com");
  });

  it("returns a user if password matches", () => {
    usersService.findByEmail.mockReturnValue({
      id: 200,
      email: "test@email.com",
      password: "PASSWORD",
    });

    expect(authService.logIn("test@email.com", "PASSWORD")).toHaveProperty(
      "id",
      200
    );

    expect(usersService.findByEmail).toHaveBeenCalledTimes(1);
    expect(usersService.findByEmail).toHaveBeenCalledWith("test@email.com");
  });
});
```

# Nest 테스트 코드 작성하기

```ts
// src/user/user.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            readUsers: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  // 컨트롤러 클래스에 대한 테스트
  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  // 컨트롤러가 가지는 각각의 라우트에 대한 테스트
  describe('readUsers', () => {
    test('이메일 정보만 이용해 유저 목록을 불러오는 함수를 호출할 때 잘 넘겨주는지 테스트', async () => {
      const email = 'kim@naver.com';
      const username = undefined;

      (userService.readUsers as jest.Mock).mockResolvedValue([
        { email, username: 'kim' },
      ]);

      const result = await userController.readUsers(email, username);

      expect(userService.readUsers).toHaveBeenCalledWith(email, username);
      expect(result).toStrictEqual([{ email, username: 'kim' }]);
    });

    test('유저명 정보만 이용해 유저 목록을 불러오는 함수를 호출할 때 잘 넘겨주는지 테스트', async () => {
      const email = undefined;
      const username = 'kim';

      (userService.readUsers as jest.Mock).mockResolvedValue([
        { email: 'kim@naver.com', username },
      ]);

      const result = await userController.readUsers(email, username);

      expect(userService.readUsers).toHaveBeenCalledWith(email, username);
      expect(result).toStrictEqual([{ email: 'kim@naver.com', username }]);
    });

    test('이메일과 유저명 정보를 이용해 유저 목록을 불러오는 함수를 호출할 때 잘 넘겨주는지 테스트', async () => {
      const email = 'kim@naver.com';
      const username = 'kim';

      (userService.readUsers as jest.Mock).mockResolvedValue([
        { email, username },
      ]);

      const result = await userController.readUsers(email, username);

      expect(userService.readUsers).toHaveBeenCalledWith(email, username);
      expect(result).toStrictEqual([{ email, username }]);
    });

    test('존재하지 않는 유저의 정보를 이용해 유저 목록을 불러오는 함수를 호출할 때 잘 넘겨주는지 테스트', async () => {
      const email = 'fake@naver.com';
      const username = 'fake';

      (userService.readUsers as jest.Mock).mockResolvedValue([]);

      const result = await userController.readUsers(email, username);

      expect(userService.readUsers).toHaveBeenCalledWith(email, username);
      expect(result).toStrictEqual([]);
    });
  });
});
```

```ts
// src/user/user.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userRepo: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepo = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('readUsers', () => {
    test('이메일과 유저명을 받았을 때 쿼리를 올바르게 실행하는지 테스트', async () => {
      const email = 'kim@naver.com';
      const username = 'kim';

      const createQueryBuilderMock = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ email, username }]),
      };
      jest
        .spyOn(userRepo, 'createQueryBuilder')
        .mockReturnValue(createQueryBuilderMock as any);

      const result = await userService.readUsers(email, username);

      expect(createQueryBuilderMock.andWhere).toHaveBeenCalledWith(
        'email = :email',
        { email },
      );

      expect(createQueryBuilderMock.andWhere).toHaveBeenCalledWith(
        'username = :username',
        { username },
      );

      expect(result).toStrictEqual([{ email, username }]);
    });
  });

  test('이메일만 받았을 때 쿼리를 올바르게 실행하는지 테스트', async () => {
    const email = 'kim@naver.com';
    const username = undefined;

    const createQueryBuilderMock = {
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([{ email, username: 'kim' }]),
    };
    jest
      .spyOn(userRepo, 'createQueryBuilder')
      .mockReturnValue(createQueryBuilderMock as any);

    const result = await userService.readUsers(email, username);

    expect(createQueryBuilderMock.andWhere).toHaveBeenCalledWith(
      'email = :email',
      { email },
    );

    expect(createQueryBuilderMock.andWhere).not.toHaveBeenCalledWith(
      'username = :username',
      { username },
    );

    expect(result).toStrictEqual([{ email, username: 'kim' }]);
  });

  test('유저명만 받았을 때 쿼리를 올바르게 실행하는지 테스트', async () => {
    const email = undefined;
    const username = 'kim';

    const createQueryBuilderMock = {
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest
        .fn()
        .mockResolvedValue([{ email: 'kim@naver.com', username }]),
    };
    jest
      .spyOn(userRepo, 'createQueryBuilder')
      .mockReturnValue(createQueryBuilderMock as any);

    const result = await userService.readUsers(email, username);

    expect(createQueryBuilderMock.andWhere).not.toHaveBeenCalledWith(
      'email = :email',
      { email },
    );

    expect(createQueryBuilderMock.andWhere).toHaveBeenCalledWith(
      'username = :username',
      { username },
    );

    expect(result).toStrictEqual([{ email: 'kim@naver.com', username }]);
  });

  test('아무것도 들어오지 않았을 때 400 예외를 발생시키는지 테스트', async () => {
    await expect(userService.readUsers(undefined, undefined)).rejects.toThrow(
      new HttpException(
        'At least email or username is required',
        HttpStatus.NOT_FOUND,
      ),
    );
  });
});


```

```
npm run test
```

# 참고

- [테스트 코드란?, 데브피플](https://www.startupcode.kr/company/blog/archives/17)
- [테스트 코드를 왜 그리고 어떻게 작성해야 할까?, 인프랩](https://tech.inflab.com/20230404-test-code/)
- [Jest로 기본적인 테스트 작성하기, DaleSeo](https://www.daleseo.com/jest-basic/)
- [Jest 공식문서](https://jestjs.io/)
- [NestJS 공식문서](https://docs.nestjs.com/fundamentals/testing)