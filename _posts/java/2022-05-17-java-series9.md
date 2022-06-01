---
layout: post
title:  'Java Series [Part9]: 자바의 객체지향 프로그래밍(2)'
description: 
date:   2022-05-17 15:01:35 +0300
image:  '/images/java_logo.png'
logo_image:  '/images/java_logo.png'
categories: programming_language
tags: Java
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Intro

## 상속
상속이란 **기존의 클래스를 재사용하여 새로운 클래스를 작성하는 것**입니다. 상속을 이용하면 코드의 재사용성을 높이고 코드의 중복을 제거할 수 있습니다. 자바에서 상속은 간단히 `extends`키워드를 사용해 표현할 수 있습니다.  

```java
class Child extends Parent {
  ...
}
```

상속을 해주는 클래스를 부모 클래스라고 하고, 상속을 받는 클래스를 자식 클래스라고 합니다.  

자식 클래스는 부모 클래스의 변수와 메서드를 상속 받으므로 부모 클래스의 변동은 자식 클래스에게도 영향을 미치지만, 자식 클래스의 변동은 부모 클래스에 아무런 영향을 주지 않습니다.  

또한 항상 자식 클래스가 부모 클래스보다 같거나 많은 멤버를 갖게 됩니다. 즉, 상속에 상속을 거듭할수록 상속받는 클래스의 멤버 개수는 점점 늘어나게 됩니다. 그래서 상속을 받는다는 것은 부모 클래스를 확장(extend)한다는 의미로 해석할 수도 있습니다.  

```java
class Person {
    String name;
    int age;
    char gender;
}

class Worker extends Person {
    int salary;
}

class Test {
    public static void main(String[] args) {
        Worker w = new Worker();
        w.age = 25;
        w.name = "Peter";
        w.gender = 'f';
        w.salary = 200;

        Person p = new Person();
        p.age = 20;
        p.name = "Mike";
        p.gender = 'f';
        p.salary = 100; // cannot find variable salary
    }
}
```

## 포함 관계
상속을 이용한 방법 말고도 클래스 간의 관계를 맺어주고 클래스를 재사용하는 방법이 있는데, 그것은 바로 포함(composite)관계를 이용하는 방법입니다.  

다음 코드는 사람을 나타내는 `Person`클래스와, 사람의 자산을 나타내는 `Property`클래스의 포함관계를 나타낸 것입니다.  

```java
class Person {
    String name;
    int age;
    char gender;
    Property pty = new Property();
}
```

이렇게 코드 재사용성을 높이기 위해 클래스 간 관계를 나타내는 방법에는 크게 상속과 포함관계가 있는데, 그러면 언제 상속을 사용하고 언제 포함관계를 사용할까요?  

```
- A(노동자)는 B(사람)이다 -> A는 B의 자식 클래스 -> 상속
- A(자산)은 B(사람)에 속한다 -> 포함 관계  
```

전체 코드는 아래와 같습니다.  

```java
class Person {
    String name;
    int age;
    char gender;
    Property pty = new Property();
}

class Property {
    int balance;
    boolean house;
    boolean car;
}

class Test {
    public static void main(String[] args) {

        Person p = new Person();
        p.age = 20;
        p.name = "Mike";
        p.gender = 'f';
        p.pty.balance = 5000;
        p.pty.car = false;
        p.pty.house = true;
    }
}
```

## 오버라이딩(overriding)

**부모 클래스로부터 상속받은 메서드의 내용을 변경하는 것을 오버라이딩**이라고 합니다. 상속받은 메서드를 그대로 사용하기도 하지만, 보통 자식 클래스에서 자신에 맞게 변경하는 경우가 많습니다.  

여기서 말하는 내용 변경은 구현부에 해당하는 얘기입니다. 그렇기 때문에 메서드의 선언부(메서드 이름, 매개변수, 반환타입)는 부모 클래스와 완전히 일치해야 합니다.  

다만 접근 제어자(access modifier)와 예외(exception)는 제한된 조건에서 다르게 변경할 수 있습니다.  

```
접근 제어자는 부모 클래스의 메서드와 같거나 더 넓은 범위로 변경 가능
부모 클래스의 메서드보다 많은 수의 예외를 선언할 수 없음
```

오버라이딩 예시는 다음과 같습니다. `Person`클래스의 `introduceMyself()` 메서드를 `Worker` 클래스에서 오버라이딩 하였습니다.  

```java
class Person {
    String name;
    int age;
    char gender;

    void introduceMyself() {
        System.out.println("Hi I'm " + name + " I'm just person");
    }
}

class Worker extends Person {
    String position;
    int salary;

    @Override
    void introduceMyself() {
        System.out.println("Hi I'm " + name + " I'm working as " + position + " My salary is " + salary);
    }
}

class Test {
    public static void main(String[] args) {

        Person p = new Person();
        p.age = 20;
        p.name = "Mike";
        p.gender = 'f';

        p.introduceMyself();

        Worker w = new Worker();
        w.age = 25;
        w.name = "Peter";
        w.gender = 'm';
        w.position = "Manager";
        w.salary = 100;
        w.introduceMyself();
    }
}
```

## super
`super`는 자식 클래스에서 부모 클래스 인스턴스를 지칭하는 방법입니다. 클래스 안에서 자기 자신의 인스턴스를 `this`로 나타낸 것과 유사합니다. 자식 클래스에서 `super`를 사용하면 자식 클래스의 변수, 메서드와 이름이 같은 부모 클래스의 변수, 메서드를 구별할 수 있습니다.  

위의 코드에서 자식클래스의 `introduceMyself()` 메서드를 다음과 같이 수정해보겠습니다.  

```java
class Worker extends Person {
    String position;
    int salary;

    @Override
    void introduceMyself() {
        super.introduceMyself(); // Hi I'm Peter I'm just person
        System.out.println("I'm working as " + position + " My salary is " + salary); // I'm working as Manager My salary is 100
    }
}
```

위와 같이 super를 이용해 부모클래스의 `introduceMyself()` 메서드를 호출할 수 있습니다.  

참고로 위의 `@Override`는 오버라이딩 애너테이션(annotation)으로 오버라이딩을 위해 반드시 표기해야 하는 것은 아닙니다. 하지만 제가 자바 컴파일러에게 `introduceMyself()` 메서드를 오버라이딩 한 것이라고 명시적으로 알려줌으로써 부모 클래스에 `introduceMyself()`가 있는지 확인하는 등 제대로 오버라이딩을 했는지 컴파일 단계에서 확인해줍니다.  

## super()
`super()`는 **부모클래스의 생성자**입니다. **생성자는 변수를 초기화하는 메서드**라고 했습니다.  

그렇기 때문에 `super()`는 부모클래스를 상속 받은 **자식클래스에서 부모클래스의 멤버 변수를 초기화 할 때 사용**합니다.  

아래는 `super()`를 사용하지 않고 부모클래스의 변수를 초기화한 경우입니다. Worker클래스에서 부모클래스의 변수인 name, age, gender를 초기화하는 코드를 `this.name = name`과 같은 방법으로 정의하였습니다.  

```java
class Person {
    String name;
    int age;
    char gender;

    Person(String name, int age, char gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }
}

class Worker extends Person {
    String position;
    int salary;

    Worker(String name, int age, char gender, String position, int salary) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.position = position;
        this.salary = salary;
    }
}

class Test {
    public static void main(String[] args) {
        Person p = new Person("Mike", 20, 'f');
        Worker w = new Worker("Peter", 20, 'm', "Manager", 100);
    }
}
```

이렇게 직접 `this.name = name`으로 정의하는 것도 틀린 코드는 아니지만, `super()`를 이용하면 코드의 중복을 제거하는 조금 더 객체지향적인 코드를 작성할 수 있기 때문에 `super()`를 이용해서 다시 작성하면 다음과 같습니다.  

```java
class Worker extends Person {
    String position;
    int salary;

    Worker(String name, int age, char gender, String position, int salary) {
        super(name, age, gender);
        this.position = position;
        this.salary = salary;
    }
}
```

# 제어자(modifier)
제어자는 클래스, 변수 또는 메서드의 선언부에 함께 사용되어 부가적인 의미를 부여합니다.  

**접근 제어자**  
  - public, protected, (default), private
  - 네 가지중 한 개만 사용 가능
  - 보통 선언부에서 가장 먼저 표기

**그 외**
  - static, final, abstract 등
  - 여러 개 조합하여 사용 가능

## static
- 사용될 수 있는 곳: 변수, 메서드
- 인스턴스 생성하지 않고 사용 가능

- 변수에 사용할 경우
  - 모든 인스턴스에 공통적으로 사용되는 클래스 변수가 된다
  - 인스턴스 생성하지 않고 사용 가능한 변수가 된다
  - 클래스가 메모리에 로드될 때 생성된다
  
  ```java
  class Person {
      static int personNumber;
      String name;
      int age;
      char gender;
  }

  class Test {
      public static void main(String[] args) {
          System.out.println(Person.personNumber); // 인스턴스 없이 personNumber 사용
      }
  }
  ```

- 메서드에 사용할 경우
  - 인스턴스 생성하지 않고 호출 가능한 클래스 메서드가 된다
  - 클래스 메서드에서는 인스턴스 멤버를 직접 사용할 수 없다
  - 클래스 메서드는 오버라이딩 할 수 없다 (자바관련 면접 질문)
  - Overriding depends on having an instance of a class. The point of polymorphism is that you can subclass a class and the objects implementing those subclasses will have different behaviors for the same methods defined in the superclass (and overridden in the subclasses). A static method is not associated with any instance of a class so the concept is not applicable.
  
  ```java
  class Person {
      static int personNumber;
      String name;
      int age;
      char gender;

      static void countPersonNumber() {
          System.out.println(personNumber); // 변수는 클래스 변수 personNumber만 사용 가능
      }
  }

  class Test {
      public static void main(String[] args) {
          Person.countPersonNumber(); // 인스턴스 없이 countPersonNumber() 메서드 호출
      }
  }
  ```

## final
- 사용할 수 있는 곳: 클래스, 메서드, 변수
- 클래스에 사용할 경우
  - 자신을 확장하는 자식클래스 정의 못하게 함 (자식 안낳는다)
  
  ```java
  final class Person {
      
  }

  class Worker extends Person { // Cannot inherit from final 'Person'
      
  }
  ```

- 메서드에 사용할 경우
  - 자식클래스가 오버라이딩 할 수 없게 함
    ```java
    class Person {
        final void countPersonNumber() {
            System.out.println("사람 숫자 세는 중");
        }
    }

    class Worker extends Person {
        @Override
        void countPersonNumber() { // Cannot Override; Overriden method is 'final'
            System.out.println("일꾼 숫자 세는 중");
        }

    }
    ```
- 변수에 사용할 경우
  - 변경할 수 없는 상수가 됨 


## abstract
추상 클래스 또는 추상 메서드를 정의할 때 사용합니다.  

- 사용할 수 있는 곳: 클래스, 메서드
- 클래스에 사용할 경우
  - 클래스 내에 추상 메서드가 선언되어 있음을 의미
  - 추상 클래스는 아직 완성되지 않은 메서드가 있음을 의미하므로 인스턴스 생성 불가
  ```java
    abstract class Person {
        abstract void countPersonNumber();
    }

    class Test {
        public static void main(String[] args) {
            Person p = new Person(); // 'Person' is abstract, cannot be instantiated
        }
    }
  ```
  
- 메서드에 사용할 경우
  - 아직 구현부가 작성되지 않은 추상 메서드임을 알림
  - 자식 클래스에서 추상 메서드를 오버라이딩 하도록 강제
    ```java
    abstract class Person {
        abstract void countPersonNumber();
    }

    class Worker extends Person { // Worker does not override abstract method countPersonNumber() in Person
        void work() {
            System.out.println("I'm working");
        }
    }

    class Test {
        public static void main(String[] args) {
            Worker w = new Worker();
            w.work();
        }
    }
    ```
## public, protected, private

접근 제어자가 사용될 수 있는 곳: 클래스, 변수, 메서드, 생성자

```
public: 접근 제한이 전혀 없음
protected: 같은 패키지 내에서는 접근 제한 없음, 다른 패키지인 경우 자식 클래스 한정
(default): 같은 패키지 내에서는 접근 제한 없음
private: 같은 클래스 내에서만 접근 가능
```

이러한 접근 제어자를 사용하는 경우는 보통 다른 클래스나 패키지에서의 **접근을 제한하기 위한 용도**로 사용합니다. 이렇게 접근을 제한하는 것을 객체지향에서 **캡슐화**라고 합니다. 

이런 경우 보통 변수는 `private`이나 `protected`로 접근 범위를 제한하고, 읽기 메서드(getter), 쓰기 메서드(setter)는 `public`으로 제공함으로써 변수를 다룰 수 있도록 합니다.  

# 다형성

# 추상 클래스

# 인터페이스

# 내부 클래스
