---
layout: post
title:  'Java OOP Series [Part1]: 클래스와 인스턴스'
description: 
date:   2025-03-15 15:01:35 +0300
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


# 자바와 객체지향 - Part 1

자바(Java)는 대표적인 객체지향 프로그래밍(Object-Oriented Programming, OOP) 언어입니다. 객체지향을 이해하면 자바의 핵심 개념들을 더 쉽게 받아들일 수 있고, 실제 개발에서도 더 유연하고 확장성 있는 코드를 작성할 수 있습니다.

이번 글에서는 객체지향의 기본 개념부터 자바에서의 클래스, 인스턴스, 참조형 변수, 생성자까지 차근차근 살펴보겠습니다.

---

## 객체지향 프로그래밍이란?

객체지향 프로그래밍(OOP, Object-Oriented Programming)이란 프로그램을 **객체(Object)** 들의 상호작용으로 구성하는 프로그래밍 방식입니다. 객체는 현실 세계의 사물, 개념 등을 프로그래밍적으로 모델링한 것으로, **속성(데이터)** 과 **행동(메서드)** 을 함께 가집니다.

예를 들어, 현실의 "자동차"는 속성으로는 색상, 속도 등이 있고, 행동으로는 달리기, 멈추기 등이 있습니다. 이를 자바로 표현하면 다음과 같습니다:

```java
class Car {
    String color;
    int speed;

    void drive() {
        System.out.println("자동차가 달립니다.");
    }

    void stop() {
        System.out.println("자동차가 멈춥니다.");
    }
}
```

이처럼 현실 세계의 사물을 추상화하여 객체로 표현하고, 그 객체들을 조합하여 프로그램을 구성하는 것이 객체지향 프로그래밍입니다.

객체지향의 장점은 다음과 같습니다:

- **코드의 재사용성**: 클래스를 재사용하여 여러 객체를 만들 수 있음
- **유지보수 용이성**: 기능 단위로 나눠져 있어 수정이 쉬움
- **확장성**: 기존 코드를 건드리지 않고 새로운 기능을 추가하기 쉬움

---

## 클래스와 인스턴스

### 클래스(Class)
클래스는 객체를 만들기 위한 **설계도**입니다. 객체가 가져야 할 속성과 기능(메서드)을 정의합니다.

```java
class Person {
    String name;
    int age;

    void sayHello() {
        System.out.println("안녕하세요. 저는 " + name + "입니다.");
    }
}
```

### 인스턴스(Instance)
인스턴스는 클래스를 기반으로 만들어진 **실제 객체**입니다. `new` 키워드를 사용하여 생성합니다.

```java
Person p1 = new Person();
p1.name = "철수";
p1.age = 20;
p1.sayHello();  // 출력: 안녕하세요. 저는 철수입니다.
```

클래스는 설계도일 뿐 메모리에 존재하지 않지만, 인스턴스를 생성하면 실제로 메모리에 객체가 만들어집니다. 하나의 클래스로 여러 개의 인스턴스를 만들 수 있습니다.

```java
Person p2 = new Person();
p2.name = "영희";
p2.age = 22;
```

---

## 인스턴스는 참조형 변수

자바에서 클래스 타입으로 선언된 변수는 **참조형(reference type)** 입니다. 이는 변수에 실제 객체 자체가 저장되는 것이 아니라, **객체가 저장된 메모리 주소(참조값)** 가 저장된다는 뜻입니다.

```java
Person p1 = new Person();
Person p2 = p1;
```

위 코드에서 `p1`과 `p2`는 같은 객체를 참조합니다. 즉, `p2`를 통해 값을 바꾸면 `p1`에서도 변경 사항이 보입니다:

```java
p2.name = "민수";
System.out.println(p1.name);  // 출력: 민수
```

### 자바의 대원칙: 자바는 항상 변수의 값을 복사해서 대입한다

자바에서 변수를 참조하면, 항상 그 변수 안에 있는 값을 복사해서 사용한다

```java
Person p1 = new Person();

// p1의 값을 복사해서 사용한다
// p1에는 객체가 저장된 메모리 주소값이 저장돼 있다
// 따라서 p2에는 p1에 저장된 메모리 주소값이 대입된다
// 이제 p1도 객체를 가리키고, p2도 같은 객체를 가리킨다
Person p2 = p1; 
```

---

## 생성자(Constructor)

생성자는 객체가 생성될 때 자동으로 호출되는 **특별한 메서드**입니다. 주로 객체의 초기화에 사용됩니다.
생성자를 호출하는 방법은 `new` 뒤에 생성자 이름과, 매개변수에 맞춰 인수를 전달하면 됩니다.

자바에서 생성자는 다음과 같은 특징을 가집니다:

- 클래스 이름과 동일한 이름을 가짐
- 반환 타입이 없음

```java
class Person {
    String name;
    int age;

    // 생성자
    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    void introduce() {
        System.out.println("이름: " + name + ", 나이: " + age);
    }
}
```

사용 예:

```java
Person p = new Person("지수", 25);
p.introduce();  // 출력: 이름: 지수, 나이: 25
```

생성자를 직접 정의하지 않으면 자바는 매개변수가 없는 **기본 생성자(default constructor)** 를 자동으로 제공합니다. 하지만 생성자를 하나라도 만들면 기본 생성자는 자동으로 제공되지 않으니 필요하면 명시적으로 정의해야 합니다.

```java
// 기본 생성자도 필요할 경우 명시적으로 정의
Person() {
    this.name = "이름없음";
    this.age = 0;
}
```


---

다음 글에서는 객체지향의 4대 특성인 **캡슐화, 상속, 다형성, 추상화** 를 중심으로 자바 객체지향의 핵심을 이어서 정리해보겠습니다.

