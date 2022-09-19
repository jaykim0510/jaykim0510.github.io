---
layout: post
title:  'Java Series [Part1]: 자바와 가상머신'
description: 
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

# Package, Class

<iframe width="560" height="315" src="https://www.youtube.com/embed/Zt4Ze4jNDUE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# JDK, JRE, JVM

JVM을 사용해서 마음껏 개발할 수 있는 환경을 JRE (Java Runtime Environment) 라고 부르며, 내 컴퓨터에 이런 환경을 만들기 위해서는 JDK (Java Development Kit) 라는 것을 설치하면 됩니다.  

![](/images/jdk.png)

<iframe width="560" height="315" src="https://www.youtube.com/embed/VvVruEDCSSY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# Maven, Gradle

<iframe width="560" height="315" src="https://www.youtube.com/embed/3Jp9kGDb01g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/L19wXSpv5cs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/ntOH2bWLWQs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# Compile, Build

<iframe width="560" height="315" src="https://www.youtube.com/embed/6SvUZqbU37E" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/zeDh2mMd_fc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/JgRCaVwkPE8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>