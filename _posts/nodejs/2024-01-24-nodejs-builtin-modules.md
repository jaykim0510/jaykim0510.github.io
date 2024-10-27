---
layout: post
title:  '[Node.js] 노드의 내장 객체와 기본 모듈'
description: 
date:   2024-01-24 12:01:35 +0300
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

# 내장 객체

## process

- 현재 실행중인 노드 프로세스에 대한 정보를 담고 있는 노드 내장 객체

```js
// 설치되 노드의 버전
process.version

// 프로세스 아이디
process.pid

// 프로세스 경과 시간
process.uptime()

// 현재 프로세스가 실행되는 위치
process.cwd()

// 시스템 환경 변수들이 들어있는 객체
// 비밀키(데이터베이스 비밀번호, 서드파티 앱 키 등)를 보관하는 용도로도 쓰임
process.env
```

# 내장 모듈

## os

- 운영체제의 정보를 담고 있는 내장 모듈

```js
import * as os from 'os';

// 홈 디렉터리 경로
os.homedir()

// 컴퓨터의 코어 정보
os.cpus()

// 사용 가능한 메모리(RAM)
os.freemem()

// 전체 메모리 용량
os.totalmem()
```

## path

- 폴더와 파일의 경로를 쉽게 조작하도록 도와주는 내장 모듈

```js
import * as path from 'path';

// 파일이 위치한 폴더 경로
path.dirname(경로)

// 파일의 확장자
path.extname(경로)

// 파일의 이름(확장자 포함)
path.basename(경로)

// 여러 경로를 하나로 합쳐준다
path.join(경로1, 경로2, ..)
```

## url

- URL 주소를 파싱해서 쉽게 조작하도록 도와주는 내장 모듈

![](/images/node_basic_1.png)

```js
import * as url from 'url'

const myUrl = new url.URL('https://www.google.com/search?q=apple')

console.log(myUrl)
```

```
URL {
  href: 'https://www.google.com/search?q=apple',
  origin: 'https://www.google.com',
  protocol: 'https:',
  username: '',
  password: '',
  host: 'www.google.com',
  hostname: 'www.google.com',
  port: '',
  pathname: '/search',
  search: '?q=apple',
  searchParams: URLSearchParams { 'q' => 'apple' },
  hash: ''
}
```

## util

- util.deprecate()

```js
import * as util from 'util'

const addFn = (a, b) => {
    return a + b
}

const deprecatedAddFn = util.deprecate(addFn, 'addFn을 쓰지 마세요')

console.log(addFn(3, 5))
console.log(deprecatedAddFn(2, 3))
```

- util.promisify()
- 프로미스의 등장 이전에는 비동기 함수의 실행 결과에 대한 후속 처리를 콜백함수로 했다
- 콜백함수의 콜백 헬 문제, 에러 처리 불가 문제 등을 해결하기 위해 프로미스가 등장했다
- `util.promisify()`가 콜백 패턴을 프로미스 패턴으로 바꿔준다
- 단 콜백이 `(err, data) => {}` 형태여야 한다

```js
const promisifiedRandomBytes = util.promisify(crypto.randomBytes)

promisifiedRandomBytes(64).then().catch()...
```

## fs

```js
import * as fs from 'fs'

(function() {
    const filePath = path.join(process.cwd(), 'myFolder', 'myFile.txt')
    
    fs.readFile(filePath, (err, fileBuffer) => {
        if (err) {
            throw err
        }
        console.log(fileBuffer)
    })
}())
```

```js
import * as fs from 'fs'

(function () {
    const filePath = path.join(process.cwd(), 'myFolder', 'myFile.txt')
    
    const fileBuffer = fs.readFileSync(filePath)
    console.log(fileBuffer)
}())
```

```js
import * as fs from 'fs/promises'

(function() {
    const filePath = path.join(process.cwd(), 'myFolder', 'myFile.txt')
    
    fs.readFile(path.join(filePath)
        .then((fileBuffer) => {
            console.log(fileBuffer)
        })
        .catch((err) => {
            throw err
        })
}())
```

```js
import * as fs from 'fs/promises'

(async function () {
    const filePath = path.join(process.cwd(), 'myFolder', 'myFile.txt')
    
    const fileBuffer = await fs.readFile(filePath)
    console.log(fileBuffer)
}())
```

```js
fileBuffer // <Buffer 48 65 6c 6c 6f 20 4a 61 76 61 73 63 72 69 70 74>

fileBuffer.toString() // Hello Javascript
```

```js
(async function () {
    const filePath = path.join(process.cwd(), 'file_study', 'hello.txt')
    await fs.appendFile(filePath, '\tHello NodeJS')
    const fileBuffer = await fs.readFile(filePath)
    console.log(fileBuffer.toString()) // Hello Javascript        Hello NodeJS
}())
```

```js
(async function () {
    const srcPath = path.join(process.cwd(), 'file_study', 'hello.txt')
    const destPath = path.join(process.cwd(), 'file_study', 'goodbye.txt')
    await fs.copyFile(srcPath, destPath)
}())
```

```js
(async function () {
    const folder = path.join(process.cwd(), 'file_study', 'myNewFolder', 'myNewFolderFolder')
    await fs.mkdir(folder, { recursive: true })
}())
```

```js
(async function () {

    const filePath = path.join(process.cwd(), 'file_study', 'hello.txt')
    
    const fileHandle = await fs.open(filePath)
    const fileContent = await fileHandle.readFile()
    console.log(fileContent.toString())
    
}())
```

```js
(async function () {

    const filePath = path.join(process.cwd(), 'file_study', 'hello.txt')
    
    await fs.writeFile(filePath, 'Hello NodeJS')
    const file = await fs.readFile(filePath)
    console.log(file.toString()) // Hello NodeJS
}())
```