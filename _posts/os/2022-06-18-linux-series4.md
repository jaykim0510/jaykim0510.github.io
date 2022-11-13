---
layout: post
title:  'Linux Series [Part4]: 리눅스 쉘 스크립트'
description: 
date:   2022-06-18 15:01:35 +0300
image:  '/images/linux_logo.png'
logo_image:  '/images/linux_logo.png'
categories: computer_science
tags: OS
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}
---

# 변수

- 대부분의 쉘 프로그램은 변수의 타입을 미리 선언하지 않아도됨
- 변수를 사용하는 방법에는 `$var`, `${var}`, `"$var"`, `"${var}"` 방법이 있음
- 문자열 안에서는 `$var`, 또는 `${var}`로 사용 (ex. `echo "var is $var"`)
- (참고로 문자열 안에 변수를 쓰고 싶으면 무조건 쌍따옴표로 감싼다. 홑따옴표는 안에 다 문자열로 인식)
- 조건문 안에 변수를 쓸 때는 쌍따옴표로 감싸는 것이 안전 -> `"$var"`, `"${var}"` (ex. `[[ "$var" -eq 10 ]]` )
- `declare -i var` -> var 변수에 정수만 오도록 타입 지정, `-a`는 배열

```sh
#!/bin/zsh

var_1="Hello var_1"

int_1=1

echo $var_1
echo ${var_1}
echo "$var_1"
echo "${var_1}"
echo $int_1
------------------------------
Hello var_1
Hello var_1
Hello var_1
Hello var_1
1
```

## Local variable

- 함수내에서만 사용하고 싶은 변수는 앞에 `local` 붙여준다

```sh
export
```

```sh
#!/bin/zsh

function test1()
{
	x=123
	echo "x is $x"
}


function test2()
{
	local y=345
	echo "y is $y"
}

test1
test2


if [ -n "$x" ]; then
	echo "x(=$x) is not local variable"
else
	echo "x is local variable"
fi

if [ -n "$y" ]; then
	echo "y(=$y) is not local variable"
else
	echo "y is local variable"
fi
-------------------
x is 123
y is 345
x(=123) is not local variable
y is local variable
```

## Environment variable

- 쉘 프로그램 전체에서 인식하는 변수
- 환경 변수 선언 방법: `export ENV_A=123`
- 쉘 프로그램을 실행할 때마다 환경 변수로 적용하고 싶다면, 
  - `~/.zshrc` 또는 `~/.bashrc` 스크립트에 export 구문 추가
  - (`~/.zshrc` 또는 `~/.bashrc` 스크립트는 쉘 프로그램 시작할 때 자동으로 실행되는 스크립트)
  - (쉘 프로그램 시작하면 내부적으로 자동으로 `source ~/.zshrc` 를 실행)
- 환경 변수에서 삭제하고 싶으면 `unset ENV_A`
- env 명령어 입력하면 쉘 프로그램에 정의된 모든 환경 변수를 볼 수 있음

```sh
# env_variable_set.sh
#!/bin/zsh

export ENV_A=123
export ENV_B=234
```

```sh
# env_variable.sh 
#!/bin/zsh

function test1()
{
	echo "environment variable ENV_A is $ENV_A"
}

source ~/shell_script_test_folder/env_variable_set.sh
test1

unset ENV_A
test1
------------------------------------------------------
environment variable ENV_A is 123
environment variable ENV_A is 
```

## Positional variable

- 함수에 아규먼트 전달한 것처럼, 스크립트도 실행할 때 아규먼트 전달 가능

## Special variable

- $0: 호출된 스크립트 이름
- $#: 파라미터의 개수
- $*: 파라미터 전체를 하나의 word로 취급
- $@: 파라미터 전체를 각각의 word로 취급
- $?: exit status
- $$: shell의 PID

```sh
#!/bin/zsh

echo "The file name is $0"
echo "The number of parameters is $#"
echo "The parameters are $*"
echo "The PID is $$"

for arg in $@
do
	echo "arg is $arg"
done
-------------------------------------------
The file name is ./special_variable.sh
The number of parameters is 0
The parameters are
The PID is 86466
```

# 조건문

- 조건문은 [ 조건문 ], [[ 조건문 ]], (( 조건문 )) 방식으로 표현 (조건문 앞뒤로 무조건 띄어쓰기 해야함)
- 끝나면 fi 붙여줘야함
- 조건문 안에서 변수는 쌍따옴표 붙여주는 것이 가장 안전 -> ex. if [[ "$var" -eq 10 ]];

```
if [ 조건문 ]; then
    명령문
elif
    명령문
else
    명령문
fi
```

## 조건문에 들어가는 대상이 숫자인 경우

- -eq, -ne, -gt, -ge, -lt, -le
- ex. [ "$var" -ne 0 ]

```sh
#!/bin/zsh

a=123
b=123

if [ $a -eq $b ]; then
	echo "a is ${b}"
else
	echo " a is not ${b}"
fi
-----------------------------
a is 123
```

## 조건문에 들어가는 대상이 문자열인 경우

- ==, !=, >, <, -z, -n
- \>, < 쓸 때는 이중괄호 써야함 (괄호 하나만 써도 되긴 하는데 그러려면 \\\> 이런식으로 써야함)
- -z: is null
- -n: is not null
- ex. [[ "$var" > "ABC" ]]
- ex. [[ -z "$var" ]]

```sh
#!/bin/zsh

a=""
b="DEF"

if [[ "$a" < "$b" ]]; then
	echo "a=$a < b=$b"
else
	echo "a=$a > b=$b"
fi


if [ -z "$a" ]; then
	echo "a=$a is null"
else
	echo "a=$a is not null"
fi
------------------------------
a= < b=DEF
a= is null
```

## 조건문에 논리 연산자를 추가할 경우

- -a (and), -o (or) 를 두 조건문 사이에 넣는 방법
- [ 조건문 ] && [ 조건문 ], [ 조건문 ] \|\| [ 조건문 ]
- [[ 조건문 && 조건문 ]], [[ 조건문 \|\| 조건문 ]] 

```sh
#!/bin/zsh

a=123
b=234
c=345

if [ "$a" -gt "$b" -a "$a" -gt "$c" ]; then
	echo "a=$a is max"
elif [ "$b" -gt  "$a" ] && [ "$b" -gt "$c" ]; then
	echo "b=$b is max"
elif [[ "$c" -gt "$a" && "$c" -gt "$b" ]]; then
	echo "c=$c is max"
fi
------------------------------------------------------
c=345 is max
```

## 조건문에 파일 속성이 들어가는 경우

- -e: 파일이 존재하는지
- -d: 디렉토리인지
- -r: 읽기가 허용되는지
- -w: 쓰기가 허용되는지
- -x: 실행이 허용되는지

```sh
#!/bin/zsh

file="/etc/passwd"

if [ -e "$file" ]; then
	echo "$file file exists"
else
	echo "$file file not exists"
fi

if [ -d "$file" ]; then
	echo "$file is directory"
else
	echo "$file is not directory"
fi

if [ -r "$file" ]; then
	echo "$file can be read"
fi

if [ -w "$file" ]; then
	echo "$file can be written"
fi

if [ -x "$file" ]; then
	echo "$file can be executed"
fi
----------------------------------------
/etc/passwd file exists
/etc/passwd is not directory
/etc/passwd can be read
```

# 반복문

## for

- 반복될 값이 변수로 표현된 경우 쌍따옴표를 붙이면 안됨 (붙이면 안에 원소가 하나씩 안 뽑히고 통째로 뽑아냄)

```
for ...
do
    ...
done
```

```sh
#!/bin/zsh

COLORS=(red yellow green blue)

for color in $COLORS
do
	echo "color is $color"
done

echo "--------------------------------"


for i in {0..10..2}
do
	echo "index is $i"
done

echo "--------------------------------"

for ((i=0; i <= 5; i++))
do
	echo "index is $i"
done

echo "-------------------------------"

x=10

((x+=10))
echo "$x"

echo "-------------------------------"

let "x+=100"
echo "$x"
------------------------------------------------
color is red
color is yellow
color is green
color is blue
--------------------------------
index is 0
index is 2
index is 4
index is 6
index is 8
index is 10
--------------------------------
index is 0
index is 1
index is 2
index is 3
index is 4
index is 5
-------------------------------
20
-------------------------------
120
```

## while

```sh
#!/bin/zsh

i=0

while [ "$i" -le 10 ]
do
	if [ "$i" -eq 4 ]; then
		echo "I hate $i"
		((i++))
		continue
	fi

	echo "i is $i"

	if [ "$i" -eq 7 ]; then
		break
	fi

	let 'i++'
	
done
------------------------------
i is 0
i is 1
i is 2
i is 3
I hate 4
i is 5
i is 6
i is 7
```

# 함수

- 함수는 인자를 받을 수도 있음. 함수 안에서 인자는 `$1`, `$2`, ..., `${10}` 과 같은 변수를 이용해 사용함
- return 문으로는 숫자만 리턴 가능. 0을 리턴하는 것을 제대로 실행한 것으로 간주

```sh
#!/bin/zsh

function test1()
{
	echo "This is test1 function"
}


function test2()
{
	x="$1"
	echo "This is test2 function"
	echo "I got argument $x"
}


function test3()
{
	echo "This is test3 function"
	return 1
}


test1
test2 200
test3

if [ "$?" -eq 0 ]; then
	echo "test3 function is Success"
else
	echo "test 3 function is Fail"
fi
------------------------------------------
This is test1 function
This is test2 function
I got argument 200
This is test3 function
test3 function is Fail
```