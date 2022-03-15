---
layout: post
title:  'Terraform Series [Part2]: HCL 코드를 이용한 인프라 관리'
description: 이번 포스트에서는 인프라 관리를 위한 테라폼 코드를 작성하기 위해 알아두면 좋은 몇 가지 구성 요소에 대해 알아보도록 하겠습니다.  
date:   2022-03-10 15:01:35 +0300
image:  '/images/tf_3.png'
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

# HCL 코드  

이번 포스트에서는 인프라 관리를 위한 테라폼 코드를 작성하기 위해 알아두면 좋은 몇 가지 구성 요소에 대해 알아보도록 하겠습니다.  

테라폼 언어는 선언적입니다. 또한 각각의 코드가 목표에 도달하기 위한 단계를 의미하는 것이 아니기 때문에 순서는 크게 중요하지 않습니다. 테라폼은 오직 resource들의 관계만을 고려해 실행 순서를 정합니다.  

테라폼 코드는 큰 틀에서 몇 가지 Block으로 이루어져 있습니다.

```
<BLOCK TYPE> "<BLOCK LABEL>" "<BLOCK LABEL>" {
  # Block body
  <IDENTIFIER> = <EXPRESSION> # Argument
}
```

```terraform
resource "aws_vpc" "main" {
  cidr_block = var.base_cidr_block
}
```

# Block   

블록은 resource와 같은 오브젝트를 나타내기 위해 필요한 설정값을 담고 있습니다. 블록의 종류에는 크게 `provider`,  `resource`, `data`, `variables`, `output`, `locals`, `module`이 있습니다. 테라폼 코드는 이러한 블록들로 구성되어 있다고 생각해도 무방합니다.  

## Provider

- 인프라를 제공해주는 주체가 누구인지 설정하는 블럭
- 예: Local, AWS, Azure, GCP 등 
- provider를 설정하고 나면 해당 provider 플러그인을 설치하고 필요한 API를 사용할 수 있음
- [https://registry.terraform.io/browse/providers](https://registry.terraform.io/browse/providers){:target="_blank"} 참고

```terraform
provider "aws" {
  region     = "us-west-2"
  access_key = "my-access-key"
  secret_key = "my-secret-key"
}
```

## Resource
- 테라폼 코드에서 가장 중요한 블럭
- 각각의 resource 블럭은 인프라스트럭처 오브젝트를 나타냄(컴퓨팅, 스토리지, 네트워크 등)
- 각각의 resource 종류마다 설정하는 인자값 다르므로 [**공식 문서**](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance#argument-reference){:target="_blank"} 참고
  - 예: `aws_network_interface`의 경우 `subnet_id`, `private_ips` 등이 있고 `aws_instance`에는 `ami`, `instance_type` 등이 있음
- resource의 속성값을 다른 resource에서 참조할 수도 있음  
  - 예: `network_interface_id = aws_network_interface.foo.id`

```terraform
resource "aws_network_interface" "foo" {
  subnet_id   = aws_subnet.my_subnet.id
  private_ips = ["172.16.10.100"]

  tags = {
    Name = "primary_network_interface"
  }
}

resource "aws_instance" "foo" {
  ami           = "ami-005e54dee72cc1d00" # us-west-2
  instance_type = "t2.micro"

  network_interface {
    network_interface_id = aws_network_interface.foo.id
    device_index         = 0
  }

  credit_specification {
    cpu_credits = "unlimited"
  }
}
```

## Data

- 테라폼 코드 외부에서 설정된 값을 코드로 가져오고 싶은 경우
- 아래의 예시와 같이 filter, most_recent 와 같은 인자값은 data source마다 달라서 문서 참조해야함
  - ![](/images/tf_3.png)  
  - 예를 들어 아래와 같이 `aws_ami` source를 사용하는 경우 다음의 [**공식문서 참고**](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/ami#argument-reference){:target="_blank"}
- resource 블럭과 같은 곳에서 사용하고자 할 때는 `data.\<data source>.\<name>.\<attribute>`
  - 예: `data.aws_ami.web.id`
  - data source별로 속성도 당연히 다르다 [**공식문서 참고**](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/ami#attributes-reference){:target="_blank"}




```terraform
# AWS AMI 중 state가 available 이고 Component 태그가 web인 것 중 가장 최근 AMI
data "aws_ami" "web" {
  # filter에 어떤 설정할 수 있는지는 https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html 참고 (테라폼 공식문서에 링크 다 명시해놨음)
  filter {
    name   = "state"
    values = ["available"]
  }

  filter {
    name   = "tag:Component"
    values = ["web"]
  }

  most_recent = true
}

# 필터링 거쳐서 얻은 AMI의 id를 사용한다
resource "aws_instance" "web" {
  ami           = data.aws_ami.web.id
  instance_type = "t1.micro"
}

```

## Variables
- Variables는 테라폼 코드를 실행할 때에 파라미터로 값을 동적으로 넘겨줄 수 있도록 함
- 인자값에는 `default`, `type`, `description`, `validation`, `sensitive`, `nullable가` 있음 ([**공식문서 참고**](https://www.terraform.io/language/values/variables#arguments){:target="_blank"})
- 값을 넘겨주는 방법은 다음과 같음
  - 테라폼 명령어 사용시 `-var` 옵션 사용하기
    - terraform apply -var="image_id=ami-abc123"
    - terraform apply -var='image_id_list=["ami-abc123","ami-def456"]' -var="instance_type=t2.micro"
    -  apply -var='image_id_map={"us-east-1":"ami-abc123","us-east-2":"ami-def456"}'
  - `.tfvars` 파일에 정의하기
    ```
    # testing.tfvars
    image_id = "ami-abc123"
    availability_zone_names = [
    "us-east-1a",
    "us-west-1c",
    ]
    ```  
    ```
    # CLI
    terraform apply -var-file="testing.tfvars"
    ```
  - 환경변수로 설정하기
    ```
    export TF_VAR_image_id=ami-abc123
    ```

```terraform
variable "user_information" {
  type = object({
    name    = string
    address = string
  })
  sensitive = true
}

resource "some_resource" "a" {
  name    = var.user_information.name
  address = var.user_information.address
}


```


## Output

- 프로그래밍 언어에서 return과 비슷한 역할을 하는 블럭
- 그냥 print하는 정도의 역할인가?
- 필수 인자값에는 value가 있고, 옵셔널 인자값에는 `description`, `sensitive`, `depends_on이` 있다

```terraform
output "instance_ip_addr" {
  value = aws_instance.server.private_ip
}


```

## Locals

- 반복적인 표현을 줄이고자 할 때 유용한 블럭

```terraform
locals {
  service_name = "forum"
  owner        = "Community Team"
}

locals {
  # Common tags to be assigned to all resources
  common_tags = {
    Service = local.service_name
    Owner   = local.owner
  }
}

resource "aws_instance" "example" {
  # ...

  tags = local.common_tags
}
```

## Module

- 여러 개의 resource의 묶음  
- 반복적으로 함께 사용되는 resource들을 묶어서 사용할 수 있음
- 사용자들이 미리 만들어 공유해놓은 Module들이 있다 ([공식문서 참고](https://registry.terraform.io/browse/modules?provider=aws){:target="_blank"})

```terraform
# AWS VPC module
module "vpc" {
  # <NAMESPACE>/<NAME>/<PROVIDER>
  source = "terraform-aws-modules/vpc/aws"

  name = "my-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  enable_vpn_gateway = true

  tags = {
    Terraform = "true"
    Environment = "dev"
  }
}
```

# 참고 
- [Terraform 공식문서](https://www.terraform.io/language){:target="_blank"}
