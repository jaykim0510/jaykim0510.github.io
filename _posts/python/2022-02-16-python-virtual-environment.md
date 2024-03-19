---
layout: post
title:  'Python Advanced Series [Part4]: 파이썬 가상환경'
description: 
date:   2022-02-16 15:01:35 +0300
image:  '/images/python_advanced_logo.png'
logo_image: '/images/python_advanced_logo.png'
category: language
tag: python
---
---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

- pyenv 와 venv를 활용해 파이썬 가상환경 관리하기

# 파이썬 버전 우선순위

![](/images/py_vir_0.png)

```
- pyenv local: 디렉터리 단위로 지정되는 파이썬 버전
- pyenv global: 디렉터리에 지정된 local 버전이 없는 경우 지정되는 파이썬 버전
- system python: venv 도구가 관리하지 않는 로컬에 설치된 파이썬 버전
```

- pyenv는 ~/.pyenv 디렉터리에 버전별로 파이썬 패키지를 관리하고 있다

![](/images/py_vir_1.png)

- version 파일은 global 버전을 나타낸다

![](/images/py_vir_2.png)

- versions 디렉터리에 버전별로 파이썬 패키지가 저장돼있다

![](/images/py_vir_3.png)


# 파이썬 가상환경 만들기

- 프로젝트별로 만들고 싶은 경우 
  - (ex. 이미지 분류 프로젝트, 음성 인식 프로젝트 등)
  - 프로젝트 디렉토리마다 가상환경을 만든다
- 용도별로 만들고 싶은 경우
  - (ex. 딥러닝 목적, 데이터 분석 목적, 웹개발 목적 등)
  - 별도의 디렉터리에 가상환경들을 모아둔다
    ![](/images/pyenv_5.png)

## 프로젝트별로 만드는 경우

- 프로젝트 디렉터리를 만든다
- 현재 global은 3.8.13 이고 해당 디렉터리에 local은 아직 지정되지 않았다
  ![](/images/py_vir_4.png)
- 해당 프로젝트에서 파이썬 버전으로 3.9.1을 쓴다고 해보자
  ```sh
  pyenv install 3.9.1
  ```
- 해당 프로젝트 폴더에서 local 로 3.9.1을 지정하자
  ![](/images/py_vir_6.png)
- 이제 파이썬 3.9.1 버전을 바탕으로 가상환경을 하나 만들자 
- (보통 프로젝트별로 가상환경을 만들 때는 가상 환경 이름을 .venv로 만드는게 관례다)
  ```
  python3 -m venv <원하는 가상환경 이름>
  ```
  ![](/images/py_vir_7.png)
- 가상환경을 사용하려면 활성화 해야 한다
  ```sh
  source ./.venv/bin/activate
  ```
  ![](/images/py_vir_8.png)
- 가상환경으로 접속됐는지 확인해보자 (activate된 경우 해당 가상환경 폴더 출력. deactivate된 경우 출력 안함)
  ```sh
  echo $VIRTUAL_ENV
  ```
  ![](/images/py_vir_9.png)
- 이제 가상환경에 원하는 라이브러리를 설치해보자
  ```sh
  pip3 install pandas
  ```
  ![](/images/py_vir_10.png)
- 가상환경을 비활성화(deactivate) 시키면 가상환경에서 설치했던 pandas 라이브러리가 다시 안보인다
  ![](/images/py_vir_11.png)

## 용도별로 만들고 싶은 경우

- 프로젝트별로 만드는 방법과 똑같다
- 차이는 용도별로 만들어진 가상환경은 여러 프로젝트에서 쓰일 것이므로, 조금 더 범용적인 위치에 설치해두는 것이 좋다
- 나는 홈 디렉터리(~)에 가상환경들을 위한 virtual_environments 디렉터리에 가상환경들을 만들어 뒀다
- 데이터 분석을 위한 용도로 가상환경을 한 번 만들어보자

```sh
mkdir ~/virtual_environments
cd ~/virtual_environments

mkdir data-analysis
cd data-analysis

pyenv local 3.8.13
python3 -m venv data_analysis_3.8 # 3.8 버전의 데이터 분석을 위한 가상 환경(data_analysis_3.8) 생성

source ~/virtual_environments/data_analysis/data_analysis_3.8/bin/activate

(
# 이렇게 3.8 버전을 만들고 pyenv local 3.8.13 이렇게 하는게 더 정확한 방법인 것 같음
mkdir 3.8
cd 3.8
pyenv local 3.8.13
python3 -m venv . # 3.8 버전의 데이터 분석을 위한 가상 환경(3.8) 생성

source ~/virtual_environments/data_analysis/3.8/bin/activate
)

pip3 install scikit-learn
pip3 install matplotlib
pip3 install pandas
```

![](/images/py_vir_12.png)

# 명령어 모음

```sh
# pyenv를 이용해 설치한 파이썬 버전 목록
pyenv versions

# pyenv로 설치 가능한 파이썬 버전 목록
pyenv install --list

# 원하는 버전의 파이썬 설치/삭제
pyenv install 3.8.13
pyenv uninstall 3.8.13

# global 또는 local 버전 확인
pyenv global
pyenv local

# global 또는 local 버전 설정
pyenv global 3.8.13
pyenv local 3.8.13

# local 버전 해제
pyenv local --unset
```

```sh
# 가상환경 생성
python3 -m venv <원하는 가상환경 이름>

# 가상환경 활성화
source <원하는 가상환경 디렉터리 위치>/bin/activate

# 가상환경 비활성화
deactivate

# 가상환경 확인
echo $PYENV_VERSION

# 가상환경 삭제
rm -rf <삭제하고 싶은 가상환경 디렉터리 위치>
```

# 참고 

- [SSAMKO의 개발 이야기, [python] pyenv로 원하는 파이썬 버전 설치하기](https://ssamko.tistory.com/59){:target="_blank"}
- [WINDY BAY, 파이썬 가상환경이 필요한 이유와 사용법 (venv, virtualenv)](https://windybay.net/post/13/){:target="_blank"}
- [아무튼 워라벨, 파이썬 가상환경 venv 사용하기 (패키지 쉽게 관리하기)](https://hleecaster.com/python-venv/){:target="_blank"}
- [donghh0221, [파이썬] venv 가상환경 관리법(파이썬 버젼 다운그레이드하기)](https://donghh0221.tistory.com/11){:target="_blank"}
- [공순이의 블로그, pyenv를 이용한 여러 개의 Python 버전 관리하기 + 가상 환경 만들기(ubuntu)](https://wooriel.tistory.com/54){:target="_blank"}