---
layout: post
title:  'Data Engineering Series [Part27]: Redis'
description: 
date:   2022-08-02 15:01:35 +0300
image:  '/images/redis_logo.png'
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

Redis: an open source, in-memory key-value database that supports abstract data structures like lists, hashes, strings, and sets   

in this article i'm going to be covering everything you need to know about redis. starting with what redis is moving on to how to install it all of the commands you need to know and then finally ending up with a real world example of how you would implement redis yourself. this is a really important video to watch because redis can be included in every single production level application and it's going to make your application more performant. so let's get started now.  

redis is essentially a type of database and more specifically it is a nosql database. but it's not very similar to any other nosql databases. it's definitely not similar to mongodb and it's obviously very different than sql databases like postgres and mysql and this is because redis doesn't really have any idea of tables or documents and instead all of the data in redis is
stored inside of key value pairs. so think about a json object you have the key name and you have the value kyle. this is essentially a key value pair and redis is just like one giant json object that has key value pairs and that's all that you have inside of redis. so it's not very good at storing a bunch of structured data like you have in sql .but it's really good for storing you know individual key value pairs that you need to access or get data from another.  

important thing to note about redis is that unlike a normal database that runs on your disk and stores all your information on disk. redis actually runs inside of your working memory your ram on your computer and this means that redis is incredibly fast because it's all working inside of ram. but it's much more unstable because if all of a sudden your system crashes you're going to lose everything that's in redis unless you're backing it up consistently, which is why redis is generally not used as like an actual persistent database store like you have with mongodb and postgres and instead it's used more **for caching** where you take things that are really you know things that you access a lot or things that take a long time to compute and you store those values inside of redis that way when you need to access them in the future. it's incredibly quick since redis is in the memory already loaded. it's milliseconds to get data as opposed to hundreds of milliseconds or even seconds of time to get data from a traditional database.  


really the important thing to realize about redis is that it's going to be built on top of a traditional database. almost always you're going to have your mongodb or postgres database in the background and you're going to have redis sitting in front of that database and any time that you have a really long or slow query to your database or you have data you access all the time but doesn't change that much what you're going to do is you're going to store that data inside of redis as well as inside your database. and then when you go to get that information if it's already in redis you can access that data in milliseconds as opposed to going all the way to the database. computing the data and then coming all the way back which is going to take you hundreds to even thousands of milliseconds depending on how complex your data is. so redis is going to take your app and make it hundreds to even thousands of times faster when it comes to querying these pieces of information.  

let's actually talk about how we can install redis. installing redis on your computer is really simple if you have a mac or linux computer. if you use mac just use homebrew to do the install and if you're on linux just use your package manager of choice to install it. it's just called redis it's that simple. but if you're on windows it's a bit more complex. because there is no way to install redis on windows. instead you need to go through the windows subsystem for linux which is pretty simple to install.  