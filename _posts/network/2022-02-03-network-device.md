---
layout: post
title:  '[Network] 네트워크 장비'
description: 
date:   2022-02-03 15:01:35 +0300
image:  '/images/network_logo.png'
logo_image: '/images/network_logo.png'
category: CS
tag: network
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 랜카드
랜카드는 유저의 **데이터를 케이블에 실어서 허브나 스위치 혹은 라우터 등으로 전달**해주고, **자신에게 온 데이터를 CPU에게 전달**해주는 역할을 합니다. 랜카드는 어떤 환경에서 사용하는가에 따라 이더넷용 랜카드, 토큰링용 랜카드, FDDI, ATM용 랜카드 등으로 구분하지만 요즘은 90% 이상 **이더넷용 랜카드**를 사용합니다. 랜카드는 데스크탑의 메인보드에 기본적으로 붙어있고, 추가적으로 랜카드를 부착할 수도 있습니다. 

# 허브
허브는 한마디로 정의하면 **멀티포트(Multiport) 리피터(Repeater)**라고 할 수 있습니다. 멀티포트는 포트가 많이 붙어있다는 뜻이고, 리피터는 들어온 데이터를 그대로 재전송한다는 의미입니다. 따라서 허브는 **특정 포트에서 들어온 데이터를 나머지 포트로 데이터를 뿌려주는 역할**을 합니다.  

허브를 이용한 네트워크의 예시를 하나 들어보겠습니다. 허브에도 이더넷 방식의 허브와 토큰링 방식의 허브가 있는데, 보통 이더넷 방식이 더 빠르기 때문에 이더넷 허브를 기준으로 얘기하도록 하겠습니다.  

허브로 연결된 컴퓨터 5대가 있을 때, 1번 컴퓨터가 2번 컴퓨터에 데이터를 전송하려고 합니다. 데이터를 허브로 보내주게 되면 허브는 일단 이 데이터를 허브내의 나머지 컴퓨터에 모두 전송합니다. 그러면 각각의 컴퓨터는 랜카드를 통해 들어온 데이터가 자신의 데이터가 맞는지 확인하고 자기의 것이 아니면 버리게 됩니다.  

![](/images/net_7.png)  

여기서 중요한 점은 위에서 구성한 네트워크가 이더넷 네트워크이기 때문에 1번 컴퓨터가 2번 컴퓨터에 데이터를 전송하는 동안 다른 컴퓨터들은 데이터를 주고 받을 수 없다는 점입니다. 따라서 이렇게 같은 허브에 연결된 컴퓨터들은 모두 **같은 콜리전 도메인**에 있다고 말합니다. 그래서 만약 허브만으로 약 100대의 컴퓨터를 연결할 수 있는 네트워크를 연결했다면 1대의 컴퓨터가 통신하는 동안 나머지 99대의 컴퓨터들은 모두 기다리고 있어야 합니다. 이는 **네트워크의 속도를 저하시키는 치명적인 원인**이 됩니다.  

![](/images/net_8.png)  

# 스위치
위에서 살펴본 허브의 단점은 아주 명확합니다. 네트워크의 규모를 확장하기 위해 아무리 허브의 개수를 늘려도 하나의 콜리전 도메인이기 때문에 네트워크의 속도를 느리게 만든다는 점입니다. 이를 해결하기 위해서는 **네트워크의 규모를 확장시켜도 콜리전 도메인이 커지지 않아야 하는데 이 때 등장한 것이 바로 스위치**입니다. 사실 **스위치 이전에 브릿지**라는 것이 있었지만 요즘은 브릿지를 스위치가 대체하였기 때문에 스위치에 대해서 알아보도록 하겠습니다.  

![](/images/net_9.png)  

스위치는 콜리전 도메인을 나눠준다고 했습니다. 예시를 보도록 하겠습니다. 

![](/images/net_10.png)  

보시다시피 콜리전 도메인은 스위치에 의해 분리되었습니다. 이렇게 되면 왼쪽 콜리전 도메인 내의 컴퓨터들이 통신하는 동안 오른쪽에서도 이와 상관없이 통신이 가능합니다. (왼쪽 콜리전 도메인 내의 컴퓨터와 오른쪽 콜리전 도메인에 있는 컴퓨터가 통신하는 경우는 제외. 이런 경우에 해당하는지는 스위치에서 저장하고 있는 **맥 주소 테이블을 바탕으로 판단**합니다)  



# 라우터

라우터가 필요한 이유는 또 스위치로는 해결하지 못하는 문제가 있기 때문입니다. 바로 **브로드캐스트 도메인 분할** 문제입니다. 브로드캐스트 도메인은 무엇이고 콜리전 도메인이랑 차이는 무엇인지 보도록 하겠습니다. 콜리전 도메인 영역은 A라는 컴퓨터가 B라는 컴퓨터에 데이터를 보내고 싶은데 어디로 보내야 할지 몰라 콜리전 도메인 영역 내의 모든 컴퓨터에 데이터를 보내는 영역입니다. 이 때는 B 컴퓨터를 제외한 나머지 컴퓨터는 데이터를 받아도 본인 것이 아니기 때문에 랜카드가 자신의 CPU까지 데이터를 보내지 않기 때문에 컴퓨터 성능에 영향을 주지 않습니다.  

```
콜리전 도메인은 컴퓨팅 성능에는 영향을 주지 않는다. 다만 네트워크 속도를 저하시킬 뿐이다. 
```

**브로드캐스트 도메인은 컴퓨팅 성능에도 영향을 주는 영역**입니다. A라는 컴퓨터가 만약 어떤 데이터를 브로드캐스팅하면 브로드캐스트 도메인 내의 모든 컴퓨터는 이 데이터의 목적지가 됩니다. 그렇기 때문에 이 데이터는 브로드캐스트 도메인 내의 모든 컴퓨터에 도착하고 랜카드는 이 데이터를 CPU에 전달해주게 됩니다. 이런 일이 자주 발생하게 되면 모든 컴퓨터의 컴퓨팅 성능에 영향을 미칠 것입니다.  

라우터는 브로드캐스트 도메인을 분할해줍니다. 이 말은 **네트워크를 분리해 준다**는 말입니다. 브로드캐스팅은 하나의 네트워크 내에서만 일어납니다. 그래서 라우터를 이용하면 네트워크를 분할할 수 있고 브로드캐스트 도메인 영역을 분할할 수 있습니다.  

```
라우터는 네트워크를 분할한다.  
```

![](/images/net_11.png)  

🦊🐱 **VLAN(Virtual LAN)**  

위에서 라우터를 이용해 네트워크를 분할했습니다. 이런 역할을 스위치가 할 수도 있습니다. 스위치의 VLAN 기능을 이용하면 네트워크 영역을 분할할 수 있습니다. 하지만 딱 그 뿐입니다. 두 네트워크 간의 통신은 스위치로 할 수 없습니다. 두 네트워크가 통신하기 위해서는 라우터가 필요합니다.  

```
스위치의 VLAN을 이용하면 네트워크를 분할할 수 있다.
라우터는 네트워크를 분할하고 두 네트워크 간의 통신을 가능하게 해준다.
```

<iframe width="560" height="315" src="https://www.youtube.com/embed/bj-Yfakjllc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>  

<iframe width="560" height="315" src="https://www.youtube.com/embed/H7-NR3Q3BeI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>