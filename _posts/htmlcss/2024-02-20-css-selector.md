---
layout: post
title:  '[CSS]: 선택자(selector)'
description: 
date:   2024-02-20 15:01:35 +0300
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

# CSS 선택자 가이드

CSS 선택자는 HTML 요소를 스타일링할 때 어떤 요소에 적용할지 지정하는 중요한 개념이다. 선택자는 기본적인 요소 선택부터 고급적인 속성 선택, 관계 선택까지 다양한 방법이 있다. 이번 글에서는 CSS 선택자의 종류와 사용법을 정리해 보겠다.

---

## 1. 기본 선택자 (Basic Selectors)

### ✅ 요소 선택자 (Type Selector)
특정 HTML 태그(요소)에 스타일을 적용할 때 사용한다.
```css
p {
    color: blue;
}
```
💡 모든 `<p>` 태그의 텍스트 색상을 파란색으로 변경한다.

### ✅ 클래스 선택자 (Class Selector)
`.`(점) 기호를 사용하여 특정 클래스를 가진 요소를 선택한다.
```css
.card {
    background-color: #f4f4f4;
}
```
💡 `.card` 클래스를 가진 모든 요소에 배경색을 적용한다.

### ✅ 아이디 선택자 (ID Selector)
`#`(샵) 기호를 사용하여 특정 아이디를 가진 요소를 선택한다.
```css
#header {
    font-size: 24px;
}
```
💡 `id="header"`인 요소의 글자 크기를 24px로 설정한다.

⚠️ **주의:** ID는 문서 내에서 고유해야 하므로, 되도록이면 클래스 선택자를 사용하는 것이 좋다.

### ✅ 전체 선택자 (Universal Selector)
`*`를 사용하여 모든 요소를 선택한다.
```css
* {
    margin: 0;
    padding: 0;
}
```
💡 모든 요소의 `margin`과 `padding`을 0으로 초기화한다.

---

## 2. 그룹 선택자 (Group Selector)
쉼표 `,`를 사용하여 여러 요소를 한 번에 선택할 수 있다.
```css
h1, h2, h3 {
    font-family: Arial, sans-serif;
}
```
💡 모든 `<h1>`, `<h2>`, `<h3>` 태그의 글꼴을 동일하게 설정한다.

---

## 3. 속성 선택자 (Attribute Selectors)
HTML 요소의 속성을 기준으로 선택할 수 있다.

### ✅ 특정 속성을 가진 요소 선택
```css
a[target] {
    color: red;
}
```
💡 `target` 속성이 있는 `<a>` 태그를 선택한다.

### ✅ 특정 값과 일치하는 요소 선택
```css
input[type="text"] {
    border: 1px solid #ccc;
}
```
💡 `type="text"` 속성을 가진 `<input>` 태그만 선택한다.

### ✅ 특정 값으로 시작하는 요소 선택 (`^=`)
```css
a[href^="https"] {
    color: green;
}
```
💡 `href` 속성이 `https`로 시작하는 `<a>` 태그를 선택한다.

### ✅ 특정 값으로 끝나는 요소 선택 (`$=`)
```css
img[src$=".png"] {
    border-radius: 10px;
}
```
💡 `.png`로 끝나는 `src` 속성을 가진 `<img>` 요소를 선택한다.

### ✅ 특정 값을 포함하는 요소 선택 (`*=`)
```css
div[class*="box"] {
    padding: 20px;
}
```
💡 `class` 속성에 `box`라는 단어가 포함된 요소를 선택한다.

---

## 4. 관계 선택자 (Combinators)
HTML 요소 간의 관계를 기준으로 선택할 수 있다.

### ✅ 자식 선택자 (`>`)
바로 아래의 자식 요소만 선택한다.
```css
div > p {
    color: red;
}
```
💡 `<div>`의 **직속 자식** `<p>` 태그만 선택한다.

### ✅ 하위(후손) 선택자 (공백)
자식뿐만 아니라 모든 하위 요소를 선택한다.
```css
div p {
    color: blue;
}
```
💡 `<div>` 내부에 있는 모든 `<p>` 태그를 선택한다.

### ✅ 인접 형제 선택자 (`+`)
바로 다음에 오는 형제 요소를 선택한다.
```css
h1 + p {
    font-weight: bold;
}
```
💡 `<h1>` 태그 바로 뒤에 오는 `<p>` 태그만 선택한다.

### ✅ 일반 형제 선택자 (`~`)
동일한 부모를 가진 모든 형제 요소를 선택한다.
```css
h1 ~ p {
    color: gray;
}
```
💡 `<h1>` 이후에 나오는 모든 `<p>` 태그를 선택한다.

---

## 5. 가상 클래스 (Pseudo-classes)
특정 상태의 요소를 선택할 때 사용한다.

### ✅ 마우스를 올린 상태 (`:hover`)
```css
a:hover {
    color: orange;
}
```
💡 마우스를 올리면 링크 색상이 주황색으로 변경된다.

### ✅ 첫 번째 요소 선택 (`:first-child`)
```css
p:first-child {
    font-size: 20px;
}
```
💡 부모 요소의 첫 번째 `<p>` 태그를 선택한다.

### ✅ 마지막 요소 선택 (`:last-child`)
```css
div:last-child {
    background-color: lightgray;
}
```
💡 부모 요소의 마지막 `<div>`만 선택한다.

---

## 6. 가상 요소 (Pseudo-elements)
HTML의 특정 부분을 선택하여 스타일을 적용한다.

### ✅ 첫 글자 스타일 (`::first-letter`)
```css
p::first-letter {
    font-size: 24px;
    font-weight: bold;
}
```
💡 `<p>` 태그의 첫 글자를 크게 표시한다.

### ✅ 첫 줄 스타일 (`::first-line`)
```css
p::first-line {
    color: red;
}
```
💡 `<p>` 태그의 첫 줄만 빨간색으로 표시한다.

### ✅ 내용 추가 (`::before`, `::after`)
```css
div::before {
    content: "★ ";
    color: gold;
}
```
💡 `<div>` 앞에 `★` 아이콘을 추가한다.

---

## 7. 선택자 우선순위 (Specificity)
CSS에서 여러 선택자가 겹칠 경우 적용 우선순위는 다음과 같다.

1. **인라인 스타일** (`style=""`) >
2. **ID 선택자 (`#id`)** >
3. **클래스, 속성, 가상 클래스 (`.class`, `[attr]`, `:hover`)** >
4. **태그 선택자 (`div`, `p`)** >
5. **전체 선택자 (`*`)**

✅ **팁:** 스타일이 적용되지 않는다면, 선택자 우선순위를 확인해 보자!

---

## 결론
CSS 선택자는 웹 디자인에서 필수적인 요소이다. 기본 선택자부터 속성, 관계, 가상 요소까지 다양한 선택자를 활용하면 더욱 효율적인 스타일링이 가능하다. 프로젝트에 맞게 적절한 선택자를 사용해 보자! 🚀

