---
layout: post
title:  'Jenkins Series [Part1]: What is Jenkins?'
description: 
date:   2022-03-01 15:01:35 +0300
image:  '/images/jenkins_10.png'
logo_image:  '/images/jenkins_logo.png'
categories:   devops
tags: Jenkins
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# CI/CD  

- **CI**: 지속적 통합 (Continuous Integration)  

보통 하나의 서비스를 출시하기 위해 다수의 개발자들이 하나의 저장소에서 코드를 작성하는데 이 때 서로의 작업을 병합하고 에러를 수정하고 테스트하는 일련의 과정을 반복하게 됩니다. 이러한 과정은 보통 비슷한 작업이 반복되는 형태로 진행되기 때문에, 개발자들은 이 과정에서 발생하는 시간 낭비를 줄이고 싶어했습니다.

Jenkins는 이러한 요구에 맞춰 개발된 CI 서비스를 제공하는 툴입니다.  

![](/images/jenkins_10.png)  

대표적인 CI 툴은 다음과 같습니다.  

![](/images/jenkins_12.png)  

- **CD**: 지속적 배포 (Continuous Deploy)

CD는 CI 과정을 통해 코드에 문제가 없는 것을 확인하고 서버에 배포하는 과정을 의미합니다.

![](/images/jenkins_11.png)  

대표적인 CD 툴은 다음과 같습니다.  

![](/images/jenkins_13.png)  


# Jenkins

> Jenkins is a self-contained, open source automation server which can be used to automate all sorts of tasks related to building, testing, and delivering or deploying software.

Jenkins는 파이프라인(Pipeline)을 사용해 거의 모든 언어의 조합과 소스코드 리포지토리에 대한 CI/CD 환경을 구축하기 위한 간단한 방법을 제공합니다.

Jenkins가 각각의 단계에 대한 스크립트 작성의 필요성을 없애주지는 않지만, 일반 사용자가 구축할 수 있는 것보다 더 빠르고 더 강력하게 빌드(Build), 테스트, 그리고 배포(deployment) 도구 등 체인 전체를 통합할 수 있는 방법을 제공해 줍니다.

Jenkins는 자바 언어로 개발된 툴로써 Jenkins를 실행하기 위해서는 별도의 서버가 존재해야 하며 서버에는 Java가 설치되어 있어야 합니다.  

Jenkins의 CI 관련 프로세스는 Jenkins의 파이프라인으로 정의됩니다.  

![](/images/jenkins_14.png)  

이러한 파이프라인은 다음의 3 가지 방법으로 정의할 수 있습니다.  

1. Jenkinsfile  
   ```
    pipeline {
    agent {}
    environment {}
    stages {
        stage("Build") {
            environment {}
            steps {}
        }
        stage("Test") {
            environment {}
            steps {}
        }
    }
    }
   ```
2. Jenkins UI  
   ![](/images/jenkin_16.jpeg)  

3. Blue Ocean   
   ![](/images/jenkins_15.jpeg)  

[**(Jenkins 공식문서 참고: Getting started with Pipeline)** ](https://www.jenkins.io/doc/book/pipeline/getting-started/){:target="_blank"}  


# 참고
- [IT World: Jenkins란 무엇인가, CI(Continuous Integration) 서버의 이해](https://www.itworld.co.kr/news/107527){:target="_blank"}
- [DevOps Story, CD를 위한 Jenkins, Argo CD 연계](https://cwal.tistory.com/22){:target="_blank"}
- [메쉬코리아 플랫폼실 최제필, CI/CD 도구 및 방법론 도입기](https://mesh.dev/20210208-dev-notes-002-ci-cd/){:target="_blank"}
- [javatpoint: Gradle vs. Jenkins](https://www.javatpoint.com/gradle-vs-jenkins){:target="_blank"}
- [GitLab vs Jenkins](https://about.gitlab.com/devops-tools/jenkins-vs-gitlab/gitlab-differentiators/){:target="_blank"}
- [Katalon: Best 14 CI/CD Tools You Must Know \| Updated for 2022](https://www.katalon.com/resources-center/blog/ci-cd-tools/){:target="_blank"}