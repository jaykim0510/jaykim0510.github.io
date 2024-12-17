---
layout: post
title:  'Java Series [Part2]: 자바 기초'
description: 
date:   2021-07-04 15:01:35 +0300
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


# Hello World  

```java
public class HelloWorld {
    /*main: 프로그램을 실행하면 가장 먼저 실행되는 메소드
    void: 리턴값 없음
    String[] args: args라는 이름의 문자열 변수가 메소드에 전달*/
    public static void main(String[] args) {

        // System: 클래스, out: 클래스 변수, println: 메소드
        System.out.println("Hello World");
    }
}
```

# 변수

- 변수는 실제 값을 저장하는 기본형 변수와, 어떤 값이 저장되어 있는 주소를 값으로 갖는 참조형 변수가 있다
- 변수를 사용하면 값을 저장해 둘 수 있다

## 변수의 선언

- 변수를 만들기 위해서는 선언과 초기화가 필요하다
- 초기화가 필요한 이유는, 선언만 한 변수가 가리키는 메모리에 엉뚱한 값이 저장되어 있음에도, 이 값을 마치 내가 저장한 값으로 읽어올 수 있기 때문에 이런 문제를 미리 방지하고자 초기화하지 않은 변수를 읽어오면 컴파일 에러가 발생한다

```java
public class Variables {
    public static void main(String[] args) {

        // 선언 방법
        // 1) 선언과 초기화를 따로
        int age;
        age = 27;

        // 2) 선언과 동시에 초기화
        double num = 12.5;

        // 초기화하지 않은 변수를 참조하려고 하는 경우
        boolean isTrue;
        System.out.println(isTrue) // 에러) Variable 'a' might not have been initialized
    }
}
```

## 변수의 타입

- 변수는 크게 기본형(primitive)과 참조형(reference)이 있다

### 기본형

```java
public class Primitive {
    public static void main(String[] args) {
        // 정수형
        int myInt = 123; // 정수형의 기본 타입; 4byte
        long myLong = 2200000000L; // 8byte; 대략 21억이 넘어간다면 long 타입을 사용

        // 실수형
        float myFloat = 3.14f; // 4byte
        double myDouble = 3.14; // 실수형의 기본 타입;  8byte

        // 문자형
        char a = 'a'; // 쌍따옴표로 감싸면 String으로 인식함
        char aPrime = 97; // 아스키 값 97 == 'a'
        char b = '가'; // 2byte

        // 논리형
        boolean myBoolean = true; // 1byte
    }
}
```

### 참조형

- 기본형에 속하지 않는 타입은 모두 참조형(reference) 타입이다
- 대표적으로 문자열(`String`), 배열(`[]`)이 있다

#### 배열

```java
public class Array {
    public static void main(String[] args) {


        // 배열 생성하는 첫 번째 방법
        int[] intArray = new int[5];

        intArray[0] = 2;
        intArray[1] = 3;
        intArray[2] = 5;
        intArray[3] = 7;
        intArray[4] = 11;

        // 배열 생성하는 두 번째 방법
        int[] arr1 = {1, 2, 3, 4, 5};
        int[] arr2 = arr1;
        int[] arr3 = arr1.clone();

        arr1[0] = 100;
        System.out.println(arr2[0]);
        System.out.println(arr3[0]);

        // 배열을 순회하는 방법
        for (double i : intArray) {
            System.out.println(i);
        }

        // 2차원 배열
        int[][] multiArray = new int[3][4];

        int[][] multiArray2 = { {1 ,2, 3, 4},
                            {5, 6, 7, 8},
                            {9, 10, 11, 12}
                            };
        System.out.println(multiArray2[0][1]);

    }
}
```

# 연산자

## 산술 연산자

- 기본적인 수학 연산을 수행

```java
public class ArithmeticExample {
    public static void main(String[] args) {
        int a = 10, b = 3;

        System.out.println("a + b = " + (a + b)); // 덧셈
        System.out.println("a - b = " + (a - b)); // 뺄셈
        System.out.println("a * b = " + (a * b)); // 곱셈
        System.out.println("a / b = " + (a / b)); // 나눗셈 (정수 나눗셈)
        System.out.println("a % b = " + (a % b)); // 나머지
    }
}
```

## 증감 연산자

- 변수의 값을 1씩 증가 또는 감소시킨다
- 전위: 먼저 1 증가/감소 시킨 후 해당 줄을 실행한다
- 후위: 해당 줄을 먼저 실행 후, 1 증가/감소 시킨다

```java
public class IncrementDecrementExample {
    public static void main(String[] args) {
        int x = 5;

        System.out.println("++x = " + ++x); // 전위 증가 => 6
        System.out.println("x++ = " + x++); // 후위 증가 => 6
        System.out.println("x = " + x); // => 7

        System.out.println("--x = " + --x); // 전위 감소 => 6
        System.out.println("x-- = " + x--); // 후위 감소 => 6
        System.out.println("x = " + x); // => 5
    }
}

```

## 비교 연산자

- 두 값을 비교하여 참(true) 또는 거짓(false)을 반환한다

```java
public class ComparisonExample {
    public static void main(String[] args) {
        int a = 10, b = 20;

        System.out.println("a == b: " + (a == b)); // false
        System.out.println("a != b: " + (a != b)); // true
        System.out.println("a > b: " + (a > b)); // false
        System.out.println("a < b: " + (a < b)); // true
        System.out.println("a >= b: " + (a >= b)); // false
        System.out.println("a <= b: " + (a <= b)); // true
    }
}
```

## 논리 연산자

```java
public class LogicalExample {
    public static void main(String[] args) {
        boolean condition1 = true;
        boolean condition2 = false;

        System.out.println("condition1 && condition2: " + (condition1 && condition2)); // false
        System.out.println("condition1 || condition2: " + (condition1 || condition2)); // true
        System.out.println("!condition1: " + (!condition1)); // false
    }
}


```

## 대입 연산자

- 변수에 값을 할당하거나 연산 후 할당

```java
public class AssignmentExample {
    public static void main(String[] args) {
        int a = 10;

        a += 5; // a = a + 5
        System.out.println("a += 5: " + a); // 15

        a -= 3; // a = a - 3
        System.out.println("a -= 3: " + a); // 12

        a *= 2; // a = a * 2
        System.out.println("a *= 2: " + a); // 24

        a /= 4; // a = a / 4
        System.out.println("a /= 4: " + a); // 6

        a %= 3; // a = a % 3
        System.out.println("a %= 3: " + a); // 0
    }
}

```

## 삼항 연산자

- 조건에 따라 두 가지 값 중 하나를 반환한다

```java
public class TernaryExample {
    public static void main(String[] args) {
        int num = -5;
        String result = (num > 0) ? "양수" : "음수";
        System.out.println("num은 " + result); // num은 음수
    }
}

```


# 조건문

## if-else문

```java
public class IfElse {
    public static void main(String[] args) {
        int temp = 15;

        if (temp < 0) {
            System.out.println("오늘의 날씨는 영하입니다: " + temp +"도");
        } else if (temp < 5){
            System.out.println("오늘의 날씨는 0도 이상 5도 미만입니다: " + temp +"도");
        } else {
            System.out.println("오늘의 날씨는 5도 이상입니다: " + temp +"도");
        }
    }
}

```

## switch문

```java
public class Switch {
    public static void main(String[] args) {
        int score = 80;

        String grade;

        switch (score / 10) {
            case 10:
                grade = "A+";
                break;
            case 9:
                grade = "A";
                break;
            default:
                grade = "F";
                break;
        }
        System.out.println("학점은 " + grade + "입니다.");
    }
}

```

## 삼항연산자

```java

```

# 반복문

## for문

```java
public class For {
    public static void main(String[] args) {
        int sum = 0;
        // i++는 실행 부분이 실행되고 나서 실행된다
        for (int i = 1; i <= 5; i++) {
            sum += i;
            System.out.println(i);
        }
    }
}

```

## while문

```java
public class While {
    public static void main(String[] args ) {
        int i = 1;
        int sum = 0;

        while (i <= 3) {
            sum = sum + i;
            i = i + 1;
        }
        System.out.println(sum);
    }
}
```  


# 형변환(Type Casting)

- 자동 형변환, 강제 형변환

## 자동 형변환

- 작은 크기의 데이터 타입에서 큰 크기의 데이터 타입으로 변환할 때 자동으로 일어나는 형변환이다
- 데이터 손실이 없기 때문에 자바가 자동으로 처리해준다
- 예를 들어, byte → short → int → long → float → double 순서로 변환이 가능하다

```java
int intValue = 100;
long longValue = intValue; // int에서 long으로 자동 형변환
float floatValue = longValue; // long에서 float로 자동 형변환
System.out.println(floatValue); // 출력: 100.0
```

## 강제 형변환

- 큰 크기의 데이터 타입에서 작은 크기의 데이터 타입으로 변환할 때 명시적으로 형변환을 지정해야 한다
- 데이터 손실이 발생할 수 있으므로 조심해서 사용해야함
- (타입)을 사용해서 형변환을 명시한다

```java
double doubleValue = 9.78;
int intValue = (int) doubleValue; // double에서 int로 강제 형변환
System.out.println(intValue); // 출력: 9 (소수점 이하가 잘림)
```