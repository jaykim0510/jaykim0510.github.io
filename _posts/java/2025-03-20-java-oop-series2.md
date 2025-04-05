---
layout: post
title:  'Java OOP Series [Part2]: 객체지향'
description: 
date:   2025-03-20 15:01:35 +0300
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


# 자바와 객체지향 - Part 2

이전 글에서는 객체지향 프로그래밍의 기본 개념과 클래스, 인스턴스, 생성자에 대해 알아봤습니다. 이번 글에서는 객체지향의 핵심 개념들을 좀 더 깊이 있게 다뤄보겠습니다. 특히 자바에서 객체지향 설계를 할 때 중요한 키워드들과 특징들을 예제와 함께 설명합니다.

---

## 객체지향 설계

객체지향 설계는 현실 세계의 사물이나 개념을 객체로 추상화하고, 이 객체들 간의 관계를 정의하여 시스템을 설계하는 방식입니다.

좋은 객체지향 설계는 다음과 같은 특징을 가집니다:

- **응집도(Cohesion)가 높고, 결합도(Coupling)가 낮아야 함**
- **변경에 유연하고 확장 가능한 구조**
- **각 객체는 자신의 역할에 집중해야 함 (단일 책임 원칙)**

예를 들어, 자동차(Car) 객체는 달리는 기능만 책임져야 하고, 운전자의 정보까지 책임지게 하면 설계가 나빠집니다.

### SOLID 원칙

SOLID는 객체지향 설계의 다섯 가지 원칙을 의미하는 약어입니다. 이 원칙들을 따르면 유지보수성과 확장성이 뛰어난 소프트웨어를 만들 수 있습니다.

1. **단일 책임 원칙 (SRP: Single Responsibility Principle)**
   - 클래스는 단 하나의 책임만 가져야 한다.
   - 변경의 이유는 하나뿐이어야 한다.

2. **개방-폐쇄 원칙 (OCP: Open/Closed Principle)**
   - 소프트웨어 요소는 확장에는 열려 있어야 하고, 변경에는 닫혀 있어야 한다.
   - 즉, 기존 코드를 변경하지 않고 기능을 추가할 수 있어야 한다.

3. **리스코프 치환 원칙 (LSP: Liskov Substitution Principle)**
   - 자식 클래스는 언제나 자신의 부모 클래스를 대체할 수 있어야 한다.
   - 예: Animal을 기대하는 곳에 Dog, Cat 등의 하위 클래스를 넣어도 정상 작동해야 한다.

4. **인터페이스 분리 원칙 (ISP: Interface Segregation Principle)**
   - 하나의 일반적인 인터페이스보다 구체적인 여러 개의 인터페이스를 사용하는 것이 낫다.
   - 클라이언트는 자신이 사용하지 않는 메서드에 의존하지 않아야 한다.

5. **의존 역전 원칙 (DIP: Dependency Inversion Principle)**
   - 고수준 모듈은 저수준 모듈에 의존해서는 안 된다. 둘 다 추상화에 의존해야 한다.
   - 구체화가 아닌 추상화에 의존함으로써 유연한 구조를 가질 수 있다.

이러한 원칙은 객체 간 결합도를 낮추고, 역할을 명확하게 분리함으로써 유지보수가 쉬운 시스템을 만들 수 있게 해줍니다.

---

## 접근 제어자 (Access Modifier)

접근 제어자는 클래스, 필드, 메서드의 접근 가능 범위를 지정하는 키워드입니다. **정보 은닉(캡슐화)의 핵심 도구**로, 외부에서 객체의 내부를 마음대로 건드리지 못하게 막는 역할을 합니다.  

접근 제어자는 속성, 메서드, 생성자, 클래스에 사용된다. (클래스에는 `public`, `default`만 가능)  


| 접근 제어자 | 같은 클래스 | 같은 패키지 | 자식 클래스 | 전체 접근 |
|--------------|--------------|----------------|----------------|-------------|
| `private`    | O            | X              | X              | X           |
| `default`(생략)| O          | O              | X              | X           |
| `protected`  | O            | O              | O              | X           |
| `public`     | O            | O              | O              | O           |


### 예시:

```java
class Person {
    private String name;   // 외부 접근 불가
    protected int age;     // 같은 패키지나 자식 클래스에서 접근 가능
    public void sayHello() {
        System.out.println("안녕하세요!");
    }
}
```

`private`는 외부 클래스에서 직접 접근할 수 없으며, 보통 `getter`, `setter` 메서드를 통해 간접적으로 접근합니다.

```java
public String getName() {
    return name;
}
```



---

## static과 final 키워드

### static
`static` 키워드는 클래스 레벨에서 공유되는 변수나 메서드를 정의할 때 사용합니다.

```java
class MathUtil {
    static double PI = 3.14159;

    static int square(int x) {
        return x * x;
    }
}

// 사용 예:
System.out.println(MathUtil.PI);
System.out.println(MathUtil.square(5));
```

- 인스턴스를 생성하지 않고도 클래스 이름으로 바로 접근 가능
- 공통 기능, 공통 상태를 공유할 때 유용함

### final

`final`은 변수, 메서드, 클래스에 붙을 수 있으며 다음과 같은 의미를 가집니다:

- **변수**: 값 변경 불가 (상수) -> `static` 과 함께 주로 사용
- **메서드**: 오버라이딩 금지
- **클래스**: 상속 금지

```java
final class Constants {
    public static final int MAX_USERS = 100;
}
```

`MAX_USERS`는 한 번 초기화되면 다시 값을 바꿀 수 없습니다.

---

## 상속 (Inheritance)

상속은 기존 클래스(부모 클래스)의 속성과 메서드를 새로운 클래스(자식 클래스)가 물려받는 개념입니다. 자바에서는 `extends` 키워드를 사용합니다.  

접근 제어자가 `private`이 아니면 자식 클래스에서도 속성과 메서드를 그대로 사용할 수 있습니다.

```java
class Animal {
    void eat() {
        System.out.println("먹는다");
    }
}

class Dog extends Animal {
    void bark() {
        System.out.println("짖는다");
    }
}

Dog dog = new Dog();
dog.eat();   // 부모 클래스의 메서드 사용
```

- 코드의 재사용성을 높이고, 공통 로직을 상위 클래스에 정의할 수 있음
- 자식 클래스는 부모 클래스의 모든 `public`/`protected` 멤버를 상속받음

### 메서드 오버라이딩

자식 클래스에서 부모 클래스의 메서드를 재정의할 수 있습니다.

```java
class Dog extends Animal {
    @Override
    void eat() {
        System.out.println("개가 먹는다");
    }
}
```


### 상속의 메모리 구조

자식 클래스의 객체를 생성하면, 메모리 내부에는 부모와 자식 객체가 모두 생성된다. 변수의 타입을 어떤 것으로 하느냐에 따라, 먼저 접근하는 객체가 결정된다.


```java
class Animal {
    void move() {}

    void bark() {}
}

class Dog extends Animal {

    void doggy() {}

    @Override
    void bark() {}
}
```

```java

Animal a = new Dog()

Dog d = new Dog()

```

`Dog` 라는 객체뿐만 아니라, `Animal` 부모 객체도 생성된다. 이 때 `a`는 부모 객체를 가리키고, `d`는 자식 객체를 가리킨다.

|변수|타입|move 호출|bark 호출|doggy 호출|
|:---:|:---:|:---:|:---:|:---:|
|a|Animal|Animal 클래스의 move가 호출됨|**Dog 클래스의 bark가 호출됨**|호출 불가|
|d|Dog|Animal 클래스의 move가 호출됨|Dog 클래스의 bark가 호출됨|Dog 클래스의 doggt가 호출됨|

`Animal` 타입인 `a`의 `bark`를 호출할 때, `Dog` 클래스의 `bark` 메서드가 호출되는 이유는, **오버라이딩된 메서드가 항상 우선권을 가지기 때문**이다.


### super

자식 객체를 생성하면, 부모 객체가 먼저 생성되고 자식 객체가 생성된다. 그래서 원래는 자식 객체의 생성자에서 `super()`를 사용해서 부모 객체를 생성해야 한다. 하지만 호출하려는 부모의 생성자가 기본 생성자라면, 생략해도 자바가 자동으로 생성해준다.


---

## 다형성 (Polymorphism)

다형성은 하나의 객체가 여러 타입으로 동작할 수 있게 하는 성질입니다. 대표적으로 **업캐스팅(Upcasting)** 과 **메서드 오버라이딩** 을 통해 구현됩니다.

```java
Animal animal = new Dog();  // 업캐스팅
animal.eat();               // 실제 실행은 Dog의 eat()
```

- 부모 타입으로 자식 객체를 참조할 수 있음
- 오버라이딩된 메서드가 호출되어 동적 바인딩(Dynamic Binding) 발생

### instanceof와 캐스팅
필요한 경우, 실제 타입을 확인하고 캐스팅할 수 있습니다. (`instanceof`는 변수의 타입이 아니고, 인스턴스의 타입을 확인한다)

```java
if (animal instanceof Dog) {
    Dog dog = (Dog) animal;
    dog.bark();
}
```

---

## 추상 클래스 (Abstract Class)

추상 클래스는 공통 기능은 구현하고, 특정 기능은 자식 클래스에서 구현하도록 강제할 수 있는 클래스입니다. `abstract` 키워드를 사용하며, 인스턴스를 직접 생성할 수 없습니다.

```java
abstract class Animal {
    abstract void makeSound();  // 추상 메서드
    void sleep() {
        System.out.println("잠을 잔다");
    }
}

class Cat extends Animal {
    @Override
    void makeSound() {
        System.out.println("야옹");
    }
}
```

- 하나 이상의 추상 메서드를 가질 수 있음
- 자식 클래스는 반드시 추상 메서드를 오버라이딩해야 함

---

## 인터페이스 (Interface)

인터페이스는 모든 메서드가 추상 메서드이며, 다중 구현을 지원합니다. `implements` 키워드를 통해 클래스를 구현할 수 있습니다.

```java
interface Flyable {
    void fly();
}

class Bird implements Flyable {
    public void fly() {
        System.out.println("날아간다");
    }
}
```

- 다중 상속이 불가능한 자바에서, 인터페이스는 여러 타입의 계약을 구현할 수 있게 해줍니다.
- Java 8부터는 `default` 메서드도 정의할 수 있음

```java
interface Logger {
    default void log(String message) {
        System.out.println("로그: " + message);
    }
}
```

---

다형성은 단지 하나의 객체가 여러 타입으로 동작하는 것뿐 아니라, **추상 클래스와 인터페이스를 통해 공통 기능을 설계하고 확장하는 방식**까지 포함합니다. 이는 유연하고 유지보수하기 쉬운 프로그램을 만드는 데 핵심적인 개념입니다.

다음 글에서는 실제 애플리케이션 개발에 객체지향 설계를 어떻게 적용하는지, 디자인 패턴과 함께 살펴보겠습니다.

