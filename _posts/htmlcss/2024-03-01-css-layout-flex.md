---
layout: post
title:  '[CSS] Layout: 플렉스(flex)'
description: 
date:   2024-03-01 15:01:35 +0300
image:  '/images/htmlcss_logo.png'
logo_image: '/images/htmlcss_logo.png'
category: frontend
tag: HTML-CSS
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# CSS Flexbox 완벽 가이드

Flexbox(Flexible Box)는 CSS에서 레이아웃을 구성하는 강력한 도구로, 컨테이너 내부의 요소들을 쉽게 정렬하고 배치할 수 있도록 도와준다. 특히 가변적인 화면 크기에 유연하게 대응할 수 있어 반응형 웹 디자인에서 자주 사용된다.

---

## 1. Flexbox 기본 개념
Flexbox는 부모 요소(컨테이너)와 자식 요소(아이템)로 구성되며, `display: flex;`를 사용하여 활성화된다.

```css
.container {
    display: flex;
}
```
💡 `display: flex;`를 적용하면 컨테이너의 자식 요소들이 자동으로 Flex 아이템이 된다.

---

## 2. Flex 컨테이너 속성
Flexbox의 부모 요소(컨테이너)에서 사용할 수 있는 주요 속성들을 살펴보자.

### ✅ `flex-direction` (배치 방향)
아이템을 정렬할 방향을 결정한다.
```css
.container {
    flex-direction: row; /* 기본값 */
}
```
옵션:
- `row` (기본값): 왼쪽 → 오른쪽 (가로 정렬)
- `row-reverse`: 오른쪽 → 왼쪽
- `column`: 위 → 아래 (세로 정렬)
- `column-reverse`: 아래 → 위

### ✅ `justify-content` (주 축 정렬)
아이템을 주 축(main axis) 방향으로 정렬한다.
```css
.container {
    justify-content: center;
}
```
옵션:
- `flex-start` (기본값): 왼쪽 정렬 (row) 또는 위쪽 정렬 (column)
- `flex-end`: 오른쪽 정렬 (row) 또는 아래쪽 정렬 (column)
- `center`: 중앙 정렬
- `space-between`: 첫 요소와 마지막 요소를 양 끝에 배치하고, 나머지는 동일한 간격
- `space-around`: 요소들 사이와 양 끝에 동일한 여백을 부여
- `space-evenly`: 모든 요소 사이 간격을 동일하게 설정

### ✅ `align-items` (교차 축 정렬)
아이템을 교차 축(cross axis) 방향으로 정렬한다.
```css
.container {
    align-items: center;
}
```
옵션:
- `stretch` (기본값): 컨테이너 높이에 맞춰 늘어남
- `flex-start`: 위쪽 정렬 (row 기준)
- `flex-end`: 아래쪽 정렬 (row 기준)
- `center`: 중앙 정렬
- `baseline`: 텍스트 기준선(baseline)에 맞춰 정렬

### ✅ `align-content` (여러 줄 정렬)
여러 줄의 아이템을 정렬할 때 사용한다. (단일 줄에서는 `align-items`와 동일)
```css
.container {
    align-content: space-between;
}
```
옵션:
- `flex-start`
- `flex-end`
- `center`
- `space-between`
- `space-around`
- `stretch`

---

## 3. Flex 아이템 속성
Flexbox의 자식 요소(아이템)에서 사용할 수 있는 주요 속성들을 살펴보자.

### ✅ `flex-grow` (확장 비율)
사용 가능한 공간을 아이템이 얼마나 차지할지 결정한다.
```css
.item {
    flex-grow: 1;
}
```
💡 모든 아이템의 `flex-grow` 값을 동일하게 설정하면, 같은 비율로 공간을 차지한다.

### ✅ `flex-shrink` (축소 비율)
아이템이 축소될 때 비율을 설정한다.
```css
.item {
    flex-shrink: 0;
}
```
💡 `0`으로 설정하면 아이템이 줄어들지 않는다.

### ✅ `flex-basis` (기본 크기)
아이템의 기본 크기를 설정한다.
```css
.item {
    flex-basis: 100px;
}
```
💡 `flex-basis: auto;`는 원래 크기 기준이며, `flex-basis: 0;`은 기본 크기를 무시하고 `flex-grow` 비율만 적용된다.

### ✅ `flex` (축약형 속성)
위 속성들을 한 줄로 작성할 수 있다.
```css
.item {
    flex: 1 1 auto; /* flex-grow, flex-shrink, flex-basis */
}
```

### ✅ `order` (정렬 순서 변경)
아이템의 순서를 변경할 수 있다.
```css
.item {
    order: 2;
}
```
💡 기본값은 `0`이며, 숫자가 작을수록 앞에 배치된다.

### ✅ `align-self` (개별 아이템 정렬)
각 아이템의 개별 정렬을 설정한다.
```css
.item {
    align-self: flex-end;
}
```
💡 `align-items`와 동일한 값을 가질 수 있으며, 특정 아이템에만 다르게 적용할 때 사용한다.

---

## 4. 실전 예제

### ✅ 기본적인 가로 정렬
```css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: lightgray;
}
.item {
    width: 100px;
    height: 100px;
    background-color: blue;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
}
```
```html
<div class="container">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
</div>
```
💡 컨테이너 안의 아이템들이 가운데 정렬된다.

### ✅ 세로 정렬과 비율 조정
```css
.container {
    display: flex;
    flex-direction: column;
    height: 300px;
}
.item {
    flex: 1;
    background-color: coral;
    margin: 5px;
}
```
```html
<div class="container">
    <div class="item">A</div>
    <div class="item">B</div>
    <div class="item">C</div>
</div>
```
💡 세 개의 아이템이 세로로 배치되며, 동일한 비율로 공간을 차지한다.

---

## 결론
Flexbox는 복잡한 레이아웃을 쉽고 직관적으로 만들 수 있는 강력한 도구이다. `flex-direction`, `justify-content`, `align-items` 등의 속성을 조합하여 다양한 UI를 만들 수 있다. 실제 프로젝트에서 활용하면서 Flexbox의 강력함을 경험해 보자! 🚀

