---
layout: post
title:  'Docker Series [Part1]: Dockerfile CMD vs ENTRYPOINT'
description: Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative a...
date:   2022-02-01 15:01:35 +0300
image:  '/images/docker_logo.png'
categories: devops
tags: Docker
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---
**Dockerfile instruction**

- [ ] FROM
- [ ] RUN
- [x] CMD
- [ ] LABEL
- [ ] EXPOSE
- [ ] ENV
- [ ] ADD
- [ ] COPY
- [x] ENTRYPOINT
- [ ] VOLUME
- [ ] USER
- [ ] WORKDIR
- [ ] ARG
- [ ] ONBUILD
- [ ] STOPSIGNAL
- [ ] HEALTHCHECK
- [ ] SHELL  


# CMD

CMD 명령어 작성요령은 다음과 같이 3가지 형태가 있습니다.  

- `CMD ["executable","param1","param2"]` (exec form, this is the preferred form)
- `CMD ["param1","param2"]` (as default parameters to ENTRYPOINT)
- `CMD command param1 param2` (shell form)

CMD 명령어는 오직 한 개의 명령어만 효과가 있습니다. 만약 아래와 같이 여러 번에 걸쳐서 작성하면 마지막 명령어 `CMD echo "B"`만 실행됩니다.  

```dockerfile
CMD echo "A" 
CMD echo "B" 
```  

CMD 명령어의 가장 큰 목적은 컨테이너가 실행될 때 디폴트 명령어, 또는 인자값을 주고 싶은 경우입니다. 예를 들어 설명해보겠습니다.  

- **exec form**: `CMD ["executable","param1","param2"]`

```dockerfile
# executable과 params의 조합이 하나의 디폴트
CMD ["/bin/bash", "-c", "echo", "Hello"] 

--------------
# 컨테이너를 실행할 때 별다른 명령어를 입력하지 않은 경우
docker run -it --rm <image-name>
-> Hello

# 명령어를 입력하면 CMD의 디폴트는 실행되지 않습니다
docker run -it --rm <image-name> echo "Good morning"
-> Good morning
```

참고로 **exec form**은 shell processsing을 지원하지 않습니다. 그래서 `CMD [ "echo", "$HOME" ]`은 $HOME을 대체해서 출력하지 않습니다.  

🦊**shell processing**이 필요한 경우 두 가지 방법이 있습니다.  

```dockerfile
# shell을 직접 실행한다
CMD [ "/bin/bash", "-c", "echo $HOME" ]

# shell form을 사용한다
CMD echo $HOME
```

- **only params**: `CMD ["param1","param2"]`  

이 경우에는 반드시 ENTRYPOINT 명령어를 명시해줘야 합니다. 왜냐하면 인자값만 줬을 뿐 아무런 실행 가능한 것도 표기하지 않았기 때문입니다. 이 방법은 ENTRYPOINT 명령어에 디폴트 파라미터를 제공하기 위한 것입니다.  

```dockerfile
ENTRYPOINT ["/bin/echo", "Hello"]
CMD ["world"]

--------------  
# 컨테이너를 실행할 때 디폴트 인자값 주지 않아 CMD 명령어가 실행된 경우 
docker run -it --rm <image-name>
-> Hello world

# 실행 시 인자 값을 주어 CMD 명령어가 실행되지 않은 경우
docker run -it --rm <image-name> ME
-> Hello ME
```

- **shell form**: `CMD command param1 param2` 

**shell form**을 사용하면 `command`가 `/bin/sh -c` 를 통해 실행되게 됩니다. 그래서 만약 `.py`와 같은 파이썬 파일을 실행할 때는 shell form이 아닌 **exec form**을 사용해야 합니다.   

```dockerfile
CMD echo "Hello"

--------------
docker run -it --rm <image-name>
-> Hello

docker run -it --rm <image-name> echo Bye
-> Bye
```
`CMD`는 보다시피 컨테이너 실행 시 디폴트 값을 줄 뿐 반드시 실행된다는 보장을 할 수 없다. 항상 실행을 보장하고 싶을 때에는 `ENTRYPOINT`를 사용하면 된다.  

# ENTRYPOINT

ENTRYPOINT에도 2가지 표현 방법이 있습니다.  

- **exec form**: `ENTRYPOINT ["executable", "param1", "param2"]`
- **shell form**: `ENTRYPOINT command param1 param2`  

ENTRYPOINT 명령어는 `docker run --entrypoint`을 사용하는 경우를 제외하고는 오버라이딩 되지 않고 반드시 실행된다는 특징이 있습니다. 예를 들어 만약 `docker run <image> -d` 식으로 컨테이너를 실행했다면 `-d`는 ENTRYPOINT의 **exec form** 뒤에 붙게 됩니다.  

**shell form**은 어떠한 CMD 명령어나 run 커맨드라인 인자값도 사용되지 않도록 합니다. 단점은 CMD의 경우와 마찬가지로 무조건 `/bin/sh -c`로 시작할 수 밖에 없다는 점입니다. 

ENTRYPOINT 명령어도 마지막 것만 실행됩니다.  

- **exec form**: `ENTRYPOINT ["executable", "param1", "param2"]`  

```dockerfile
FROM ubuntu
ENTRYPOINT ["/bin/echo", "Hello"]
CMD ["world"]

----------------------
# ENTRYPOINT, CMD 모두 실행
docker run -it --rm <image-name>
-> Hello world

# ENTRYPOINT, run argument 실행
docker run -it --rm <image-name> ME
-> Hello ME
```

# CMD vs ENTRYPOINT

- CMD, ENTRYPOINT 명령어는 마지막 하나만 실행된다
- CMD 명령어는 도커 컨테이너 실행할 때 디폴트 값을 주기 때문에 오버라이딩 될 수 있다
- 항상 실행되는 명령어를 원한다면 ENTRYPOINT를 사용하자
- 항상 실행되는 명령어와 오버라이딩 되는 인자를 원한다면 CMD와 ENTRYPOINT를 함께 써보자  
- CMD와 ENTRYPOINT의 조합 결과는 다음과 같다  
  ![](/images/docker_1.png)  

# 참고

- [Docker 공식문서](https://docs.docker.com/engine/reference/builder/#cmd){:target="_blank"}  
- [스뎅(thDeng)님 블로그](https://blog.leocat.kr/notes/2017/01/08/docker-run-vs-cmd-vs-entrypoint){:target="_blank"}