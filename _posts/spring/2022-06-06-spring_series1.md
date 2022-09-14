---
layout: post
title:  'Spring Series [Part1]: 스프링 핵심 원리'
description: 
date:   2022-06-06 15:01:35 +0300
image:  '/images/spring_logo.png'
logo_image:  '/images/spring_logo.png'
categories:   web_development
tags: Spring
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 스프링 역사

- **EJB(Enterprise Java Beans)**: 
  - 기업환경의 시스템을 구현하기 위한 서버측 컴포넌트 모델 (서버를 구현하기 위해 필요한 각종 기능들을 제공)
  - 서버 구현에 필요한 거의 모든 기능(ORM, 서버 애플리케이션 프레임워크 등)을 제공했지만 어렵고 느리고 비싸다
- **하이버네이트(Hybernate)**:
  - EJB에서 JPA 기능을 담당하던 엔티티 빈을 훨씬 사용하기 편하도록 구현
  - 하이버네이트를 조금 더 일반화 시켜 JPA를 표준화(용어를 통일시키고 기능을 일반화)시킴
  - 하이버네이트는 JPA의 구현체중 하나
    ![](/images/jpa_1.png)  
- **스프링(Spring)**:
  - EJB의 서버 애플리케이션 프레임워크를 훨씬 사용하기 편하게 만듬
  - EJB의 시대가 끝나고 봄(Spring)이 왔다 -> 스프링
- **스프링 부트(Spring Boot)**:
  - 스프링은 다 좋은데 설정하기가 힘들다
  - 스프링은 별도의 웹 서버도 있어야 하고, 서버 애플리케이션을 띄우기 위해 빌드도 해야한다
  - 스프링 부트가 이 모든 것들을 해결해준다



**JPA(Java Persistence API)**  

- 자바 진영의 ORM 표준 기술
- SQL 작성없이 객체를 DB에 직접 저장

**ORM(Object Relational Mapping)**  

- 메모리 상의 객체를 DB에 데이터로 저장시켜주는 기술



# 스프링

- 스프링은 하둡(Hadoop)이 HDFS와 MapReduce와 같은 기술들을 일컫는 생태계를 나타내는 것처럼 스프링도 스프링 생태계를 나타냄
- 각각의 기술들은 [**공식문서 참고**](https://spring.io/projects)

![](/images/spring_1.png)

## 스프링 프레임워크

- **핵심 기술**: 스프링 DI 컨테이너, AOP, 이벤트 등 (디자인 패턴 같은 느낌)
- **웹 기술**: 스프링 MVC (백엔드 설계 패턴(아키텍처) 같은 느낌)
- **데이터 접근** 기술: 트랜잭션, JDBC, JPA
- **기술 통합**: 캐시, 이메일, 원격접근, 스케줄링
- **테스트**: 스프링 기반 테스트 지원

## 스프링 부트

- 스프링을 편리하게 사용할 수 있도록 지원
- Tomcat 같은 웹 서버 내장
- 스프링과 외부 라이브러리 자동 구성

## 스프링의 핵심 컨셉
- 웹 애플리케이션을 만들어주는 프레임워크
- 데이터베이스에 접근을 편리하게 함
- **객체 지향 설계를 지원하는 프레임워크**


# 객체 지향  

## 다형성
- 객체 지향 코드를 작성할 때 얻을 수 있는 가장 큰 특징은 **다형성**
- 다형성은 **역할(인터페이스)과 구현(클래스)으로 나누어** 코드를 설계
- 코드 설계시 역할만 알아도 됨
- 빠른 설계와 유연한 확장 가능

## 제어의 역전, 의존 관계 주입
- 스프링은 **다형성을 위해 제어의 역전(IoC), 의존관계 주입(DI) 방식으로 개발**하도록 지원
- 스프링 컨테이너(`ApplicationContext`)가 위 방식을 가능하게 함
- 서비스를 공연에 비유하면 스프링 컨테이너는 공연 기획자에 해당

## 서버와 클라이언트
- 서버와 클라이언트를 각각 객체로 구현
- 클라이언트는 요청하는 객체, 서버는 응답하는 객체
- 수 많은 클라이언트 객체와 서버 객체는 서로 협력 관계를 가짐
- 서버와 클라이언트 구조에 다형성을 적용하면, 클라이언트를 변경하지 않고, 서버의 기능을 유연하게 변경할 수 있음
- (인터페이스를 구현한 객체 인스턴스를 실행 시점에 유연하게 변경할 수 있음)
- 인터페이스를 안정적으로 잘 설계하는 것이 중요

## SOLID

- 좋은 객체 지향 설계를 위한 5가지 원칙
- **S**(Single Responsibility Principle): 단일 책임 원칙
  - 하나의 클래스는 하나의 책임만 가진다
  - 하나의 책임? -> 모호하다
  - 핵심 의미는 변경이 생겼을 때 파급 효과가 적냐이다 -> 책임을 적절히 잘 분리해야 한다
- **O**(Open/Closed Principle): **개방/폐쇄 원칙**
  - 확장이 되더라도 변경은 일어나면 안된다
  - 이런 마법같은 일이?
  - 확장은 구현하는 객체에만 반영하고, 인터페이스에 대한 변경은 막자 -> **다른 구현체에 영향을 끼치지 말자**
  - 객체 지향의 특성중 다형성과 관련 -> 제어의 역전, 의존관계 주입 방식 필요 -> OCP를 지키기 위해서는 IoC와 DI가 있어야됨
- **L**(Liskov Substitution Principle): 리스코프 치환 원칙
  - 인터페이스를 구현하는 모든 객체 인스턴스는 인터페이스의 규약을 잘 지켜야함
  - 그래야 구현한 객체들중 어떤 것들로 치환하더라도 일관되게 동작할 수 있음
- **I**(Interface Segregation Principle): 인터페이스 분리 원칙
  - 하나의 범용적인 인터페이스보다 역할에 맞게 인터페이스를 분리하여 정의하는 것이 좋음
  - 단일 책임 원칙과 비슷한 철학
- **D**(Dependency Inversion Principle): **의존관계 역전 원칙**
  - 컴포넌트들이 구현 클래스가 아니라 **인터페이스에 의존**하도록 해야함
  - DIP도 다형성과 관련 -> **OCP와 DIP 모두 제어의 역전(IoC), 의존관계 주입(DI)을 필요로함**

## 스프링과 객체 지향

- 스프링은 **DI(Dependency Injection) 컨테이너** 기술을 통해 객체지향의 OCP, DIP 원칙을 지키도록 해줌
- DI 컨테이너 기술 덕분에 **기능의 확장을 부품 교체하듯** 할 수 있게 됨

# 스프링 컨테이너와 빈

- 구현체에는 의존관계가 없어야함 -> 의존관계는 인터페이스간에 있어야함 (DIP 원칙)
  - 구현체에 의존관계가 있으면 (DIP 원칙 위배) -> 기능 확장시 구현체간에 영향 끼침 (OCP 원칙 위배)
- 근데 인터페이스간에 의존관계만 정의하게 되면 구현 객체를 상황에 맞게 생성할 수가 없음 
  - 그래서 런타임 단계에서 적절히 구현 객체를 생성하고 연결해 줄 존재가 필요 -> 이를 담당하는 설정 클래스를 만들자 -> `AppConfig` 클래스

## AppConfig
- `AppConfig`는 애플리케이션의 실제 동작에 필요한 구현 객체를 생성
- `AppConfig`는 생성한 객체 인스턴스의 참조를 생성자를 통해 주입(연결)
- `AppConfig`가 바로 **의존관계 주입해주는 존재**였음
- 기능 변경으로 인한 코드 변경은 `AppConfig`에서만 일어난다
- `AppConfig`는 의존관계 주입뿐만 아니라, **제어의 흐름**까지 담당 -> 구현 객체는 자신의 로직을 실행하는 역할만 담당
- 이러한 `AppConfig` 클래스를 IoC 컨테이너 또는 **DI 컨테이너**라고 함
- 스프링에서는 이러한 `AppConfig`를 담당하는 클래스에 `@Configuration`을 붙여줌 (`@Configuration`이 빈의 싱글톤을 보장)
- 그리고 `AppConfig`에서 각 구현체를 리턴하는 메서드에는 `@Bean`을 붙여줌 -> 스프링 컨테이너에 스프링 빈으로 등록됨 -> 스프링 컨테이너의 관리 대상이 됨
- (`@Bean`이 붙은 메서드마다 이미 스프링 빈이 존재하면 존재하는 빈을 반환하고, 없으면 생성해서 스프링 컨테이너에 등록하고 반환)

```java
@Configuration
public class AppConfig {
  
  @Bean
  public MemberService memberService() {
    return new MemberServiceImpl(memberRepository());
  }

  @Bean
  public MemberRepository memberRepository() {
    return new MemoryRepository();
  }
}
```

```java
public static void main(String[] args) {
  AppConfig appConfig = new AppConfig();
  MemberService memberService = appConfig.memberService();
}
```

## ApplicationContext
- **ApplicationContext**를 스프링 컨테이너라 함
- ApplicationContext는 인터페이스이다
- 스프링 컨테이너는 DI 컨테이너를 더욱 사용하기 편하게 만든 것
- 스프링 컨테이너는 `AppConfig` 내의 구현 객체를 스프링 컨테이너에 빈으로 알아서 등록하고 알아서 의존관계를 주입해줌
- 빈(Bean)은 의존관계 주입을 위해 스프링 컨테이너에서 기다리는 구현 객체라고 생각하면 됨

```java
// AnnotationConfigApplicationContext는 ApplicationContext을 구현한 것중 하나
// ac가 우리의 빈을 관리해주는 스프링 컨테이너
ApplicationContext ac = new AnnotationConfigApplicationContext(AppConfig.class);

MemberService memberService = applicationContext.getBean("memberService", MemberService.class);

```

# 싱글톤 컨테이너

- 스프링은 태생이 기업용 온라인 서비스 기술을 지원하기 위해 탄생
- 웹 애플리케이션은 보통 여러 고객이 동시에 요청
- `AppConfig` 클래스가 요청이 들어올 때마다 새로운 객체를 생성함 -> 메모리 낭비가 커짐 -> **객체를 1개만 생성하고 공유하도록 설계**
- `private static final SingletonService instance = new SingletonService();`
- 스프링 컨테이너는 싱글톤 패턴의 문제점(DIP, OCP 위반 가능성. 유연성 떨어짐)을 해결하면서, 객체 인스턴스를 싱글톤으로 관리
- 스프링 **빈(Bean)이 바로 싱글톤으로 관리되는 객체**
- 객체 인스턴스를 공유하기 때문에 싱글톤 객체(스프링 빈)를 **무상태로 설계**해야함 -> 특정 클라이언트에 의존적인 필드가 있으면 안됨, 가급적 읽기만 가능해야함 


# 컴포넌트 스캔

- 스프링에서 설정 정보가 없어도 자동으로 스프링 빈을 등록하는 도와주는 기능
- 원래는 `AppConfig` 내에 구현체를 리턴하는 메서드를 정의하고 위에 @Bean을 붙이는 작업을 직접해야 했음
  ```java
  @Configuration
  public class AppConfig {
    
    @Bean
    public MemberService memberService() {
      return new MemberServiceImpl(memberRepository());
    }

    @Bean
    public MemberRepository memberRepository() {
      return new MemoryRepository();
    }
  }
  ```
- 이제는 이렇게 `AppConfig`에 `@ComponentScan`을 붙이고, 각 구현체에 `@Component`만 붙여주면 됨 (리턴하는 메서드를 정의, `@Bean`의 수고가 사라짐) 
  ```java
  @Configuration
  @ComponentScan
  public class AppConfig {
      
  }
  ```
- `@Component`이 붙은 클래스를 스캔해서 스프링 빈으로 등록해줌
  ```java
  @Component
  public class MemoryMemberRepository implements MemberRepository {}
  ```
- 근데 원래 `AppConfig`내에서 의존 관계를 주입했었는데, 의존관계는 이제 어떻게 해결하나? -> `@Autowired`
  ```java
  @Configuration
  public class AppConfig {
    
    @Bean
    public MemberService memberService() {
      return new MemberServiceImpl(memberRepository()); // memberService와 memberRepository간의 의존 관계가 이렇게 정의되어 있었음
    }
  }
  ```

# 의존관계 자동 주입

- `@Autowired`가 의존관계를 자동으로 주입

```java
@Component
public class MemberServiceImpl implements MerberService {
  private final MemberRepository memberRepository;

  @Autowired
  public MemberServiceImpl(MemberRepository memberRepository) {
    this.memberRepository = memberRepository;
  }
}
```

# 빈 생명주기 콜백

- DB 커넥션 풀, 네트워크 소켓처럼 애플리케이션 시작 시점에 필요한 연결을 미리 해두고, 애플리케이션 종료 시점에 연결을 모두 종료하는 작업을 진행하려면 객체의 초기화와 종료 작업이 필요하다
- 스프링 빈은 객체를 생성하고, 의존관계 주입이 다 끝난 다음에야 필요한 데이터를 사용할 수 있는 준비가 완료되고 초기화 작업을 할 수 있다
  ```
  객체 생성 -> 의존관계 주입 -> 초기화
  ```
- 의존관계 주입이 완료되는 시점에 스프링이 콜백 함수를 통해 초기화 시점을 알려준다. 또한 스프링 컨테이너가 종료되기 직전에 소멸 콜백 함수로 종료 시점을 알려준다

```
스프링 컨테이너 생성 -> 빈 생성 -> 의존관계 주입 -> 초기화 콜백 -> 사용 -> 소멸전 콜백 -> 스프링 종료
```

- 스프링은 크게 3가지 방법으로 빈 생명주기 콜백을 지원 -> 하지만 가장 많이 사용하는 방식은 `@PostConstruct`, `@PreDestory` 애노테이션
- 의존관계가 주입되고 실행되길 원하는 초기화 함수에 `@PostConstruct` 애노테이션을 붙여준다
  ```java
  @PostConstruct
  public void init() {
    System.out.println("NetworkClient.init);
    connect();
  }
  ```

# 빈 스코프

- 스프링 빈은 기본적으로 싱글톤 스코프로 생성 -> 스프링 컨테이너의 시작과 함께 생성되고 컨테이너가 종료될 떼까지 유지됨
- 스프링은 다양한 스코프를 지원
  - 싱글톤: 가장 넓은 범위의 스코프
  - 프로토타입: 빈의 생성과 의존관계 주입까지만 스프링 컨테이너가 관여 -> 매우 짧은 범위의 스코프
  - 웹 관련 스코프
    - request: 웹 요청이 들어오고 나갈때 까지 유지되는 스코프
    - session: 웹 세션이 생성되고 종료될 때 까지 유지되는 스코프
    - application: 웹의 서블릿 컨텍스트와 같은 범위로 유지되는 스코프