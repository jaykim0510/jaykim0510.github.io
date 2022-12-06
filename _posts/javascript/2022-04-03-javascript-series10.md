---
layout: post
title:  'Javascript Series [Part10]: Javascript 객체지향'
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

# 객체 생성

```js
// object literal
const user = {
    email: "abc@de.com",
    birthday: "1234-05-11",
    buy(item) {
        console.log(`${this.email} buys ${item.name}`)
    }
}

const item = {
    name: "sweater",
    price: 24000,
}
```


```js
// factory function
function createUser(email, birthday) {
    const user = {
        email: email, 
        birthday,  // // 파라미터와 이름이 같으면 이렇게만 적어도 된다
        buy(item) {
            console.log(`${this.email} buys ${item.name}`)
        },
    };
    return user
}
```

```js
// constructor function
function User(email, birthday) {
    this.email = email,
    this.birthday = birthday,
    this.buy = function (item) {
        console.log(`${this.email} buys ${item.name}`)
    };
}

const user1 = new User("abc@de.com", "1234-01-14");
```

```js
// class
class User {
    // 생성자 메서드
    constructor(email, birthday) {
        this.email = email;
        this.birthday = birthday;
    }
    buy(item) {
        console.log(`${this.email} buys ${item.name}`)
    }
}

const user1 = new User("abc@de.com", "1234-01-14");
```


# 캡슐화

```js
// class
class User {
    // 생성자 메서드
    constructor(email, birthday) {
        this.email = email;
        this.birthday = birthday;
    }
    buy(item) {
        console.log(`${this.email} buys ${item.name}`)
    }

    set email(address) {
        if (address.includes('@')) {
            this._email = address
        } else {
            throw new Error('invalid address');
        }
    }

    get email() {
        return this._email
    }
}

const user1 = new User("abc@de.com", "1234-01-14");
```

# 상속

```js
class User {
    constructor(email, birthday) {
        this.email = email;
        this.birthday = birthday;
    }

    buy(item) {
        console.log(`${this.email} buys ${item.name}`);
    }
}

class PremiumUser extends User {
    constructor(email, birthday, point) {
        super(email, birthday);
        this.point = point
    }
    buy(item) {
        super.buy(item);
        this.point += 5;
    }

    streamMusic() {
        console.log("Music");
    }
}
```

# 다형성

```js
user = PremiumUser("abv@de.com", "1234-05-12", 350);

console.log(user instanceof PremiumUser); // true
console.log(user instanceof User); // true
```

# static

```js
class Math {
    static PI = 3.14;

    static getCircleArea(radius) {
        return Math.PI * radius * radius;
    }
}

console.log(Math.PI);
console.log(Math.getCircleArea(5));
```