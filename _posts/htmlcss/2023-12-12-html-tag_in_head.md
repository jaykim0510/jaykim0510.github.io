---
layout: post
title:  '[HTML]: <head>에 들어가는 태그'
description: 
date:   2023-12-12 15:01:35 +0300
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


# HTML의 &lt;head&gt; 태그와 주요 요소들

웹 문서를 만들 때 `<head>` 태그는 눈에 보이지 않는 중요한 정보를 포함하는 부분이다. `<head>` 태그 내부에는 웹 페이지의 제목, 메타데이터, 스타일, 외부 리소스 연결 등의 정보를 정의하는 다양한 태그가 들어간다. 이 글에서는 `<head>` 태그 내부에서 자주 사용되는 `<title>`, `<meta>`, `<style>`, `<link>` 태그에 대해 알아보자.

## 1. &lt;title&gt; 태그: 문서의 제목 설정

`<title>` 태그는 웹 브라우저의 탭 제목으로 표시되며, 검색 엔진이 페이지를 인식하는 데 중요한 역할을 한다.

### ✅ 사용 예시
```html
<head>
    <title>HTML Head 태그 가이드</title>
</head>
```

### 🔹 &lt;title&gt; 태그의 역할
- 브라우저 탭에 표시되는 페이지 제목 설정
- 검색 엔진 최적화(SEO)에서 중요한 요소
- 북마크할 때 기본 제목으로 사용됨

---

## 2. &lt;meta&gt; 태그: 문서의 메타데이터 설정

`<meta>` 태그는 웹 문서에 대한 정보를 검색 엔진이나 브라우저에 제공하는 역할을 한다.

### ✅ 사용 예시
```html
<head>
    <meta charset="UTF-8">
    <meta name="description" content="HTML의 head 태그에 대해 설명하는 문서입니다.">
    <meta name="keywords" content="HTML, head, title, meta, link, style">
    <meta name="author" content="김지온">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
```

### 🔹 &lt;meta&gt; 태그의 주요 속성

|속성|설명|
|:---:|:---:|
|`charset`|문자 인코딩 방식 지정 (일반적으로 UTF-8 사용)|
|`name="description"`|페이지에 대한 짧은 설명 (검색 엔진 결과에 표시됨)|
|`name="keywords"`|페이지의 핵심 키워드 (현재 SEO 영향력은 적음)|
|`name="author"`|문서의 저자 정보를 명시|
|`name="viewport"`|반응형 웹을 위한 화면 크기 설정 (모바일 최적화)|

---

## 3. &lt;style&gt; 태그: 내부 스타일 정의

`<style>` 태그는 HTML 문서 내부에서 CSS 스타일을 직접 작성할 때 사용된다.

### ✅ 사용 예시
```html
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
        }
        h1 {
            color: blue;
        }
    </style>
</head>
```

### 🔹 &lt;style&gt; 태그의 특징
- HTML 문서 내부에서 CSS를 정의할 수 있음
- 작은 규모의 스타일링에는 적합하지만, 유지보수 측면에서 외부 CSS 파일을 사용하는 것이 더 바람직함

---

## 4. &lt;link&gt; 태그: 외부 리소스 연결

`<link>` 태그는 HTML 문서에 외부 스타일시트나 폰트, 아이콘 등을 연결할 때 사용된다.

### ✅ 사용 예시
```html
<head>
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
</head>
```

### 🔹 &lt;link&gt; 태그의 주요 속성

| 속성 | 설명 |
|------|------------------------------------|
| `rel` | 연결할 리소스의 유형 (e.g., `stylesheet`, `icon`) |
| `href` | 외부 리소스 파일의 경로 |
| `type` | 파일의 MIME 타입 지정 (대부분 생략 가능) |

### 🔹 &lt;link&gt; 태그의 활용 예
- **CSS 파일 연결** → `<link rel="stylesheet" href="style.css">`
- **파비콘(favicon) 설정** → `<link rel="icon" href="favicon.ico" type="image/x-icon">`
- **구글 폰트 연결** → `<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">`

---

## ✅ 정리

| 태그 | 역할 |
|------|------------------------------------------------------|
| `<title>` | 브라우저 탭 제목 설정 및 검색 엔진 최적화 |
| `<meta>` | 문서 정보(설명, 키워드, 인코딩 등) 제공 |
| `<style>` | 문서 내부에서 CSS 스타일 적용 |
| `<link>` | 외부 CSS 파일, 아이콘, 폰트 등 연결 |

웹 페이지를 만들 때 `<head>` 태그를 올바르게 활용하면 SEO 최적화, 모바일 친화성, 스타일링 등에 도움을 줄 수 있다. 올바른 HTML 구조를 통해 가독성과 유지보수성을 높이도록 하자! 🚀

