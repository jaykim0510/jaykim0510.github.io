---
layout: post
title:  'Javascript Series [Part9]: Javascript 모던 자바스크립트'
description:
date:   2022-04-03 15:01:35 +0300
image:  '/images/js_logo.jpg'
logo_image:  '/images/javascript_logo.png'
categories: programming_language
tags: Javascript
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# 모던 자바스크립트

- 현시점에 사용하기 적합한 범위 내에서 최신 버전의 표준을 준수하는 자바스크립트
- (너무 최신은 아니고, 대부분의 브라우저에서 지원하는 자바스크립트 버전)


# 논리 연산

```js
// AND 연산자
//앞이 True이면 뒤에 나오는 값에 따라 True/False가 결정된다 -> 뒤에 나오는 값 출력
console.log('Modern' && 'Javascript'); // Javascript
console.log('0' && Nan); // Nan

// 앞이 False이면 뒤에 나오는 값은 True/False 여부에 상관 없다 -> 앞에 나오는 값 출력
console.log(null && undefined); // null


// OR 연산자
// 앞이 True이면 뒤에 나오는 값 상관 없다 -> 앞에 나오는 값 출력
console.log({} || 15); // {}

// 앞이 False 이면 -> 뒤에 나오는 값 출력
console.log(0 || true); // true

// OR 연산자는 이렇게 디폴트값을 설정하는 상황에 많이 사용된다
function myNumber(value) {
    const num = value || 0;
    return num
}

const myNum = myNumber(5); // 5
const myNum = myNumber(); // 0


// null 병합 연산자
// OR 연산자랑 비슷하지만, False의 범위가 null과 undefined 만으로 제한된다
// 왼쪽 값이 null 또는 undefined 면 오른쪽값 출력
// 왼쪽 값이 그 밖의 다른 경우에는 왼쪽값 출력
console.log(0 || 123); // 123
console.log(0 ?? 123); // 0
console.log(null ?? 123); // 123
```

# 변수 선언

```js
console.log(val); // undefined
var val = 5;
console.log(val); // 5

// let이나 const로 선언한 변수는 호이스팅 안됨 -> 변수가 선언되기 전에 사용한 코드의 오류를 잡을 수 있음
console.log(letval); // ReferenceError
let letval = 5;
```

```js
var val = 'I';
var val = 'You';

// let이나 const는 중복 선언을 막아준다
let val = 'I'; // SnytaxError
let val = 'You'; // SnytaxError

// 중복 할당은 가능하다
let val = 'I';
val = 'You';
```

```js
// var은 함수 스코프
// let, const는 블록 스코프 (함수를 포함한 모든 {} 블록)

// x: 전역변수
// y: 전역변수
// z: 함수 스코프 지역 변수
var x = 3;
{
    var y = 4;
}
function myFunc() {
    var z = 5;
    console.log(x); // 3
    console.log(y); // 4
    console.log(z); // 5
}
myFunc()

console.log(x); // 3
console.log(y); // 4
console.log(z); // ReferenceError



// x: 전역변수
// y: 블록 스코프 지역 변수
// z: 블록 스코프 지역 변수
let x = 3;
{
    let y = 4;
}
function myFunc() {
    let z = 5;
    console.log(x); // 3
    console.log(y); // ReferenceError
    console.log(z); // 5
}
myFunc()

console.log(x); // 3
console.log(y); // ReferenceError
console.log(z); // ReferenceError
```

# 함수 표현식

- 함수를 값처럼 사용하는 방식
- 함수 선언식과의 차이: 
  - 함수 선언식은 호이스팅 된다
  - 함수 선언식은 함수 스코프다 (함수가 아닌 블록에 정의된 함수 선언식은 전역적으로 사용된다)

```js
// 변수(myFunc)에 할당
const myFunc = function (value) {
    console.log(value)
}
myFunc(5);


const myBtn = document.querySelector('#myBtn');
// 함수의 인자로 전달
myBtn.addEventListener('click', function () {
    console.log('my button is clicked');
})
```

```js
// 함수 내부에서 함수를 재귀 호출하고 싶을 때는 함수에 이름을 붙여주는 것이 좋다
// Named Function Expression
const myFunc = function factorial(value) {
    if (value === 1) {
        return 1
    }
    else {
        return value * factorial(value - 1)
    }
}

myFunc(5);
console.log(myFunc.name); // factorial
factorial(5); // ReferenceError (함수 표현식의 함수명은 함수 내부에서만 사용 가능)
```

# 즉시 실행 함수

```js
(function () {
    console.log('Initializing System');
})();

// 재사용 불가하다
(function myFunc() {
    console.log('Initializing System');
})();

myFunc(); // ReferenceError
```

```js
// 이렇게 초기화 기능에 사용하거나,
(function () {
    console.log('Initializing System');
})();

// 1회성으로 필요한 함수 결과값을 사용할 때 주로 쓴다
const factorial5 = (function factorial(value) {
    if (value === 1) {
        return 1
    }
    else {
        return value * factorial(value - 1)
    }
})(5);

console.log(factorial5)
```

# Argument와 Rest Parameter

```js
// arguments는 함수 내에서 자동으로 생성되는 객체
// 인자를 값으로 가지는 유사 배열 -> 배열이 아니기 때문에 배열이 가지는 메서드는 사용 못함
// 함수 정의하는 부분에서 파라미터 없이도 사용 가능하지만 가독성 떨어짐
function myPrint() {
    for (const val in arguments) {
        console.log(val)
    }
}

// ...args: rest parameter
// 배열이기 때문에 배열의 메서드를 사용할 수 있음
function myPrint(first, second, ...rest) {
    console.log(`first: ${first}`)
    console.log(`second: ${second}`)
    console.log(`rest: ${rest}`)
}

myPrint('Apple', 'Banana', 'Car', 'Dinosour', 'Egg');
```

# Arrow Function

```js
const myfunc = value => value * 2;

const myfunc = (first, second) => {
    return {first: first,
            second: second}
}

const myfunc = (first, second) => ({first: first, second: second})
```

# this

```js
const myfunc = function () {
    console.log(`first: ${this.name}, second: ${this.age}`);
}

user_a = {
    name: 'Alex',
    age: 21,
    myfunc: myfunc
}

user_b = {
    name: 'Kim',
    age: 25,
    myfunc: myfunc
}

user_a.myfunc();
user_b.myfunc();
```

# Spread

```js
const numbers = [1, 2, 3];

console.log(numbers) // [1, 2, 3]
console.log(...numbers) // 1, 2, 3
```

```js
// 객체를 spread할 때는 반드시 객체를 표현하는 중괄호 안에서 활용해야 한다

const latte = {
  esspresso: '30ml',
  milk: '150ml'
};

const cafeMocha = {
  ...latte,
  chocolate: '20ml',
}

console.log(latte); // {esspresso: "30ml", milk: "150ml"}
console.log(cafeMocha); // {esspresso: "30ml", milk: "150ml", chocolate: "20ml"}
```

# 모던한 프로퍼티 표기법

```js
const username = 'kim';
const gender = 'male';
const age = 25;
function introduceMyself() {
    console.log(`Hi my name is ${username}.`)
}


const user = {
    username,
    gender,
    age,
    introduceMyself,
}

user.introduceMyself();


const user = {
    username,
    gender,
    age,
    introduceMyself() {
    console.log(`Hi my name is ${username}.`)
    }
}
```

# 옵셔널 체이닝

```js
function printCatName1(user) {
    console.log(user.cat.name);
}

function printCatName2(user) {
    console.log(user.cat && user.cat.name);
}

function printCatName3(user) {
    console.log((user.cat === null || user.cat === undefined) ? undefined : user.cat.name);
}

// ?. 옵셔널 체이닝 연산자
function printCatName4(user) {
    console.log(user.cat?.name ?? '고양이 없음');
}
  
const user = {
    name: 'Captain',
}

const user_with_cat = {
    name: 'Captain',
    cat: {
      breed: 'British Shorthair',
    }
}

printCatName1(user) // TypeError
printCatName1(user_with_cat) // undefined

printCatName2(user) // undefined
printCatName2(user_with_cat) // undefined

printCatName3(user) // undefined
printCatName3(user_with_cat) // undefined

printCatName4(user) // 고양이 없음
printCatName4(user_with_cat) // 고양이 없음
```

# Destructing

```js
const words = ['Apple', 'Banana', 'Car', 'Dinosour', 'Egg']

const [a, b, c, ...rest] = words


console.log(a) // Apple
console.log(b) // Banana
console.log(c) // Car
console.log(rest) // [Dinosour, Egg]


let x = 'Apple';
let y = 'Banana';

[x, y] = [y, x];
```

```js
const macbook = {
    title: 'Macbook Pro',
    price: 10000,
    memory: '16GB',
    storage: '1TB'
}

const {title, price, ...rest} = macbook;

console.log(title);
console.log(price);
console.log(rest);

const {title: product, price, ...rest} = macbook;

console.log(product);
console.log(price);
console.log(rest);
```

# 예외 처리

- `SyntaxError` 같은 에러는 아예 코드를 실행하지 않는다
- 코드 실행도중 처리 가능한 에러를 Exception이라 하고, Exception이 발생해도 코드가 동작하도록 하는걸 예외 처리(Exception Handling)이라고 한다


```js
try {
  // 실행할 코드
} catch (err) {
  // 에러가 발상했을 때 실행할 코드
} finally {
  // 항상 실행할 코드
}
```

```js
// 에러 발생시키기

const err = new TypeError("타입에러가 발생했습니다");

console.log(err.name); // TypeError
console.log(err.message); // 타입에러가 발생했습니다
console.error(err.name); // TypeError

throw err; // Uncaught TypeError: 타입에러가 발생했습니다
```

```js
// 예외 처리
try {
    const x = 'a';
    console.log(x.abcd());
    
} catch (err) {
    console.error(err.name);
    
}
```

# forEach, map

```js
const names = ['mike', 'bob', 'kong'];

names.forEach(function (userName) {
    console.log(userName);
});

names.forEach( (userName) => {
    console.log(userName);
});

names.forEach( (userName, i) => {
    console.log(i, userName);
});
```

```js
// map은 return 문이 반환하는 값을 배열에 담은 새로운 배열을 반환한다
const names = ['mike', 'bob', 'kong'];

const new_names = names.map((userName, i) => {
    return [i, userName];
});

console.log(new_names);
```

# filter와 find

- `filter`는 항상 배열 형태로 리턴
- `find`는 조건에 맞는 원소 찾으면 그 값을 반환하고 종료

```js
const names = ['mike', 'bob', 'kong'];

const filtered_names = names.filter((el) => {
    return el.length === 4 });

console.log(filtered_names); // ['mike', 'kong']

const finded_el = names.find((el) => {
    return el.length === 4
})

console.log(finded_el); // 'mike'
```

# some과 every

```js
const names = ['mike', 'bob', 'kong'];

const someReturn = names.some((el) => {
    return el.length === 4 });


const everyReturn = names.every((el) => {
    return el.length === 4 });


console.log(someReturn); // true
console.log(everyReturn); // false
```

# reduce

```js
const numbers = [1, 2, 3, 4];

const totalSum = numbers.reduce((acc, el) => {
    return acc + el;
}, 0)

console.log(totalSum);
```

# sort, reverse

```js

const numbers = [1, 4, 7, 10];

// sort,reverse 는 원본 배열 numbers를 정렬함 -> 원본을 보존하려면 새로운 변수에 미리 할당해둬야함

// 유니코드에 정의된 순으로 정렬
console.log(numbers.sort()); // [1, 10, 4, 7]

// 오름차순 정렬
console.log(numbers.sort((a, b) => a - b)); // [1, 4, 7, 10]

// 내림차순 정렬
numbers.sort((a, b) => b - a); // [10, 7, 4, 1]

// 역으로 정렬
console.log(numbers.reverse()); // [10, 7, 4, 1]
```

# Map과 Set

```js
// Map 객체는 메소드를 통해 값을 다루기 때문에, 다양한 자료형을 key로 활용할 수 있다는 장점

// Map 생성
const myMap = new Map();

// set 메소드
myMap.set('title', '문자열 key');
myMap.set(2017, '숫자형 key');
myMap.set(true, '불린형 key');

// get 메소드
console.log(myMap.get(2017)); // 숫자형 key
console.log(myMap.get(true)); // 불린형 key
console.log(myMap.get('title')); // 문자열 key

// has 메소드
console.log(myMap.has('title')); // true
console.log(myMap.has('name')); // false

// size 프로퍼티
console.log(myMap.size); // 3

// delete 메소드
myMap.delete(true);
console.log(myMap.get(true)); // undefined
console.log(myMap.size); // 2

// clear 메소드
myMap.clear();
console.log(myMap.get(2017)); // undefined
console.log(myMap.size); // 0
```

```js

//  Set에는 개별 값에 바로 접근하는 방법이 없다
// 중복을 허용하지 않는 값들을 모을 때 유용

// Set 생성
const members = new Set();

// add 메소드
members.add('영훈'); // Set(1) {"영훈"}
members.add('윤수'); // Set(2) {"영훈", "윤수"}
members.add('동욱'); // Set(3) {"영훈", "윤수", "동욱"}
members.add('태호'); // Set(4) {"영훈", "윤수", "동욱", "태호"}

// Set 생성 (두 번째 방법)
const numbers = [1, 3, 4, 3, 3, 3, 2, 1, 1, 1, 5, 5, 3, 2, 1, 4];
const uniqNumbers = new Set(numbers);

// has 메소드
console.log(members.has('동욱')); // true
console.log(members.has('현승')); // false

// size 프로퍼티
console.log(members.size); // 4

// delete 메소드
members.delete('종훈'); // false
console.log(members.size); // 4
members.delete('태호'); // true
console.log(members.size); // 3

// clear 메소드
members.clear();
console.log(members.size); // 0
```

# 모듈화

- 여러 js 파일을 사용하는 경우에는 모듈화를 해주는 것이 좋다

```html
<body>
    <script type="module" src="index.js"></script>
    <script type="module" src="printer.js"></script>
</body>
```

- 또 다른 방법은 하나의 js에서 다른 js 파일들을 import 하는 방법이다

```html
<body>
    <script type="module" src="index.js"></script>
</body>
```

```js
// printer.js

export const numbers = [1, 4, 7, 10];

export function printer (value) {
    console.log(value);
}
```

```js
// index.js

import { numbers, printer } from "./printer.js";

console.log(numbers);

printer(numbers);
```

- 임포트한 변수나 함수의 이름을 바꿔서 사용할 수도 있다

```js
import { numbers as myNumbers, printer } from "./printer.js";

console.log(myNumbers);

printer(myNumbers);
```

- 임포트 익스포트를 와일드 카드 문자(*)를 사용해서 한꺼번에 처리할 수도 있다


```js
// printer.js

const numbers = [1, 4, 7, 10];

function printer (value) {
    console.log(value);
}

export {numbers, printer};
```

```js
// index.js

import * as printJS from "./printer.js";

console.log(printJS.numbers);
printJS.printer(printJS.numbers);
```