---
layout: post
title:  '[Javascript]: 데이터 타입'
description: 이웅모님의 모던 자바스크립트 Deep Dive 책을 읽고 정리한 내용이다
date:   2024-01-17 15:01:35 +0300
image:  '/images/js_logo.png'
logo_image: '/images/js_logo.png'
category: language
tag: javascript
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 데이터 타입

- 원시 타입(Primitive): 숫자, 문자열, 불리언, undefined, null, Symbol
- 객체 타입(Object): 객체, 함수, 배열 등 원시 타입이 아닌 모든 타입

## 숫자 타입

- ECMAScript 사양에 따르면 숫자 타입의 값은 64비트 부동소수점 형식을 따른다
- 즉 모든 수를 실수로 처리하며, 정수만 표현하기 위한 데이터 타입이 별도로 존재하지 않는다
- 숫자 타입은 추가적으로 세 가지 특별한 값도 표현할 수 있다 (`Infinity`, `-Infinity`, `NaN`)

### Number 생성자 함수

- `Number`는 표준 빌트인 객체 중 하나로, 원시 타입인 숫자를 다룰 때 유용한 프로퍼티와 메서드를 제공한다
- `Number` 객체는 생성자 함수 객체다. 따라서 `new` 연산자와 함께 호출하여 `Number` 인스턴스를 생성할 수 있다

```js
// Number 래퍼 객체 생성
const numObj = new Number() // Number {[[PrimitiveValue]]: 0}
const numObj = new Number(10) // Number {[[PrimitiveValue]]: 10}

// new 연산자 없이 호출하면, 리터럴 숫자 생성
Number(0) // 0
Number(-1) // -1
Number('10.5') // 10.5
```

### Number 프로퍼티

```js
Number.EPSILON
Number.MAX_VALUE // 1.7976931348623157e+308
Number.MIN_VALUE // 5e-324
Number.POSITIVE_INFINITY // Infinity
Number.NEGATIVE_INFINITY // -Infinity
Number.NaN
```

### Number 메서드

#### Number.isFinite

#### Number.isInteger

#### Number.isNaN

#### Number.prototype.toExponential

#### Number.prototype.toFixed

#### Number.prototype.toPrecision

#### Number.prototype.toString

### Math 프로퍼티

```js
Math.PI
```

### Math 메서드

#### Math.abs

#### Math.round

#### Math.ceil

#### Math.floor

#### Math.sqrt

#### Math.random

#### Math.pow

#### Math.max

#### Math.min

## 문자열 타입

- 일반 문자열: 쌍따옴표(") 또는 작은 따옴표(') 사용
- 템플릿 문자열: 백틱(`) 사용

- 템플릿 문자열을 사용하면, 여러 줄에 걸쳐서 나오는 문자열을 있는 그대로 저장할 수 있다 (탭, 줄바꿈 등 모두 반영된다)
- 또 템플릿 문자열을 사용하면 표현식을 삽입할 수 있다
- 일반 문자열은 탭, 줄바꿈 등을 표현하려면 이스케이프 시퀀스를 사용해야 한다
- (백슬래쉬 하나인데, 하나만 하면 Jekyll Search가 안되서 두 개로 표기)
  - `\\0`: Null
  - `\\b`: 백스페이스
  - `\\t`: 탭
  - `\\'`: 작은 따옴표
  - ...


### String 생성자 함수

- 표준 빌트인 객체인 String은 원시 타입인 문자열을 다룰 때 유용한 프로퍼티와 메서드를 제공한다
- String 객체는 생성자 함수 객체다. 따라서 `new` 연산자와  함게 호출하여 String 인스턴스를 생성할 수 있다
- String 래퍼 객체는 배열과 마찬가지로 length 프로퍼티와 인덱스를 나타내는 숫자 형식의 문자열을 프로퍼티 키로, 각 문자를 프로퍼티 값으로 갖는 유사 배열 객체이면서 이터러블이다. 따라서 배열과 유사하게 인덱스를 사용해 각 문자에 접근할 수 있다
- `new` 연산자를 사용하지 않고 String 생성자 함수를 호출하면, 인스턴스가 아닌 문자열을 반환한다. 이를 이용해 명시적으로 타입을 변환하기도 한다

```js
const apple = new String('apple') // [String: 'apple']

const numericStrObj = new String(123) // [String: '123']

const numericStr = String(123) // "123"
const booleanStr = String(true) // "true"
const infinityStr = String(Infinity) // "Infinity"
```

### String 메서드

- String 메서드는 언제나 새로운 문자열을 반환한다
- 문자열은 변경 불가능한 원시 값이기 때문에, String 래퍼 객체도 읽기 전용 객체로 제공된다

#### String.prototype.indexOf

- 배열과 마찬가지로 문자열도 indexOf 메서드가 있다

```js
const str = 'Hello World'

str.indexOf('l') // 2
str.indexOf('lo') // 3
str.indexOf('z') // -1
```

#### String.prototype.search

- 인수로 전달받은 정규 표현식과 매치되는 문자열을 검색하여 일치하는 문자열의 인덱스를 반환한다

```js
const str = 'Hello World'

str.search(/o/) // 4
str.search(/x/) // -1
```

#### String.prototype.includes

- 인수로 전달받은 문자열이 포함되어 있는지 확인하여 그 결과를 `true` 또는 `false`로 반환한다

```js
const str = 'Hello World'

str.includes('o') // true
str.includes('o ') // true
str.includes('orl') // true
str.includes('o', 8) // false
str.includes('zz') // false
```

#### String.prototype.startsWith

- 인수로 전달받은 문자열로 시작하는지 확인하여 그 결과를 `true` 또는 `false`로 반환한다

```js
const str = 'Hello World'

str.startsWith('H') // true
str.startsWith('W') // false
str.startsWith('W', 6) // true
```

#### String.prototype.endsWith

- 인수로 전달받은 문자열로 끝나는지 확인하여 그 결과를 `true` 또는 `false`로 반환한다

```js
const str = 'Hello World'

str.endsWith('d') // true
str.endsWith('o') // false
str.endsWith('o', 5) // true
```

#### String.prototype.charAt

- 인수로 전달받은 인덱스에 위치한 문자를 검색해 반환한다
- 인덱스가 문자열의 범위를 벗어난 경우 빈 문자열을 반환한다

```js
const str = 'Hello World'

str.charAt(4) // 'o'
str.charAt(5) // ' '
str.charAt(100) // ''
```

#### String.prototype.substring

- 인수로 전달받은 인덱스에 위치하는 부분 문자열을 반환한다
- 두 번째 인수를 생략할 수 있다
- 0보다 작은 값을 인수로 받으면 0으로 취급된다
- `str.length` 보다 큰 값을 인수로 받으면 `str.length`로 취급된다


```js
const str ='Hello World'

str.substring(1, 4) // 'ell'
str.substring(1) // 'ello World'
str.substring(-10, 1) // 'H'
str.substring(0, 100) // 'Hello World'
```

#### String.prototype.slice

- 배열과 마찬가지로 slice 메서드를 제공한다
- substring과 동일하게 동작한다

```js
const str = 'Hello World'

str.slice(1, 4) // 'ell'
```

#### String.prototype.toUppserCase

- 대상 문자열을 모두 대문자로 변경한 문자열을 반환한다

```js
const str = 'Hello World!'

str.toUpperCase() // 'HELLO WORLD!'
```


#### String.prototype.toLowerCase

- 대상 문자열을 모두 소문자로 변경한 문자열을 반환한다

```js
const str = 'Hello World!'

str.toUpperCase() // 'hello world!'
```


#### String.prototype.trim

- 문자열 앞뒤에 공백 문자를 제거한 문자열을 반환한다

```js
const str = '  foo   '

str.trim() // 'foo'
str.trimStart() // 'foo   '
str.trimEnd() // '   foo'
```

#### String.prototype.repeat

- 대상 문자열을 인수로 전달받은 정수만큼 반복해 연결한 문자열을 반환한다

```js
'abc'.repeat(2) // 'abcabc'
```

#### String.prototype.replace

- 첫 번째 인수로 전달받은 문자열 또는 정규 표현식을 검색해, 두 번째 인수로 전달한 문자열로 치환한 문자열을 반환한다
- `$&` 로 검색된 문자열을 재사용할 수 있다

```js
const str = 'Hello World'

str.replace('World', 'Javascript') // 'Hello Javascript'
str.replace('World', 'Beautiful $&') // 'Hello Beautiful World'
str.replace(/hello/gi, 'Goodbye') // 'Goodbye World'
```

#### String.prototype.split

- 인수로 전달한 구분자를 기준으로 문자열을 분리해 배열로 반환한다
- 빈 문자열, 문자열, 정규 표현식을 구분자로 사용할 수 있다

```js
const str = 'Hello Beautiful World!'

str.split('') // ['H', 'e', 'l', 'l', 'o', ' ', 'B', 'e', 'a', 'u', 't', 'i', 'f', 'u', 'l', ' ', 'W', 'o', 'r', 'l', 'd', '!']
str.split(' ') // ['Hello', 'Beautiful', 'World!']
str.split('o') // ['Hell', ' Beautiful W', 'rld!']
str.split(/\s/) // ['Hello', 'Beautiful', 'World!']
```


## 배열

- 배열은 여러 개의 값을 순차적으로 나열한 자료구조이다
- 배열은 동일한 크기의 메모리 공간이 연속적으로 나열된 자료구조를 말한다
- 즉 배열의 요소는 하나의 데이터 타입으로 통일되어 있으며 서로 연속적으로 인접해 있다
- 인덱스를 통해 단 한 번의 연산으로 임의의 요소에 접근할 수 있다
- 하지만 배열의 특정 값을 찾거나, 삽입, 삭제하는 연산은 비교적 느리다
- 자바스크립트의 배열은 위에서 말한 일반적인 의미의 배열과 다르다
- 즉 자바스크립트의 배열은 각 요소가 차지하는 메모리 크기가 다를 수 있고, 연속적으로 이어져 있지 않을 수도 있다

### 자바스크립트 배열

- 자바스크립트에 배열이라는 타입은 존재하지 않는다. 배열은 객체 타입이다
- 자바스크립트의 배열은 배열의 동작을 흉내 낸 특수한 형태의 객체이다
- 자바스크립트의 모든 값은 배열의 요소가 될 수 있다 (원시값, 객체, 함수, 배열 등)
- 자바스크립트의 배열은 해시 테이블로 구현된 객체이다

- 배열은 인덱스와 `length` 프로퍼티를 갖기 때문에 for문을 통해 순차적으로 요소에 접근할 수 있다

```js
const arr = ['apple', 'banana', 'orange']

for (let i = 0; i < arr.length; i++) {
  console.log(arr[i])
}
```


### 배열 생성

- 배열은 생성하는 방법에는 배열 리터럴, `Array` 생성자 함수, `Array.of`, `Array.from` 메서드가 있다
- 배열의 프로토타입 객체는 `Array.prototype` 이며, `Array.prototype`은 배열을 위한 빌트인 메서드를 제공한다

- 배열 리터럴이 가장 일반적인 방법이다
- `Array.from`은 유사 배열 객체 또는 이터러블 객체를 배열로 변환해 반환해 준다
- `Array.from`은 두 번째 인수로 콜백 함수를 전달해, 첫 번째 인수로 전달된 배열의 요소 값과 인덱스를 순차적으로 전달하면서 콜백 함수의 반환값으로 구성된 배열을 반환한다

```js
// 유사 배열 객체를 배열로 변환해 반환
Array.from({ length: 2, 0: 'a', 1: 'b' }) // ['a', 'b']

// 문자열 이터러블을 배열로 변환해 반환
Array.from('Hello') // ['H', 'e', 'l', 'l', 'o']
```

```js
const sequences = Array.from(new Array(3), (_, i) => i)

sequences // [0, 1, 2]
```

- 유사 배열 객체는 마치 배열처럼 인덱스로 프로퍼티 값에 접근할 수 있고 `length` 프로퍼티를 갖는 객체를 말한다

```js
const arrayLike = {
  '0': 'apple',
  '1': 'banana',
  length: 2
}
```

- 이터러블 객체는 Symbol.iterator 메서드를 구현하여, for...of 문으로 순회할 수 있으며, 스프레드 문법과 배열 디스트럭처링 할당의 대상으로 사용할 수 있는 객체를 말한다. ES6에서 제공하는 빌트인 이터러블은 Array, String, Map, Set, DOM 컬렉션, arguments 등이 있다

### 배열 요소의 참조/추가/수정/삭제

- 배열 요소 참조할 때는 대괄호([]) 표기법을 사용한다
- 존재하지 않는 요소에 접근하면 `undefined`가 반환된다

```js
const arr = [10, 20]

arr[0] // 10

arr[2] // undefined
```

- 존재하지 않는 인덱스를 사용해 값을 할당하면 새로운 요소가 추가된다

```js
const arr = [0, 1]

arr[2] = 5

arr // [0, 1, 5]
```

- 배열의 length 프로퍼티 값보다 큰 인덱스로 요소를 추가하면 희소 배열이 된다

```js
arr[100] = 100

arr // [0, 1, 5, empty * 97, 100]
arr.length // 101
```

- 이미 요소가 존재하는 인덱스에 값을 재할당하면 새로운 값으로 갱신된다

```js
arr[1] = 10
```

- 인덱스는 0 이상의 정수 (또는 정수 형태의 문자열)를 사용해야 한다
- 이 외의 값 사용하면 프로퍼티가 생성된다. 프로퍼티는 `length` 프로퍼티 값에 영향을 주지 않는다

```js
const arr = []

arr[0] = 1
arr['1'] = 2

arr['foo'] = 3
arr.bar = 4
arr[1.1] = 5
arr[-1] = 6

arr // [1, 2, foo: 3, bar: 4, '1.1': 5, '-1': 6]
arr.length // 2
```

- 배열의 특정 요소를 삭제하려면 `Array.prototype.splice` 메서드를 사용하면 된다
- `Array.prototype.splice(삭제를 시작할 인덱스, 삭제할 요소 수)`

```js
const arr = [1, 2, 3]

arr.splice(1, 1)

arr // [1, 3]
arr.length // 2
```

### 배열 메서드

- 배열 메서드는 원본 배열을 직접 변경하는 메서드와,
- 원본 배열은 변경하지 않고 새로운 배열을 생성하여 반환하는 메서드가 있다

#### isArray

- 전달된 인수가 배열이면 `true`, 배열이 아니면 `false`를 반환한다

```js
Array.isArray([]) // true
Array.isArray([1, 2]) // true
Array.isArray(new Array()) // true
```

#### indexOf

- 인수로 전달된 요소를 검색해 인덱스를 반환한다
- 배열안에 요소가 여러 개 있다면 첫 번째로 검색된 요소의 인덱스를 반환한다
- 요소가 존재하지 않으면 -1을 반환한다
- 두 번째 인수로 검색을 시작할 인덱스를 정할 수도 있다

```js
const arr = [1, 2, 2, 3]

arr.indexOf(2) // 1
arr.indexOf(4) // -1
arr.indexOf(2, 2) // 2
```

- 배열 안에 요소가 있는지 확인할 때 유용하다

```js
const foods = ['apple', 'orange', 'banana']

// orange의 인덱스를 찾는 것 보다, orange가 있는지 확인하는데 주 목적을 가진다
if (foods.indexOf('orange') === -1) {}
```

- ES7 에서 도입된 `Array.prototype.includes` 메서드를 사용하면 가독성이 더 좋다

```js
if (foods.includes('orange')) {}
```

#### push

- 인수로 전달받은 모든 값을 원본 배열의 마지막 요소로 추가하고, `length` 프로퍼티 값을 반환한다
- 원본 배열을 직접 변경한다

```js
const arr = [1, 2]

let result = arr.push(3, 4)

console.log(result) // 4
console.log(arr) // [1, 2, 3, 4]
```

- 요소 하나만 추가하는 경우, `arr[arr.length] = 10` 이 방법이 `arr.push(10)` 보다 성능이 뛰어나다
- 만약 원본 배열은 건드리지 않고, 요소를 추가한 새로운 배열을 만들고 싶은 경우 스프레드 문법을 사용하면 된다

```js
const newArr = [ ...arr, 10 ]
```

#### pop

- 마지막 요소를 제거하고 제거한 요소를 반환한다
- 빈 배열이면 `undefined`를 반환한다
- 원본 배열을 변경한다

#### unshift

- `push`가 뒤에 요소를 추가한다면, `unshift`는 맨 앞에 인수로 받은 값을 요소로 추가한다

```js
const arr = [1, 2]

let result = arr.unshift(3, 4)

console.log(result) // 4
console.log(arr) // [3, 4, 1, 2]
```

- 원본 배열을 변경하기 때문에, 원치 않으면 스프레드 문법을 사용하면 된다

```js
const newArr = [3, 4, ...arr]
```

#### shift

- `pop`이 마지막 요소를 제거한다면, `shift`는 첫 번째 요소를 제거하고 제거한 요소를 반환한다

<br>

- `push`는 맨 뒤 요소 추가, `pop`은 맨 뒤 요소 제거
- `unshift`는 맨 앞 요소 추가, `shift`는 맨 앞 요소 제거


#### concat

- 뒤에 인수로 받은 값을 요소로 추가해, 새로운 배열을 반환한다

```js
const arr = [1, 2]

arr.concat([3, 4]) // [1, 2, 3, 4]

arr.concat([3, 4], 5) // [1, 2, 3, 4, 5]

arr.concat(3) // [1, 2, 3]
```

- 결론은 `push`, `unshift`, `concat` 보다, 스프레드 문법을 일관성 있게 사용하는 것이 가장 좋다


#### splice

- 중간에 요소를 추가/제거 할 때 사용한다
- 원본 배열을 변경한다
- 인수로 (`start`, `deleteCount`, `items`)를 받는다. `start`는 필수이고, 나머지는 유무에 따라 `splice`의 기능이 달라진다
- start
  - 요소를 제거하기 시작할 인덱스
  - 음수인 경우 배열 끝에서의 인덱스를 나타낸다 (-1: 맨 끝 요소의 인덱스)
  - start만 지정하면, start 인덱스부터 끝 요소까지 제거한다
- deleteCount
  - start부터 제거할 요소의 개수
  - 0이면 아무런 요소도 제거하지 않는다
- items
  - 추가할 요소들의 목록이다
  - 3, 4, 5 이런 식으로 여러 요소 나타낼 수 있다
  - 생략할 경우 요소들을 제거하기만 한다

```js
const arr = [1, 2, 3, 4]

// 인덱스 1에서 시작해, 2개의 요소를 제거하고, 그 자리에 20, 30을 추가한다
const result = arr.splice(1, 2, 20, 30)

result // [2, 3]
arr // [1, 20, 30, 4]
```

```js
const result = arr.splice(1, 0, 100)

result // []
arr // [1, 100, 2, 3, 4]
```

```js
const result = arr.splice(1, 1)

result // 2
arr // [1, 3, 4]
```

```js
const result = arr.splice(1)

result // [2, 3, 4]
arr // [1]
```

- `filter` 이용해서 특정 요소들을 제거할 수도 있다

```js
const arr = [1, 2, 3, 1, 2]

const result = arr.filter(v => v !== 2)

result // [1, 3, 1]
```

#### slice

- 인수로 전달된 범위의 요소들을 복사하여 배열로 반환한다
- 원본 배열은 변경되지 않는다
- `Array.prototype.slice(start, end)` (end는 옵션)
- `arr.slice()` 는 얕은 복사를 한다 (`[ ...arr ]`. `Object.assign({}, arr)` 도 얕은 복사이다)

```js
const arr = [1, 2, 3]

arr.slice(0, 1) // [1]
arr // [1, 2, 3]
```

```js
arr.slice(1) // [2, 3]
arr.slice(-1) // [3]
arr.slice(-2) // [2, 3]
arr.slice() // [1, 2, 3]
```

```js
const todos = [
  { id: 1, content: 'HTML', completed: false },
  { id: 2, content: 'CSS', completed: true },
  { id: 3, content: 'Javascript', completed: false },
]

const _todos = todos.slice()

// 얕은 복사는 한 단계 까지만 복사하고, 중첩된 객체는 서로 공유된다

todos === _todos // false
todos[0] === _todos[0] // true
```

#### join

```js
const arr = [1, 2, 3, 4]

arr.join() // '1,2,3,4'
arr.join('') // '1234'
arr.join(':') // '1:2:3:4'

```

#### reverse

- 배열의 순서를 뒤집는다
- 원본 배열이 변경된다

```js
const arr = [1, 2, 3]

const result = arr.reverse() 

result // [3, 2, 1]
arr // [3, 2, 1]
```

#### fill

- 인수로 받은 값으로 배열 안의 요소를 바꾼다
- 원본 배열을 변경한다
- `Array.prototype.fill(value, start, end)`

```js
const arr = [1, 2, 3, 4, 5]

arr.fill(0) // [0, 0, 0, 0, 0]

arr.fill(0, 1) // [1, 0, 0, 0, 0]

arr.fill(0, 1, 3) // [1, 0, 0, 4, 5]
```

#### includes

- 배열 내에 특정 요소가 포함되어 있는지 확인하여 `true` 또는 `false`를 반환한다
- `Array.prototype.includes(value, start)` (start는 옵션)

```js
const arr = [1, 2, 3]

arr.includes(2) // true

arr.includes(100) // false
```

#### flat

- 배열을 재귀적으로 평탄화한다
- `Array.prototype.flat(depth)` (depth의 기본값은 1)

```js
[1, [2, 3, 4, 5]].flat() // [1, 2, 3, 4, 5]

[1, [2, 3, 4, [5]]].flat() // [1, 2, 3, 4, [5]]

[1, [2, 3, 4, [5]]].flat(2) // [1, 2, 3, 4, 5]

[1, [2, [3, [4, [5]]]]].flat(Infinity) // [1, 2, 3, 4, 5]
```

#### sort

- 배열의 요소를 정렬한다
- 원본 배열을 변경하며, 변경된 원본 배열을 반환한다
- 기본적으로 오름차순으로 정렬한다

```js
const fruits = ['Banana', 'Orange', 'Apple']

fruits.sort()

fruits // ['Apple', 'Banana', 'Orange']
```

```js
fruits.sort().reverse() // 내림차순 정렬
```

- sort 메서드의 기본 정렬 순서는 유니코드 코드 포인트의 순서를 따른다
- 요소가 숫자 타입이라 할지라도, 일시적으로 문자열로 변환한 후 유니코드 코드 포인트의 순서를 기준으로 정렬한다

```js
[2, 10].sort() // [10, 2]
```

- 따라서 숫자 요소를 정렬할 때는, sort 메서드에 정렬 순서를 정의하는 비교 함수를 인수로 전달해야 한다
- 비교 함수의 반환값이 0보다 작으면, 첫 번째 인수를 우선하여 정렬
- 0보다 크면 두 번째 인수를 우선하여 정렬
- 0이면 그대로 둔다

```js
// a - b < 0 이면 첫 번째 인수를 우선 --> a < b 이면 a를 우선 --> 오름차순
sort((a, b) => a - b)

// b - a < 0 이면 첫 번째 인수를 우선 --> b > a 이면 b를 우선 --> 내림차순
sort((a, b) => b - a)
```

- 문자열도 위와 같이 비교 함수를 사용해 정렬할 수 있다

```js
// 오름차순으로 하고 싶은 경우
// a > b 일 때, 오름차순이므로 b가 앞으로 오도록 --> 두 번째 인수가 우선 되도록 --> 양수 --> 1
// a < b 일 때, 오름차순이므로 a가 앞으로 오도록 --> 첫 번째 인수가 우선 되도록 --> 음수 --> -1
sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
```

#### forEach

- 배열을 순회하면서 콜백 함수를 반복 호출한다
- 콜백 함수는 요소값, 인덱스, 배열 자체를 전달 받을 수 있다

```js
[1, 2, 3].forEach((item, index, arr) => {
  console.log(item, index, arr)
})
```

- `forEach` 메서드는 원본 배열을 변경하지 않는다. 
- (하지만 콜백 함수의 세 번째 매개변수 `arr`을 직접 변경하면 원본 배열을 변경할 수 있다)
- `forEach` 메서드의 반환값은 언제나 `undefined`다

```js
const numbers = [1, 2, 3]

const result = numbers.forEach((item, idx, arr) => { arr[idx] = item ** 2 })

result // undefined
numbers // [1, 4, 9]
```

- `forEach` 메서드는 for문과 달리 `break`, `continue` 문을 사용할 수 없다 -> 모든 요소를 순회해야 한다
- 성능보다는 가독성이 중요한 경우 `forEach`를 사용하면 좋다

#### map

- 배열의 모든 요소를 순회하면서 콜백 함수를 반복 호출한다
- 쿨백 함수의 반환값들로 구성된 새로운 배열을 반환한다
- 원본 배열을 변경하지 않는다

```js
const newArr = [1, 2, 3].map((item, index, arr) => item ** 2)

newArr // [1, 4, 9]
```

#### filter

- 배열의 모든 요소를 순회하면서 콜백 함수를 반복 호출한다
- 콜백 함수의 반환값이 `true`인 요소로만 구성된 새로운 배열을 반환한다

```js
const numbers = [1, 2, 3, 4, 5]

const odds = numbers.filter((item, index, arr) => item % 2)
```

#### reduce

- 배열의 모든 요소를 순회하면서 콜백 함수를 반복 호출한다
- 그리고 콜백 함수의 반환값을 **다음 순회 시에 콜백 함수의 첫 번째 인수로 전달**하면서 콜백 함수를 호출해 하나의 결과값을 만들어 반환한다
- reduce 메서드는 2개의 인수 (콜백 함수와, 초기값)를 전달 받는다
- 콜백 함수에는 4개의 인수 (이전 반환값, 요소값, 인덱스, 배열)가 전달 된다

```js
// 첫 accumulator 에는 초기값으로 전달한 0이 들어간다
const sum = [1, 2, 3, 4].reduce((acc, cur, idx, arr) => acc + cur, 0)
```

#### some

- 배열의 모든 요소를 순회하면서 콜백 함수를 반복 호출한다
- 콜백 함수의 반환값이 한 번이라도 참이면 `true`, 모두 거짓이면 `false`를 반환한다

#### every

- 배열의 모든 요소를 순회하면서 콜백 함수를 반복 호출한다
- 콜백 함수의 반환값이 모두 참이면 `true`, 하나라도 거짓이면 `false`를 반환한다


#### find

- 배열의 모든 요소를 순회하며 콜백 함수를 반복 호출한다
- 콜백 함수의 반환값이 `true`인 첫 번째 요소를 반환한다

#### findIndex

- 배열의 모든 요소를 순회하며 콜백 함수를 반복 호출한다
- 콜백 함수의 반환값이 `true`인 첫 번째 요소의 인덱스를 반환한다

## Set과 Map

### Set

- Set 객체는 중복되지 않는 유일한 값들의 집합이다
- 집합은 요소들의 순서가 없고, 인덱스로 접근할 수 없다
- 이터러블을 인수로 받는다

```js
const set = new Set()

const set = new Set([1, 2, 3, 3])
set // Set(3) {1, 2, 3}

set.size // 3
```

```js
const set = new Set()

set.add(1)

set.add(2).add(3)
```

```js
const set = new Set()

set.add(1)
   .add('a')
   .add(true)
   .add(undefined)
   .add(null)
   .add({})
   .add([])
   .add(() => {})
```

```js
const set = new Set([1, 2, 3])

set.has(2) // true
set.has(4) // false
```

```js
cont set = new Set([1, 2, 3])

set.delete(2)

set // Set(2) { 1, 3 }

set.delete(0)

set // Set(2) { 1, 3 }
```

```js
const set = new Set([1, 2, 3])

set.clear()
```

```js
const set = new Set([1, 2, 3])

// Set 객체는 forEach 메서드를 갖는다
set.forEach((v, _, set) => console.log(v, set)) // 두 번째 인수는 첫 번째 인수와 같다. 배열의 forEach와 인터페이스 통일을 위해서일 뿐 의미는 없다


// Set 객체는 이터러블이기 때문에 for문으로 순회할 수 있다
for (let value of set) {
  console.log(value)
}


// 스프레드와 디스트럭처링을 이용해 배열로 만들 수 있다
[ ...set ]
```

### Map

- Map 객체는 키와 값의 쌍으로 이루어진 컬렉션이다
- 인수로 이터러블을 전달할 수 있으며, 이 때 이터러블의 요소는, 키와 값의 쌍으로 이루어져야 한다
- Map 객체는 키 타입에 제한이 없다 (일반 객체는 문자열 또는 심벌 값만 키로 사용할 수 있다)
- Set과 마찬가지로 `has`, `delete`, `clear` 메서드를 가진다

```js
const map = new Map([['k1', 'v1'], ['k2', 'v2']])

map.size // 2
```

```js
const map = new Map()

map.set('k1', 'v1')

map.get('k1')
```

```js
map.keys()
map.values()
map.entries()
```


## 날짜

- 표준 빌트인 객체인 Date는 날짜와 시간(연, 월, 일, 시, 분, 초, 밀리초)을 위한 메서드를 제공한다
- UTC는 국제 표준시를 말한다 (UTC와 GMT는 굉장히 작은 차이이기 때문에 혼용되어 사용된다)
- KST는 UTC에 9시간을 더한 시간이다 (즉, KST는 UTC보다 9시간 빠르다)
- 현재 날짜와 시간은 자바스크립트 코드가 실행된 시스템의 시계에 의해 결정된다

### Date 생성자 함수

- Date 생성자 함수로 생성된 Date 객체는 1970년 1월 1일 0시를 기점으로부터 경과된 ms초 정수값을 가진다
- Date 생성자 함수로 객체를 생성하는 방법에는 다음과 같이 4가지가 있다

```js
// Date 객체를 반환한다; 내부적으로 날짜와 시간을 나타내는 정수값을 갖지만 콘솔에 출력하면 기본적으로 날짜와 시간 정보를 출력한다

new Date() // 2024-05-31T21:41:42.769Z

// new 연산자 없이 호출하면 객체를 반환하지 않고 문자열을 반환한다

Date() // 'Sat Jun 01 2024 06:41:56 GMT+0900 (대한민국 표준시)'
```

```js
// 1970년 1월 1일 0시를 기점으로 경과된 ms 초를 인수로 넣으면 해당 날짜와 시간을 나타내는 객체를 생성한다

new Date(365 * 24 * 60 * 60 * 1000) // 1971-01-01T00:00:00.000Z
```

```js
// Date.parse 메서드가 해석 가능한 날짜와 시간을 나타내는 문자열을 인수로 넣으면 이에 해당하는 Date 객체를 반환한다

new Date('May 26, 2020 10:00:00') //2020-05-26T01:00:00.000Z
new Date('2020/03/26/10:00:00') // 2020-03-26T01:00:00.000Z
new Date('2024-03-12 18:00:00') // 2024-03-12T09:00:00.000Z
```

```js
// 연, 월, 일, 시, 분, 초, 밀리초를 인수로 전달하면 이에 해당하는 Date 객체를 반환한다
// 연, 월은 필수이고, 나머지는 지정하지 않으면 0 또는 1로 초기화된다

new Date(2020, 2) //2020-02-29T15:00:00.000Z
new Date(2020, 2, 26, 10, 00, 00, 0) //2020-03-26T01:00:00.000Z
```

### Date 메서드

#### Date.now

- 1970년 1월 1일 0시(UTC)를 기점으로 현재 시간까지 경과한 밀리초를 숫자로 반환한다

```js
const now = Date.now()

now // 1717244473632

new Date(now) // 2024-06-01T12:22:27.087Z
```

#### Date.parse

- 1970년 1월 1일 0시(UTC)를 기점으로 인수로 전달된 시간까지 경과한 밀리초를 숫자로 반환한다
- 인수로 전달된 시간이 기본적으로 로컬 타임으로 인식된다

```js
Date.parse()
Date.parse('2024/05/05') 1714834800000
Date.parse('2024-05-05 12:00:00') // 1714878000000
Date.parse('Jan 2, 1970 00:00:00') //54000000

Date.parse('2024-05-05 12:00:00 UTC') // 1714910400000
```

#### Date.UTC

- 인수로 전달된 시간까지 경과한 밀리초를 숫자로 반환한다
- 인수로 전달된 시간이 항상 UTC로 인식된다
- (년, 월[, 일, 시, 분, 초, 밀리초]) 형태로 인수를 전달해야 한다

```js
Date.UTC(2024, 6) // 1719792000000

Date.UTC(2024, 0, 20, 1, 10, 50) // 1705713050000 (month는 0이 1월을 나타낸다)
```

#### 현재 로컬 시간 문자열

```js
// new Date() 자체가 반환하는 문자열은 UTC
// get 메서드로 얻은 날짜/시간은 로컬 타임 (한국은 KST)

const now = new Date() // 2024-06-01T12:41:17.819Z

const year = now.getFullYear() // 2024
const month = now.getMonth() + 1 // 6 (month는 0부터 시작함)
const day = now.getDate() // 1

const hour = now.getHours() // 21
const minutes = now.getMinutes() // 41
const seconds = now.getSeconds() // 17

now.toString() // 'Sat Jun 01 2024 21:41:17 GMT+0900 (대한민국 표준시)'

now.toDateString() // 'Sat Jun 01 2024'

now.toTimeString() // '21:41:17 GMT+0900 (대한민국 표준시)'

now.toISOString() // '2024-06-01T12:41:17.000Z' // UTC 기준 시간 반환

now.toLocaleString() // '2024. 6. 1. 오후 9:41:17' // 해당 로컬 사람들에게 익숙한(?) 형태로 반환
now.toLocaleString('ko-KR') // '2024. 6. 1. 오후 9:41:17'
now.toLocaleString('en-US') // '6/1/2024, 9:41:17 PM'

now.toLocaleTimeString() // '오후 9:41:17'
```

#### Date.prototype.getTime

- 1970년 1월 1일 0시를 기점으로 경과된 밀리초를 반환한다

```js
const date = new Date('2024-05-01')
date.getTime() // 1714521600000


Date.parse('2024-05-01') // 1714521600000
```

#### Date.prototype.getTimezoneOffset

- UTC와 Date 객체에 지정된 로컬 시간과의 차이를 분 단위로 반환한다
- KST는 UTC에 9시간을 더한 시간이다

```js
const today = new Date()

today.getTimezoneOffset() / 60 // -9
```
