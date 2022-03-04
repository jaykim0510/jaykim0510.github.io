---
layout: post
title:  'Java Series [Part2]: 자바 시작하기'
description: FROM은 빌드를 위한 stage를 초기화하고 이후의 명령어를 위한 기본 이미지를 만듭니다.
date:   2021-07-04 15:01:35 +0300
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


## Hello World  

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

## 변수와 연산

```java
public class Variables {
    public static void main(String[] args) {

        // 선언 방법
        // 1)
        int age;
        age = 27;

        // 2)
        double num = 12.5;

        // 자료형

        // primitive type
        int myInt = 123;
        long myLong = 12345678910L;

        double myDouble = 3.14; // double이 더 높은 정밀도, 소수형의 기본 타입
        float f = 3.14f;

        char a = 'a'; // 쌍따옴표로 감싸면 String으로 인식함
        char aPrime = 97; // 아스키 값 97 == 'a'
        char b = '가';

        boolean myBoolean = true;


        // 객체형 type
        String myString = "jay kim";
    }
}
```

## 조건문

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

## 반복문

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


## 배열

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


        for (double i : intArray) {
            System.out.println(i);
        }


        int[][] multiArray = new int[3][4];

        int[][] multiArray2 = { {1 ,2, 3, 4},
                            {5, 6, 7, 8},
                            {9, 10, 11, 12}
                            };
        System.out.println(multiArray2[0][1]);

    }
}
```