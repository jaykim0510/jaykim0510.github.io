---
layout: post
title:  'Data Engineering Series [Part16]: 분산 시스템(Distributed Systems)에서의 네트워크와 운영체제'
description: 
date:   2022-07-22 15:01:35 +0300
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

# 운영체제 관점

# 네트워크: Inter Process Communication

Inter-process communication (IPC) is set of interfaces, which is usually programmed in order for the programs to communicate between series of processes. This allows running programs concurrently in an Operating System.  

Interprocess communication is at the heart of all distributed systems. It makes no sense to study distributed systems without carefully examining the ways that processes on different machines can exchange information. Communication in distributed systems is always based on low-level message passing as offered by the underlying network. Expressing communication through message passing is harder than using primitives based on shared memory, as available for nondistrib- uted platforms. Modem distributed systems often consist of thousands or even millions of processes scattered across a network with unreliable communication such as the Internet. Unless the primitive communication facilities of computer networks are replaced by something else, development of large-scale distributed applications is extremely difficult.  

In this chapter, we start by discussing the rules that communicating processes must adhere to, known as protocols, and concentrate on structuring those proto- cols in the form of layers. We then look at three widely-used models for commu- nication: Remote Procedure Call (RPC), Message-Oriented Middleware (MOM), and data streaming. We also discuss the general problem of sending data to multi- ple receivers, called multicasting.  

Our first model for communication in distributed systems is the remote proce- dure call (RPC). An RPC aims at hiding most of the intricacies of message pass- ing, and is ideal for client-server applications.  

In many distributed applications, communication does not follow the rather strict pattern of client-server interaction. In those cases, it turns out that thinking in terms of messages is more appropriate. However, the low-level communication facilities of computer networks are in many ways not suitable due to their lack of distribution transparency.  

An alternative is to use a high-level message-queuing model, in which communication proceeds much the same as in electronic maiI systems. Message-oriented middleware (MOM) is a subject important enough to warrant a section of its own.  

With the advent of multimedia distributed systems, it became apparent that
many systems were lacking support for communication of continuous media, such as audio and video. What is needed is the notion of a stream that can support the continuous flow of messages, subject to various timing constraints. Streams are discussed in a separate section.  

Finally, since our understanding of setting up multicast facilities has im- proved, novel and elegant solutions for data dissemination have emerged. We pay separate attention to this subject in the last section of this chapter.

## Remote Procedure Call(RPC)
Remote Procedure Call (RPC) is a communication technology that is used by one program to make a request to another program for utilizing its service on a network without even knowing the network’s details. A function call or a subroutine call are other terms for a procedure call.   

It is based on the client-server concept. The client is the program that makes the request, and the server is the program that gives the service. An RPC, like a local procedure call, is based on the synchronous operation that requires the requesting application to be stopped until the remote process returns its results. Multiple RPCs can be executed concurrently by utilizing lightweight processes or threads that share the same address space.   

Remote Procedure Call program as often as possible utilizes the Interface Definition Language (IDL), a determination language for describing a computer program component’s Application Programming Interface (API). In this circumstance, IDL acts as an interface between machines at either end of the connection, which may be running different operating systems and programming languages.  

![](/images/dist_4.png)

![](/images/dist_5.png)  


## Message based Communication

In the development of models and technologies, message abstraction is a necessary aspect that enables distributed computing. Distributed system is defined as a system in which components reside at networked communication and synchronise its functions only by movement of messages. In this, message recognizes any discrete data that is moved from one entity to another. It includes any kind of data representation having restriction of size and time, whereas it invokes a remote procedure or a sequence of object instance or a common message. This is the reason that “message-based communication model” can be beneficial to refer various model for inter-process communication, which is based on the data streaming abstraction.  

Various distributed programming model use this type of communication despite of the abstraction which is shown to developers for programming the co-ordination of shared components. Below are some major distributed programming models that uses “message-based communication model”  

- Message Passing
    - In this model, the concept of message as the major abstraction of model is introduced. The units which inter-change the data and information that is explicitly encode, in the form of message. According to then model, the schema and content of message changes or varies. Message Passing Interface and OpenMP are major example of this type of model.
- Remote Procedure Call
    - This model explores the keys of procedure call beyond the restrictions of a single process, thus pointing the execution of program in remote processes. In this, primary client-server is implied. A remote process maintains a server component, thus enabling client processes to invoke the approaches and returns the output of the execution. Messages, created by the Remote Procedure Call (RPC) implementation, retrieve the information of the procedure itself and that procedure is to execute having necessary arguments and also returns the values. The use of messages regarding this referred as marshal-ling of the arguments and return values.

## Sockets

This method is mostly used to communicate over a network between a client and a server. It allows for a standard connection which is computer and OS independent.  


# 참고

- [GeeksforGeeks: Interprocess Communication in Distributed Systems](https://www.geeksforgeeks.org/interprocess-communication-in-distributed-systems/?ref=gcse){:target="_blank"}