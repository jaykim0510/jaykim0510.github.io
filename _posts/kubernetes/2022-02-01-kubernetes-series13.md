---
layout: post
title:  'Kubernetes Series [Part13]: Helm'
description: 
date:   2022-02-01 15:01:35 +0300
image:  '/images/kubernetes_logo.png'
logo_image:  '/images/kubernetes_logo.png'
category: devops
tag: [kubernetes]
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---


# Intuition

- 쿠버네티스 오브젝트의 매니페스트 파일은 yaml,json 과 같은 정적인 형태이다
- 만약 A 어플리케이션에도 MySQL 이 필요하고, B 어플리케이션에도 MySQL이 필요하다면, 각 MySQL 오브젝트의 형태는 거의 유사하고, 레이블과 같은 요소들만 바뀔 것이다
- 이를 위해 MySQL 오브젝트 파일을 각각 따로 관리하는 것은 쿠버네티스의 매우 불편한 요소이다
- 그래서 yaml 파일을 동적으로 만들고 싶다 (매니페스트 파일 안의 값들을 변수 처리하고, 동적으로 값을 할당한다)


- Helm은 하나의 Template을 통해 yaml 파일을 동적으로 생성하게 해주는 툴
- 그리고 하나의 오픈 소스를 위해 필요한 Template을 모아 Chart라고 함
- 이러한 Chart를 개발자들이 퍼블릭 저장소에 올려두고 서로 공유함 => 필요한 오픈소스의 템플릿을 다운받아 변수만 할당해주면 빠르게 사용할 수 있음
- 그래서 Helm을 apt, pip와 같은 패키지 매니저 툴이라고도 함

- **Helm Hub (Artifact Hub)**: 원하는 Helm Chart를 검색 => 해당 Chart를 다운 받을 수 있는 Helm Chart Repository 로 안내함
- **Helm Chart Repository (Bitnami)**: 실제 Helm Chart를 저장하고 있는 저장소 (Grafana에서 Grafana Chart도 제공하지만 Bitnami라는 곳에서도 Grafana Chart 제공)

(네이버 쇼핑에서 '자켓' 이라고 검색하면 다양한 쇼핑몰에서 제공하는 '자켓' 목록이 보이는 것과 같다. 네이버 쇼핑이 Artifact Hub, 쇼핑몰이 Helm Chart Repository)

## 헬름 설치

```
brew install helm
```

```
helm version
```

## 헬름 기본 사용법

- Helm Chart를 이용하려면 우선 Chart를 가진 레포지토리가 나의 로컬 Helm에 등록돼 있어야 한다

```sh
# 레포지토리 나의 Helm 에 등록
# 레포지토리명과 URL을 매핑해둔다
helm repo add [레포지토리명] [url]
```


```sh
# 차트 배포 (쿠버네티스의 kubectl apply와 유사)
# 레포지토리명 -> URL -> 해당 URL 저장소에서 다운로드
helm install [배포명(optional)] [레포지토리명/차트명] [flags(optional)]
ex. helm install my-tomcat bitnami/tomcat --version 7.1.2

# 배포명은 따로 명시 안하면 차트에서 제공하는 배포명 사용함
helm install bitnami/tomcat --version 7.1.2 --generate-name

# 그 밖에도 다양한 형식으로 설치할 수 있음
helm install foo foo-0.1.1.tgz # 압축 파일을 이용
helm install foo path/to/foo # 디렉터리를 이용
helm install foo https://example.com/charts/foo-1.2.3.tgz # URL을 이용

# 설정값 오버라이딩 (--set이 가장 우선순위 높음)
helm install stable/mariadb -f config.yaml
helm install stable/mariadb --set a=b

```

```sh
# 차트 압축파일 다운
# 파일을 내가 커스텀해서 배포할 수 있음
helm pull [레포지토리명/차트명] [flags(optional)]
```

```sh
# 배포된 차트 관련 명령어
helm list 
helm status [배포명]
helm uninstall [배포명]
```

# Helm Chart

- 차트는 쿠버네티스 리소스와 관련된 셋을 설명하는 파일의 모음
- 차트는 특정한 디렉터리 구조를 가진 파일들로 생성

```
wordpress/            # 차트 디렉터리
  Chart.yaml          # 차트에 대한 정보를 가진 YAML 파일
  LICENSE             # 옵션: 차트의 라이센스 정보를 가진 텍스트 파일
  README.md           # 옵션: README 파일
  values.yaml         # 차트에 대한 기본 환경설정 값들
  values.schema.json  # 옵션: values.yaml 파일의 구조를 제약하는 JSON 파일
  charts/             # 이 차트에 종속된 차트들을 포함하는 디렉터리
  crds/               # 커스텀 자원에 대한 정의
  templates/          # values와 결합될 때, 유효한 쿠버네티스 manifest 파일들이 생성될 템플릿들의 디렉터리
  templates/NOTES.txt # 옵션: 간단한 사용법을 포함하는 텍스트 파일
```

```
helm create [차트명]
```

```sh
helm show values . # values.yaml
helm show chart . # Chart.yaml
helm show readme . # README.md
helm show all . # All
```

```sh
# 템플릿에 변수가 적용된 모습을 확인할 수 있음
# 배포하기 전에 확인하는 용도로 많이 사용
helm template [차트명] .
```

```sh
helm get manifest [차트명] # 배포된 매니페스트 파일 보여줌
helm get values [차트명] # -f 또는 --set 옵션으로 적용한 값들을 보여줌
helm get all [차트명] # 배포된 차트의 모든 것을 보여줌
```

## 변수 주입

- values.yaml, Chart.yaml, 템플릿 정보, 릴리즈 정보를 템플릿에 있는 변수에 할당할 수 있다
- values.yaml은 scope만 대문자, 나머지는 정의된대로 읽어오면 되고, 나머지는 항상 대문자로 시작한다

```yaml
# values.yaml
replicaCount: 1
image: 
  repository: nginx
serivce:
  type: ClusterIP
```

```yaml
# Chart.yaml
name: mychart
type: application
version: 0.1.0
```

```yaml
# deployment.yaml
kind: Deployment
metadata:
spec:
  replicas: {% raw %}{{ .Values.replicaCount }}{% endraw %}
  containers:
  - name: {% raw %}{{ .Chart.Name }}{% endraw %}

```

```yaml
# 그 밖에도 이런식으로 사용할 수 있음
{% raw %}{{ .Template.BasePath }}{% endraw %}
{% raw %}{{ .Template.Name }}{% endraw %}
{% raw %}{{ .Release.Name }}{% endraw %}
{% raw %}{{ .Release.Namespace }}{% endraw %}
```

## 사용자 정의 변수

- `_helpers.tpl`: templates 폴더에서 사용할 변수들을 정의할 수 있는 곳 (templates 폴더 안에 있는 template들이 언제든지 참조해서 사용할 수 있다)
- (`_helpers.tpl` 안에서 `define` 키워드를 사용해 선언하고, 템플릿 안에서는 `template` 또는 `include` 키워드를 이용해 참조한다)
- (`template`은 불러온 값을 파이프 라인으로 전달할 수 없지만 `include`는 불러온 값을 파이프라인으로 전달이 가능하다. 따라서 `include`는 불러온 값의 가공이 가능하기 때문에 더 사용할 것이 권장된다. )

```sh
# _helpers.tpl
{% raw %}{{- define "mychart.name" -}}{% endraw %}
MyChart
{% raw %}{{- end}}{% endraw %}
```

```yaml
# deployment.yaml
apiVersion:
kind:
metadata:
  name: {% raw %}{{ include "mychart.name" . }}{% endraw %}
```

## 로직 적용

```sh
# 함수
{% raw %}{{ [함수명] 인자1 인자2 ... }}{% endraw %}
ex. {% raw %}{{ quote .Values.name }}{% endraw %} # (quote 함수에 .Values.name 을 인자로 넣는다 => 양쪽에 쌍따옴표가 붙은 결과물 출력)
```

```sh
# 파이프라인 => 여러 함수를 쓸 때는 파이프라인 방식을 써야된다
# 함수 하나를 쓰더라도 그냥 파이프라인으로 많이 쓴다
{% raw %}{{ [인자] | [함수명] }}{% endraw %}
ex {% raw %}{{ .Values.name | quote }}{% endraw %} # .Values.name을 quote 함수의 인자로 넣는다
```

```sh
# if문
# false가 되는 예시 0, "", [], {}, Null, false
# eq(=), ne(!=), not(!), ge(>=), gt(>), le(<=), lt(<), and(&&), or(||), default, empty
{% raw %}{{- if eq .Values.dev.env "dev" }}{% endraw %}
  log: debug
{% raw %}{{- else if .Values.dev.env }}{% endraw %}
  log: {% raw %}{{ .Vlaues.dev.log }}{% endraw %}
{% raw %}{{- else }}{% endraw %}
  log: error
{% raw %}{{- end }}{% endraw %}
```

```sh
{% raw %}{{- with .Values.dev }}{% endraw %}
  env: {% raw %}{{ .env }}{% endraw %} # {% raw %}{{ .Values.dev.env }}{% endraw %}
  log: {% raw %}{{ .log }}{% endraw %} # {% raw %}{{ .Values.dev.log }}{% endraw %}
{% raw %}{{- end }}{% endraw %}
```

```sh
{% raw %}{{- range .Values.list }}{% endraw %} # [a, b, c]
- {% raw %}{{ . }}{% endraw %} # a -> b -> c
{% raw %}{{- end }}{% endraw %}
```

## 다양한 함수들

- `{% raw %}{{- .Values.data | toYaml | nindent 4 }}{% endraw %}`: 리스트 요소를 YAML 형태로 열거하고 싶을 때

```yaml
# values.yaml

data:
  - a
  - b
  - c
```

- 위의 데이터를 아래와 같이 템플릿에 주입하고 싶다

```yaml
# deployment.yaml

foo:
  bar:
    - a
    - b
    - c

```

```yaml
foo:
  bar:
    {% raw %}{{ .Values.data | toYaml }}{% endraw %} # toYaml 함수에 넣으면 리스트형 데이터를 YAML에 맞게 형변환 시켜준다
----------------------------------------------------

# 하지만 결과는 이상하게 나온다 (첫 번째 요소에만 4칸이 띄어지고, 나머지는 indent가 없다)
foo:
  bar: 
    - a
- b
- c
```

```yaml
foo:
  bar:
{% raw %}{{ .Values.data | toYaml | indent 4 }}{% endraw %} # indent 4를 넣어 각 요소에 indent 4를 넣어준다

# 결과는 올바르지만 정작 템플릿은 indent가 제대로 적용이 안되기 때문에 가독성이 떨어진다
```

```yaml
foo:
  bar:
  {% raw %}{{- .Values.data | toYaml | indent 4 }}{% endraw %} # -를 추가하면 앞에 공백문자를 없애준다
---------------------------------------------------------------------

# 앞에 공백문자 2칸 뿐만 아니라 줄바꿈도 없애버린다
foo:
  bar: - a
    - b
    - c
```

```yaml
foo:
  bar:
  {% raw %}{{- .Values.data | toYaml | nindent 4 }}{% endraw %} # 앞에 한 번 줄바꿈을 실행하고 각 요소에 indent 4를 넣어준다
------------------------------------------------

# 템플릿 indent도 보기좋게 유지하면서 원하는 결과를 얻었다
foo:
  bar:
    - a
    - b
    - c
```

- `{% raw %}{{- .Values.data | default 5 }}{% endraw %}`: `.Values.data`가 `false`이면 default 값 `5`가 나온다

- `{% raw %}{{ trim "  hello " }}{% endraw %}`: 좌우 공백문자를 제거 ("hello" 리턴)
- `{% raw %}{{ trimPrefix "-" "-hello-" }}{% endraw %}`: 왼쪽에 - 문자 제거 ("hello-" 리턴)
- `{% raw %}{{ trimSuffix "-" "-hello-" }}{% endraw %}`: 오른쪽에 - 문자 제거 ("-hello" 리턴)

- 

# 참고
