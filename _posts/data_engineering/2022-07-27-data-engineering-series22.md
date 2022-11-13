---
layout: post
title:  'Data Engineering Series [Part22]: 시스템 디자인(3) Consistent Hashing'
description: 
date:   2022-07-26 15:01:35 +0300
image:  '/images/system_design_logo.png'
logo_image:  '/images/data_engineering_logo.png'
categories: data_engineering
tags: DE
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# Why hashing?

Hash is basically a function that takes a value and converts it into another value of a specific format. Hash functions that are commonly used are MD5, SHA1, SHA256, etc.   

Suppose you build a distributed cache, where the data is distributed over various nodes, sometimes spanning multiple data centers. When we want to store the data for a user, we need to decide which node will cache this data. And when we want to retrieve this cached value, we must query the same node. So let us use a simple hash function for this again.  

```
hash(user) = Sum(ASCII value of all characters in name) % 5
```

Where 5 is the number of nodes. This way, the hashes generated for users will be as follows:

![](/images/system_design_8.png)  

Since hash(Alice) is 0, Alice’s data will be stored in node 0. Similarly, Bob’s data will be stored in node 1 and Eve’s in 4. Now when you need to look up the information for Alice, you will use the same hash function to determine which node to query. Since hash(Alice) equals 0, you will query node 0 and fetch the information.  

But there is a problem with this solution. This model is not scalable. If the traffic increases and you want to add a new node, the formula to calculate the hash will get updated to  

```
hash(user) = Sum(ASCII value of all characters in name) % 6
```

And similarly hash(Alice) will get updated to 2. So now you will search for Alice’s information in node 2, but the information is actually stored in node 0 so you won’t find it.  

To fix this, you will need to rehash all the data every time a node is added or removed, and once rehashed, you need to move the data to their respective new nodes, which could be across different data centers. This is not a very good solution as it uses up a lot of CPU resources and bandwidth.  

This is where Consistent Hashing comes in.  

# Consistent Hashing

Consistent Hashing tries to optimize the system in such a way that:  

- You don’t need to move around all the data while adding or removing nodes.
- There will be minimal movement of data as if a node is removed, the data from that node will be supported by another node. Similarly, when a node is added, some data will be mapped to it as you don’t want it to sit idle.
- You can have a nearly even distribution of data across all machines.  


The idea is **removing the number of nodes in the system out of the equation** while calculating the hash. Now hashes for data and nodes will all be independently calculated and adding or removing nodes won’t change these hashes.  

Now instead of assigning the data to these nodes in a sequential manner, we will plot these nodes, or their hashes, on the number line, and each node will be responsible for the range between its position and the position of the first node to its right. 

![](/images/system_design_9.png)

When the data comes in for storage, we will calculate its hash to determine its place on the number line. Based on which node’s range it falls in, we will map the data to that node.  

If you want to remove a node from this system, the range of the previous machine on the number line will be extended, and all the data from the removed node will be mapped to the previous node in the number line. This resolves the issue of data transfer as only the data from one machine will need to be mapped to another machine.  

But there is still a problem with this system. **After removing a node, the ranges of certain machines might not be balanced.**  

An ideal solution to this would be **assigning data between various nodes.**  

The idea is to assign the same machine to multiple hashes and map each of these hashes on the number line.  

![](/images/system_design_10.png)  

This can be achieved by either using multiple hash functions or by assigning multiple identifiers to the same node, and then calculating the hashes for all of the instanced. Then, We can map them on the number line, or what we can now refer to as a consistent hashing ring, essentially representing the same node on the ring multiple times.  

![](/images/system_design_11.png)

Now the data handled by a removed node will be distributed across the ring. So when a node needs to be removed, all its identifiers will be removed and the data will be mapped to the nodes falling to the right of each identifier, as shown in the following diagram, making the distribution much more even.  

(노드가 삭제되도, 그 노드에 저장되어 있던 데이터가 여러 해시 함수에 의해 분리된 인스턴스에 흩어져서 저장되어 있었으므로, 다른 노드로 이동할 때도 각 인스턴스의 오른쪽 인스턴스로 저장되므로 여러 노드에 분산 저장되게 된다. -> 데이터가 훨씬 even해진다.)  

The reason why it gets even is because each identifier of machine is hashed separately, with the hash function, it is very likely that they would be arranged in a random fashion like Blue_4 - Red_1 - Blue_2 - Green_3 - Red_4 - Orange_1, which makes sure that when one machine is removed, it's data us spread across multiple other machines.  

Similarly, when a new node is added, its identifiers will also be mapped across the ring, picking up data from various nodes, maintaining even distribution across the ring.  

# Where is it Used

Now we just saw how we could use consistent hashing while building a caching system. There are a lot of systems out there that use consistent hashing for improving their performance. For example, Cassandra, a distributed NoSQL Columnar DB that deals with huge traffic uses consistent hashing to distribute its data. Amazon’s Dynamo DB is another such example. It is a managed distributed DB which uses consistent hashing for distributing its data. Similarly, Couchbase is another NoSQL DB (a document DB) which uses consistent hashing to distribute its data across various instances.  