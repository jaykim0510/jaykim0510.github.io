---
layout: post
title:  '[Javascript]: 함수'
description: 이웅모님의 모던 자바스크립트 Deep Dive 책을 읽고 정리한 내용이다
date:   2024-01-22 15:01:35 +0300
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

# 함수

- 프로그래밍에서 함수는 일련의 과정을 문(statement)으로 구현하고 코드 블록으로 감싸서 하나의 실행 단위로 정의한 것이다
- 함수를 이용하면 코드의 재사용성을 높이고 가독성을 향상시킨다
- 자바스크립트에서 함수는 <span class='very__important'>호출할 수 있는 객체</span>다

## 함수 정의

- 자바스크립트에서 함수를 정의하는 방법에는 **함수 선언문**, **함수 표현식**, **Function 생성자 함수** 그리고 **화살표 함수**가 있다
  - 함수 선언문과 함수 표현식은 함수 리터럴을 통해 정의한다
  - Function 생성자 함수는 거의 사용하지 않는다 (권장하는 방식이 아니다)
  - 화살표 함수는 ES6에서 도입된 것으로 위의 방식들을 간략화한 방법이다

### 함수 리터럴

- 함수라는 객체를 표현하는 방식을 의미한다
- 숫자 리터럴은 숫자 값으로 표기해야 하고, 문자열 리터럴도 따옴표로 묶어야 되듯이, 함수 리터럴도 함수 리터럴로 인식되려면 규칙이 필요하다
- 함수 리터럴은 function 키워드, 함수 이름, 매개변수 목록, 함수 몸체로 구성된다

```js
// 기본 방식
// function 키워드, 함수 이름, 매개변수 목록, 함수 몸체
function add(x, y) {
    return x + y
}

// 매개변수 없어도 된다
function sayHello() {
    return 'Hello'
}

// 함수 이름 없어도 된다
// 하지만, 식별자에 할당해야 한다
const add = function(x, y) {
    return x + y
}
```
- 함수 리터럴은 함수 선언문 또는 함수 표현식, 이 두 가지 함수 정의에 사용된다
- 만약 함수 이름이 없다면, 무조건 함수 표현식으로 정의하는데만 사용되야 한다
  ```js
  function () { // 식별자가 필요합니다
    return 'hello'
  }

  const sayHello = function () { // 함수 표현식
    return 'hello'
  }
  ```
- 함수 이름이 있다면,
  - 값으로 평가되는 문맥인 경우, 예를 들어 변수에 할당하거나 피연산자로 사용하면 이는 **함수 표현식**으로 정의한 것이다
  - 단독으로 사용하면 이는 **함수 선언문**으로 정의한 것이다

```js
function add(x, y) { // 함수 선언문
    return x + y
}

const add = function add(x, y) { // 함수 표현식
    return x + y
}
```

### 함수 선언문

- 함수 선언문은 함수 리터럴의 이름을 생략할 수 없다
- (변수에 할당도 못하는데 함수 이름까지 없으면 함수를 식별할 수가 없으니까)
- **함수 호출은 함수 이름에 의해서가 아니라 함수 객체를 가리키는 식별자로 호출한다**
- 그래서 함수 선언문도 암묵적으로는 함수 이름과 똑같은 식별자를 자바스크립트 엔진이 생성하고, 거기에 함수 객체를 할당한다
- 이렇게 자바스크립트 엔진이 식별자를 생성해 함수 객체를 할당한 후부터 함수를 값처럼 사용할 수 있다 (일급 객체)

```js
function add(x, y) { // 함수 선언문
    return x + y
}

// 자바스크립트 엔진이 암묵적으로 아래와 같이 변경한다
const add = function add(x, y) {
    return x + y
}
```

### 함수 표현식

- 함수 표현식으로 함수를 정의하면, 자바스크립트 엔진이 별다른 과정을 거치지 않아도 값으로 사용할 수 있다
- 함수 표현식의 함수 리터럴은 함수 이름을 생략하는 것이 일반적이다 (재귀 함수의 경우에는 함수 이름 필요)

### 함수 생성 시점과 함수 호이스팅

- 함수 선언문으로 함수를 정의하면 런타임 이전에 함수 객체가 먼저 생성된다. 그리고 자바스크립트 엔진은 함수 이름과 동일한 이름으로 식별자를 암묵적으로 생성하고 생성된 함수 객체를 할당한다
- 이렇게 런타임 이전에 이미 함수 객체가 생성되어 있기 때문에, 런타임에 함수 선언문 이전부터 함수를 참조하고 호출할 수 있다
- 이를 함수 호이스팅이라고 한다

- 반면 함수 표현식은 런타임 이전에는 함수를 할당한 변수의 선언문 까지만 실행되고, 해당 변수에는 `undefined`가 할당되어 있다. 그리고 런타임에 비로소 함수 객체가 생성되어 변수에 할당된다
- 함수 표현식은 런타임에서 함수 표현식을 만났을 때 비로소 함수 객체가 할당되기 때문에 표현식 이전에 함수를 참조하고 호출할 수 없다
- 이렇게 변수 선언문만 런타임 전에 실행되고, 할당문은 런타임에 실행되는 방식을 변수 호이스팅이라 한다

- 결론적으로 함수 호이스팅은 함수를 호출하기 전에 함수를 선언해야 한다는 당연한 규칙을 위배하기 때문에 권장되지 않고, <span class='very__important'>변수 호이스팅 되는 함수 표현식으로 함수를 정의할 것을 권장한다</span>


### 화살표 함수

- 화살표 함수는 ES6에서 도입되었으며 함수를 정의할 때 `function` 키워드 대신 화살표 `=>`를 사용한다
- 화살표 함수는 항상 익명 함수로 정의한다
- 화살표 함수는 단순히 위의 정의 방법들을 단순화하기 위한 용도가 아니라, **화살표 함수만의 특징과 용도가 있다**

- 화살표 함수는 생성자 함수로 사용할 수 없다
- 기존 함수와 `this` 바인딩 방식이 다르다
- `prototype` 프로퍼티가 없다
- `arguments` 객체를 생성하지 않는다

- (중요한 부분이기 때문에 나중에 26장 공부한 후 보충한다)

<br>

- 표현만 간략한 것이 아니라 내부 동작도 기존의 함수보다 간략하다
- 특히 화살표 함수는 콜백 함수 내부에서 `this`가 전역 객체를 가리키는 문제를 해결하기 위한 대안으로 유용하다
- 화살표 함수는 선언문으로 정의할 수 없고, 함수 표현식으로 정의해야 한다

#### 화살표 함수 정의

```js
// 매개변수

const arrow = (x, y) => { ... }

const arrow = x => { ... }

const arrow = () => { ... }
```

```js
// 함수 몸체
// 함수 몸체가 하나의 표현식인 문으로 구성된다면 몸체를 감싸는 중괄호 {}를 생략할 수 있다
const power = x => x ** 2
const power = x => { return x ** 2 }

// 객체 리터럴을 반환하는 경우 객체 리터럴을 소괄호 ()로 감싸줘야 한다
const create = (id, content) => ({ id, content })

// 함수 몸체가 여러 개의 문으로 구성된다면 몸체를 감싸는 중괄호 {}를 생략할 수 없다
const sum = (a, b) => {
  const result = a + b
  return result
}
```

#### 화살표 함수와 일반 함수의 차이

- 화살표 함수는 인스턴스를 생성할 수 없는 non-constructor 이다
  - 인스턴스를 생성할 수 없으므로 prototype 프로퍼티가 없고 프로토타입도 생성하지 않는다
- 화살표 함수는 함수 자체의 `this`, `arguments`, `super`, `new.target` 바인딩을 갖지 않는다
  - 따라서 화살표 함수 내부에서 `this`, `arguments`, `super`, `new.target` 을 참조하면 스코프 체인을 통해 상위 스코프를 참조한다



#### this

- 화살표 함수가 일반 함수와 구별되는 가장 큰 특징은 `this`다
- 화살표 함수는 다른 함수의 인수로 전달되어 콜백 함수로 사용되는 경우가 많다
- 화살표 함수의 this는 일반 함수의 this와 다르게 동작한다
- 이는 "콜백 함수 내부의 this 문제", 즉 콜백 함수 내부의 this가 외부 함수의 this와 다르기 때문에 발생하는 문제를 해결하기 위해 의도적으로 설계된 것이다
- this 바인딩은 함수의 호출 방식, 즉 함수가 어떻게 호출되었는지에 따라 동적으로 결정된다
- 콜백 함수가 일반 함수로 호출되는 경우, 함수 내부의 this는 전역 객체를 가리킨다
- 화살표 함수는 함수 자체의 this 바인딩을 갖지 않는다. 따라서 화살표 함수 내부에서 this를 참조하면 상위 스코프의 this를 그대로 참조한다


```js
// 여기서 화살표 함수 내부의 this는 person을 가리키지 않고, 상위 스코프인 전역의 this가 가리키는 전역 객체를 가리킨다

const person = {
  name: 'Lee',
  sayHi: () => console.log(`Hi ${this.name}`)
}
```

```js
// 화살표 함수 말고, ES6 메서드 축약 표현으로 나타내는 것이 좋다

const person = {
  name: 'Lee',
  sayHi() { console.log(`Hi ${this.name}`) }
}
```

```js
// 클래스 필드에 할당한 화살표 함수의 상위 스코프는 클래스 외부다
// 하지만 this는 클래스 외부의 this를 참조하지 않고 클래스가 생성할 인스턴스를 참조한다 (이유는 모르겠음..)
// 하지만 클래스 필드에 할당한 화살표 함수는 프로토타입 메서드가 아니라 인스턴스 메서드가 된다 -> 메모리 낭비
class Person {
  name = 'Lee',
  sayHi = () => console.log(`Hi ${this.name}}`)
}

// 결론은 메서드를 정의할 때는 ES6 메서드 축약 표현으로 정의하는 것이 좋다
class Person {
  name = 'Lee',
  sayHi() { console.log(`Hi ${this.name}`) }
}
```

- 결론은 어떤 함수의 인수로 콜백 함수를 전달할 때는, 해당 콜백 함수를 화살표 함수의 사용하는 것이 좋고,
- 메서드는 ES6의 메서드 축약 표현으로 나타내는 것이 좋다

```js
// 화살표 함수는 함수 자체의 arguments객체를 갖지 않는다
// 따라서 화살표 함수로 가변 인자 함수를 구현해야 할 때는 반드시 Rest 파라미터를 사용해야 한다

const sum = (a, b, ...rest) => {
    let tot = a + b
    if (rest.length) {
        tot += rest.reduce((prev, cur) => prev + cur)
    }
    return tot
}
```





## 참조에 의한 전달과 외부 상태의 변경

- 함수의 매개변수로 전달한 인자를 함수 안에서 조작하면 어떻게 될까?
  - 원시값은 원본이 훼손되지 않는다
  - 객체는 원본이 훼손된다
- `var`, `let` 으로 정의한 원시값을 변경하면, 값을 새로운 메모리에 할당하고 해당 메모리에 저장된 값을 수정한다. 그래서 원본 값은 보존된다
- 객체는 변경 가능한 타입이기 때문에, 원시값을 변경하면, 해당 메모리에 있는 원시값이 그대로 수정된다. 그래서 원본 값이 훼손된다
- 이렇게 함수가 외부 상태를 변경하는 것은 변화의 추적을 어렵게 하기 때문에 지양되는 방식이다. 그래서 깊은 복사를 통해 매개변수에 전달하면 이러한 부수 효과를 피할 수 있다

```js
const changeVal = function(prim, obj) { // 외부 상태를 건드리는 비순수 함수
    prim += 100;
    obj.name = 'Kim';
}

// 외부 상태
let num = 100;
let person = { name: 'Lee' };

console.log(num) // 100
console.log(person) // { name: 'Lee' }

changeVal(num, person);

console.log(num) // 100 --> 원시값은 원본이 보존
console.log(person) // { name: 'Kim' } --> 객체는 원본이 훼손

```

## 다양한 함수의 형태

### 즉시 실행 함수

- 함수 정의와 동시에 즉시 호출되는 함수를 즉시 실행 함수라고 한다
- 즉시 실행 함수는 단 한 번만 호출되며 다시 호출할 수 없다
- 즉시 실행 함수는 그룹 연산자 `(...)`로 먼저 함수 리터럴 + 호출 연산자를 감싸줘야 한다
  ```js
  (function () {}())
  ```
- 그룹 연산자가 없으면 함수 선언문으로 여겨지고 함수 선언문은 함수 객체가 아니기 때문에 뒤의 함수 호출 연산자를 붙일 수 없다
- 그룹 연산자로 감싸줘야 함수 리터럴, 즉 함수 객체로 평가되고 뒤에 호출 연산자를 붙일 수 있다
- 즉시 실행 함수도 일반 함수처럼 인수를 전달할 수 있고 값을 반환할 수도 있다
  ```js
  const res = ( function (x, y) { return x + y }(3, 5) ) // 8
  ```

### 중첩 함수

- 함수 내부에 정의된 함수를 중첩 함수 또는 내부 함수라 한다
- 그리고 중첩 함수를 포함하는 함수를 외부 함수라 한다
- 중첩 함수는 자신을 포함하는 외부 함수를 돕는 헬퍼 함수의 역할을 한다

```js
function outer() {
    let x = 1;

    function inner() {
        let y = 2;
        console.log(x + y);
    }

    inner();
}

outer();
```

### 콜백 함수

- 반복되는 부분을 함수로 만들어 **다른 함수 매개변수에 인자로 전달되는 함수를 콜백 함수**라 한다
- **콜백 함수를 인자로 받는 함수를 고차 함수**라 한다

```js
const callBackFunc = function (x) {
    console.log(x)
}

const higherOrderFunc = function (n, cb) {
    for (let i = 0; i < n; i++) {
        cb(i)
    }
}

higherOrderFunc(5, callBackFunc);
```
