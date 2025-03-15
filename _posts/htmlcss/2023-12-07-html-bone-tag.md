---
layout: post
title:  '[HTML]: HTML의 기본 뼈대가 되는 태그'
description: 
date:   2023-12-07 15:01:35 +0300
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


# HTML의 뼈대가 되는 태그

웹 페이지는 HTML(HyperText Markup Language)로 작성되며, 기본적으로 `<html>`, `<head>`, `<body>` 세 가지 주요 태그로 구성된다. 이 글에서는 각각의 역할과 특징을 살펴보자.

- html: HTML 문서의 최상위 요소
- head: 문서의 메타데이터, 스타일, 스크립트 등을 포함하는 영역
- body: 사용자가 보게 될 실제 콘텐츠 영역

---

## 1. &lt;html&gt; 태그: 문서의 루트 요소

`<html>` 태그는 모든 HTML 문서를 감싸는 루트 요소로, 웹 브라우저가 해당 문서를 HTML로 해석하도록 한다.

### ✅ 사용 예시

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <title>HTML 문서 구조</title>
</head>
<body>
    <h1>안녕하세요!</h1>
</body>
</html>
```

### 🔹 &lt;html&gt; 태그의 주요 속성

| 속성 | 설명 |
|------|-----------------------------|
| `lang` | 문서의 언어 설정 (예: `ko`, `en`) |

---

## 2. &lt;head&gt; 태그: 문서 정보 및 설정

`<head>` 태그는 웹 페이지의 메타데이터, 스타일, 외부 리소스 등을 정의하는 공간이다.

### ✅ 주요 요소
- `<title>`: 문서의 제목 설정
- `<meta>`: 문자 인코딩, SEO 관련 정보 설정
- `<link>`: 외부 CSS, 폰트, 아이콘 연결
- `<style>`: 내부 스타일 정의
- `<script>`: JavaScript 코드 연결

### ✅ 사용 예시
```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML 구조</title>
    <link rel="stylesheet" href="styles.css">
</head>
```

---

## 3. &lt;body&gt; 태그: 문서의 실제 콘텐츠

`<body>` 태그는 화면에 보이는 콘텐츠를 포함하는 부분이다.

### ✅ 주요 요소
- 텍스트 관련 태그: `<h1>`, `<p>`, `<span>` 등
- 레이아웃 태그: `<div>`, `<section>`, `<article>` 등
- 멀티미디어 태그: `<img>`, `<video>`, `<audio>` 등
- 입력 태그: `<form>`, `<input>`, `<button>` 등

### ✅ 사용 예시

```html
<body>
    <h1>웹 페이지의 구조</h1>
    <p>이 문서는 HTML의 기본 구조를 설명합니다.</p>
</body>
```

---

## ✅ 정리

| 태그 | 역할 |
|------|----------------------------------|
| `<html>` | HTML 문서의 루트 요소 |
| `<head>` | 문서의 메타정보 및 설정 포함 |
| `<body>` | 웹 페이지의 실제 콘텐츠 포함 |

이 세 가지 태그를 기반으로 HTML 문서를 구성하면, 의미 있고 체계적인 웹 페이지를 만들 수 있다. 🚀

