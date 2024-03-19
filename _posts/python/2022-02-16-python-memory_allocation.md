---
layout: post
title:  'Python Advanced Series [Part2]: 파이썬의 메모리 관리(Feat.Garbage Collection)'
description: 메모리를 효율적으로 사용하는 프로그램/어플리케이션을 만들기 위해서는 메모리 할당에 대해 이해해야합니다.
date:   2022-02-16 15:01:35 +0300
image:  '/images/python_advanced_logo.png'
logo_image: '/images/python_advanced_logo.png'
category: language
tag: python
---
---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---
요즘에는 컴퓨터, 스마트폰을 사용할 때 한가지 프로그램/어플리케이션만 실행하는 사람은 없을 것입니다. 그렇기 때문에 내가 만든 프로그램/어플리케이션이 메모리를 효율적으로 사용하도록 개발하는 것은 중요합니다.  

메모리를 효율적으로 사용하는 프로그램/어플리케이션을 만들기 위해서는 메모리 할당에 대해 이해해야합니다. 메모리 할당은 내가 사용하는 프로그래밍 언어, 운영체제, 컴퓨터 아키텍처에 따라 조금씩 다르지만 전체적인 과정은 비슷합니다.  

파이썬의 메모리 관리는 대부분 Python Memory Manager에 의해 수행되지만, Python Memory Manager를 공부하면 프로그래밍 전반에 대한 이해와 코드 최적화, 디버깅을 더욱 잘 할 수 있게 될 것입니다.  

# 메모리 관리

파이썬에서의 메모리 관리는 크게 두 가지 레벨로 나누어서 생각할 수 있습니다. 첫 번째로 운영체제 레벨에서는 각 프로세스에 메모리를 얼마나 할당할지를 정하고, 각각의 프로세스가 다른 프로세스에 접근하지 못하도록 관리합니다.  

두 번째로 파이썬 내에서의 메모리 관리입니다.  

파이썬에서는 컴파일 단계에서 스택 영역에 메모리를 정적으로 크기를 정하고, 실행 단계에서는 Python memory manager를 이용해 힙 영역에 동적으로 메모리를 할당하고 그 외의 역할(공유, 할당, 제거 등)들을 수행함으로써 메모리를 관리합니다.     


![](/images/python_1.png)  

## Python Memory Manager   

Python memory manager는 모든 Python objects와 data structures를 포함하는 private 힙을 포함합니다. Python memory manager는 공유(sharing), 분할(segmentation), 사전 할당(preallocation) 또는 캐싱(caching)과 같은 다양한 동적 스토리지 관리 측면을 다루는 다양한 구성 요소를 가지고 있습니다.

가장 낮은 수준에서 raw memory allocator는 운영 체제의 메모리 관리자와 상호 작용하여 모든 파이썬 관련 데이터를 저장할 수 있는 충분한 공간을 private 힙에 확보합니다. raw memory allocator 외에도 여러 object-specific allocators가 동일한 힙에서 object의 특성에 맞는 고유한 메모리 관리 정책을 구현합니다.  

파이썬 힙의 관리는 인터프리터 자체에 의해 수행되며 힙 내부의 메모리 블록에 대한 객체 포인터를 사용자가 직접 제어할 수 없다는 것을 의미합니다. Python objects를 위한 힙 공간 할당은 파이썬/C API 함수를 통해 파이썬 메모리 관리자에 의해 수행됩니다.  

## Garbage Collection  

가비지 컬렉션은 인터프리터가 프로그램을 사용하지 않을 때 프로그램의 메모리를 비우는 것입니다. 파이썬이 이렇게 할 수 있는 것은 파이썬 개발자들이 백엔드에서 우리를 위해 가비지 컬렉터를 구현했기 때문입니다. 파이썬 가비지 컬렉터는 reference counting 방법으로 객체에 더 이상 참조가 없을 때는 객체가 차지하고 있던 메모리의 할당을 취소하고 메모리를 비우게 됩니다.   

# 메모리 할당  

![](/images/python_3.png)

메모리 할당(memory allocation)은 프로그램이 컴퓨터 메모리의 특정 빈 블록에 할당되거나 할당되는 과정을 의미합니다. 파이썬에서 이 모든 것은 Python memory manager에 의해 수행됩니다.  

## Stack 할당

스택 할당은 정적 메모리를 저장하는데, 정적 메모리는 특정 함수나 메서드 호출 내에서만 필요한 메모리입니다. 함수가 호출되면 프로그램의 호출 스택에 추가됩니다. 변수 초기화 같은 특정 함수 내부의 모든 로컬 메모리 할당은 함수 호출 스택에 임시로 저장되며, 함수가 돌아오면 삭제되고 호출 스택이 다음 작업으로 이동합니다. 연속적인 메모리 블록에 대한 이 할당은 미리 정의된 루틴을 사용하여 컴파일러에 의해 처리되기 때문에 개발자들은 이것에 대해 걱정할 필요가 없습니다.

(그러면 이 부분은 함수, 메서드, 그리고 함수나 메서드 안에서 사용되는 지역변수들을 컴파일 단계에서 확인하고 이에 알맞은 메모리 크기를 예측해서 정적으로 할당하는 건가?)  

(그리고 코드 실행 단계에서 함수가 호출될 때마다 스택에 Call stack이 쌓인다?)  

## Heap 할당

힙 할당은 프로그램에서 전역 범위로 사용되는 메모리인 동적 메모리를 저장합니다. 이러한 변수들은 특정 메서드나 함수 호출 외부에 필요하거나 전역적으로 여러 함수 내에서 공유됩니다. 스택 할당과 달리 힙 할당은 힙 데이터 구조와 관련이 없습니다. 힙 영역은 단순히 할당하고 어느 정도 임의의 주소에서 자유롭게 사용할 수 있는 큰 메모리 공간이며, 저장되는 객체에 필요한 공간을 기반으로 합니다.  

(힙 할당은 코드 실행 단계에서 객체의 타입에 맞게 동적으로 메모리 할당된다?)  
(Python memory manager의 가비지 컬렉션 기능에 의해 더이상 참조되지 않는 객체는 제거되고 메모리 비운다?)  


# 참고 
- [How does Memory Allocation work in Python (and other languages)?](https://medium.datadriveninvestor.com/how-does-memory-allocation-work-in-python-and-other-languages-d2d8a9398543){:target="_blank"}
- [Python 공식문서: Memory Management](https://docs.python.org/3/c-api/memory.html#tracemalloc-c-api){:target="_blank"}
- [What’s the difference between a stack and a heap?](https://www.programmerinterview.com/data-structures/difference-between-stack-and-heap/){:target="_blank"}
- [RealPython: Memory Management in Python](https://realpython.com/python-memory-management/){:target="_blank"}  
- [muchogusto.log: 파이썬 런타임과 메모리 관리](https://velog.io/@muchogusto/파이썬-런타임과-메모리-관리){:target="_blank"}
- [python의 메모리 할당과 관리 (Stack & Heap Memory)](https://hkim-data.tistory.com/182){:target="_blank"}
- [파이썬 메모리 영역](https://armontad-1202.tistory.com/entry/파이썬의-메모리-영역){:target="_blank"}

