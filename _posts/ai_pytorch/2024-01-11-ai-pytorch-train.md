---
layout: post
title:  '[Pytorch] 학습 코드 짜기'
description: 딥러닝 모델 학습 과정에 데이터를 주입하는 방법과 모델 학습에 공통적으로 적용되는 학습 과정을 코드로 배운다
date:   2024-01-11 15:01:35 +0300
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

```py
import torch
import torchvision
import torchvision.transforms as transforms
import torchvision.models as models
import torchvision.datasets as datasets

import torch.optim as optim
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import random_split

import matplotlib.pyplot as plt
import matplotlib.image as image
import numpy as np
```

# Data Loader

## 데이터셋

- 기본적으로 파이토치에서 데이터셋을 구성할 때는 PyTorch의 `torch.utils.data`에서 `Dataset` 클래스를 상속해서 만든다
- 이렇게 생성된 `Dataset` 클래스는 크게 아래와 같이 3가지 메서드로 구성된다
  - `__init__`: 일반적으로 해당 메서드에서는 데이터의 위치나 파일명과 같은 초기화 작업을 위해 동작합니다. 일반적으로 CSV파일이나 XML파일과 같은 데이터를 이때 불러옵니다. 이렇게 함으로써 모든 데이터를 메모리에 로드하지 않고 효율적으로 사용할 수 있습니다. 여기에 이미지를 처리할 transforms들을 Compose해서 정의해둡니다.
  - `__len__`: 해당 메서드는 Dataset의 최대 요소 수를 반환하는데 사용됩니다. 해당 메서드를 통해서 현재 불러오는 데이터의 인덱스가 적절한 범위 안에 있는지 확인할 수 있습니다.
  - `__getitem__`: 해당 메서드는 데이터셋의 idx번째 데이터를 반환하는데 사용됩니다. 일반적으로 원본 데이터를 가져와서 전처리하고 데이터 증강하는 부분이 모두 여기에서 진행될 겁니다. 이는 이후 transform 하는 방법들에 대해서 간단히 알려드리겠습니다.

```py
class BasicDataset(torch.utils.data.Dataset):
    def __init__(self, X, y):
        super().__init__()
        self.image_df = X
        self.label_df = y
    
    def __len__(self):
        return len(self.image_df)
    
    def __getitem__(self, idx):
        return self.image_df.iloc[idx], self.label_df.iloc[idx]
```

## 데이터 로더

- 데이터 로더는 모델 학습을 위해서 데이터를 미니 배치(Mini batch)단위로 제공해주는 역할을 합니다.
- dataset은 앞서 우리가 만든 Dataset을 인자로 넣어주시면 됩니다! 
- 보통 batch_size나 collate_fn와 같은 인자를 주로 사용할겁니다!
  - `batch_size`: 인자가 나타내고 있는 뜻 그대로 배치 사이즈를 의미합니다.
  - `shuffle`: 데이터를 DataLoader에서 섞어서 사용하겠는지를 설정할 수 있습니다. 앞선 경우와 다르게 데이터가 섞인 것을 확인하실 수 있습니다.
  - `sampler / batch_sampler`: sampler는 index를 컨트롤하는 방법입니다. 데이터의 index를 원하는 방식대로 조정합니다. 즉 index를 컨트롤하기 때문에 설정하고 싶다면 shuffle 파라미터는 False(기본값)여야 합니다. 불균형 데이터셋의 경우, 클래스의 비율에 맞게끔 데이터를 제공해야할 필요가 있습니다. 이럴 때 사용하는 옵션이 sampler입니다.
    - `SequentialSampler` : 항상 같은 순서
    - `RandomSampler` : 랜덤, replacemetn 여부 선택 가능, 개수 선택 가능
    - `SubsetRandomSampler` : Samples elements randomly from a given list of indices, without replacement. (랜덤 리스트, 위와 두 조건 불가능)
    - `WeigthRandomSampler` : 가중치에 따른 확률
    - `BatchSampler` : batch단위로 sampling 가능
  - `collate_fn`: 생각보다 많이 쓰는 옵션입니다. 보통 map-style 데이터셋에서 sample list를 batch 단위로 바꾸기 위해 필요한 기능입니다. zero-padding이나 Variable Size 데이터 등 데이터 사이즈를 맞추기 위해 많이 사용합니다. 데이터가 로더에 의해 return 되기 전에 collate_fn을 거쳐서 그 결과가 return된다
  - `drop_last`: batch 단위로 데이터를 불러온다면, batch_size에 따라 마지막 batch의 길이가 달라질 수 있습니다. batch의 길이가 다른 경우에 따라 loss를 구하기 귀찮은 경우가 생기고, batch의 크기에 따른 의존도 높은 함수를 사용할 때 걱정이 되는 경우 마지막 batch를 사용하지 않을 수 있습니다.

```py
from torch.utils.data import DataLoader

dataloader = DataLoader(dataset, batch_size=4, shuffle=True, drop_last=True)
```

# 학습

```py
def train():
    start_time = time.time()
    print(f'[Epoch: {epoch + 1} - Training]')
    model.train()
    total = 0
    running_loss = 0.0
    running_corrects = 0

    for i, batch in enumerate(train_dataloader):
        imgs, labels = batch
        imgs, labels = imgs.cuda(), labels.cuda()

        outputs = model(imgs)
        optimizer.zero_grad()
        _, preds = torch.max(outputs, 1)
        loss = criterion(outputs, labels)
        
        loss.backward()
        optimizer.step()
        
        total += labels.shape[0]
        running_loss += loss.item()
        running_corrects += torch.sum(preds == labels.data)
        
        if i % log_step == log_step - 1:
            print(f'[Batch: {i + 1}] running train loss: {running_loss / total}, running train accuracy: {running_corrects / total}')

    print(f'train loss: {running_loss / total}, accuracy: {running_corrects / total}')
    print("elapsed time:", time.time() - start_time)
    return running_loss / total, (running_corrects / total).item()


def validate():
    start_time = time.time()
    print(f'[Epoch: {epoch + 1} - Validation]')
    model.eval()
    total = 0
    running_loss = 0.0
    running_corrects = 0

    for i, batch in enumerate(val_dataloader):
        imgs, labels = batch
        imgs, labels = imgs.cuda(), labels.cuda()

        with torch.no_grad():
            outputs = model(imgs)
            _, preds = torch.max(outputs, 1)
            loss = criterion(outputs, labels)

        total += labels.shape[0]
        running_loss += loss.item()
        running_corrects += torch.sum(preds == labels.data)

        if (i == 0) or (i % log_step == log_step - 1):
            print(f'[Batch: {i + 1}] running val loss: {running_loss / total}, running val accuracy: {running_corrects / total}')

    print(f'val loss: {running_loss / total}, accuracy: {running_corrects / total}')
    print("elapsed time:", time.time() - start_time)
    return running_loss / total, (running_corrects / total).item()


def test():
    start_time = time.time()
    print(f'[Test]')
    model.eval()
    total = 0
    running_loss = 0.0
    running_corrects = 0

    for i, batch in enumerate(test_dataloader):
        imgs, labels = batch
        imgs, labels = imgs.cuda(), labels.cuda()

        with torch.no_grad():
            outputs = model(imgs)
            _, preds = torch.max(outputs, 1)
            loss = criterion(outputs, labels)

        total += labels.shape[0]
        running_loss += loss.item()
        running_corrects += torch.sum(preds == labels.data)

        if (i == 0) or (i % log_step == log_step - 1):
            print(f'[Batch: {i + 1}] running test loss: {running_loss / total}, running test accuracy: {running_corrects / total}')

    print(f'test loss: {running_loss / total}, accuracy: {running_corrects / total}')
    print("elapsed time:", time.time() - start_time)
    return running_loss / total, (running_corrects / total).item()
```

```py
def adjust_learning_rate(optimizer, epoch):
    lr = learning_rate
    if epoch >= 3:
        lr /= 10
    if epoch >= 7:
        lr /= 10
    for param_group in optimizer.param_groups:
        param_group['lr'] = lr
```

```py
learning_rate = 0.01
log_step = 20

model = Model1()
model = model.cuda()

criterion = nn.CrossEntropyLoss()
optimizer = optim.SGD(model.parameters(), lr=learning_rate, momentum=0.9)

num_epochs = 20
best_val_acc = 0
best_epoch = 0

history = []
accuracy = []
for epoch in range(num_epochs):
    adjust_learning_rate(optimizer, epoch)
    train_loss, train_acc = train()
    val_loss, val_acc = validate()
    history.append((train_loss, val_loss))
    accuracy.append((train_acc, val_acc))

    if val_acc > best_val_acc:
        print("[Info] best validation accuracy!")
        best_val_acc = val_acc
        best_epoch = epoch
        torch.save(model.state_dict(), f"best_checkpoint_epoch_{epoch + 1}.pth")

torch.save(model.state_dict(), f"last_checkpoint_epoch_{num_epochs}.pth")

plt.plot([x[0] for x in accuracy], 'b', label='train')
plt.plot([x[1] for x in accuracy], 'r--',label='validation')
plt.xlabel("Epochs")
plt.ylabel("Accuracy")
plt.legend()

test_loss, test_accuracy = test()
print(f"Test loss: {test_loss:.8f}")
print(f"Test accuracy: {test_accuracy * 100.:.2f}%")
```
