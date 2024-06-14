---
layout: post
title:  '[Node.js] 내부 들여다 보기'
description: 
date:   2024-02-23 15:01:35 +0300
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

- JavaScript is a single-threaded programming language, which means it can only execute one task at a time. However, JavaScript provides an event-driven model that allows developers to write code that responds to events like user actions or timers. This event-driven model is possible due to the JavaScript Event Loop.

# What is the Event Loop?

- The Event Loop is a crucial part of JavaScript’s runtime environment. It is responsible for managing the execution of JavaScript code and handling events. The Event Loop continuously checks if there are any tasks to be executed in the event queue. If there are, it picks the tasks one by one and executes them.

# The Event Loop and the Event Queue

- The Event Loop enables JavaScript to handle asynchronous operations and events. It consists of two main components: the Call Stack and the Event Queue.

- The Event Queue is a data structure that holds events and tasks that are waiting to be processed. When an event occurs or an asynchronous task is completed, it is added to the Event Queue. The Event Loop then checks the Call Stack and the Event Queue. If the Call Stack is empty, it takes the first task from the Event Queue and adds it to the Call Stack for execution.




# Asynchronous

- 비동기는 메인 프로세스의 흐름과 상관 없이 독립적으로 일어나는 것들을 의미한다
- 자바스크립트는 기본적으로 싱글 스레드로 동작하는 동기이다
- 하지만 자바스크립트는 본디 웹 브라우저의 프로그래밍 언어였으며, 사용자의 클릭, 마우스 움직임, 입력과 같은 행동에 반응하는 것이 주 목적이었다
- 이러한 작업들을 어떻게 동기 프로그래밍 모델로 할 수 있을까
- 정답은 libuv, OS 커널이 자바스크립트 코드 내에 있는 일부 비동기 작업들을 대신 처리해준다는 것이다
- 자바스크립트는 libuv, OS 커널과 어떤 방식으로 상호작용할까?

# Callbacks

- 비동기로 실행되는 것들에는 여러 가지가 있다
  - 이벤트 트리거에 의해 실행되는 작업
  - I/O, Newtork 같은 특정 유형의 작업
- 비동기로 실행되는 작업은 코드의 메인 흐름이 그 결과를 기다리지 않는다. 즉 비동기 작업은 non-blocking 이다
- 그래서 우리는 비동기 작업의 결과가 나왔을 때 실행될 코드를 바로 밑에 적으면 안된다

```js
const res = 비동기함수()

console.log(res) // res 안나옴
```

- 이를 위한 첫 번째 해결 방법으로 나온게 바로 콜백 함수이다
- 비동기 함수에 인자로 콜백 함수를 넣어줌으로써, 비동기 함수의 결과가 반환되었을 때 실행할 코드를 작성할 수 있다

```js
비동기함수((res) => { console.log(res) })
```

- 근데 만약 콜백 함수가 비동기 함수라면?


```js
비동기함수1((res1) => { 
    비동기함수2((res2) => {
      비동기함수3((res3) => {
        console.log(res3)
      })
    })
})
```

- 이렇게 계속 nested 하게 코드가 작성되기 때문에 점점 가독성이 나빠지게 된다. 이를 콜백 헬이라고 한다
- ES6에서 도입된 async/await 표기법을 사용하면 아래와 같이 깔끔하게 작성할 수 있다

```js
async 비동기함수() {
  const res1 = await 비동기함수1()
  const res2 = await 비동기함수2(res1)
  const res3 = await 비동기함수3(res2)
  return res3
}
```

- 이렇게 작성하면 '비동기함수'는 비동기로 실행되고, '비동기함수1, 2, 3'도 비동기 함수로 취급되어 실행되지만, 서로 의존적이기 때문에 사실상 동기로 실행된다

# Event Loop

- 자바스크립트는 싱글스레드인데, 비동기 함수가 어떻게 메인 흐름을 방해하지 않고, 별도의 독립적으로 실행될 수 있을까?
- 그건 바로 자바스크립트가 비동기 작업은 libuv나 OS 커널과 같은 주변 환경에 작업을 위임하기 때문이다
- 자바스크립트는 기본적으로 콜스택에 쌓인 작업들을 스택방식으로 처리한다
- 모든 함수를 콜스택에 바로 쌓지는 않고, 비동기 작업들은 libuv의 uv_io에게 전달한다
- uv_io는 그중에 OS 커널이 할 수 있는 네트워크 요청과 같은 비동기 작업들은 OS 커널에게 전달한다
- 그래서 OS 커널은 네트워크 요청을 처리하고, uv_io의 쓰레드풀에 있는 워커 쓰레드들(default: 4)은 다른 비동기 작업을 처리한다
- 작업이 완료되면 이벤트 루프에 있는 특정 phase의 이벤트 큐에 콜백함수를 등록한다
- 이벤트 루프는 콜스택에 있는 작업들을 처리하고, 비어있게 되면 이벤트 큐에 있는 콜백함수를 자신의 콜스택으로 가져온다
- 각 phase의 이벤트 큐에 있는 콜백함수를 가져올 때, phase는 순서가 있기 때문에, 사실상 비동기 작업에 우선 순위가 있다고 할 수 있다
- (timer, io, poll, check, close)
- 그리고 다시 콜스택에 있는 작업들을 처리한다
- 한마디로 자바스크립트는 싱글스레드이지만, 주변에 있는 libuv와 OS커널을 활용할 줄 알기 때문에, 자바스크립트가 비동기 작업을 처리할 수 있는 것이다


- The event loop is what allows Node.js to perform non-blocking I/O operations — despite the fact that JavaScript is single-threaded — by offloading operations to the system kernel whenever possible.
- Since most modern kernels are multi-threaded, they can handle multiple operations executing in the background. When one of these operations completes, the kernel tells Node.js so that the appropriate callback may be added to the poll queue to eventually be executed
- When Node.js starts
  1. it initializes the event loop
  2. processes the provided input scripts
  3. begins processing the event loop
- The following diagram shows a simplified overview of the event loop's order of operations.
  - (Each box will be referred to as a "phase" of the event loop.)
  - ![](/images/node_internals_1.png)

- 각각의 phase는 자신만의 FIFO 큐를 가지고 있으며, 자신의 이벤트 루프가 자신의 phase에 진입하면, 큐에 있는 콜백을 모두 실행한 후, 다음 phase로 이동한다
- (내생각: 콜백 함수에도 급이 있다? 그래서 이벤트 루프가 돌 때, 뭔가 제일 우선순위가 높은 콜백부터 차례대로 실행? ex. timers의 큐에 있는 콜백함수가 제일 높은 우선순위)
- Between each run of the event loop, Node.js checks if it is waiting for any asynchronous I/O or timers and shuts down cleanly if there are not any.



# 참고

- [Mixu's Node book](https://book.mixu.net/node/index.html)
- [The Node.js Event Loop, nodejs.org](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
- [nodejs의 내부 동작 원리 (libuv, 이벤트루프, 워커쓰레드, 비동기),빨간색코딩:티스토리](https://sjh836.tistory.com/149)
- [How to Use the JavaScript Event Loop, SQUASH](https://www.squash.io/how-to-use-the-javascript-event-loop/)