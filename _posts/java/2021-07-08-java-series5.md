---
layout: post
title:  'Java Series [Part5]: 자바 조금 더 알아보기'
description: FROM은 빌드를 위한 stage를 초기화하고 이후의 명령어를 위한 기본 이미지를 만듭니다.
date:   2021-07-08 15:01:35 +0300
image:  '/images/java_logo.png'
logo_image:  '/images/java_logo.png'
categories: programming_language
tags: Java
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---


## 1. 상속  

클래스간 공통된 속성과 기능이 많이 있을 경우 만약 이 공통된 부분을 클래스마다 다시 쓴다면 프로그래밍의 중요한 법칙 중 하나인 'DRY(Don't Repeat Yourself; 중복 배체)'를 어기게 되는 것입니다. 자바의 '클래스 상속(Class Inheritance)' 기능이 이 문제를 해결해줍니다.  

```java
public class 자식클래스 extends 부모클래스 {
    ...
}
```

접근 제어자가 private이 아니면 자식클래스에서도 변수와 메소드를 그대로 사용할 수 있습니다.  

자식 클래스가 부모 클래스가 가지고 있는 메소드를 덮어 쓰고 싶을 때는`(기존 부모 클래스의 메소드와는 독립적인 메소드로 만들고 싶을 때)` '메소드 오버라이딩(Method Overriding)'을 해줘야 합니다. 메소드 정의 위에 써져있는 @Override가 메소드 오버라이딩을 표시해줍니다. @Override와 같이 골뱅이(@)가 붙어있는 문법을 '어노테이션(Annotation)'이라고 합니다. 주석(Comment)과 어느정도 비슷하지만, 어노테이션은 자바에서 추가적인 기능을 제공합니다. 예를 들어서 @Override를 써줬는데 부모 클래스에 같은 이름의 메소드가 없는 경우, 오류가 나오게 됩니다.  

```java
public class MinimumBalanceAccount extends BankAccount {
    private int minimum;

    @Override
    public boolean withdraw(int amount) {
        if (getBalance() - amount < minimum) {
            System.out.println("적어도 " + minimum + "원은 남겨야 합니다.");
            return false;
        }

        setBalance(getBalance() - amount);
        return true;
    }
}
```  

이번에는 `부모 클래스가 가지고 있는 메소드에서 몇 가지를 추가해서 쓰고 싶은 경우에는 super를 사용`하면 됩니다.

```java
public class TransferLimitAccount extends BankAccount {
    private int transferLimit;

    @Override
    boolean withdraw(int amount) {
        if (amount > transferLimit) {
            return false;
        }

        return super.withdraw(amount);
    }
}  
```


## 2. 캐스팅과 제네릭

### 1) 캐스팅  

```java

ArrayList<BankAccount> accounts = new ArrayList<>();

accounts.add(ba);
accounts.add(mba);
accounts.add(sa);

for (BankAccount account : accounts) {
    account.deposit(1000);
}
```  
이렇게 하면 각 계좌가 BankAccount 타입으로 '캐스팅(Casting)'되고, 한꺼번에 묶어서 다룰 수 있습니다.  

sa에게는 이자를 붙여주고 싶은데, BankAccount 클래스에는 addInterest 메소드가 없습니다. 만약 여기서 SavingsAccount만 골라서 addInterest 메소드를 쓰고 싶으면 instanceof 키워드를 사용하면 됩니다.  

```java
for (BankAccount account : accounts) {
    account.deposit(1000);

    if (account instanceof SavingsAccount) {
        ((SavingsAccount) account).addInterest();
    }
}
```

### 2) 제네릭  

아래 꺽쇠 기호(<>) 사이에 있는 T를 '타입 파라미터'라고 부릅니다. 그리고 이와 같이 타입 파라미터를 받는 클래스를 '제네릭 클래스(Generic Class)'라고 합니다.  

```java
public class Box<T> {
    private T something;

    public void set(T object) { 
        this.something = object;
    }

    public T get() {
        return something;
    }
}
```

아래처럼 타입 파라미터로 String을 넘겨주면,  

```java
Box<String> box = new Box<>();
```  

클래스에 있던 모든 T가 String으로 대체된다고 생각하면 됩니다.  

```java
public class Box<String> {
    private String object;

    public void set(String object) {
        this.object = object;
    }

    public String get() {
        return object;
    }
}
```

지금까지는 타입 파라미터로 아무 클래스나 넘길 수 있었는데요. extends 키워드를 이용하면 타입을 제한할 수도 있습니다.  

```java
public class PhoneBox<T extends Phone> extends Box<T> {
    public void handsFreeCall(String numberString) {
        object.call(numberString);
    }
}
```


## 3. 인터페이스와 추상 클래스

### 1) 인터페이스

클래스가 생성될 때, 특정 빈 메소드를 강제로 가지도록 하고 싶을 때 인터페이스를 이용합니다  

```java
// 인터페이스
public interface Shape {
  // 빈 메소드
  double getArea();

  double getPerimeter();
}
// 특정 인터페이스를 따라야 하는 클래스
public class Circle implements Shape {
  ...
  ...
  public double getArea() {
    return PI * radius * radius;
  }

  public double getPerimeter() {
    return 2 * PI * radius;
  }
}
```  

### 2) 추상 클래스  

![](/images/java_3.png){: width="100%"}  

```java
// 추상클래스
public abstract class Shape {
  // 변수
  public double x, y;

  // 메소드
  public void move(doulbe x, double y) {
    ...
  }

  // 빈 메소드 (추상 메소드)
  public abstract double getArea();

  public abstract double getPerimeter();
}

```


# 참고
- [도커 공식문서](https://docs.docker.com/network/)
- [클라우드 엔지니어 Won의 성장 블로그, 06. 도커 네트워크 포스트](https://captcha.tistory.com/70)