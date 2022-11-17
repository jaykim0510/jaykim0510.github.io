---
layout: post
title:  'Dockerfile을 이용한 이미지 빌드(4): Docker 이미지 빌드 잘해보기'
description: 
date:   2022-01-26 18:01:35 +0300
image:  '/images/docker_4.png'
logo_image:  '/images/docker_logo.png'
categories: devops
tags: Docker
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

- 도커 이미지 빌드 과정에 외부에서 파일을 다운로드 해야하는 것들은 가급적 미리 다운로드 해서 이미지 안에 미리 포함시키는게 낫다 (외부에서 미래에 지원을 종료하거나 버전이 바뀌거나 하는 문제가 많다)

# 참고
