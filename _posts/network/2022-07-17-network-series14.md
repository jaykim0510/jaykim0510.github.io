---
layout: post
title:  'Network Series [Part14]: 네트워크 용어(4): DNS'
description: 
date:   2022-07-17 15:01:35 +0300
image:  '/images/network_logo.png'
logo_image: '/images/network_logo.png'
category: CS
tag: network
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}
---

# DNS(Domain Name System)

![](/images/dns_logo.webp)

- 도메인명을 이용해 웹 서버에 접근할 수 있도록 도와주는 서비스
- 도메인명을 IP주소로 변환해준다
- 인터넷계의 전화번호부

# Main components:   

- Domain Registrar (도메인 등록 대행 업체)
- Nameservers (네임 서버)
- DNS Records (DNS 레코드)

Let’s talk about these components and how they work together.  


## Domain Registrar

![](/images/domain_registrar.png)

- 도메인명은 도메인 등록 대행 업체로부터 구매한다
- 도메인 등록 대행 업체는 기본적으로 네임서버를 제공해준다
- DNS 레코드는 이러한 등록 대행 업체에 의해 관리된다
- 다음은 도메인명을 판매하는 도메인 등록 대행 업체의 목록이다

```
- AWS Route53
- Google Domains
- Cloudflare
- Namecheap
- GoDaddy
- Hover
```

![](/images/domain_registrar_2.png)

![](/images/domain_registrar_3.png)

## Nameserver

- DNS 레코드를 저장하고 있는 서버
- 네임서버는 등록 대행 업체(ex. GoDaddy) 또는 다른 외부 서비스(ex. Cloudflare)가 제공


If you’re trying to point your domain name to your web hosting, you’ve probably come across the term nameserver. So, what is a nameserver?  

Nameservers help connect URLs with the IP address of web servers. Nameservers are an important part of the Domain Name System (DNS), which many people call the “phone book of the Internet”.  

**What Is a Nameserver? Explained in More Detail**  

When a user enters a URL in their browser, like “kinsta.com, there needs to be some way to connect that URL with the underlying web server that powers the website at that domain name.  

Think how difficult it would be if you had to enter the actual IP address of a web server every time you wanted to visit a website. You wouldn’t be able to remember whether it was 159.89.229.118 or 159.89.229.119 — it would be a mess!  

Nameservers play an important role in connecting a URL with a server IP address in a much more human-friendly way.  

Nameservers look like any other domain name. When you look at a website’s nameservers, you’ll typically see a minimum of two nameservers (though you can use more). Here’s an example of what they look like:  

- ns-380.awsdns-47.com
- Ns-1076.awsdns-06.org

Only instead of serving up a website, those nameservers help direct traffic.  

To illustrate the role that nameservers play in directing traffic on the Internet, let’s look at a real example.  

Let’s say you want to visit the Kinsta homepage. On the surface, this action is simple: you type “kinsta.com” into your browser’s address bar and you see the Kinsta homepage. Easy, right?  

But behind-the-scenes, the high-level process actually goes something like this:  

- You type “kinsta.com” into the address bar and hit enter
- Your browser sends a request to that domain’s nameservers
- The nameservers respond back with the IP address of the website’s server
- Your browser requests the website content from that IP address
- Your browser retrieves the content and renders it in your browser


In order to visit a website you must first access a Domain Name Server. If there’s an issue with In the the decentralized naming systems responsible for turning hostnames into IP addresses, you might experience a message such as “DNS server not responding”.  

Nameservers vs DNS Records  
In the example above, we left out one point for simplicity:  

DNS records are what contain the actual information that other browsers or services need to interact with, like your server’s IP address.

Nameservers, on the other hand, help store and organize those individual DNS records.  

Earlier, we referred to DNS as the phone book of the Internet. But a more specific analogy would be that:  

- Nameservers are the physical phone book itself.
- DNS records are the individual entries in the phone book.

If you wanted to find someone’s phone number (back when phone books existed!), you’d first grab the phone book itself. Then, you’d open the phone book and go through the entries to find the specific information that you need.  

Armed with that knowledge, let’s look at a fuller sequence of what happens when you visit a website:  

- You type “kinsta.com” into the address bar and hit enter
- Your browser uses DNS to retrieve the domain’s nameservers
- Your browser asks for the A record that contains the IP address of the web server (a specific DNS record)
- The nameservers provide the IP address from the A record
- Your browser requests the website content from that IP address
- Your browser retrieves the content and renders it in your browser

**How to Use Nameservers in the Real World**  
In the real world, you’ll use nameservers and DNS records primarily to point your domain name towards your hosting.  

You also might use the DNS records supplied by your nameservers in other ways, like setting up your email account with MX records or verifying your domain name with Google Search Console.  

Where Are Your Domain’s Nameservers Located?  

The answer to this question is that “it depends”.  

When you register your domain name through a domain registrar, your domain is usually pointed towards your domain registrar’s nameservers at first. Your domain registrar is also where you can edit your domain’s nameservers.  

If you wanted to, you could leave your nameservers at your domain registrar and just edit the DNS records to point your domain name towards your web hosting.  

However, many web hosts recommend that you change your domain’s nameservers to nameservers provided by the host. For example, here at Kinsta, we provide premium nameservers powered by Amazon Route 53 that you can use (though you don’t have to):  

To change your nameservers, you’ll need to use the interface at the domain registrar where you purchased your domain name.  

For example, here’s what it looks like to change the nameservers at a domain registered through Google Domains.  

You can see that the domain is originally configured to use the Google Domains nameservers:  


## DNS Records

- 네임서버에 저장되어 있는 데이터
- zone files라고도 불림
- 변환 요청을 처리하기 위해 필요한 정보를 가지고 있음
- DNS 서버는 DNS 레코드를 보고 요청을 처리함
- 보통 DNS 레코드는 1~4시간마다 업데이트가 일어남 이 값을 TTL이라고 함

여러 종류의 DNS 레코드가 있지만 아래의 4 가지 정도가 가장 많이 사용된다  

- **A record**s: Used to point a domain or a subdomain at an IPv4 address. This is the rule used to point a domain like example.com to the web server where the example.com website lives. (Note: If a web server uses and IPv6 address rather than an IPv4 address, then an AAAA record is used rather than an A record).
- **CNAME records**: Used to associate a subdomain to the primary or canonical domain. This type of rule is commonly used to associate a www subdomain with the primary domain, such as www.example.com with example.com.
- **MX records**: Used to associate a domain with an email service. This is the type of rule used if you want mail for example.com to be delivered to a specific email service such as Gmail.
- **TXT records**: Used to associate any arbitrary text to a domain. Most commonly, TXT records are used to associate SPF records with a domain to improve email deliverability and protect against spammers misusing the domain name when sending out spam. Check out our in-depth blog post on email authentication and why it’s important.

# How Does DNS Work?

<h1> </h1>

<iframe width="560" height="315" src="https://www.youtube.com/embed/vrxwXXytEuI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<h1> </h1>

![](/images/dns_mechanism.png)

- DNS는 요청받은 도메인 명을 IP주소로 변환시켜주는데 이를 DNS resolution이라고 함
- DNS resolution은 IP주소를 알아내기 위해 아래의 4가지 종류의 DNS 서버를 필요로함

# There are 4 DNS servers involved in loading a webpage:

- **DNS recursor (DNS resolver)**: DNS 리졸버는 클라이언트로부터 요청을 받고 받은 요청을 적절한 네임서버로 전달한다
- **Root nameserver**: 루트 네임서버는 resolving을 위한 첫 단계로, 어떤 TLD 네임 서버로 가야 하는지 알려준다
- **TLD nameserver**: Top-level 도메인 서버는 다음으로 특정 호스트명을 가지는 네임서버를 안내한다
- **Authoritative nameserver**: 요청의 마지막 종착지로, 도메인명에 해당하는 정보가 있으면 IP 주소를 돌려준다

```
Note: 
Often DNS lookup information will be cached either locally inside the querying computer or
remotely in the DNS infrastructure. There are typically 8 steps in a DNS lookup. 
When DNS information is cached, 
steps are skipped from the DNS lookup process which makes it quicker. 
The example below outlines all 8 steps when nothing is cached.  
```

The 8 steps in a DNS lookup:  

- A user types ‘example.com’ into a web browser and the query travels into the Internet and is received by a DNS recursive resolver.
- The resolver then queries a DNS root nameserver (.).
- The root server then responds to the resolver with the address of a Top Level Domain (TLD) DNS server (such as .com or .net), which stores the information for its domains. When searching for example.com, our request is pointed toward the .com TLD.
- The resolver then makes a request to the .com TLD.
- The TLD server then responds with the IP address of the domain’s nameserver, example.com.
- Lastly, the recursive resolver sends a query to the domain’s nameserver.
- The IP address for example.com is then returned to the resolver from the nameserver.
- The DNS resolver then responds to the web browser with the IP address of the domain requested initially.


Once the 8 steps of the DNS lookup have returned the IP address for example.com, the browser is able to make the request for the web page:  

- The browser makes a HTTP request to the IP address.
- The server at that IP returns the webpage to be rendered in the browser (step 10).

![](/images/dns_query_1.png)



# Resolution

Resolution is the process of asking for the resource records of a fully-qualified domain name (FQDN) and receiving back an answer. Every time that your computer does not have an IP address cached for a required FQDN, a resolution takes place. In this post, I discuss the main components involved in DNS resolution and explain the two main methods in which resolution is performed.

## Components
There are five main components that play a role in DNS resolution.  

The first component is the client. This is the host that is asking the question, "Where is www.netflix.com on the internet?"  

The second component is the DNS resolver. Typically provided by your ISP, this serves as the first component that the client reaches out to if the answer to the DNS query is not cached by the client. Its role is to query the other components to find the answer to the original question. The way it does this depends on the type of DNS resolution being performed.  

Clients can configure their settings to use a DNS resolver not provided by their ISP. Google, Cloudflare, Verisign, and Cisco are just a handful of companies that offer free-alternative DNS resolvers. Be aware of which resolver you choose though! Every site you visit will likely send a DNS query which is handled by your chosen DNS resolver. This gives that resolver an ability to see what you request and may sell this data to advertisers. Always read the policies of DNS resolvers that you are considering to use.  

The third component is the DNS Root Zone, which is questioned if the DNS resolver does not have the answer in cache. Its role is to return the nameservers for the requested TLD. There are 13 root servers in the world operated by 12 organizations. These servers are anycasted and I go into more detail about them in my DNS Architecture post.  

The fourth component is the TLD's Nameservers. Its role is to return the authoritative nameservers of the requested second-level domain.  

Finally, the fifth component is the Authoritative Nameservers. These servers are the responsibility of the registrant to provide, and their role is to return the resource record for the requested third-level domain (or apex domain).  

## Iterative Resolution
There are two types of resolution, the first is iterative. In an iterative resolution, it is the responsibility of the DNS resolver to keep querying nameservers until it gets an answer.  

A flowchart describing iterative resolution.  

Let's go through each step in more detail.  

- The client sends an iterative DNS query for www.blakes.site..  
- The DNS resolver receives this query. If it doesn't have an answer for this query already cached, it will continue by asking a root server where the nameservers for .site are. If it is cached, the answer will be returned here and the process will terminate. Sidenote: The DNS resolver could also store cache entries for the .site TLD nameservers and the blakes.site authoritative nameservers and skip the appropriate steps.  
- The root server returns the IP addresses for the .site nameservers. It also can cache the .site nameservers for future usage.  
- The DNS resolver now has to ask the .site TLD nameservers for the IP addresses of the blakes.site authoritative nameservers. It also can cache the .site nameservers for future usage.
- The .site TLD nameservers return the IP addresses for the blakes.site authoritative nameservers. The DNS resolver can cache the blakes.site authoritative nameservers for future usage.
- The DNS resolver asks the blakes.site authoritative nameservers for the resource records for the entry www.
- The blakes.site authoritative nameservers return the resource records for the entry www.
- The DNS resolver caches the response and returns it back to the client.

## Recursive Resolution
The alternative to iterative resolution is recursive resolution. Instead of an address to the next nameserver being sent back to the DNS resolver to then query, the nameserver makes the request itself and returns the result all the way back up to the DNS resolver.  

A flowchart describing recursive resolution.  

Let's also go through this resolution step-by-step.  

- The client sends a recursive DNS query for www.blakes.site.. Nothing new.
- The DNS resolver receives this query. If it doesn't have an answer for this query already cached, it will continue by asking a root server for the answer to www.blakes.site.. If it is cached, the answer will be returned here and the process will terminate.
- If the root server did not have an answer cached, then it asks the next component that could have an answer: the TLD nameservers. The root servers can also cache the TLD nameservers for the requested domain for future use.
- If the TLD nameservers did not have an answer cached, then it asks the next component that could have an answer: the authoritative nameservers. The TLD nameservers can also cache the authoritative nameservers for the requested domain for future use.
- The authoritative nameservers find an answer for www.blakes.site. and pass the answer up back to the TLD nameservers.
- The TLD nameservers pass the answer back up to the root server.
- The root server passes the answer back to the DNS resolver.
- The DNS resolver caches and passes the answer back to the client.

There is caching at each component, so it is possible that only a partial resolution has to take place for a query. If the requested FQDN is popular and the DNS resolver is being used by a lot of people, then it is completely possible that the root servers are never contacted.  

## Recursive Resolution: Pros/Cons
In general, recursive resolution tends to be faster than its iterative counterpart due to caching of final answers. However, this type of resolution creates security flaws including cache poisoning and DNS amplification attacks.

## Responsibility: Recursive vs Iterative
In recursive resolution, the burden of having to contact nameservers belongs to the server. On the flip side, for iterative resolution, the burden of contacting nameservers belongs to the client.


# What is DNS caching? Where does DNS caching occur?

- 도메인명-IP주소를 간단히 매핑하여 저장함으로써 리졸빙을 빠르게 할 수 있다

## Browser DNS caching

- 브라우저에 매핑 관계를 저장해둔다
- 브라우저에 도메인명을 입력하면 브라우저는 가장 처음으로 브라우저에 캐시된 매핑 관계를 확인한다

In Chrome, you can see the status of your DNS cache by going to chrome://net-internals/#dns.  

## Operating system (OS) level DNS caching

- 요청을 ISP가 제공해주는 리졸버에게 전달하기 전에 마지막으로 들리는 로컬 환경이다

# DNS 질의 과정과 우선순위

## /etc/hosts

DNS가 없던 아주 옛날에는 모든 서버의 `/etc/hosts` 파일에는 아래와 같은 형식으로 domain과 IP주소의 짝을 직접 등록하여 도메인에 대한 IP주소를 찾아가도록 하였다. DNS서버를 운영할때 기본값으로 `/etc/hosts` 파일을 먼저 읽어 들인다. 요청받은 도메인이 이 곳에 등록되어 있다면 DNS요청을 네임서버에 보내지않고 이 곳에 등록되어 있는 주소로 연결이 된다. 그리하여 일종의 트릭으로 원하는 IP와 도메인명을 등록하고 사용할 수도 있다.  

```
<IP주소>    <hostname>
127.0.0.1  localhost
```

## /etc/host.conf

이 파일은 어떤 특정 도메인에 대해 IP주소값을 찾을 때, 주소 값을 어디에서 찾을 것인가를 결정하는 파일이다.  

![](/images/ip_2.png)

hosts : `/etc/hosts`파일을 말한다.bind : DNS를 말한다. 즉, `/etc/resolv.conf`에 정의된 nameserver를 의미한다.nis : NIS에 의한 도메인 쿼리를 말한다. 위의 내용으로 예를 들면 어떤 PC로 부터 자신(DNS서버)에게 도메인 주소를 IP로 알려달라는 질의 요청이 왔다. 맨 처음은 `/etc/hosts` 파일에서 찾아본 후, 없으면 `/etc/resolv.conf`파일에 정의된 nameserver에게 쿼리하는 순서이다. 즉, 도메인 네임 서비스를 어디서 받을 것인가를 정의해 놓은 파일이라는 것이다.  

## /etc/resolv.conf
이 파일은 사용하고자 하는 네임서버를 지정하는 파일이다.  

구성을 보도록 하자.  

![](/images/ip_3.png)

search는 호스트+도메인으로 사용할 도메인 명을 지정해둔 것이다. 거의 모두 호스트명과 도메인 명을 함께 사용한다. 하지만 특별하게 호스트명만 사용되었을 때 사용하게될 기본 도메인명을 의미하는 것이다.예를 들어 search abc.com 이라고 가정하자. 그럼 "telnet 호스트명"과 같이 "telnet www"라고 하였을 경우에 자동으로 "telnet www.abc.com"으로 인식하는 것이다. nameserver는 말 그대로 이 서버에서 사용할 네임서버를 지정해둔 것이다.  

```
DNS 처리과정 우선순위 

1. Local 환경 쿼리 (자기 자신)
2. 내부 네트워크 쿼리
3. 외부 공인 DNS 쿼리
```

# Domain Name Hierarchy

![](/images/fqdn.png)

Alternatively referred to as a namespace, a domain namespace is a name service provided by the Internet for Transmission Control Protocol networks/Internet Protocol (TCP/IP). DNS is broken up into domains, a logical organization of computers that exist in a larger network. Below is an example of the hierarchy of domain naming on the Internet.  

![](/images/domain_name_hierarchy.png)

In the example above, all websites are broken into regional sections based on the TLD (top-level domain). With http://support.computerhope.com, it has a ".com" TLD, "computerhope" as its second level domain (local to the .com TLD), and "support" as its subdomain, which is determined by its server.  


# 참고

- [How To Set Permanent DNS Nameservers in Ubuntu and Debian](https://www.tecmint.com/set-permanent-dns-nameservers-in-ubuntu-debian/){:target="_blank"}
- [kinsta, What Is DNS? Domain Name System Explained](https://kinsta.com/knowledgebase/what-is-dns/){:target="_blank"}
- [kinsta, What Is a Nameserver? Why Are Nameservers Important?](https://kinsta.com/knowledgebase/what-is-a-nameserver/){:target="_blank"}
- [CLOUDFLARE, What is DNS?](https://www.cloudflare.com/ko-kr/learning/dns/what-is-dns/){:target="_blank"}
- [IT_Dexter:티스토리](https://itdexter.tistory.com/261){:target="_blank"}
- [Whackur's Blog:티스토리](https://whackur.tistory.com/45){:target="_blank"}
- [hozero.log, [SAA] 섹션 10: Route 53](https://velog.io/@hozero/SAA-%EC%84%B9%EC%85%98-10-Route-53){:target="_blank"}
- [Blake Khan, DNS Explained. Hierarchy and Architecture](https://dev.to/blake/dns-explained-hierarchy-and-architecture-18pj){:target="_blank"}