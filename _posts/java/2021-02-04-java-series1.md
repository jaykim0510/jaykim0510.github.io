---
layout: post
title:  'Java Series [Part1]: 자바와 가상머신'
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


![](/images/java_1.png){: width="100%"}  


# 자바와 가상머신

> 한 번만 작성하면, 어디서든 동작한다. (Write Once, Run Anywhere.)  

어떤 언어는 운영체제에 따라 동작이 달라집니다.  
분명히 윈도우즈에서는 잘 동작했는데, 맥에서 동작하지 않는 일이 발생합니다.  
그래서 우리가 개발할 때는 항상 운영체제를 신경써야 합니다.  
중간 중간 테스트도 해주어야 하고요.  

만약 휴대폰 애플리케이션을 개발한다면 어떨까요?  
최악의 경우, 모든 휴대폰 기종을 모아서 매번 테스트를 해봐야겠네요.  

자바는 이런 '호환성'문제를 해결해 줍니다.  

'자바 가상머신'이라는 것만 설치되면, 어느 운영체제이든, 어느 디바이스이든, 동일하게 동작합니다.  
(자바 가상머신은 영어로 Java Virtual Machine, 줄여서 JVM 이라고 부릅니다.)  

이러한 자바의 높은 호환성은 애플리케이션의 특징과도 잘 맞아떨어지기 때문에, 애플리케이션 개발에 활발히 사용되고 있죠.  

![](/images/java_compiler_1.png)


# 자발 실행 과정

- 개발자가 작성한 소스코드(`.java`)
- 컴파일러(Javac)에 의해 바이트 코드로 변환(`.class`)
- 바이트 코드가 JVM에 전달
- 바이트 코드 안에 있는 클래스를 하나씩 런타임 단계에서 로드해서 검증한 후, JIT 컴파일러가 이를 기계어로 변환

![](/images/java_compiler_2.png)


# JDK, JRE, JVM

- JVM(Java Virtual Machine): 
  - Java, Kotlin, Scala와 같은 언어의 코드를 어느 디바이스에서든 실행할 수 있도록 함
  - 런타임 단계에서 바이트 코드를 기계어로 번역 (JIT 컴파일러(Just In Time Compiler) 내장)

- JRE(Java Runtime Environment):
  - 우리가 작성한 코드안에는 보통 다양한 외부 라이브러리가 포함돼 있음
  - 그런 외부 라이브러리를 제공해줘야만 우리가 작성한 코드도 돌아감
  - JRE가 그런 외부 라이브러리를 제공함

- JDK(Java Development Kit):
  - 자바 코드를 작성할 때 필요한 컴파일 기능, 디버깅 기능 등 개발자가 필요한 기능을 제공

![](/images/jdk.png)


# Compile, Build

- Compile:
  - 컴파일은 어떤코드를 다른 타겟 언어(기계어, 자바, C, 파이썬)로 변환하는 과정을 의미
  - 자바에서는 컴파일러가 소스 코드 -> 바이트 코드, JIT 컴파일러가 바이트 코드 -> 기계어로 변환함

- Build:
  - 하나의 실행 가능한 소프트웨어로 만들기 위해 필요한 과정
  - [컴파일 - 링크 - 패키징 - 테스트] 라는 과정을 빌드라고 함
  - 자바에서는 빌드 과정을 마치고 나면 하나의 `.jar` 또는 `.war` 파일을 산출
  - 빌드를 할 때는 보통 빌드 도구를 사용 -> 대표적인 빌드 도구에는 Maven, Gradle이 있음

# Maven, Gradle

- 빌드 관리 도구
  - 프로젝트에서 필요한 파일(xml, properties, jar)들을 자동으로 인식해 빌드해주는 도구
  - 소스코드를 컴파일, 테스트 등을 하여 실행가능한 소프트웨어로 빌드해줌
  - 외부 라이브러리를 참조하여 자동으로 다운로드 및 업데이트해줌
  - 자바의 대표적인 빌드 도구: Maven, Gradle

- Maven
  - 프로젝트의 외부 라이브러리를 쉽게 참조할 수 있게 `pom.xml` 파일로 명시하여 관리
  - 참조한 외부 라이브러리에 연관된 다른 라이브러리도 자동으로 관리됨
  - xml 파일은 프로젝트 규모가 커지면 점점 관리 하기가 힘들어짐

    ![](/images/maven_1.png)

    ```xml
    <modelVersion>maven의 버전</modelVersion>
    <groupId>프로젝트 그룹 Id</groupId>
    <artifactId>groupId 외에 프로젝트 구분을 위한 또 다른 Id</artifactId>
    <version>프로젝트의 버전</version>
    <name>프로젝트 이름</name>
    <description>프로젝트 설명</description>
    <properties>프로젝트 내에서 빈번하게 사용되는 상수를 정의하는 영역 ${태그명} 형태로 사용</properties>
    <dependencies>해당 프로젝트에서 의존성을 가지는 라이브러리를 정의하는 영역. <dependency> 태그로 표기</dependencies>
    <build>빌드와 관련된 정보를 설정하는 영역</build>
    ```

- Gradle
  - `pom.xml` 대신 `build.gradle` (groovy 언어)로 관리
  - Maven과 비교해 더 빠르고 간결함
  - 현재 실무자들중 Maven에 익숙한 개발자가 많아서 아직은 Maven의 사용 비중이 더 높음

    ![](/images/gradle_1.png)

    ```gradle
    repositories {라이브러리가 저장된 위치}
    mavenCentral {기본 Maven Repository}
    dependencies {라이브러리 사용을 위한 의존성 설정}
    ```

# 참고

- [한빛미디어, [자바 기초 강의] 5강. 바이트코드 파일과 자바 가상 머신](https://www.youtube.com/watch?v=Zt4Ze4jNDUE&t=1s){:target="_blank"}
- [우아한 Tech, [10분 테코톡] 🧹 와이비의 빌드와 배포](https://www.youtube.com/watch?v=zeDh2mMd_fc){:target="_blank"}
- [AroundHub Studio, 자바의 대표적인 빌드 관리 툴! 메이븐(Maven)과 그레이들(Gradle)](https://www.youtube.com/watch?v=3Jp9kGDb01g){:target="_blank"}
- [우아한 Tech, [10분 테코톡] 루나의 Gradle](https://www.youtube.com/watch?v=ntOH2bWLWQs&t=273s){:target="_blank"}