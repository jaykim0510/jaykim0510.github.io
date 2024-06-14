---
layout: post
title:  '[Next.js]: next-auth를 통한 인증'
description:
date:   2024-02-13 15:01:35 +0300
image:  '/images/next_logo.png'
logo_image: '/images/next_logo.png'
category: frontend
tag: nextjs
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# NextAuth

```
<!-- v5 -->
npm install next-auth@beta
```

- The main entry point of NextAuth.js is the `NextAuth` method that you import from `next-auth`. It handles different types of requests, as defined in the REST API section.

- In Next.js, you can define an API route that will catch all requests that begin with a certain path. Conveniently, this is called Catch all API routes.
- `/app/api/auth/[...nextauth]/route.ts` instruct NextAuth.js that every API request beginning with `/api/auth/*` should be handled by the code written in the `[...nextauth]` file
  - All requests to `/api/auth/* (signIn, callback, signOut, etc.)` will automatically be handled by NextAuth.js

## Options

- Options are passed to NextAuth.js when initializing it in an API route.
- providers
  - An array of authentication providers for signing in (e.g. Google, Facebook, Twitter, GitHub, Email, etc) in any order
- secret
  - A random string is used to hash tokens, sign/encrypt cookies and generate cryptographic keys.
  - If you set NEXTAUTH_SECRET as an environment variable, you don't have to define this option.
- session

    ```js
    session: {
    // Choose how you want to save the user session.
    // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
    // If you use an `adapter` however, we default it to `"database"` instead.
    // You can still force a JWT session by explicitly defining `"jwt"`.
    // When using `"database"`, the session cookie will only contain a `sessionToken` value,
    // which is used to look up the session in the database.
    strategy: "database",

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours
    
    // The session token is usually either a random UUID or string, however if you
    // need a more customized session token string, you can define your own generate function.
    generateSessionToken: () => {
        return randomUUID?.() ?? randomBytes(32).toString("hex")
    }
    }
    ```

- jwt
  - JSON Web Tokens can be used for session tokens if enabled with `session: { strategy: "jwt" }` option

    ```js
    jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 60 * 60 * 24 * 30,
    // You can define your own encode/decode functions for signing and encryption
    async encode() {},
    async decode() {},
    }
    ```

  - An example JSON Web Token contains a payload like this:

    ```js
    {
    name: 'Iain Collins',
    email: 'me@iaincollins.com',
    picture: 'https://example.com/image.jpg',
    iat: 1594601838,
    exp: 1597193838
    }
    ```

- You can use the built-in `getToken()` helper method to verify and decrypt the token, like this:

    ```js
    import { getToken } from "next-auth/jwt"

    const secret = process.env.NEXTAUTH_SECRET

    export default async function handler(req, res) {
    // if using `NEXTAUTH_SECRET` env variable, we detect it, and you won't actually need to `secret`
    // const token = await getToken({ req })
    const token = await getToken({ req, secret })
    console.log("JSON Web Token", token)
    res.end()
    }
    ```

- pages
  - Specify URLs to be used if you want to create custom sign in, sign out and error pages

    ```js
    pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    }
    ```


- callbacks
  - Callbacks are asynchronous functions you can use to control what happens when an action is performed
  - Callbacks are extremely powerful, especially in scenarios involving JSON Web Tokens as they allow you to implement access controls without a database and to integrate with external databases or APIs.
  - You can specify a handler for any of the callbacks below.

    ```js
    callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
        return true
    },
    async redirect({ url, baseUrl }) {
        return baseUrl
    },
    async session({ session, token, user }) {
        return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
        return token
    }
    }
    ```

# 

- We worked hard to avoid having to save your config options in a separate file and then pass them around as `authOptions` throughout your application. To achieve this, we settled on moving the configuration file to the root of the repository and having it export an `auth` function you can use everywhere else.

```js
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [GitHub],
})
```

- This then allows you to import the functions exported from this file elsewhere in your codebase via import statements like one of the following.
- Universal `auth()`. Remember a single method, and authenticate anywhere. Replaces getServerSession, getSession, withAuth, getToken and useSession in most cases
```js
import { auth } from "@/auth"
```

- The old configuration file, contained in the API Route (`app/api/auth/[...nextauth]/route.ts`), now becomes a 1-line handler for GET and POST requests for those paths.

```js
export { GET, POST } from "./auth"
```

# Providers

## Credentials

- The Credentials provider allows you to handle signing in with arbitrary credentials, such as a username and password, two-factor authentication or hardware device (e.g. YubiKey U2F / FIDO).
- It is intended to support use cases where you have an existing system you need to authenticate users against.

```js
// app/api/auth/[...nextauth].js

import CredentialsProvider from "next-auth/providers/credentials"
...
providers: [
  CredentialsProvider({
    // The name to display on the sign in form (e.g. 'Sign in with...')
    name: 'Credentials',
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      username: { label: "Username", type: "text", placeholder: "jsmith" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials, req) {
      // You need to provide your own logic here that takes the credentials
      // submitted and returns either a object representing a user or value
      // that is false/null if the credentials are invalid.
      // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
      // You can also use the `req` object to obtain additional parameters
      // (i.e., the request IP address)
      const res = await fetch("/your/endpoint", {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: { "Content-Type": "application/json" }
      })
      const user = await res.json()

      // If no error and we have user data, return it
      if (res.ok && user) {
        return user
      }
      // Return null if user data could not be retrieved
      return null
    }
  })
]
...
```

## OAuth


### Naver

```js
import NaverProvider from "next-auth/providers/naver";
...
providers: [
  NaverProvider({
    clientId: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET
  })
]
...
```

# REST API

- NextAuth.js exposes a REST API that is used by the NextAuth.js client.

# Authenticating

- NextAuth.js has had a few different ways to authenticate server-side in the past, and we've tried to simplify this as much as possible.

- Now that Next.js components are server-first by default, and thanks to the investment in using standard Web APIs, we were able to simplify the authentication process to a single auth() function that you can use anywhere.


![](/images/nextjs_auth_1.png)



# Extention

- session, user 같은 데이터에 커스텀 속성 추가하고 싶을 때

## callback 이용

```js
...
callbacks: {
  async jwt({ token, account }) {
    // Persist the OAuth access_token to the token right after signin
    if (account) {
      token.accessToken = account.access_token
    }
    return token
  },
  async session({ session, token, user }) {
    // Send properties to the client, like an access_token from a provider.
    session.accessToken = token.accessToken
    return session
  }
}
...
```

```js
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data } = useSession()
  const { accessToken } = data

  return <div>Access Token: {accessToken}</div>
}
```

## 모듈 확장

- `next-auth` comes with certain types/interfaces that are shared across submodules. Good examples are `Session` and `JWT`. Ideally, you should only need to create these types at a single place, and TS should pick them up in every location where they are referenced. Luckily, Module Augmentation is exactly that, which can do this for us. Define your shared interfaces in a single place, and get type-safety across your application when using `next-auth` (or one of its submodules).

```js
import NextAuth from "next-auth"

export default NextAuth({
  callbacks: {
    session({ session, token, user }) {
      return session // The return type will match the one returned in `useSession()`
    },
  },
})
```


```js
import { useSession } from "next-auth/react"

export default function IndexPage() {
  // `session` will match the returned value of `callbacks.session()` from `NextAuth()`
  const { data: session } = useSession()

  return (
    // Your component
  )
}
```

- By default, TypeScript will merge new interface properties and overwrite existing ones. In this case, the default session user properties will be overwritten, with the new one defined above.

- If you want to keep the default session user properties, you need to add them back into the newly declared interface:

```js
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      address: string
    } & DefaultSession["user"]
  }
}
```


- Although you can augment almost anything, here are some of the more common interfaces that you might want to override in the `next-auth` module:

```js
/**
 * The shape of the user object returned in the OAuth providers' `profile` callback,
 * or the second parameter of the `session` callback, when using a database.
 */
interface User {}
/**
 * Usually contains information about the provider being used
 * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
 */
interface Account {}
/** The OAuth profile returned from your provider */
interface Profile {}
```

- Make sure that the `types` folder is added to `typeRoots` in your project's `tsconfig.json` file.