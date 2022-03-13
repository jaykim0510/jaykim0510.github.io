---
layout: post
title:  'Jenkins Series [Part3]: 선언적 파이프라인(Feat.Jenkinsfile)'
description: 
date:   2022-03-03 15:01:35 +0300
image:  '/images/jenkins_logo.png'
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

# Jenkinsfile

Jenkinsfile은 파이프라인을 만들기 위해 작성하는 코드입니다. 이 때 Jenkinsfile을 작성하는 방법에는 두 가지가 있습니다.  

- **Scripted Pipeline**  

2016년까지 Jenkins 코드는 전체적인 틀을 위해서만 Jenkins DSL(Domain-Specific Language)가 약간 사용되었을 뿐 실질적인 프로그램의 흐름은 그루비(Groovy) 언어에 의해 작성되었습니다. 그래서 Jenkinsfile을 작성하기 위해 J**enkins DSL뿐만 아니라 그루비 언어까지 배워야 했습니다.** 이렇게 작성된 코드가 바로 Scripted Pipeline입니다.  

이 때까지는 파이프라인에서 빌드후처리, 파이프라인 에러 상태확인, 알림기능 등 Jenkins에 특화된 내용은 없고 대부분 그루비의 `try-catch-finally` 구조로 구현해야 했습니다.  

- **Declarative Pipeline**  

그러다 2017년부터 클라우드 비스(CloudBees)에서 선언적 파이프라인을 개발하였습니다. 이 문법을 통하여 파이프라인을 심플하고 독자적인 방법으로 작성할 수 있게 되었습니다.

# Jenkinsfile의 구조  
모든 선언적 파이프라인은 반드시 `pipeline` 블록으로 감싸야 합니다. 그리고 그 안에 Sections과 Directives(지침)로 구성되어 있습니다.    

## Sections  
Sections에는 `agent`, `stages`, `steps`, `post`가 있습니다. (`stage`는 Jenkins DSL에서 Directives로 분류하고 있습니다. 하지만 저는 Sections로 분류하는 것이 편해 여기서 `stage`도 함께 소개하겠습니다. [**공식문서 참고**](https://www.jenkins.io/doc/book/pipeline/syntax/#){:target="_blank"})  

```sh
pipeline {
    agent {}
    stages {
        stage {
            steps {}
        }
    }
    post {}
}
```

### agent  

`agent`는 파이프라인 혹은 스테이지를 어디서 실행할지를(파일 경로, 컨테이너 등) 의미합니다.  

|**필수**|Yes|
|**파라미터**|`any`, `none`, `label`, `node`, `docker`, `dockerfile`, `kubernetes`|
|**위치**|`pipeline` block, `stage` block|

([**공식문서 참고**](https://www.jenkins.io/doc/book/pipeline/syntax/#agent-parameters){:target="_blank"})  

### stages  

`stage` 섹션을 묶는 블럭입니다.  

|**필수**|Yes|
|**파라미터**|None|
|**위치**|`pipeline` block|

### stage
stage는 공식문서에서 Directives(지침)으로 분류하는 블럭이며 파이프라인 내에서 구분하고 싶은 각각의 단계(예를 들어 Build, Test, Deploy)를 나타냅니다.  

|**필수**|Yes|
|**파라미터**|필수 파라미터: 각 `stage`의 이름|
|**위치**|`stages` block|

### steps  

`steps`는 각각의 `stage` 안에서 실행될 것들을 묶는 블럭입니다.  

|**필수**|Yes|
|**파라미터**|None|
|**위치**|`stage` block|

### post  

post는 `pipeline` 또는 각각의 `stage`가 실행된 후 **조건에 따라 실행되는 블록**입니다.  
|**필수**|No|
|**조건**|`always`, `changed`, `fixed`, `regression`, `aborted`, `failure`, `success`, `unstable`, `unsuccessful`, `cleanup`|
|**위치**|`pipeline` block, `stage` block|

([**공식문서 참고**](https://www.jenkins.io/doc/book/pipeline/syntax/#post){:target="_blank"})  

## Directives

### environment   

환경변수를 지정하기 위한 키-밸류 쌍입니다.  

|**필수**|None|
|**파라미터**|None|
|**위치**|`pipeline` block, `stage` block|

### options  

파이프라인 또는 각 스테이지별로 옵션을 제공합니다. 다양한 종류의 옵션이 있습니다.  

- newContainerPerStage: `docker`, `dockerfile` agent 사용시 가능한 옵션. 각 스테이지마다 새로운 컨테이너 생성
- retry: 파이프라인이 실패할 때 다시 실행  
- timeout: 제한된 시간 동안만 실행되도록 제한

이 밖에 많은 옵션들이 있습니다.  

[[**공식문서 참고**]](https://www.jenkins.io/doc/book/pipeline/syntax/#options)  


|**필수**|No|
|**파라미터**|None|
|**위치**|`pipeline` block, `stage` block|

### parameters  

파이프라인을 실행할 때 유저가 파라미터를 줄 수 있도록 합니다.  

|**필수**|No|
|**파라미터**|`string`, `text`, `booleanParam`, `choice`, `password`|
|**위치**|`pipeline` block|

```
pipeline {
    agent any
    parameters {
        string(name: 'PERSON', defaultValue: 'Mr Jenkins', description: 'Who should I say hello to?')

        text(name: 'BIOGRAPHY', defaultValue: '', description: 'Enter some information about the person')

        booleanParam(name: 'TOGGLE', defaultValue: true, description: 'Toggle this value')

        choice(name: 'CHOICE', choices: ['One', 'Two', 'Three'], description: 'Pick something')

        password(name: 'PASSWORD', defaultValue: 'SECRET', description: 'Enter a password')
    }
    stages {
        stage('Example') {
            steps {
                echo "Hello ${params.PERSON}"

                echo "Biography: ${params.BIOGRAPHY}"

                echo "Toggle: ${params.TOGGLE}"

                echo "Choice: ${params.CHOICE}"

                echo "Password: ${params.PASSWORD}"
            }
        }
    }
}
```

### triggers

파이프라인을 어떤 기준으로 자동화할지 정하는 옵션입니다. 소스코드가 Github 또는 BitBucket이라면  `triggers`가 필요하지 않을 수 있습니다. 현재 Jenkins에서 제공하는 `triggers`는 `cron`, `pollSCM`, `upstream`이 있습니다.  

|**필수**|No|
|**파라미터**|`cron`, `pollSCM`, `upstream`|
|**위치**|`pipeline` block|

### tools

파이프라인 내에서 빌드할 때 필요한 도구들을 참조합니다.  

|**필수**|No|
|**파라미터**|None|
|**위치**|`pipeline` bloc, `stage` block|

### when  

각각의 스테이지를 실행할지를 설정하는 조건입니다.  

|**필수**|No|
|**파라미터**|`branch`, `buildingTag`, `environment`, `equals`, `expression`, `tag`, `not`, `allOf`, `anyOf` 등|
|**위치**|`stage` block|

```
pipeline {
    agent any
    stages {
        stage('Example Build') {
            steps {
                echo 'Hello World'
            }
        }
        stage('Example Deploy') {
            when {
                branch 'production'
            }
            steps {
                echo 'Deploying'
            }
        }
    }
}
```

```
pipeline {
    agent any
    stages {
        stage('Example Build') {
            steps {
                echo 'Hello World'
            }
        }
        stage('Example Deploy') {
            when {
                allOf {
                    branch 'production'
                    environment name: 'DEPLOY_TO', value: 'production'
                }
            }
            steps {
                echo 'Deploying'
            }
        }
    }
}
```

```
    agent any
    stages {
        stage('Example Build') {
            steps {
                echo 'Hello World'
            }
        }
        stage('Example Deploy') {
            when {
                expression { BRANCH_NAME ==~ /(production|staging)/ }
                anyOf {
                    environment name: 'DEPLOY_TO', value: 'production'
                    environment name: 'DEPLOY_TO', value: 'staging'
                }
            }
            steps {
                echo 'Deploying'
            }
        }
    }
}
```

# 참고
- [Jenkins 공식문서: Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/){:target="_blank"}
- [SeungHyeon, [Jenkins] # 선언적(Declarative) 파이프라인](https://velog.io/@seunghyeon/Jenkins-선언적Declarative-파이프라인#when--branch-name-){:target="_blank"}