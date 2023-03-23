---
layout: post
title:  'Deep Learning Series [Part9]: Advanced CNN  '
description: 
date:   2021-04-05 15:01:35 +0300
image:  '/images/googlenet_1.png'
logo_image:  '/images/ai_logo.jpeg'
categories: AI
tags: Deep_Learning
---
---


**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Advanced CNN  

## 1. GoogLeNet

![](/images/googlenet_1.png){: width="100%"}   



### 1) GoogLeNet의 특징  

- 커널의 적절한 사이즈를 찾기 위해 고민하기 보다, **여러 가지 사이즈의 커널을 병렬로 이용**함으로써 보다 **풍부한 Feature Extraction** 수행한다
- **1 X 1 컨볼루션 필터**를 이용해 **Feature map의 dimension을 줄이고**, 결과적으로 연산해야 할 **파라미터 수를 감소**시킨다.
- 1 X 1 이라서 Feature map dimension이 줄어든 것이 아니라, 1 X 1 필터의 채널 수를 작은 사이즈를 썼기 때문이다.
- 참고로 컨볼루션 커널의 사이즈, padding, striding이 Feature map의 사이즈를 결정한다.
- 컨볼루션 커널의 채널의 개수가 Feature map의 개수를 결정한다.  

### 2) Inception Module

![](/images/googlenet_2.png){: width="60%"}   

![](/images/googlenet_3.png){: width="100%"}   

- 위 그림과 같이 1 X 1 컨볼루션 필터를 이용해 Feature map의 dimension을 줄이고, 결과적으로 연산해야 할 파라미터 수를 감소시켰다.  
- Inception모듈을 보면 여러 필터가 병렬적으로 연산되고 모듈 끝에서 결과들이 Concatenation됩니다.  
- 따라서 Feature map의 개수는 달라도 괜찮지만, Feature map의 사이즈는 같아야 합니다.  

![](/images/googlenet_4.png){: width="60%"}   

### 3) GoogLeNet Network Structure

![](/images/googlenet_1.png){: width="100%"}   

- 다음과 같이 Inception Module은 총 9개로 구성되어 있다
- Concatenation까지가 Inception Module에 포함되고 그 후에 보통 Pooling layer를 거친 뒤 다시 Inception Module로 들어가는 것으로 반복된다.  
- Inception Module을 2개 거친 후 Pooling하기도 하고, 5개 거치고 Pooling 하기도 한다.

![](/images/googlenet_6.png){: width="100%"}   

## 2. ResNet  

- VGG 모델이 나온 이후 깊은 Network가 좋은 성능을 낸다는 인식이 생겼다.
- 하지만 비슷한 방식으로 Network를 **더 깊게 만들었을 때 오히려 성능이 저하**되었다.
- 그 원인으로는 Gradient Vanishing과 파라미터 수 증가에 따른 학습 속도 저하가 있다.
- 파라미터 수 증가는 앞에서와 같이 **1 X 1 컨볼루션**으로 해결하였다.
- Gradient Vanishing 문제는 **Residual Learning**을 통해 해결하였다.  

### 1) Residual Learning

- 처음 Residual Learning이 나오기 전에 시도되던 방법은 Identity mapping이다.
- Identity mapping은 층은 더 깊게 만들되, Gradient vanishing은 생기지 않도록 하기 위해 이전 값을 그대로 다시 통과시키는 방법이다.
- 비선형성은 있어야 층을 깊게 쌓는 의미가 있으므로 Relu()정도가 있어야 하는데, 이렇게 되면 identity한 mapping이 되기 어려워진다.
- 그래서 좀 더 쉬운 방법으로 제안된 것이 Residual Learning이다. 

![](/images/googlenet_7.png){: width="60%"}  

- H(x)가 x가 되도록 하는 것이 아니라, F(x)가 0이 되도록 학습하는 것이 쉽다.  

### 2) Residual Block

![](/images/resnet_1.png){: width="60%"}  

- ResNet 50을 포함한 이보다 깊은 네트워크(50/101/152)에서는 1 X 1 Conv를 이용해 파라미터 갯수를 줄였다.

![](/images/resnet_2.png){: width="70%"}  

- Residual Block 내에서는 Feature map 사이즈는 동일하고 Filter수만 변함  

### 3) ResNet Architecture

![](/images/resnet_4.png){: width="100%"}  

![](/images/resnet_3.png){: width="100%"}  


