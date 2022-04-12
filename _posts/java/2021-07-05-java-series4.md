---
layout: post
title:  'Java Series [Part4]: 자바의 자료형 특징'
description: 
date:   2021-07-07 15:01:35 +0300
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


## 1. 기본형 참조형

![](/images/java_2.png){: width="100%"}  

```java
// 참조형의 경우 == 연산자는 같은 인스턴스를 가리키는지를 물어봄
String myString = "aBc";
System.out.println(myString.toLowerCase() == "abc");
-----------------------------------------------------------------
false

// 인스턴스가 가지는 값이 같은지를 확인하고 싶으면 equals() 메소드를 사용해야함
String myString = "aBc";
System.out.println(myString.toLowerCase().equals("abc"));
----------------------------------------------------------------
true
```

## 2. null  

어떤 언어들에서는 '비어있음'을 None으로 표현하고, 또 어떤 언어들에서는 nil로 표현합니다. 자바에서는 '비어있음'이 null이라는 값으로 표현됩니다. 단, null은 참조형 변수(Reference Type)만 가질 수 있는 값입니다. 

## 3. final  

변수를 정의할 때 final을 써주면, 그 변수는 '상수'가 됩니다. 즉, 한 번 정의하고 나서 다시 바꿀 수 없다는 것이죠.  

```java
public final double pi = 3.141592;
```

## 4. 클래스 변수와 클래스 메소드  

### 1) 클래스 변수

클래스 변수는 인스턴스가 생성될 때마다 값이 초기화 되는 것이 아니라, 모든 인스턴스들이 함께 공유하는 변수입니다. 클래스 변수를 정의하기 위해서는 static이라는 키워드를 붙여주면 됩니다.  

자주 접하게 되는 클래스 변수는 바로 상수입니다. final을 공부할 때 상수를 보긴 했지만, 상수를 더 상수답게 쓰려면 static과 함께 쓰는 것이 좋습니다. 상수는 인스턴스에 해당되는 것이 아니며, 여러 복사본 대신 한 값만 저장해두는 것이 맞기 때문입니다. 상수 이름은 보통 모두 대문자로 쓰고, 단어가 여러 개인 경우 _로 구분 짓습니다.  

```java
public class CodeitConstants {
    public static final double PI = 3.141592653589793;
    public static final double EULERS_NUMBER = 2.718281828459045;
    public static final String THIS_IS_HOW_TO_NAME_CONSTANT_VARIABLE = "Hello";

    public static void main(String[] args) {
        System.out.println(CodeitConstants.PI + CodeitConstants.EULERS_NUMBER);
    }
}
```

### 2) 클래스 메소드  

마찬가지로, 클래스 메소드는 인스턴스가 아닌 `클래스에 속한 메소드`입니다. 클래스 메소드는 언제 사용할까요? 인스턴스 메소드는 인스턴스에 속한 것이기 때문에, 반드시 인스턴스를 생성해야 사용할 수 있습니다. 하지만 `클래스 메소드는 클래스에 속한 것이기 때문에, 인스턴스를 생성하지 않고도 바로 실행할 수 있습니다.`  

예를 들어,  Math.abs(), Math.max() 등을 사용하면, 자바에서 미리 만들어 둔 수학 관련 기능을 활용할 수 있습니다. 하지만 우리는 Math 클래스의 인스턴스를 생성하지는 않습니다. 필요하지 않기 때문이죠. 단지 Math 클래스의 기능(메소드)만 활용하면 됩니다.  
사실 우리가 가장 먼저 접한 '클래스 메소드'는 바로 main 메소드입니다. main은 자바 프로그램의 시작점이라고 했습니다. 첫 번째로 실행되는 코드이니, 어떤 인스턴스도 생성되어 있지 않습니다. 따라서 main 메소드 역시 인스턴스를 생성하지 않고 실행하는 '클래스 메소드'입니다. `클래스 메소드도 동일하게 static이라는 키워드`로 정의할 수 있습니다.  

## 5. Wrapper class

'Wrapper 클래스'는 기본 자료형을 객체 형식로 감싸는 역할을 합니다. Integer 클래스는 int형을, Double 클래스는 double을, Long 클래스는 long을, Boolean 클래스는 boolean을 wrapping할 수 있습니다. 그런데 이런 Wrapper 클래스가 왜 필요할까요?

기본형 자료형(Primitive Type)을 참조형(Reference Type)처럼 다루어야할 때 Wrapper 클래스를 사용하면 됩니다. 예를 들어서 ArrayList같은 컬렉션을 사용할 때는 꼭 참조형을 사용해야 합니다.  

```java
// 생성자로 생성하는 방법
Integer i = new Integer(123);

// 리터럴로 생성하는 방법
Integer i = 123;
```

## 6. ArrayList

```java
import java.util.ArrayList
// ArrayList<안에 넣은 객체의 클래스>
ArrayList<String> nameList = new ArrayList<>();

nameList.add("Jay");
nameList.add("Mike");
nameList.remove(1);
nameList.contains("Jay");

for (String name : nameList) {
  System.out.println(name)
}
```

## 7. HashMap  

```java
HashMap<String, Integer> check = new HashMap<>();
check.put("사과",new Integer(1))
check.get("사과")
```