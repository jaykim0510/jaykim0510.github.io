---
layout: post
title:  'Java OOP Series [Part3]: 디자인 패턴'
description: 
date:   2025-03-25 15:01:35 +0300
image:  '/images/java_oop_logo.png'
logo_image:  '/images/java_oop_logo.png'
category: language
tag: java
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 자바와 객체지향 - Part 3: 디자인 패턴

객체지향 설계 원칙(SOLID)을 잘 따르면서 유연하고 확장 가능한 코드를 작성하려면 **디자인 패턴**에 대한 이해가 필수입니다.

디자인 패턴이란, 소프트웨어 설계 시 반복적으로 마주치는 문제들을 해결하기 위한 **재사용 가능한 설계 템플릿**입니다. 디자인 패턴을 적용하면 협업, 유지보수, 확장성이 좋아집니다.

---

## 디자인 패턴의 분류

디자인 패턴은 보통 아래 세 가지 범주로 나눕니다:

| 유형       | 설명                                      |
|------------|-------------------------------------------|
| 생성 패턴  | 객체 생성 과정을 추상화함                  |
| 구조 패턴  | 클래스나 객체를 조합하여 더 큰 구조를 만듦 |
| 행위 패턴  | 객체 간의 책임 분배와 통신에 초점           |

아래는 자바에서 자주 사용되는 대표적인 패턴들을 소개합니다.

---

## 생성 패턴 (Creational Patterns)

### 1. 싱글톤 패턴 (Singleton)
- 하나의 인스턴스만 생성되도록 보장
- 전역에서 접근 가능한 인스턴스를 제공

```java
public class Singleton {
    private static Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

> 사용 예: 설정 클래스, 로그 시스템 등

---

### 2. 팩토리 메서드 패턴 (Factory Method)
- 객체 생성을 서브클래스에 위임하여 유연성 증가

```java
abstract class Product {
    abstract void use();
}

class ConcreteProduct extends Product {
    void use() {
        System.out.println("제품 사용");
    }
}

class ProductFactory {
    public Product createProduct() {
        return new ConcreteProduct();
    }
}
```

> 사용 예: Spring의 Bean 생성

---

## 구조 패턴 (Structural Patterns)

### 1. 어댑터 패턴 (Adapter)
- 기존 클래스를 수정하지 않고 인터페이스를 변환

```java
interface Target {
    void request();
}

class Adaptee {
    void specificRequest() {
        System.out.println("특정 요청");
    }
}

class Adapter implements Target {
    private Adaptee adaptee = new Adaptee();

    public void request() {
        adaptee.specificRequest();
    }
}
```

> 사용 예: 다른 라이브러리 간 연결

---

### 2. 데코레이터 패턴 (Decorator)
- 기존 객체에 새로운 기능을 동적으로 추가

```java
interface Coffee {
    String getDescription();
}

class BasicCoffee implements Coffee {
    public String getDescription() {
        return "기본 커피";
    }
}

class MilkDecorator implements Coffee {
    private Coffee coffee;

    public MilkDecorator(Coffee coffee) {
        this.coffee = coffee;
    }

    public String getDescription() {
        return coffee.getDescription() + ", 우유";
    }
}
```

> 사용 예: Java I/O API (BufferedReader 등)

---

## 행위 패턴 (Behavioral Patterns)

### 1. 전략 패턴 (Strategy)
- 런타임에 알고리즘을 선택 가능하게 함

```java
interface PaymentStrategy {
    void pay(int amount);
}

class CreditCardPayment implements PaymentStrategy {
    public void pay(int amount) {
        System.out.println("신용카드로 " + amount + "원 결제");
    }
}

class ShoppingCart {
    private PaymentStrategy strategy;

    public ShoppingCart(PaymentStrategy strategy) {
        this.strategy = strategy;
    }

    public void checkout(int amount) {
        strategy.pay(amount);
    }
}
```

> 사용 예: 결제 수단 선택, 정렬 알고리즘 선택 등

---

### 2. 옵저버 패턴 (Observer)
- 한 객체의 상태 변화 시, 의존 객체들에 자동 알림

```java
interface Observer {
    void update(String message);
}

class Subscriber implements Observer {
    public void update(String message) {
        System.out.println("알림: " + message);
    }
}

class Publisher {
    private List<Observer> observers = new ArrayList<>();

    public void addObserver(Observer o) {
        observers.add(o);
    }

    public void notifyObservers(String message) {
        for (Observer o : observers) {
            o.update(message);
        }
    }
}
```

> 사용 예: GUI 이벤트 시스템, 알림 시스템

---

## 마무리

디자인 패턴은 **반복되는 문제에 대한 최적의 해결 방법**을 제공합니다. 모든 상황에 패턴을 억지로 적용할 필요는 없지만, 다양한 패턴을 익혀두면 **객체지향적 사고 능력과 설계 능력**이 확연히 향상됩니다.
