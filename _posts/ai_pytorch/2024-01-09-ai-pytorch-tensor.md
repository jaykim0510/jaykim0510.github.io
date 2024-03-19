---
layout: post
title:  '[Pytorch] 텐서 다루기'
description: 파이토치는 딥러닝 프레임워크중 하나다. 파이토치는 넘파이(Numpy) 배열과 유사한 텐서(Tensor)를 사용한다
date:   2024-01-09 15:01:35 +0300
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
# 파이토치

- 파이토치는 **딥러닝 프레임워크**중 하나다
- 파이토치는 넘파이(Numpy) 배열과 유사한 텐서(Tensor)를 사용한다 
- 파이토치는 GPU를 활용한 딥러닝 코드를 작성하는데 편리한 기능을 제공한다
- 텐서는 기본적으로 다차원 배열을 처리하기에 적합한 자료구조로 이해할 수 있다.
- 텐서는 "자동 미분" 기능을 제공한다.

# 디바이스 (CPU, GPU, MPS 등)

- 파이토치는 텐서간의 연산을 할 때, <span class='very__important'>텐서들이 서로 같은 디바이스(Device)안에 있어야 한다</span>
- 따라서 가능하면, 연산을 수행하는 텐서들을 모두 GPU에 올린 뒤에 연산을 수행하는 것이 좋다
- (GPU가 없다면 다른 장비(CPU, MPS)도 된다)

## 디바이스 확인하기

```py
torch.cuda.is_available() # GPU 사용 가능 여부
torch.cpu.is_available() # CPU 사용 가능 여부
torch.backends.mps.is_available() # MPS 사용 가능 여부
```

## 디바이스 설정하기

- 만약 `device`를 지금 사용중인 디바이스가 아닌 다른 디바이스로 설정하려는 경우 `'cuda:X'` 처럼 `X`에 디바이스 ordinal을 표기해야 한다. 하지만 지금 현재 장비 사용하려는 경우 `0` 붙이거나 아니면 아예 생략해도 된다. 그래서 나는 그냥 생략할 예정이다
- `device`로 문자열 `'cuda'` 이런식으로 전달해도 되고, `torch.device('cuda')` 이런 객체를 전달해도 된다

```py
device = "cpu"
if torch.cuda.is_available():
    device = "cuda:0"
elif torch.backends.mps.is_available():
    device = "mps"
print(device)
--------------------
"mps"

# 이렇게 한 줄로 쓸 수도 있음
device = 'cuda' if torch.cuda.is_available() else 'mps' if torch.backends.mps.is_available() else 'cpu'
```

## 텐서에 디바이스 할당하기

- `Tensor.cpu()`, `Tensor.cuda()` 써도 되지만,
- `device`를 정의했으면 `Tensor.to(device)` 를 쓰는게 더 괜찮은 것 같다
- (게다가 mps는 `.mps()` 따로 없어서 무조건 `.to()` 써야함)
- 텐서를 디바이스에 옮기는 과정은, 원본 텐서를 새로운 디바이스에 복사한다. 그래서 새로운 디바이스에 할당된 텐서를 다루기 위해서는 변수에 재할당 해야한다

```py
x = torch.Tensor([[1, 2], [3, 4]])

z = x.to(device) # 이렇게 x.to(device)는 device로 x를 복사한 후 복사한 값을 반환한다

print(x.device) # cpu
print(z.device) # mps: 0

# 보통은 x = x.to(device) 이렇게 쓰면 된다

# 참고로 .to() 는 device 뿐만 아니라 타입까지 변환할 수 있다
x.to(torch.float32)

x.to(device, dtype=torch.float32)


# 결론,
# to()를 쓰자
# x = x.to(device) 처럼 device로 옮겨진 텐서를 재할당하자
```

```py
# 텐서를 연산할 때는 서로 같은 디바이스에 있어야 한다

a = torch.tensor([
    [1.0, 1.],
    [2., 2.]
]).to("mps")

# CPU 장치의 텐서
b = torch.tensor([
    [5., 6.],
    [7., 8.]
])

print(torch.matmul(a, b)) # 오류 발생
--------------------------------
RuntimeError: Tensor for argument #2 'mat2' is on CPU, but expected it to be on GPU (while checking arguments for mm)
```

# 텐서 속성

- 텐서의 **기본 속성**으로는 다음과 같은 것들이 있다.
  * 모양(shape)
  * 자료형(data type)
  * 저장된 장치(device)

```py
tensor = torch.rand(2, 2)

print(tensor)
print(f"shape: {tensor.shape}")
print(f"type: {tensor.dtype}")
print(f"device: {tensor.device}")
--------------------------------------
tensor([[0.0271, 0.0495],
        [0.0183, 0.3877]])
shape: torch.Size([2, 2])
type: torch.float32
device: cpu
```

# 텐서 생성

- 텐서를 생성하는 데 있어 아래에서 설명한 것 말고도 훨씬 더 많은 방법들이 있다 [(파이토치 공식문서 참고)](https://pytorch.org/docs/stable/torch.html#creation-ops)

## torch.Tensor

- `torch.Tensor()` (= `torch.FloatTensor()`) 말고도, `torch.DoubleTensor()`, `torch.IntTensor()`, `torch.LongTensor()` 등 다양한 데이터 타입을 이름으로 가지는 생성자가 있다

```py
l = [[1, 2], [3, 4]]
arr = np.array([[1, 2], [3, 4]])

torch.Tensor(l)
torch.Tensor(arr)
-----------------------
tensor([[1., 2.],
        [3., 4.]])
```

## torch.tensor

- `torch.tensor()`의 가장 큰 특징은 입력으로 받은 **data를 항상 새로 복사해 텐서로 만든다**는 점이다
- 복사는 메모리 낭비를 유발하기 때문에, 상황에 맞게 대처 방법을 사용하는게 좋다
  - 데이터를 공유하지만 메모리 효율적인 방법으로 텐서를 만들고 싶은 경우: `torch.as_tensor(data)`
  - 텐서의 단순 `requires_grad()` 플래그만 바꾸고 싶은 경우: `Tensor.requires_grad(bool)`
- `torch.tensor()`는 새로운 메모리에 텐서를 만들고 autograph에서 떼어낸다 (creates a new leaf tensor)
  - 그래서 텐서를 복사할 때는 `torch.tensor()` 보다는 같은 역할이지만 더 명시적인, `Tensor.clone().detach()` 를 권장하기도 한다

## torch.as_tensor

- `torch.as_tensor()`는 데이터를 공유하며, autograph에 붙어있다 (preserves autograd history if possible)
- 이미 텐서인 경우 같은 타입, 디바이스면 그냥 원본 반환하고, 타입이 달라지거나 디바이스가 달라지면 아예 새로 복사한다
- 넘파이 배열의 경우 `torch.from_numpy()` 가 조금 더 빠르다

## torch.zeros, torch.zeros_like, torch.ones, torch.ones_like

- `torch.zeros()`는 `size` 형태의 텐서를 `0`으로, `torch.ones()`는 `size` 형태의 텐서를 `1`로 채운다

```py
torch.zeros(size=(2, 3))
torch.zeros(2, 3)
```

- `torch.zeros_like()`는 `input`과 같은 형태의 텐서를 `0`으로, `torch.ones_like()`는 `input`과 같은 형태의 텐서를 `1`로 채운다
- 이 때 `input`은 텐서여야 한다. 넘파이 배열 같은 다른 타입을 쓰려면 `torch.ones(input.shape)` 이렇게 써야 한다

```py
x = torch.tensor([[1, 2], [3, 4]])

z = torch.zeros_like(x)
```

## torch.empty, torch.empty_like, torch.full, torch.full_like

- `torch.empty()`, `torch.empty_like()`는 비어있는 것은 아니고, `0`에 가까운 초기화되지 않은 값을 가진다

```py
a = torch.empty(2, 3, dtype=torch.int32) # [2, 3] 이렇게 넣어줘도 된다
b = torch.empty_like(a)
```

- `torch.full()`, `torch.full_like()`는 `fill_value`로 텐서를 채워준다

```py
a = torch.full(size=(2, 2), fill_value=5, dtype=torch.float64)
b = torch.full_like(a, fill_value=10)
```

## torch.arange, torch.linspace

- `torch.arange()`는 간격을 지정할 수 있다
- `torch.linspace()`는 개수를 지정할 수 있다

```py
torch.arange(5) # tensor([0, 1, 2, 3, 4])
torch.arange(1, 4) # tensor([1, 2, 3])
torch.arange(0, 2.5, 0.5) # tensor([0.0000, 0.5000, 1.0000, 1.5000, 2.0000])

torch.linspace(3, 10, 5) # tensor([ 3.0000,  4.7500,  6.5000,  8.2500, 10.0000])
```

## torch.rand, torch.randn, torch.randint

- `torch.rand()`는 `0`과 `1`사이의 uniform distribution 에서 `size` 만큼 샘플링한 텐서를 반환한다
- `torch.randn()`은 `0`과 `1`사이의 normal distribution 에서 `size` 만큼 샘플링한 텐서를 반환한다
- `torch.randint()`는 `low`와 `high-1` 사이의 정수 값을 uniform distribution 에서 `size` 만큼 샘플링한 텐서를 반환한다
- (`rand_like()`, `randn_like()`, `randint_like()`도 있다)
- 더 많은 샘플링 방법들이 있다 [(파이토치 공식문서 참고)](https://pytorch.org/docs/stable/torch.html#random-sampling)

```py
torch.rand(2, 3) # [2, 3] 형태의 텐서에 uniform distribution으로 샘플링한 값을 채운다
torch.randn(2, 3) # [2, 3] 형태의 텐서에 normal distribution으로 샘플링한 값을 채운다
torch.randint(3, 10, (2, 2)) # [2, 2] 형태의 텐서에 3과 9 사이의 정수 값을 uniform distribution으로 샘플링한 값을 채운다
```


# 텐서 조작

## 텐서 이어붙이기

### torch.cat

- `torch.cat(tensors, dim)`은 `dim` 방향으로 텐서를 이어 붙인다. `dim` 방향 제외한 나머지 부분은 shape이 서로 같아야 한다

```py
x = torch.ones(size=(2, 2))
y = torch.zeros(size=(2, 2))

torch.cat(tensors=(x, y), dim=0)
--------------------------------
tensor([[1., 1.],
        [1., 1.],
        [0., 0.],
        [0., 0.]])

torch.cat(tensors=(x, y), dim=1)
--------------------------------
tensor([[1., 1., 0., 0.],
        [1., 1., 0., 0.]])
```

```py
x = torch.ones(size=(2, 3))
y = torch.zeros(size=(2, 4))

torch.cat(tensors=(x, y), dim=1)
--------------------------------
tensor([[1., 1., 1., 0., 0., 0., 0.],
        [1., 1., 1., 0., 0., 0., 0.]])
```

### torch.stack, torch.vstack, torch.hstack, torch.dstack

- `torch.stack(tensors, dim)`은 **새로운 차원**으로 텐서를 이어 붙인다.
- 텐서들의 사이즈는 모두 같아야 한다
- 새로운 차원은 크기는 쌓은 `len(tensors)`가 된다

```py
# 예를 들어, 3 X 4 짜리 행렬을 5개를 새로운 차원에 이어붙인다고 하면,
# 3 X 4 는 2차원 행렬이기 때문에 사이즈가 [3, 4] 이렇게 되어있다.
# 여기서 새로운 차원이 생길 수 있는 자리는 [new, 3, 4], [3, new, 4] 또는 [3, 4, new] 이렇게 있다
# 우리는 5개를 이어붙인다고 했기 때문에 new에 5가 들어간다

a = torch.ones((3, 4))
torch.stack([a, a, a, a, a], dim=0).shape # [5, 3, 4]
torch.stack([a, a, a, a, a], dim=1).shape # [3, 5, 4]
torch.stack([a, a, a, a, a], dim=2).shape # [3, 4, 5]
```

- `torch.vstack(tensors)`은 dim=0 (세로)방향으로 쌓는다
- `torch.hstack(tensors)`은 dim=1 (가로)방향으로 쌓는다 
- `torch.dstack(tensors)`은 dim=2 (3차원)방향으로 쌓는다
- `dim` 방향 제외한 다른 차원의 사이즈는 같아야 한다
- 쌓으면 결과는 다른 차원의 사이즈는 그대로고, `dim` 방향의 차원만 모두 더해진다
  - vstack의 경우: (2, 3), (3, 3) -> (5, 3)
  - hstack의 경우: (1, 2, 3), (1, 5, 3) -> (1, 7, 3)
  - dstack의 경우: (1, 2), (1, 2) -> (1, 2, 2)

## 텐서 쪼개기

### torch.split

- `torch.split(tensor, split_size or selections, dim)`
- `split_size(int)`인 경우 `split_size` 값 만큼의 `size` 갖는 텐서로 나눈다 (batch size같은 개념)
- `selections(list)`인 경우 `selections`의 element값 만큼을 `split_size`로 가진다 -> `selections` 원소의 합이 split하고자 하는 차원의 값과 같아야 함
  - (3, 16) -> selections: [1, 5, 10] ok
  - (3, 16) -> selections: [1, 5, 11] X
- 쪼개기도 `vsplit`, `hsplit`, `dsplit` 있음

```py
x = torch.randn(5, 16)

y = torch.split(x, 3, dim=1)
for batch in y:
    print(batch.shape)
------------------------------
torch.Size([5, 3])
torch.Size([5, 3])
torch.Size([5, 3])
torch.Size([5, 3])
torch.Size([5, 3])
torch.Size([5, 1])

z = torch.split(x, [1, 3, 5, 7], dim=1)
for batch in z:
    print(batch.shape)
------------------------------
torch.Size([5, 1])
torch.Size([5, 3])
torch.Size([5, 5])
torch.Size([5, 7])
```

## 텐서 형변환

- 텐서의 자료형(정수, 실수 등)을 변환할 수 있다
- `Tensor.type()`
- `Tensor.int()`, `Tensor.float()`

```py
x = torch.ones(2, 3)
print(x.dtype)
---------------------
torch.float32



x_int = x.type(torch.int32)
print(x.dtype)
print(x_int.dtype)
---------------------
torch.float32
torch.int32

x_float = x.float()
print(x_float.dtype)
---------------------
torch.float32
```

## 텐서 인덱싱

### torch.index_select

- `torch.index_select(input, dim, index)`
- `index`를 통해 특정 index의 tensor를 가져온다
- `index`는 IntTensor 또는 LongTensor type의 1-D tensor이다
- `input.dim()`은 변하지 않는다 (3차원이면 계속 3차원)
- `input`의 `dim` 사이즈는 `len(index)`와 같아진다

```py
x = torch.IntTensor([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])

indices = torch.tensor([0, 2])

y0 = torch.index_select(x, dim=0, index=indices)
y1 = torch.index_select(x, dim=1, index=indices)
----------------------------------------------

------------------------
x
shape: torch.Size([3, 4])
tensor([[ 1,  2,  3,  4],
        [ 5,  6,  7,  8],
        [ 9, 10, 11, 12]], dtype=torch.int32)
------------------------
y0
shape: torch.Size([2, 4])
tensor([[ 1,  2,  3,  4],
        [ 9, 10, 11, 12]], dtype=torch.int32)
------------------------
y1
shape: torch.Size([3, 2])
tensor([[ 1,  3],
        [ 5,  7],
        [ 9, 11]], dtype=torch.int32)
------------------------
```

## 텐서 모양 바꾸기

### torch.reshape

- `torch.reshape(input, shape)`
- `input`과 data는 같다, shape만 다르다
- 가능하면 view of input 아니면 copy

```py
x = torch.arange(8.)

y = torch.reshape(x, (1, 8))
z = torch.reshape(y, (-1, 4))

print(x.shape, y.shape, z.shape)
----------------------------------
torch.Size([8]) torch.Size([1, 8]) torch.Size([2, 4])
```

### Tensor.view()

- `Tensor.view(shape)`
- `torch.reshape()`과 비슷하지만 기존 텐서와 메모리를 공유하기 때문에 메모리를 낭비하지 않는 방식이다
- 텐서의 형태를 바꿀 때 인덱스는 바뀌었으나 실제 메모리 상에서는 배열을 바꾸지 않는다(위치 바꾸는 연산이 잦으면 성능을 떨어트리므로)
- contiguous한 텐서만 지원한다 
  - (contiguous한 텐서인지 확인: `Tensor.is_contiguous()`)
  - (contiguous한 텐서 만들고 싶을 때: `Tensor.contiguous()`)
  - `Tensor.contiguous().view()` 이렇게 쓰면 된다


### torch.transpose

- `torch.transpose(input, dim0, dim1)`
- `dim0`과 `dim1`이 바뀐 tensor를 리턴
- `input`과 memory를 공유

```py
x = torch.randn(2, 3, 4)

y = torch.transpose(x, 0, 2)

y.shape # (4, 3, 2)
```

### torch.squeeze(), torch.unsqueeze()

- `torch.squeeze(tensor, dim)`: 특정(`dim`) 차원의 값이 1이면 차원을 없애버린다
- `torch.unsqueeze(tensor, dim)`: 특정(`dim`) 차원을 추가한다

```py
x = torch.randn(2, 1, 4)

y0 = torch.squeeze(x, dim=0)
y1 = torch.squeeze(x, dim=1)
y2 = torch.squeeze(x, dim=2)

y0.shape
y1.shape
y2.shape
--------------
torch.Size([2, 1, 4])
torch.Size([2, 4])
torch.Size([2, 1, 4])
```

```py
x = torch.randn(2, 1, 4)

y0 = torch.unsqueeze(x, dim=0)
y1 = torch.unsqueeze(x, dim=1)
y2 = torch.unsqueeze(x, dim=2)
y3 = torch.unsqueeze(x, dim=3)

y0.shape
y1.shape
y2.shape
y3.shape
---------------
torch.Size([1, 2, 1, 4])
torch.Size([2, 1, 1, 4])
torch.Size([2, 1, 1, 4])
torch.Size([2, 1, 4, 1])
```

# 텐서 연산과 함수

```py
# 같은 크기를 가진 두 개의 텐서에 대하여 사칙연산 가능
# 기본적으로 요소별(element-wise) 연산
a = torch.tensor([
    [1, 2],
    [3, 4]
])
b = torch.tensor([
    [5, 6],
    [7, 8]
])
print(a + b)
print(a - b)
print(a * b)
print(a / b)
---------------------------
tensor([[ 6,  8],
        [10, 12]])
tensor([[-4, -4],
        [-4, -4]])
tensor([[ 5, 12],
        [21, 32]])
tensor([[0.2000, 0.3333],
        [0.4286, 0.5000]])
```

```py
t = torch.Tensor([[1, 3], [2, 0]])


torch.sum(t, dim=0)
torch.sum(t, dim=1)
-------------------------------------
tensor([3., 3.])
tensor([4., 2.])



torch.mean(t, dim=1)
-------------------------------------
tensor([2., 1.])



torch.argmax(t, dim=0)
-------------------------------------
tensor([1, 0])



torch.sort(t, dim=0, descending=False)
-------------------------------------
torch.return_types.sort(
values=tensor([[1., 0.],
        [2., 3.]]),
indices=tensor([[0, 1],
        [1, 0]]))



torch.clamp(t, min=2, max=10)
-------------------------------------
tensor([[2., 3.],
        [2., 2.]])



torch.any(t)
torch.all(t)
-------------------------------------
tensor(True)
tensor(False)
```

```py
t = torch.arange(1, 11)

t[[0, 2]]
-------------------------------------
tensor([1, 3])



t[(t > 2) & (t < 8)]
-------------------------------------
tensor([3, 4, 5, 6, 7])



t[t.remainder(2) == 0]
-------------------------------------
tensor([ 2,  4,  6,  8, 10])



torch.where(t > 5, t*2, 0)
-------------------------------------
tensor([ 0,  0,  0,  0,  0, 12, 14, 16, 18, 20])



torch.tensor([0, 0, 1, 1, 1, 2]).unique()
-------------------------------------
tensor([0, 1, 2])


```

# 텐서 곱

## 행렬곱

```py
# 모두 같다

A.matmul(B)
torch.matmul(A, B)
A.mm(B)
torch.mm(A, B) # This function does not broadcast. For broadcasting matrix products, see torch.matmul()
A @ B
-----------------
tensor([[ 8., 18.],
        [14., 32.]])
```

## 행렬 원소간 곱

```py
# 모두 같다

A.mul(B)
torch.mul(A, B)
A * B
------------
tensor([[ 2.,  9.],
        [ 8., 20.]])
```

## 벡터 내적

```py
# 모두 같다

vec_A = torch.ravel(A)
vec_B = torch.ravel(B)

vec_A.dot(vec_B)
torch.dot(vec_A, vec_B)
----------
tensor(39.)
tensor(39.)
```

## 배치 행렬곱

```py
batch = 32
n = 10
m = 20
p = 30

t1 = torch.rand((batch, n, m))
t2 = torch.rand((batch, m, p))

torch.bmm(t1, t2).shape
--------------------------
torch.Size([32, 10, 30])
```

# 자동 미분과 그래디언트

- 신경망 학습은 크게 두 단계로 나뉘어진다
  - 순전파: forward propagation을 통해prediction을 구하고 이를 이용해 loss 계산
  - 역전파: back prop을 통해 gradients를 구하고 이를 이용해 parameter들을 adjust

```py
# forward prop
prediction = model(data)

# backward prop
loss.backward()
```

## Autograd

- https://tutorials.pytorch.kr/beginner/basics/autogradqs_tutorial.html
- https://tutorials.pytorch.kr/beginner/blitz/autograd_tutorial.html
- 텐서에 requires_grad=True를 적용하면 이는 autograd가 이 tensor의 모든 연산들을 추적하도록 합니다
- loss가 계산되고 loss.backward()를 호출하면 autograd는 gradient를 계산하고 이를 텐서의 .grad 속성(attribute)에 저장합니다
- autograd는 실행 시점에 정의되는(define-by-run) 프레임워크입니다