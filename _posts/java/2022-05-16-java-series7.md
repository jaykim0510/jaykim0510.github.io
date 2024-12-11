---
layout: post
title:  'Java Series [Part7]: 자바의 제네릭'
description: 
date:   2022-05-16 15:01:35 +0300
image:  '/images/java_logo.png'
logo_image:  '/images/java_logo.png'
category: language
tag: java
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 제네릭(Generic)
제네릭은 메서드나 클래스 안에서 사용되는 객체의 타입을 지정하고 컴파일 시에 체크하도록 하는 기능을 합니다.  

이렇게 하면 `String` 타입을 받는 메서드, `Integer` 타입을 받는 메서드를 각각 따로 정의할 필요가 없고, 제네릭 메서드 하나로 정의할 수 있습니다.  

또 타입을 지정함으로써 컴파일 시점에 타입 체크 기능도 해줄 수 있습니다. (오류 중에 가장 좋은 오류는 컴파일 오류)

```
제네릭의 장점

- 타입을 메서드나 클래스의 외부에서 동적으로 지정할 수 있다
- 지정한 타입만 사용한다는 보장이 있기 때문에 별다른 형변환이 필요 없어진다
```

제네릭 사용 예시를 보도록 하겠습니다.  

```java
import java.util.ArrayList;


class Test {
    public static void main(String[] args) {

        ArrayList<String> list1 = new ArrayList<String>();
        // 또는 ArrayList<String> list1 = new ArrayList<>();
        
        list1.add("1");
        list1.add(1); // 컴파일 오류
    }
}
```

```java
import java.util.HashMap;

class Test {
    public static void main(String[] args) {

        HashMap<Integer, String> map1 = new HashMap<>();

        map1.put(1, "apple");
        map1.put("1", "value2"); // 컴파일 오류
    }
}
```

```java
class Car {
    String brand;
    int year;

    void start() {
        System.out.println("차가 출발합니다");
    }

    void stop() {
        System.out.println("차가 멈춥니다");
    }
}

class Driver<C> {
    C car = new C(); // type parameter 'C' cannot be instantiated directly

    void driveStart() {
        car.start();
    }

    void driveStop() {
        car.stop();
    }
}


class Test {
    public static void main(String[] args) {
        Driver<Car> d = new Driver<>();

        d.driveStart();
        d.driveStop();
    }
}
```

# 제네릭 클래스


# 제네릭 메서드