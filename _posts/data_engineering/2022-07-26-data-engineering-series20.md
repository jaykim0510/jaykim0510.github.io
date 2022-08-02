---
layout: post
title:  'Data Engineering Series [Part20]: 시스템 디자인(1) Intro + Architecture'
description: 
date:   2022-07-26 15:01:35 +0300
image:  '/images/data_engineering_logo.png'
logo_image:  '/images/data_engineering_logo.png'
categories: DE
tags: Data_Engineering
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---
# Intro

## What will be covered?
- Introduction to System Design: Start with an introduction of the course, explanations on high level and low level design, interviewer's expectations, and how to approach these kind in an interview.
- System Design Basics: Build a strong foundation of System Design fundamentals that are useful in understanding the dynamics of highly scalable systems.
- System Design Case Studies: Cover the 11 most frequently asked interview questions with a detailed walkthrough.
- Problem Solving: Apply your understanding of the preceding chapters with the help of some practice problems and quizzes.

## High Level System Design

- **Overall architecture**: How the system can be built such that it takes care of scalability, latency, and other performance requirements

- **Components and services**: Any system is a collection of various services and other components interacting with each other. In this part of high level design, we need to decide how the system will be broken down, what will the microservices be, and their scope.

- **Interaction between the systems**: How will the systems interact with each other? What protocols will you use? Will it be synchronous or asynchronous? You need to make these decisions based on the requirements.

- **Databases**: What databases will you need? What kind of data do you need to store? SQL or NoSQL, what will be the database schema? Depending on how much detail the interviewer wants you to go into, you may have to make these decisions as well.

## Low Level System Design (Code Quality)

- **API**: If you’re trying to build a web server, define your APIs clearly. For example, if you decide to make REST APIs, ensure they follow REST standards. Similarly, if you are building a library, define the APIs in a very clean manner as publicly accessible functions such that the client can easily integrate them
- **Test Code**: This means we should have a working code with some basic test cases that are passing for the logic we have written.
- **Modular**: how easy it is to add new features without interfering with existing code.

# Application Architecture

## Monolithic Architecture

Back when the internet was just starting to gain popularity, websites used to serve mostly static content. There wasn’t a lot of user interaction like we see now. The applications were much less complex, and so was their architecture. A single application used to take care of the entire user journey, everything from UI rendering to backend business logic to fetching the data from DBs or File Systems. This was the world of Web 1.0.  

Then came Web 2.0 with social networks, e-commerce, and online gaming and things became a lot more interactive. By this time everything was still maintained in a single huge codebase. If you consider an e-commerce system, back then everything from UI to business logic for payments, carts, orders, etc. was maintained in a single codebase. This is known as Monolithic Architecture.  

![](/images/system_design_1.png)  

The problem with this approach was that the code was very complex, difficult to maintain, and hard to iterate and improve. On top of that, multiple people were working on the same codebase; it was a recipe for disaster.  

**Disadvantage of Monolithic Architecture**  

- One of the most common problems with monoliths is that you are **bound to a single technology stack**. Suppose you have a monolith built on Java with Spring framework. Now you need to add some Machine Learning logic, and you want to use Python for it. That is nearly impossible in monolithic architecture. You either need to figure out a way to do this with Java, or you need a standalone application that handles your machine learning logic, which defeats the purpose of a monolithic app.
- Another problem would be that it is very **easy to break** things in such an architecture. That is because, when you have such a huge codebase, it is nearly impossible for everyone to know everything about how the entire system works. If you change some logic in the shared code, you might end up breaking someone else’s feature. Sure you can have test cases, but even those are not enough sometimes.
- Another major issue is scalability. It is very **tricky to scale a monolithic application**. Let us look at the example of an e-commerce application. In case of a Black Friday sale, you might need to scale your payments and cart modules, but Warehouse and Notification modules can continue to work at the same pace. This cannot be done in a monolithic app. Since it is the same codebase, you will need to deploy the entire system again and again. This means the capacity meant for the Warehouse module might be sitting idle or that the Payment and Cart modules may choke the rest of the system.
- Deployments are also a very tedious process here. Since the code is huge, it takes **much longer to build**, package, and deploy the code. That said, if you update the code for Warehousing, even the Payments module must be redeployed since everything is packaged together.


## Microservice Architecture

![](/images/system_design_2.png)

The idea is to break down the application into logical components such that these components become services of their own. Normally this is also how the teams would be structured, so each team would work on the services that handle their features. These services will now be communicating with each other via a set of API calls like REST APIs or Remote Procedure Calls.  

**Benefits of Microservice Architecture**  

- We are not bound to a single technology stack anymore. Different services can use different languages or databases as needed.
- Each system does one thing and does it well, without worrying about breaking another set of features.
- Engineers will be working on and maintaining a smaller codebase.
- Iterating, deploying, and testing becomes a lot easier.
- Unlike in monolith, we can now independently scale up Cart and Payments Services, and the rest of the services can continue working as they are. This ensures optimized use of resources and makes auto-scaling a lot easier.

**Disadvantage of Microservice Architecture**  

- Latency
    - One of the key reasons is latency. Function calls are faster than API calls, so it makes sense that monoliths will have lower latency. Usually, this latency is not high enough to be noticed by the user, but if you are working on something that needs a response in a few microseconds then you should definitely think about using monolithic architecture.
    - With network calls comes the possibility of network failures and slightly increases the complexity of error handling and retries.
- Backward Compatibility
    - If a service needs a new mandatory parameter and the other services have not made the change accordingly, certain flows will break.
    - In monolith it will be caught in the development phase since the compiler will throw an error. To solve this we need some good automated test cases.
- Logging
    - If you need to trace logs for a user in monoliths, it is easy to do so as they are all in the same place. But in microservices, for each request from the user there will be multiple service calls.
    - In the below example, consider a single request from the user to the order service. The order service is talking to Inventory, Payment, Warehouse, and Notification Services, and thus there will be logs in each of these services. So tracing exactly what happened becomes very difficult as we need to check logs in each system.
    - A better approach would be to store all the logs in a central place where they can be queried. This is a cost since you either need to build a Log Aggregation System or buy a third-party system’s license.

# Conclusion
In conclusion, if you are a small business working with a small team and have a limited set of features, monolith might be a better approach for you. However, if you are working on a huge product with hundreds of microservices, the maintenance cost of microservices will be worthwhile.  

Also, usually, when you think about HLD(High Level Design) interviews, chances are you will be developing an overall architecture for a complex system that might be difficult to design in a monolithic manner. So thinking in terms of microservices will be a good idea.  