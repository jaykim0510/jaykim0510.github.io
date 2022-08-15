---
layout: post
title:  'AWS Series [Part6]: AWS Security Service: IAM'
description: 
date:   2022-06-21 15:01:35 +0300
image:  '/images/aws_logo.png'
logo_image:  '/images/aws_logo.png'
categories: Cloud
tags: AWS
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# AWS Security

- AWS Security services assist you in safeguarding sensitive data and information while also meeting compliance and confidentiality standards
- AWS enables you to automate tedious security processes so you can concentrate on growing and innovating your company. Furthermore, you only pay for the services you utilize

# Security의 종류

- AWS IAM, AWS GuardDuty, AWS Macie, AWS Config, AWS CloudTrail

# IAM

- Identity and Access Management
- IAM safeguards accesses to AWS services and resources and to create and manage AWS users and groups and use permissions to grant or deny access to AWS services


# IAM 동작 원리

- Principal
  - A User or a role can be a principal
  - An action on AWS resource can be performed by a principal
  - (AWS 서비스에 접근하려는 주체)
- Authentication
  - It is a process of confirming identity of the principal who is trying to access an AWS product
  - To authenticate from console, you must provide your credentials or required keys
  - (어떤 주체에게 AWS 서비스에 접근 가능하도록 권한을 주려면 필요한 키를 주체에게 주어야 한다)
- Request
  - When a principal attempts to access the AWS Console, API or CLI, he sends a request to AWS
  - (주체가 이제 접근을 한다)
- Authorizatioin
  - Here IAM uses information from the request context to check for matching policies
  - IAM determine whether to allow or deny the request
  - (IAM은 주체가 가지고 있는 키를 이용해 접근 가능한 주체인지 확인한다)
- Actions
  - After authorization of the request, AWS approves the action
  - Using this, you can either edit, or delete or even create a resource
  - (주체의 자격을 검증하고 나면 주체는 본인이 가진 권한만큼 리소스에 접근(생성, 수정, 삭제 등)할 수 있다)
- Resources
  - Resource perform a set of requested actions

![](/images/aws_iam_1.png)

![](/images/aws_iam_2.png)

# IAM 구성요소

## User
- AWS users are AWS entities that represent the person or application that interacts with AWS
- IAM users have a name and credentials which are formed when you gave them
- The root users of an AWS account is not the same as an IAM user with administrator access

## Group
- A set of IAM users is referred to as an IAM user group
- User groups allow you to specify permissions for many users, making it easier to manage those user's permissions
- In a resource-based policy, a user goup can't be desinated as a Principal. A user group is a technique to apply policies to ao group of people all at once

## Role
- An IAM role is an identity with permission policies that govern what the identity can and cannot do
- There are no long-term credentials connected with a role. Instead, when you take on a role, you're given temporary security credentials for the duration of your role sesion (Role은 Session -> 유효 기간 있음)


## Policy
- Policies are created and linked to IAM identities(user, group, role) or AWS resource
- A policy is an object that defines the rights of an identity or resource
- Most policies are saved as JSON documents

### Policy JSON Fromat
- [AWS 공식문서 참고](https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/reference_policies_elements.html){:target="_blank"}

- Identity based Policy
  - example
    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [
            "s3.*",
            "s3-object-lambda:*"
          ],
          "Resource": "*",
          "Condition": {}
        }
      ]
    }
    ```

- Resource based Policy
  - example
    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        { 
          "Sid": "Statement1",
          "Effect": "Allow",
          "Principal": {
            "AWS": "Identity, ex. arn:aws:iam::1111111:root"
          },
          "Action": [
            "s3.*",
            "s3-object-lambda:*"
          ],
          "Resource": "*",
          "Condition": {}
        }
      ]
    }
    ```

- Version
  - 정책의 처리에 사용할 언어 구문 규칙을 지정
  - example
    ```
    "Version": "2012-10-17" // 정책 언어의 현재 버전
    "Version": "2008-10-17" // 이전 정책 언어 버전
    ```

- Sid
  - 선택사항
  - 정책 문에 입력되는 식별자를 제공
  - `Sid` 값은 JSON 정책 내 고유성이 보장되어야함
  - ASCII 대문자(A~Z), 소문자(a~z) 및 숫자(0~9)를 지원합니다.
  - example
    ```
    "Sid": "1"
    "Sid": "Statement1"
    ```

- Effect 
  - 필수값
  - example
    ```
    "Effect": "Allow"
    "Effect": "Deny"
    ```

- Action
  - 필수값
  - 허용 또는 거부할 작업 지정
  - 서비스 네임스페이스를 작업 접두사(iam, ec2, sqs, sns, s3 등)로 사용
  - 작업 이름을 사용하여 값을 지정
    - (이름은 서비스에서 지원되는 작업과 일치해야함)
    - (작업 목록은 각 서비스별 Doc의 Actions에 있음)
  - example
    ```
    "Action": "ec2:StartInstances"
    "Action": "s3:GetObject"
    "Action": [ "sqs:SendMessage", "sqs:ReceiveMessage", "iam:ChangePassword", "s3:GetObject" ]
    "Action": "s3:*"
    "Action": "iam:*AccessKey*"
    ```

- Resource
  - 어떤 서비스에 접근할 것인지 지정
  - example
    ```
    "Resource": "arn:aws:s3:::DOC-EXAMPLE-BUCKET/*/test/*"
    "Resource": [
                    "arn:aws:dynamodb:us-east-2:account-ID-without-hyphens:table/books_table",
                    "arn:aws:dynamodb:us-east-2:account-ID-without-hyphens:table/magazines_table"
                ]
    ```

- Condition
  - 정책의 효력이 발생하는 시점에 대한 조건을 지정
  - example
    ```
    "Condition" : { "StringEquals" : { "aws:username" : "johndoe" }}
    "Condition": {"StringLike": {"s3:prefix": ["janedoe/*"]}}
    ```


# 참고

- [Youtube Simplilearn: AWS S3 Tutorial](https://www.youtube.com/watch?v=oaZ3R4NCRu8&t=1870s){:target="_blank"}