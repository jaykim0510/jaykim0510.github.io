---
layout: post
title:  'Data Engineering Series [Part17]: Distributed Systems(3) 네트워크와 운영체제'
description: 
date:   2022-07-23 15:01:35 +0300
image:  '/images/distributed_logo.png'
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

![](/images/dist_5.png)    

Remote Procedure Call (RPC) is a communication technology that is used by one program to make a request to another program for utilizing its service on a network without even knowing the network’s details. A function call or a subroutine call are other terms for a procedure call.   

It is based on the client-server concept. The client is the program that makes the request, and the server is the program that gives the service. An RPC, like a local procedure call, is based on the synchronous operation that requires the requesting application to be stopped until the remote process returns its results. Multiple RPCs can be executed concurrently by utilizing lightweight processes or threads that share the same address space.   

Remote Procedure Call program as often as possible utilizes the Interface Definition Language (IDL), a determination language for describing a computer program component’s Application Programming Interface (API). In this circumstance, IDL acts as an interface between machines at either end of the connection, which may be running different operating systems and programming languages.  


**Elements of RPC**  

![](/images/rpc_1.png)

- **Client**: The client process initiates RPC. The client makes a standard call, which triggers a correlated procedure in the client stub.
- **Client Stub**: Stubs are used by RPC to achieve semantic transparency. The client calls the client stub. Client stub does the following tasks:
    - The first task performed by client stub is when it receives a request from a client, it packs(marshalls) the parameters and required specifications of remote/target procedure in a message.
    - The second task performed by the client stub is upon receiving the result values after execution, it unpacks (unmarshalled) those results and sends them to the Client.
- **RPC Runtime**: The RPC runtime is in charge of message transmission between client and server via the network. Retransmission, acknowledgment, routing, and encryption are all tasks performed by it. On the client-side, it receives the result values in a message from the server-side, and then it further sends it to the client stub whereas, on the server-side, RPC Runtime got the same message from the server stub when then it forwards to the client machine. It also accepts and forwards client machine call request messages to the server stub.
- **Server Stub**: Server stub does the following tasks:
    - The first task performed by server stub is that it unpacks(unmarshalled) the call request message which is received from the local RPC Runtime and makes a regular call to invoke the required procedure in the server.
    - The second task performed by server stub is that when it receives the server’s procedure execution result, it packs it into a message and asks the local RPC Runtime to transmit it to the client stub where it is unpacked.
- **Server**: After receiving a call request from the client machine, the server stub passes it to the server. The execution of the required procedure is made by the server and finally, it returns the result to the server stub so that it can be passed to the client machine using the local RPC Runtime.

**Working Procedure for RPC Model**  

- The process arguments are placed in a precise location by the caller when the procedure needs to be called.
- Control at that point passed to the body of the method, which is having a series of instructions.
- The procedure body is run in a recently created execution environment that has duplicates of the calling instruction’s arguments.
- At the end, after the completion of the operation, the calling point gets back the control, which returns a result.
  - The call to a procedure is possible only for those procedures that are not within the caller’s address space because both processes (caller and callee) have distinct address space and the access is restricted to the caller’s environment’s data and variables from the remote procedure.
  - The caller and callee processes in the RPC communicate to exchange information via the message-passing scheme.
  - The first task from the server-side is to extract the procedure’s parameters when a request message arrives, then the result, send a reply message, and finally wait for the next call message.
  - Only one process is enabled at a certain point in time.
  - The caller is not always required to be blocked.
  - The asynchronous mechanism could be employed in the RPC that permits the client to work even if the server has not responded yet.
  - In order to handle incoming requests, the server might create a thread that frees the server for handling consequent requests.

![](/images/dist_4.png)

**Advantages of Remote Procedure Calls**   

- The technique of using procedure calls in RPC permits high-level languages to provide communication between clients and servers.
- This method is like a local procedure call but with the difference that the called procedure is executed on another process and a different computer.
- The thread-oriented model is also supported by RPC in addition to the process model.
- The RPC mechanism is employed to conceal the core message passing method.
- The amount of time and effort required to rewrite and develop the code is minimal.
- The distributed and local environments can both benefit from remote procedure calls.
- To increase performance, it omits several of the protocol layers.
- Abstraction is provided via RPC.  To exemplify, the user is not known about the nature of message-passing in network communication.
- RPC empowers the utilization of applications in a distributed environment.


**Disadvantages of Remote Procedure Calls**  

- In Remote Procedure Calls parameters are only passed by values as pointer values are not allowed.
- It involves a communication system with another machine and another process, so this mechanism is extremely prone to failure.
- The RPC concept can be implemented in a variety of ways, hence there is no standard.
- Due to the interaction-based nature, there is no flexibility for hardware architecture in RPC.
- Due to a remote procedure call, the process’s cost has increased.


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
- [조원호의 행복공간: [네트워크] IPC와 RPC의 차이점](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=horajjan&logNo=220956169499){:target="_blank"}