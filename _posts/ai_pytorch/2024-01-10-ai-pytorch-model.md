---
layout: post
title:  '[Pytorch] 모델 만들기'
description: 파이토치 모델은 기본적으로 nn.Module 클래스를 상속하여 사용한다. 모델을 구현할 때에는, 직접 기본적인 모듈을 직접 만들 필요 없이, torch.nn에서 제공해주는 모듈을 활용하면 된다
date:   2024-01-10 15:01:35 +0300
image:  '/images/pytorch_logo.png'
logo_image:  '/images/pytorch_logo.png'
category: AI
tag: pytorch
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 파이토치 모델

- 파이토치 모델은 기본적으로 `nn.Module` 클래스를 상속하여 사용한다
- 공식문서에 따르면 `nn.Module` 은 다음과 같은 기능을 한다
  - Base class for all neural network modules.
  - Your models should also subclass this class.
  - Modules can also contain other Modules, allowing to nest them in a tree structure. You can assign the submodules as regular attributes

# 모델 직접 만들기

## 간단한 선형 모델 만들어보기

- 딥러닝 모델의 기본적인 기능을 제공 받기 위해 `nn.Module` 을 상속받는다
- 모델의 가중치는 `Parameter()`를 통해 생성한다
- 순전파(forward propagation)를 통해 모델의 예측값을 얻기 위해 `forward()` 메서드를 구현한다

```py
import torch
import torch.nn as nn
from torch.nn.parameter import Parameter

class MyLinearModel(nn.Module):
    def __init__(self, in_features, out_features):
        super(MyLinearModel, self).__init__()
        self.W = Parameter(torch.ones((out_features, in_features)))
        self.b = Parameter(torch.ones(out_features))
        
    def forward(self, x):
        mm = torch.mm(x, self.W.T)
        output = mm + self.b
        return output
```

```py
model = MyLinearModel(3, 2) # 모델 생성

x = torch.randn((10, 3)) # 입력 데이터

prediction = model(x) # 순전파를 통한 예측값 반환
```

- 가중치(weight)와 바이어스(bias)는 업데이트되어야 할 값이기 떄문에 `Parameter`로 정의한다
- 이동평균과 같이 학습은 필요없지만 모델을 저장할 때 같이 저장하고 싶은 값들은 `Buffer`로 정의한다
- 파이토치에서 사용되는 변수들을 정리하면 다음과 같다
  - **Tensor**
    - ❌ gradient 계산
    - ❌ 값 업데이트
    - ❌ 모델 저장시 값 저장
  - **Parameter**
    - ✅ gradient 계산
    - ✅ 값 업데이트
    - ✅ 모델 저장시 값 저장
  - **Buffer**
    - ❌ gradient 계산
    - ❌ 값 업데이트
    - ✅ 모델 저장시 값 저장

```py
class Model(nn.Module):
    def __init__(self):
        super().__init__()

        self.parameter = Parameter(torch.Tensor([7]))
        self.tensor = torch.Tensor([7])
        self.register_buffer('buffer', self.tensor) # tensor를 buffer로 등록
```



## torch.nn 모듈 사용하기

- Linear를 비롯해 Convolution, RNN, BatchNorm, Sigmoid, CrossEntropyLoss 등 여러 모듈들을 이미 파이토치에서 만들어놨다

```py
import torch.nn as nn

model = nn.Linear(20, 30)

x = torch.randn(128, 20)

prediction = model(x)
```

- 실제로 논문에서 구현하는 여러 모듈들이 복합적으로 사용하는 모델을 구현할 때에는, 직접 기본적인 모듈을 직접 만들 필요 없이, `torch.nn`에서 제공해주는 모듈을 활용하면 된다

```py
class Model(nn.Module):
    def __init__(self):
        super(Model, self).__init__()
        self.conv1 = nn.Conv2d(in_channels=1, out_channels=3, kernel_size=1, bias=True)
        self.bn1 = nn.BatchNorm2d(num_features=3)
        self.conv2 = nn.Conv2d(in_channels=3, out_channels=5, kernel_size=1, bias=False)

    def forward(self, x):
        x = F.relu(self.bn1(self.conv1(x)))
        return F.relu(self.conv2(x))
```

- 그리고 논문에 있는 모델들을 보면 여러 개의 모듈을 포함하는 레이어가 수십개씩 쌓여있는 모습을 볼 수 있다
- 그런 모델을 구현할 때에는 모델안의 모듈들을 컨테이너로 구분해서 감싸주는게 좋다
- 또한 모델에서 다른 부분은 얼려두고, 특정 모듈만 학습하는 파인튜닝을 위해서라도 컨테이너 단위로 모델을 나누는게 좋다
- 컨테이너 종류로는 `Sequential`, `ModuleList`, `ModuleDict` 등이 있다
- `Sequential`은 입력 데이터가 모든 모듈을 다 통과하고, `ModuleList`, `ModuleDict`는 동적으로 특정 모듈만 통과하도록 할 수 있다
- 아래는 컴퓨터 비전 분야에서 사용되는 AlexNet의 모델 코드이다

```py
class AlexNet(nn.Module):

    def __init__(self, num_classes=1000):
        super(AlexNet, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=11, stride=4, padding=2),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2),
            nn.Conv2d(64, 192, kernel_size=5, padding=2),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2),
            nn.Conv2d(192, 384, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(384, 256, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(256, 256, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2),
        )
        self.avgpool = nn.AdaptiveAvgPool2d((6, 6))
        self.classifier = nn.Sequential(
            nn.Dropout(),
            nn.Linear(256 * 6 * 6, 4096),
            nn.ReLU(inplace=True),
            nn.Dropout(),
            nn.Linear(4096, 4096),
            nn.ReLU(inplace=True),
            nn.Linear(4096, num_classes),
        )

    def forward(self, x):
        x = self.features(x)
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.classifier(x)
        return x
```

# 모델 파헤치기

- 모델을 구성하는 모듈과 파라미터를 살펴보고 싶을 때가 있다. 이 때는 model 객체의 `named_parameters()` 메서드를 사용하면 된다

```py
for param, weight in model.named_parameters():
    print(f"파라미터 명: {param}")
    print(f"파라미터 크기: {weight.size()}")
    print(f"파라미터 값: {weight}")
    print()
------------------------------------------------
파라미터 명: conv1.weight
파라미터 크기: torch.Size([3, 1, 1, 1])
파라미터 값: Parameter containing:
tensor([[[[0.9726]]],
        [[[0.2617]]],
        [[[0.4475]]]], requires_grad=True)

파라미터 명: conv1.bias
파라미터 크기: torch.Size([3])
파라미터 값: Parameter containing:
tensor([0.4027, 0.9123, 0.1270], requires_grad=True)

파라미터 명: bn1.weight
파라미터 크기: torch.Size([3])
파라미터 값: Parameter containing:
tensor([1., 1., 1.], requires_grad=True)

파라미터 명: bn1.bias
파라미터 크기: torch.Size([3])
파라미터 값: Parameter containing:
tensor([0., 0., 0.], requires_grad=True)

파라미터 명: conv2.weight
파라미터 크기: torch.Size([5, 3, 1, 1])
파라미터 값: Parameter containing:
tensor([[[[-0.3509]],
            ...
         [[-0.4782]]]], requires_grad=True)
```

- 직접 파라미터에 접근할 수도 있다

```py
model.conv1.weight
--------------------------
Parameter containing:
tensor([[[[0.9726]]],
        [[[0.2617]]],
        [[[0.4475]]]], requires_grad=True)
```

- torchvision (또는 torchinfo)를 사용하면 조금 더 보기 좋게 프린트 해볼 수도 있다

```py
summary(model, input_size=(1, 1, 1))

----------------------------------------------------------------
        Layer (type)               Output Shape         Param #
================================================================
            Conv2d-1              [-1, 3, 1, 1]               6
       BatchNorm2d-2              [-1, 3, 1, 1]               6
            Conv2d-3              [-1, 5, 1, 1]              15
================================================================
Total params: 27
Trainable params: 27
Non-trainable params: 0
----------------------------------------------------------------
Input size (MB): 0.00
Forward/backward pass size (MB): 0.00
Params size (MB): 0.00
Estimated Total Size (MB): 0.00
----------------------------------------------------------------
```



# Pretrained 모델

- 딥러닝 모델은 일반적으로 파라미터가 많은 대용량 크기의 모델을 풍부한 대용량 데이터로 학습할수록 더 성능이 뛰어나다
- 하지만 이런 모델을 학습하는데에는 많은 비용이 들어가기 때문에 쉽지 않다
- 그래서 구글, 네이버 등과 같은 기업에서는 이러한 큰 시간과 비용을 들여 학습시킨 모델을 제공하는데 이러한 모델들을 사전 학습된 모델 (pre-trained model)이라고 한다
- 예를 들어, 대용량의 언어 데이터를 학습한 모델은 다양한 자연어 관련 태스크에 범용적으로 사용될 수 있고, 대량의 이미지 데이터를 학습한 모델은 여러 컴퓨터 비전 관련 태스크에 사용될 수 있다
- 이렇게 사전 학습된 모델은 그대로 사용할 수도 있고, 우리가 가지고 있는 데이터로 특별한 목적에 더 특화된 모델을 만들기 위해 파인 튜닝(fine-tuning) 할 수도 있다

## 사전학습된 모델 불러오기

- 파이토치는 비전, 자연어와 같은 각 분야에 특화된 라이브러리를 제공한다. 이러한 라이브러리에는 유명한 모델들을 사전학습된 모델로 제공해준다
- 뿐만 아니라 허깅페이스(huggingface) 같은 곳에서도 사전학습된 모델을 제공한다

```py
import torchvision.models as models

alexnet = models.alexnet(pretrained=True)

# alexnet = models.alexnet() # 가중치는 학습되지 않은 껍데기만 가져온다

alexnet
---------------------------------------------------------------------------------
AlexNet(
  (features): Sequential(
    (0): Conv2d(3, 64, kernel_size=(11, 11), stride=(4, 4), padding=(2, 2))
    (1): ReLU(inplace=True)
    (2): MaxPool2d(kernel_size=3, stride=2, padding=0, dilation=1, ceil_mode=False)
    (3): Conv2d(64, 192, kernel_size=(5, 5), stride=(1, 1), padding=(2, 2))
    (4): ReLU(inplace=True)
    (5): MaxPool2d(kernel_size=3, stride=2, padding=0, dilation=1, ceil_mode=False)
    (6): Conv2d(192, 384, kernel_size=(3, 3), stride=(1, 1), padding=(1, 1))
    (7): ReLU(inplace=True)
    (8): Conv2d(384, 256, kernel_size=(3, 3), stride=(1, 1), padding=(1, 1))
    (9): ReLU(inplace=True)
    (10): Conv2d(256, 256, kernel_size=(3, 3), stride=(1, 1), padding=(1, 1))
    (11): ReLU(inplace=True)
    (12): MaxPool2d(kernel_size=3, stride=2, padding=0, dilation=1, ceil_mode=False)
  )
  (avgpool): AdaptiveAvgPool2d(output_size=(6, 6))
  (classifier): Sequential(
    (0): Dropout(p=0.5, inplace=False)
    (1): Linear(in_features=9216, out_features=4096, bias=True)
    (2): ReLU(inplace=True)
    (3): Dropout(p=0.5, inplace=False)
    (4): Linear(in_features=4096, out_features=4096, bias=True)
    (5): ReLU(inplace=True)
    (6): Linear(in_features=4096, out_features=1000, bias=True)
  )
)
```

```py
alexnet.classifier
--------------------------------------------------------------------
Sequential(
  (0): Dropout(p=0.5, inplace=False)
  (1): Linear(in_features=9216, out_features=4096, bias=True)
  (2): ReLU(inplace=True)
  (3): Dropout(p=0.5, inplace=False)
  (4): Linear(in_features=4096, out_features=4096, bias=True)
  (5): ReLU(inplace=True)
  (6): Linear(in_features=4096, out_features=1000, bias=True)
)
```

## 사전학습된 모델 커스텀 하기

- 사전학습된 모델은 보통 입력층과 출력층은 우리가 원하는 형태와 다를 수 있다
- 예를 들어 사전 학습된 모델은 이미지 클래스 100개를 분류할 수 있는 모델이지만, 우리의 태스크는 10개만 분류하면 되는 경우가 있다
- 그래서 이런 문제를 해결하기 위해서 우리는 사전 학습된 모델의 일부를 추가, 수정, 삭제할 수 있어야 한다

- 임의의 모듈에 접근하는 방법은 다음과 같다

```py
alexnet.classifier[0]
alexnet.get_submodule("classifier")[0]
alexnet.get_submodule("classifier.0")
alexnet._modules["classifier"]._modules["0"]
---------------------------------------------
Dropout(p=0.5, inplace=False)
```

- 모듈의 이름을 모를 때는 다음과 같이 `named_modules()` 메서드를 사용해 확인해 볼 수 있다

```py
for name, module in alexnet.named_modules():
    print(f"이름: {name}")
------------------------------------------------
이름: features
이름: features.0
이름: features.1
...(생략)
이름: features.11
이름: features.12
이름: avgpool
이름: classifier
이름: classifier.0
...(생략)
이름: classifier.5
이름: classifier.6
```

- 모듈을 수정/삭제 하는 방법은 다음과 같다

```py
# 모듈 삭제
alexnet.classifier[6] = nn.Identity()
# alexnet.classifier.pop(6)

# 모듈 수정
alexnet.classifier[6] = nn.Linear(4096, 10)
```

- 모듈을 추가하는 방법은 다음과 같다

```py
# 특정 모듈의 자식 모듈로 추가하는 방법
alexnet.features[11].add_module('100', nn.BatchNorm2d(256))

# 자식 모듈이 아닌 그냥 모듈 추가하는 방법
alexnet.features.insert(1, nn.Identity())
```


## 사전학습된 모델 파인튜닝 하기

- 특정 부분만 학습하기 위해서는 다른 부분은 학습에서 제외해야 한다(freeze)
  - Weight freeze 란 해당 모듈의 graident 는 역전파 하지 않아 학습을 하지 않는다는 의미입니다.
  - 예를 들어, 우리가 하려는 태스크가 pretrain 한 태스크와 매우 유사하다면, feature 파트는 freeze 하여 학습하지 않고 새로 정의한 task specific 파트만 학습하는 것이 좋은 방법일 수 있습니다.
- 모듈 객체의 `requires_grad_()` 메서드 사용하면 된다

```py
alexnet.features[0].requires_grad_(requires_grad=False)

# 또는
for param in alexnet.features[0].parameters():
    param.requires_grad=False
```

- 제외되었는지(frozen) 확인해보자

```py
alexnet.features[0].weight.requires_grad
alexnet.features[0].bias.requires_grad
-----------------------------------------------
False
False
```

- 만약 특정 커스텀 태스크를 위해 모듈을 새로 추가했다면, 해당 모듈의 weight initialization을 해주는게 좋다

```py
import torch.nn.init as init

def initialize_weights(model):
    """
    Xavier uniform 분포로 모든 weight 를 초기화합니다.
    더 많은 weight 초기화 방법은 다음 문서에서 참고해주세요. https://pytorch.org/docs/stable/nn.init.html
    """
    for m in model.modules():
        if isinstance(m, nn.Conv2d):
            init.xavier_uniform_(m.weight.data)
            if m.bias is not None:
                m.bias.data.zero_()
        elif isinstance(m, nn.BatchNorm2d):
            m.weight.data.fill_(1)
            m.bias.data.zero_()
        elif isinstance(m, nn.Linear):
            m.weight.data.normal_(0, 0.01)
            m.bias.data.zero_()

# 이렇게 새로 추가한 모듈만 가중치 초기화를 해준다
initialize_weights(model.myclassifier)
```

# 모델 저장하기 / 불러오기


## 모델 저장하기

- `torch.save(model.state_dict(), save_path)`
- `state_dict()`는 모델을 사용하는데 필요한 모든 파라미터와 버퍼를 저장하고 있다

```py
save_folder = "./runs/"
save_path = os.path.join(save_folder, "best.pth")   # ./runs/best.pth
os.makedirs(save_folder, exist_ok=True)  

torch.save(model.state_dict(), save_path)
print(f"{save_path} 폴더에 모델이 성공적으로 저장되었습니다.")
print(f"해당 폴더의 파일 리스트: {os.listdir(save_folder)}")
--------------------------------------------------------
./runs/best.pth 폴더에 모델이 성공적으로 저장되었습니다.
해당 폴더의 파일 리스트: ['best.pth']
```

## 저장된 모델 불러오기

- `model.load_state_dict(torch.load(save_path))`

```py
new_model = Model()
new_model.load_state_dict(torch.load(save_path))
print(f"{save_path} 에서 성공적으로 모델을 load 하였습니다.")
--------------------------------------------------------
./runs/best.pth 에서 성공적으로 모델을 load 하였습니다.
```



