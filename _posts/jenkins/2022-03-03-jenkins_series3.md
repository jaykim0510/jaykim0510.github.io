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

# Sections

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

## agent

## stages

## stage

## steps

## post

# Directives

## environment  

```sh
pipeline {
    agent {}
    environment {}
    stages {
        stage {
            environment {}
            steps {}
        }
    }
    post {}
}
```

## options

```sh
pipeline {
    agent {}
    options {}
    stages {
        stage {
            options {}
            steps {}
        }
    }
    post {}
}
```

## parameters

```sh
pipeline {
    agent {}
    parameters {}
    stages {
        stage {
            steps {}
        }
    }
    post {}
}
```

## triggers

```sh
pipeline {
    agent {}
    triggers {}
    stages {
        stage {
            steps {}
        }
    }
    post {}
}
```

## tools

```sh
pipeline {
    agent {}
    tools {}
    stages {
        stage {
            tools {}
            steps {}
        }
    }
    post {}
}
```

## when

```sh
pipeline {
    agent {}
    stages {
        stage {
            when {}
            steps {}
        }
    }
    post {}
}
```

# 참고
- [Jenkins 공식문서: Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/#when){:target="_blank"}
- [SeungHyeon, [Jenkins] # 선언적(Declarative) 파이프라인](https://velog.io/@seunghyeon/Jenkins-선언적Declarative-파이프라인#when--branch-name-){:target="_blank"}