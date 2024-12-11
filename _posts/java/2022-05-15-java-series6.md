---
layout: post
title:  'Java Series [Part6]: 자바의 컬렉션 프레임웍'
description: 
date:   2022-05-15 15:01:35 +0300
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

# 컬렉션 프레임웍
JAVA API문서에서는 컬렉션 프레임웍을 '데이터 군(group)을 다루고 표현하기 위한 단일화된 구조'라고 정의하고 있습니다. 컬렉션 프레임웍은 컬렉션, 다수의 데이터를 다루는데 필요한 다양하고 풍부한 클래스들을 제공합니다.   

![](/images/java_6.png)

# 컬렉션 프레임웍의 핵심 인터페이스

컬렉션 프레임웍에서는 컬렉션(데이터 그룹)을 크게 `List`, `Set`, `Map`이라는 3가지 인터페이스를 정의함으로써 컬렉션을 다루는데 필요한 기능을 제공하고 있습니다. 그리고 `List`와 `Set` 인터페이스의 공통된 부분을 뽑아서 새로운 인터페이스인 `Collection`을 추가로 정의하였습니다.  

## List

- 순서가 있는 데이터의 집합으로 데이터 중복을 허용
- 구현클래스: ArrayList, LinkedList, Stack 등


## Set

- 순서를 유지하지 않는 데이터의 집합, 데이터의 중복을 허용하지 않음
- 구현클래스: HashSet, TreeSet 등

## Map

- 키(Key)와 값(Value)으로 이루어진 쌍을 데이터로 갖는 집합
- 구현클래스: HashMap, TreeMap, Hashtable 등

# 몇 가지 중요한 구현클래스

## ArrayList

```java
ArrayList list1 = new ArrayList();

list1.add(new Integer(5));
list1.add(new Integer(3));
```

## HashMap

```java
HashMap map = new HashMap();

map.put("key1", "value1");
map.put("key2", "value2");
```