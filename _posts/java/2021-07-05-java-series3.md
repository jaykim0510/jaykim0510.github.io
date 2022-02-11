---
layout: post
title:  'Java Series [Part3]: 자바와 객체지향 프로그래밍'
description: FROM은 빌드를 위한 stage를 초기화하고 이후의 명령어를 위한 기본 이미지를 만듭니다.
date:   2021-07-05 15:01:35 +0300
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


## 1. 객체 만들기  
자바는 객체 단위로 동작하는 객체 지향 프로그래밍이기 때문에, Hello world 한 줄을 출력하더라도 클래스로 작성해야 합니다.  
`클래스`는 `변수와 메소드를 갖는 객체(인스턴스)를 만드는 설계도`라고 생각하시면 됩니다.

```java
public class BankAccount {

    // 변수
    private int balance;
    private Person owner;
    
    // 메소드
    public void setBalance(int newBalance){
        this.balance = newBalance;
    }
    public int getBalance(){
        return balance;
    }
    public void setOwner(Person newOwner){
        this.owner = newOwner;
    }
    public Person getOwner(){
        return this.owner;
    }
    
    boolean deposit(int amount){
        if (amount < 0 || owner.getCashAmount() < amount){
            System.out.println("입금 실패입니다. 잔고: "+balance+"원, 현금: "+owner.getCashAmount()+"원");
            return false;
        }
        else{
            balance += amount;
            owner.setCashAmount(owner.getCashAmount()-amount);
            System.out.println(amount + "원 입금하였습니다. 잔고: " + balance + "원, 현금: " + owner.getCashAmount() + "원");
            return true;
            
        }
    }
    boolean withdraw(int amount){
        if ( amount < 0 || getBalance() < amount) {
            System.out.println("출금 실패입니다. 잔고: "+balance+"원, 현금: "+owner.getCashAmount()+"원");
            return false;
        }
        else{
            balance -= amount;
            owner.setCashAmount(owner.getCashAmount()+amount);
            System.out.println(amount + "원 출금하였습니다. 잔고: "+ balance + "원, 현금: " + owner.getCashAmount() + "원");
            return true;
        }
    }
    
}
```

## 2. 객체 설계하기  

### 1) 접근 제어자(Access Modifier)  

#### a) private

```java
public class Person {
    private int age;

    public void setAge(int newAge) {
        if (newAge > 0) {
            this.age = newAge;
        }
    }

    public int getAge() {
        return this.age;
    }
}
```  

age 변수를 public으로 하면 외부에서 Person 객체를 생성했을 때 age 변수에 직접 접근이 가능하다 (p1.age = -10 이런 식으로) 따라서 외부에서 무분별하게 접근하는 것을 막고자 
접근 제어자를 public이 아닌 private으로 작성합니다.  

#### b) protected

접근 제어자에는 public, private 그리고 protected가 있습니다. protected를 사용하면 자식 클래스에 한해서 변수에 직접적으로 접근이 가능합니다. 그렇게 함으로써 private을 사용했을 때 setter, getter 메소드를 작성해야하는 불편함을 해소해줍니다.

```java  

public class Person {

    protected int age;

}

public class Student extends Person {
  public void olderAge() {
    age = age + 1
  }
}
```

#### c) public final

자식 클래스 뿐 아니라 다른 곳에서도 사용되지만 수정은 안되도록 하는 ( 좀 더 일반적인) 방법은 public final입니다.

```java
public final double pi = 3.14
```

### 2) 메소드 오버로딩(Method Overloading)  

'메소드 오버로딩(Method Overloading)'은 클래스 내에 같은 이름의 메소드를 2개 이상 정의할 수 있게 해주는 기능입니다.  

```java
public class Calculator {
    int add(int a, int b) {
        return a + b;
    }

    int add(int a, int b, int c) {
        return a + b + c;
    }

    double add(double a, double b) {
        return a + b;
    }
}
```  

지금까지 써왔던 System.out.println()도 메소드오버로딩되어 있는 메소드입니다.

### 3) 생성자

'생성자(Constructor)'는 크게 두 가지 역할이 있습니다

1. 인스턴스를 만들고,
2. 인스턴스의 속성(인스턴스 변수)들을 초기화시켜줍니다.

생성자를 한 개도 정의 안 했을 경우에는 자바에서 자동으로 `기본 생성자`를 제공해줍니다. 

```java
Person p1 = new Person();
```  

생성자를 하나라도 정의하면 위의 기본 생성자는 사용할 수 없습니다.  

```java
public class Person {
    String name;
    int age;

    public Person(String pName, int pAge) {
        this.name = pName;
        this.age = pAge;
    }

    public static void main(String[] args) {
    Person p1 = new Person("Jay", 27);
    }
}  
```   

생성자 오버로딩도 가능합니다.  

```java
// 생성자 오버로딩

public class Person {
    String name;
    int age;

    public Person(String pName, int pAge) {
        this.name = pName;
        this.age = pAge;
    }

    public Person(String pName) {
    this.name = pName;
    this.age = 12;    // 12살을 기본 나이로 설정
    }
}
```
