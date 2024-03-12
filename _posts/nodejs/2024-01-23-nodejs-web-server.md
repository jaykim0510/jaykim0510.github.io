---
layout: post
title:  '[Node.js] 웹서버'
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

- Node.js는 백엔드 서버용 코드를 작성하는데 유용한 `http` 모듈을 기본 제공한다

# http 모듈 불러오기

- CommonJS 방식과, ESModule 방식이 있다

```js
// CommonJS 방식
const http = require('http')

// ESModule 방식
import * as http from 'http'
```

# 서버 생성하기

- `createServer([options][, requestListener])`
- requestListener는 요청(request) 이벤트가 발생했을 때 실행될 콜백 함수를 말한다
- 여기서 작성해도 되지만 나는 역할 구분을 명확히 하기 위해 뒤에서 `server.on('request', 콜백함수)` 방식으로 따로 분리해서 작성했다

```js
import * as http from 'http'

const server = htttp.createServer()
```

# 서버 포트 열기

```js
server.listen(8000)
```

# 클라이언트로부터 요청 받기

- Node.js는 이벤트 방식으로 동작한다
- '요청(request)'이라는 이벤트가 들어왔을 때 실행할 콜백함수를 등록하면 된다
- 요청은 크게 경로(path)와 메서드(method)로 분기한다
- 요청에 대한 응답은 스트림 형식 또는 파일 형식으로 반환할 수 있다

```js
import * as url from 'url'

server.on('request', (req, res) => {
    
    const pathname = url.parse(req.url).pathname

    if (pathname === '/') {
        res.write('<h1>Hello Node !</h1>')
    } else if (pathname === '/items') {
        if (req.method === 'GET') {
            res.write('<h1>All Items</h1>')
        } else if (req.method === 'POST') {
            res.write('<h1>Create Item</h1>')
        }
    }
    res.end()
})

```

# 전체 코드

```js
import * as http from 'http'
import * as url from 'url'

const server = http.createServer()


server.listen(8000)


server.on('request', (req, res) => {

    // http://localhost:8000/foo/bar?a=z 에 대하여,
    // req.url -> '/foo/bar?a=z'
    // url.parse(req.url).pathname -> '/foo/bar'
    // url.parse(req.url).path -> '/foo/bar?a=z'
    // url.parse(req.url).href -> '/foo/bar?a=z'
    const pathname = url.parse(req.url).pathname

    
    if (pathname === '/') {
        res.write('<h1>Hello Node !</h1>')
    } else if (pathname === '/items') {
        if (req.method === 'GET') {
            res.write('<h1>All Items</h1>')
        } else if (req.method === 'POST') {
            res.write('<h1>Create Item</h1>')
        }
    }

    res.end()
    
})
```

# Express 프레임워크

- 위에서 http 모듈로도 충분히 백엔드 서버를 만들 수 있음을 확인했다
- 하지만 요청 분기, 응답 반환 방식이 코드 규모가 커지면 점점 가독성이 떨어진다
- 이러한 단점을 해결하기 위해 Express 프레임워크를 사용할 예정이다