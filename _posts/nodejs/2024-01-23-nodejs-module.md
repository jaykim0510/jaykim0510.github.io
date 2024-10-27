---
layout: post
title:  '[Node.js] 모듈'
description: 
date:   2024-01-23 15:01:35 +0300
image:  '/images/node_logo.png'
logo_image:  '/images/node_logo.png'
category: backend
tag: nodejs
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Node.js 모듈

- 노드는 v12 이후, CommonJS 모듈, ES 모듈 방식을 모두 사용할 수 있다

- 모듈: 특정한 기능을 하는 함수나 변수들의 집합 
- 모듈로 만들면 여러 프로그램에서 재사용 가능

## CommonJS 모듈

- 노드에서 사용하는 임포트 방법 중 하나 (브라우저에서는 사용하지 않음)

```js

const PI = 3.14

const getArea = (radius) => {
  return PI * radius ** 2
}
```

- 위와 같이 상수 `PI` 와, `getArea` 함수가 있다고 했을 때, 다른 곳에서 임포트 해서 사용하기 위해 다음과 같은 방법이 있다

### Named Export

```js

const PI = 3.14

const getArea = (radius) => {
  return PI * radius ** 2
}

module.exports = {
  PI,
  getArea
}
```

```js

const PI = 3.14

const getArea = (radius) => {
  return PI * radius ** 2
}

module.exports.PI = PI
module.exports.getArea = getArea
```

```js

const PI = 3.14

const getArea = (radius) => {
  return PI * radius ** 2
}

exports.PI = PI
exports.getArea = getArea
```

### Default Export

- 만약 하나만 export 한다면, 객체 형태로 해도 되지만, 아래와 같이 바로 `module.exports`에 대입해 줘도 된다
- import 할 때도, 정확히 결정된 한 개만 import 하기 때문에, 이름이 달라도 된다. `getArea`라 안하고, `abc` 이런식으로 해도 된다

```js
// modules/math.js

const PI = 3.14

const getArea = (radius) => {
  return PI * radius ** 2
}

module.exports = getArea
```

```js
// app.js

const abc = require('./modules/math')

console.log(abc(5))
```

- 객체 형태로 export 하는 것을, Named export 라고 하고,
- 하나의 값 자체를 export 하는 것을, Default export 라고 한다

![](/images/node_module_1.png)

### this

- node.js에서 최상위 스코프의 `this`는 `module.exports`를 가리킴

```js
console.log(this === module.exports) // true

const a = () => {
  console.log(this === module.exports) // true
}

function b() {
  console.log(this === global) // true
}
```

- `require('./var.js')` 실행만 하고 변수에 할당 안하면, `var.js` 파일 실행은 하지만, 모듈은 가져와서 사용하지 않음

### Dynamic Import

```js

const isCool = true

if (isCool) {
  const { getArea } = require("./modules/math");
  console.log(getArea(5));
}
```


## ES 모듈

- 자바스크립트 진영에서 표준으로 채택한 모듈화 방법
- `mjs` 확장자를 사용하거나 package.json에 `type: “module”`을 추가해야 함

### Named Export

- 모듈을 임포트할 때 `export` 사용한 모듈은 구조 분해 할당 형태로 불러온다
- export 할 때 사용한 이름 그대로 import 해야 한다

```js
export const odd = '홀수'
export const even = '짝수'
```

### Default Export

- `export default` 는 모듈에서 한 번만 사용할 수 있다
- `export default` 사용한 모듈은 구조 분해 할당이 필요없고, 다른 이름으로 불러올 수도 있다

```js
export default const odd = '홀수'
// export default const even = '짝수' X

export default const mynumbers = { odd: '홀수', even: '짝수' }
```

- 확장자(ex. `.js`, `.mjs` 등)를 생략하면 안된다

```js
import { odd } from './var.js'

import mynumbers from './var.js'
import mymymy from './var.js' // export default는 임포트할 요소가 유일하기 때문에 불러올 때 이름이 달라도 된다
```

### this

- ES 모듈에서 Top-level `this`는 `undefined` 이다

```js

console.log(this) // undefined

const a = () => {
  console.log(this) // undefined
}

function b() {
  console.log(this) // undefined
}
```

### Dynamic Import

```js

const isCool = true

if (isCool) {
  const { getArea } = await import('./modules/math.js')
  console.log(getArea(5));
}
```