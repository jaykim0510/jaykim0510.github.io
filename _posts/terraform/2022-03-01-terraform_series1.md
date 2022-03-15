---
layout: post
title:  'Terraform Series [Part1]: What is Terraform?'
description: 테라폼을 통해 인프라 구성에 필요한 파일, 리소스 등을 코드로 정의하여 인프라를 프로비저닝하고 관리할 수 있습니다.
date:   2022-03-01 15:01:35 +0300
image:  '/images/tf_1.png'
logo_image:  '/images/terraform_logo.jpg'
categories:   devops
tags: Terraform
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Terraform

> HashiCorp Terraform is an infrastructure as code tool that lets you define both cloud and on-prem resources in human-readable configuration files that you can version, reuse, and share.  

![](/images/tf_1.png)

테라폼은 하시코프에서 오픈소스로 개발 중인 IaC 툴입니다. 테라폼을 통해 인프라 구성에 필요한 파일, 리소스 등을 코드로 정의하여 일관된 워크플로우를 사용해 전체 라이프사이클에 걸쳐 인프라를 프로비저닝하고 관리할 수 있습니다. 쉽게 말해 원하는 인프라를 코드로 작성할 수 있다는 말입니다. 테라폼은 컴퓨팅, 스토리지, 네트워킹 리소스와 같은 저수준의 구성 요소뿐만 아니라 DNS 및 SaaS 기능과 같은 고수준의 구성 요소를 관리할 수도 있습니다.  

🦊 **프로비저닝**  
어떤 프로세스나 서비스를 실행하기 위한 준비 단계를 프로비저닝이라고 이야기합니다. 프로비저닝에는 크게 네트워크나 컴퓨팅 자원을 준비하는 작업과 준비된 컴퓨팅 자원에 사이트 패키지나 애플리케이션 의존성을 준비하는 단계로 나뉘어집니다. 명확한 경계는 불분명하지만 테라폼은 전자를 주로 다루는 도구입니다. ([**44bits: 테라폼(Terraform) 기초 튜토리얼 참고**](https://www.44bits.io/ko/post/terraform_introduction_infrastrucute_as_code))


# 인프라를 코드로 관리
인프라(컴퓨팅, 스토리지, 네트워킹)를 구성하기 위해 그저 테라폼 코드만 작성하면 된다는 것은 굉장히 편하게 느껴집니다. 제가 AWS를 맛보기로 사용해 봤을 때의 기억으로는 인프라를 구성하기 위해 EC2, S3, VPC 등 AWS 내에서 많은 서비스들을 왔다갔다 하면서 클릭을 했어야 했는데 이제 이러한 작업들을 할 필요 없어진다는 점이 굉장히 편할 것 같습니다. 인프라를 코드로 관리하게 되면 얻게 되는 이점에 대해 한 번 정리해보면 다음과 같은 것들이 있을 것 같습니다.  

- 인프라를 언제 어디서든 일관되게 구성할 수 있다.  
- 인프라 관리를 위한 협업을 코드로 할 수 있다.  
- 인프라를 버전 컨트롤 할 수 있다.  
- 인프라도 지속적 통합/지속적 배포가 가능해진다.  

# 테라폼 코드  
테라폼 코드는 어떻게 생겼길래 인프라를 관리할 수 있는 걸까요? 테라폼 코드 생김새를 한 번 구경하도록 하겠습니다.  

```terraform
# main.tf

provider "aws" {
  region = "ap-northeast-2"
}

resource "aws_vpc" "myvpc" {
  cidr_block = "10.0.0.0/16"
}
```

`provider`를 통해 인프라를 제공해주는 주체를 정할 수 있습니다. `provider`는 나의 컴퓨터인 local이 될 수도 있고, `aws`, `gcp`, `azure와` 같은 클라우드 서비스가 될 수도 있습니다.  

`resource`를 이용해 내가 생성하고자 하는 인프라를 설정할 수 있습니다. 위에서는 `aws_vpc`를 생성했습니다.  

위의 코드를 일반적으로 나타내면 다음과 같습니다.  

```
<BLOCK TYPE> "<BLOCK LABEL>" "<BLOCK LABEL>" {
  <IDENTIFIER> = <EXPRESSION>
}
```

# State Driven Workflow Engine

1. It will parse our HCL configuration/code files.
2. Using the information in our HCL, Terraform will build up a graph of all the resources we want to provision (desired state) and figure out any dependencies between them to try and decide a logical order they need to be created in.
3. Terraform will next inspect its State to better understand what it has and hasn’t deployed (if it is our first deployment, the State will be empty). This is known as perceived state. It is perceived state because there is a disconnect between what Terraform “thinks” exists and what “actually” exists.
4. Terraform next performs a logical delta between our desired state, and what it knows to be our perceived state. It then decides which CRUD actions it needs to perform, and the order to perform them in, in order to bring our perceived state in-line with our desired state.
5. Terraform next performs all necessary operations to achieve the desired state. The result of this operation will be that resources will likely start to appear in our Azure subscription and this then becomes known as actual state.
6. Terraform updates the state to reflect what it has done.

![](/images/tf_2.png)

# 좋은 글귀  
**Terraform in a nutshell**  
In its most basic form, Terraform is an application that converts configuration files known as HCL (Hashicorp Configuration Language) into real world infrastructure, usually in Cloud providers such as AWS, Azure or Google Cloud Platform.  

This concept of taking configuration files and converting them into real resources is known as IaC (Infrastructure as Code) and is the new hotness in the world of Software Engineering. And the reason it is becoming so hot right now, is because this code can live alongside your app code in repos, be version controlled and easily integrated into your CI/CD pipelines.  

간단히 말해 Terraform은 상태 기반 클라우드 플랫폼 프로비저닝 엔진입니다. 또한 추상화 툴링(provider and backend)을 활용하여 일관성 있고 결정론적인 클라우드 프로바이더별 CRUD API 호출로 해석 및 번역할 수 있는 코드를 작성할 수 있으므로 많은 업무와 스트레스가 제거됩니다.

AWS의 CloudFormation  

# 참고  

- [44bits: 테라폼(Terraform) 기초 튜토리얼](https://www.44bits.io/ko/post/terraform_introduction_infrastrucute_as_code){:target="_blank"}
- [C:\Dave\Storey, Terraform For Beginners](https://itnext.io/terraform-for-beginners-dd8701c1ebdd){:target="_blank"}
- [Jayendra's Cloud Certification Blog: Terraform Cheat Sheet](https://jayendrapatil.com/terraform-cheat-sheet/){:target="_blank"}
