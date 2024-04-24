---
layout: post
title:  '[Next.js]: 데이터 패칭 (with. Tanstack Query)'
description:
date:   2024-02-10 15:01:35 +0300
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

# Data Fetching with Tanstack Query

- 데이터 패칭은 데이터를 불러(fetch)오는 것을 말한다
- 데이터 패칭은 클라이언트 단에서 할 수도 있고, 서버 단에서 할 수도 있다

<br>

- Next.js의 확장된 `fetch` 함수를 통해서도 데이터 패칭을 할 수 있지만, Tanstack Query 라이브러리를 이용하면 더 세밀한 적용이 가능하며 무한스크롤과 같은 기능을 쉽게 구현할 수 있다는 장점이 있다
- 또한 Tanstack Query는 리액트뿐만 아니라 Vue, Svelte, Angulary 같은 다른 프론트엔드 프레임워크도 지원하기 때문에, Tanstack Query를 잘 배워두면 어떤 프레임워크에서든 데이터 패칭을 일관되게 사용할 수 있다

```shell
npm i @tanstack/react-query@5
```


## Client Side Fetching

- 클라이언트의 요청에 의해 데이터를 불러올 수 있는데, Tanstack Query에서는 이를 쿼리(query)라고 한다
- Next.js의 클라이언트 컴포넌트에서 데이터 패칭은 쿼리를 통해 이루어진다

<br>

- Tanstack Query는 요청 함수(queryFn)가 패칭한 데이터를 유니크 키(queryKey) 값을 통해 식별한다
- 키(queryKey)는 반드시 배열 형태여야 한다
- 요청 함수(queryFn)는 GET, POST 같은 HTTP 요청을 보내는 비동기 함수여야 한다

```js
function Todos() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodoList,
  })

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  // We can assume by this point that `isSuccess === true`
  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}
```

## Query Function Variables

- 키(queryKey)는 패칭한 데이터를 식별하는 역할도 하지만, 요청 함수(qeryFn)의 인자로 전달되는 [`QueryFunctionContext`](https://tanstack.com/query/latest/docs/framework/react/guides/query-functions#queryfunctioncontext){:target="_blank"}의 일부가 되기도 한다
- 항상 유용한건 아니지만, 키(queryKey)에 요청 함수(queryFn)에 전달하고 싶은 무언가가 있다면 도움이 된다

```js
function Todos({ status, page }) {
  const result = useQuery({
    queryKey: ['todos', { status, page }],
    queryFn: fetchTodoList,
  })
}

// Access the key, status and page variables in your query function!
function fetchTodoList({ queryKey }) {
  const [_key, { status, page }] = queryKey
  return new Promise()
}
```

## Parallel Queries

- `useQueries()`

## Dependent Queries

- `enabled`

## Server Side Fetching

- 서버에서 미리 데이터 패칭 관련 로직을 실행해 데이터를 불러올 수 있는데, 이를 프리패치(pre-fetch)라고 한다
- Next.js의 서버 컴포넌트에서 데이터 패칭은 프리패치를 통해 이루어진다


```js
const prefetchTodos = async () => {
  // The results of this query will be cached like a normal query
  await queryClient.prefetchQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })
}
```

- Server rendering is the act of generating the initial html on the server, so that the user has some content to look at as soon as the page loads. This can happen on demand when a page is requested (SSR). It can also happen ahead of time either because a previous request was cached, or at build time (SSG)

- hydrate: 물을 다른 화합물과 결합하는 것
- dehydrate: 물을 다른 화합물로부터 분리하는 것

### Initial Setup

```js
// In Next.js, this file would be called: app/providers.jsx
'use client'

// We can not useState or useRef in a server component, which is why we are
// extracting this part out into it's own file with 'use client' on top
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export default function Providers({ children }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
```

```js
// In Next.js, this file would be called: app/layout.jsx
import Providers from './providers'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```



### Prefetching and de/hydrating data

- Let's next look at how to actually prefetch data and dehydrate and hydrate it

```js
// app/posts/page.jsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import Posts from './posts'

export default async function PostsPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  })

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  )
}
```

```js
// app/posts/posts.jsx
'use client'

export default function Posts() {
  // This useQuery could just as well happen in some deeper
  // child to <Posts>, data will be available immediately either way
  const { data } = useQuery({ queryKey: ['posts'], queryFn: getPosts })

  // This query was not prefetched on the server and will not start
  // fetching until on the client, both patterns are fine to mix.
  const { data: commentsData } = useQuery({
    queryKey: ['posts-comments'],
    queryFn: getComments,
  })

  // ...
}
```

- In the SSR guide, we noted that you could get rid of the boilerplate of having `<HydrationBoundary>` in every route. This is not possible with Server Components.




# Caching

- 데이터 패칭에서 데이터 원천은 데이터베이스에 있다
- 하지만 매번 데이터베이스에서 가져오는 것은 성능적인 문제가 있기 때문에 데이터를 캐싱하게 된다

- Let's assume we are using the default gcTime of 5 minutes and the default staleTime of 0.

<br>

- A new instance of `useQuery({ queryKey: ['todos'], queryFn: fetchTodos })` mounts.
  - Since no other queries have been made with the `['todos']` query key, this query will show a hard loading state and make a network request to fetch the data.
  - When the network request has completed, the returned data will be cached under the `['todos']` key.
  - The hook will mark the data as stale after the configured staleTime (defaults to 0, or immediately).
- A second instance of `useQuery({ queryKey: ['todos'], queryFn: fetchTodos })` mounts elsewhere.
  - Since the cache already has data for the `['todos']` key from the first query, that data is immediately returned from the cache.
  - The new instance triggers a new network request using its query function.
    - Note that regardless of whether both fetchTodos query functions are identical or not, both queries' status are updated (including isFetching, isPending, and other related values) because they have the same query key.
  - When the request completes successfully, the cache's data under the `['todos']` key is updated with the new data, and both instances are updated with the new data.
- Both instances of the `useQuery({ queryKey: ['todos'], queryFn: fetchTodos })` query are unmounted and no longer in use.
  - Since there are no more active instances of this query, a garbage collection timeout is set using gcTime to delete and garbage collect the query (defaults to 5 minutes).
- Before the cache timeout has completed, another instance of `useQuery({ queryKey: ['todos'], queryFn: fetchTodos })` mounts. The query immediately returns the available cached data while the fetchTodos function is being run in the background. When it completes successfully, it will populate the cache with fresh data.
- The final instance of `useQuery({ queryKey: ['todos'], queryFn: fetchTodos })` unmounts.
- No more instances of `useQuery({ queryKey: ['todos'], queryFn: fetchTodos })` appear within 5 minutes.
  - The cached data under the `['todos']` key is deleted and garbage collected.

# Query Invalidation

- 캐싱된 데이터는 항상 최신 데이터를 반영하고 있지는 않다. 시간이 지나면 데이터베이스와 차이가 생길 수 있다
- 그래서 변경 가능성이 높은 데이터는 적당한 시점에 데이터베이스로부터 다시 불러와 동기화하는 것이 좋다
- Next.js에서는 이를 Data Revalidation이라고 하고, Tanstack Queryt에서는 이를 Query Invalidation이라고 한다
- gcTime, staleTime 으로 revalidation 할 수 있지만, 동적으로 시점을 정하고 싶다면 `queryClient.invalidateQueries()`를 호출해 원하는 시점에 명시적으로 revalidation할 수도 있다

- Waiting for queries to become stale before they are fetched again doesn't always work, especially when you know for a fact that a query's data is out of date because of something the user has done. For that purpose, the QueryClient has an invalidateQueries method that lets you intelligently mark queries as stale and potentially refetch them too!

# Fetching State

- isFetching: In any state, if the query is fetching at any time (including background refetching) `isFetching` will be `true`.
- isError: The query encountered an error
- isPending: The query has no data yet
- isSuccess: The query was successful and data is available

# Pagination

## Paginated Queries

```js
const result = useQuery({
  queryKey: ['projects', page],
  queryFn: fetchProjects,
})
```

- placeholderData: 다음 페이지 데이터가 패칭되는 동안 이전 페이지 데이터를 계속 제공함으로써 좀더 높은 UI 제공

```js
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import React from 'react'

function Todos() {
  const [page, setPage] = React.useState(0)

  const fetchProjects = (page = 0) =>
    fetch('/api/projects?page=' + page).then((res) => res.json())

  const { isPending, isError, error, data, isFetching, isPlaceholderData } =
    useQuery({
      queryKey: ['projects', page],
      queryFn: () => fetchProjects(page),
      placeholderData: keepPreviousData,
    })

  return (
    <div>
      {isPending ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          {data.projects.map((project) => (
            <p key={project.id}>{project.name}</p>
          ))}
        </div>
      )}
      <span>Current Page: {page + 1}</span>
      <button
        onClick={() => setPage((old) => Math.max(old - 1, 0))}
        disabled={page === 0}
      >
        Previous Page
      </button>{' '}
      <button
        onClick={() => {
          if (!isPlaceholderData && data.hasMore) {
            setPage((old) => old + 1)
          }
        }}
        // Disable the Next Page button until we know a next page is available
        disabled={isPlaceholderData || !data?.hasMore}
      >
        Next Page
      </button>
      {isFetching ? <span> Loading...</span> : null}{' '}
    </div>
  )
}
```

## Infinite Queries

- `useInfiniteQuery`


- `data` is now an object containing infinite query data:
- `data.pages` array containing the fetched pages
- `data.pageParams` array containing the page params used to fetch the pages
- The `fetchNextPage` and fetchPreviousPage functions are now available (fetchNextPage is required)
- The `initialPageParam` option is now available (and required) to specify the initial page param
- The `getNextPageParam` and `getPreviousPageParam` options are available for both determining if there is more data to load and the information to fetch it. This information is supplied as an additional parameter in the query function
- A `hasNextPage` boolean is now available and is true if `getNextPageParam` returns a value other than `null` or `undefined`
- A `hasPreviousPage` boolean is now available and is true if `getPreviousPageParam` returns a value other than `null` or `undefined`
- The `isFetchingNextPage` and `isFetchingPreviousPage` booleans are now available to distinguish between a background refresh state and a loading more state


- With this information, we can create a "Load More" UI by:
  - Waiting for `useInfiniteQuery` to request the first group of data by default
  - Returning the information for the next query in `getNextPageParam`
  - Calling `fetchNextPage` function

```js
import { useInfiniteQuery } from '@tanstack/react-query'

function Projects() {
  const fetchProjects = async ({ pageParam }) => {
    const res = await fetch('/api/projects?cursor=' + pageParam)
    return res.json()
  }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  })

  return status === 'pending' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.data.map((project) => (
            <p key={project.id}>{project.name}</p>
          ))}
        </React.Fragment>
      ))}
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
              ? 'Load More'
              : 'Nothing more to load'}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </>
  )
}
```

- It's essential to understand that calling `fetchNextPage` while an ongoing fetch is in progress runs the risk of overwriting data refreshes happening in the background. This situation becomes particularly critical when rendering a list and triggering `fetchNextPage` simultaneously.
- Remember, there can only be a single ongoing fetch for an InfiniteQuery. A single cache entry is shared for all pages, attempting to fetch twice simultaneously might lead to data overwrites.
- If you intend to enable simultaneous fetching, you can utilize the `{ cancelRefetch: false }` option (default: true) within `fetchNextPage`.
- To ensure a seamless querying process without conflicts, it's highly recommended to verify that the query is not in an `isFetching` state, especially if the user won't directly control that call.

```js
<List onEndReached={() => !isFetching && fetchNextPage()} />
```



# 참고

- [Tanstack Query 공식문서](https://tanstack.com/query/latest/docs/framework/react/overview)
- [next.js에서 react query가 필요할까?, xionwcfm](https://xionwcfm.tistory.com/339)
- [How to Setup React Query in Next.js 13 App Directory, codevoweb](https://codevoweb.com/setup-react-query-in-nextjs-13-app-directory/)