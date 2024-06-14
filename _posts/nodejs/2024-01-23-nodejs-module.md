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

# CommonJS 모듈

```js
module.exports = {
    odd,
    even
}

// module.exports = odd
// module.exports = [odd, even]
// module.exports 는 파일에서 한 번만 쓸 수 있음
```

```js
const { odd, even } = require('./var.js')

// const { myOdd: odd, myEven: even } = require('./var.js')

// const mynumbers = require('./var.js')
// mynumbers.odd
// mynumbers.even
```

- `module.exports` 외에도 `exports`로 모듈을 만들 수 있음

```js
exports.odd = odd
exports.even = even

// module.exports와 exports를 같이 쓸 수는 없음
```

![](/images/node_module_1.png)

- node.js에서 최상위 스코프의 `this`는 `module.exports`를 가리킴

```js
console.log(this === module.exports) // true

function a() {
    console.log(this === global)
}

a() // true
```

- `require('./var.js')` 실행만 하고 변수에 할당 안하면, `var.js` 파일 실행은 하지만, 모듈은 가져와서 사용하지 않음

# ES 모듈

- 자바스크립트 진영에서 표준으로 채택한 모듈화 방법
- `mjs` 확장자를 사용하거나 package.json에 `type: “module”`을 추가해야 함

```js
export const odd = '홀수'
export const even = '짝수'
```

- `export default` 는 모듈에서 한 번만 사용할 수 있다

```js
export default const odd = '홀수'
// export default const even = '짝수' X

export default const mynumbers = { odd: '홀수', even: '짝수' }
```
- 모듈을 임포트할 때 `export` 사용한 모듈은 구조 분해 할당 형태로 불러온다
- `export default` 사용한 모듈은 구조 분해 할당이 필요없고, 다른 이름으로 불러올 수도 있다
- 확장자(ex. `.js`, `.mjs` 등)를 생략하면 안된다

```js
import { odd } from './var.js'

import mynumbers from './var.js'
import mymymy from './var.js' // export default는 임포트할 요소가 유일하기 때문에 불러올 때 이름이 달라도 된다
```