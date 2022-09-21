---
layout: post
title:  'Network Series [Part14]: 네트워크 용어(4): DNS'
description: 
date:   2022-07-17 15:01:35 +0300
image:  '/images/dns_logo.webp'
logo_image: '/images/cs_logo.jpeg'
categories: CS
tags: Network
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}
---


# DNS(Domain Name System)

- 도메인명을 이용해 웹 서버에 접근할 수 있도록 도와주는 서비스
- 도메인명을 IP주소로 변환해준다
- 인터넷계의 전화번호부

## Main components:   

- Domain Registrar
- Nameservers
- DNS Records
- Web-based services (such as website hosting and email)

Let’s talk about these four components and how they work together.  


## Domain Registrar

A domain registrar is the service provider where domain names are purchased and where domain registration is maintained (such as GoDaddy or Namecheap). Here is list of the best domain registrars.  

- Google Domains
- Cloudflare
- Namecheap
- GoDaddy
- Hover

**The registrar is where the domain nameservers are specified.**  

Most registrars include basic DNS service with the cost of domain registration. As a result, unless you add custom nameservers to the domain, the domain will use the registrar’s standard nameservers. This means that in the vast majority of cases, by default, DNS records are managed by the registrar.  

## Nameserver

Nameservers are servers much like web servers. However, they are configured to store DNS records rather than to serve up websites or web applications.  

This means that when you want to change any DNS record you must change those DNS records on the nameservers that have been specified by the registrar or third-party service such as Cloudflare.  

This step is often a little confusing, so let’s break this down a little bit by looking at a fictional example:  

- Your domain (example.com) is registered at GoDaddy.
- You add Cloudflare’s nameservers to example.com within your GoDaddy account to start using Cloudflare.
- You change a DNS record for example.com at GoDaddy. This change will not do anything because the domain is not using GoDaddy’s nameservers.
- You make the same DNS change for example.com at Cloudflare. This change will be effective because the domain is using Cloudflare’s nameservers.

So in other words, if you are only using GoDaddy, you will need to update your DNS records with GoDaddy as they control your nameservers. If you are using Cloudflare, you will need to update your DNS records with Cloudflare as they control your nameservers. The same goes for those using Kinsta DNS.  

You can’t visit a website without first accessing a Domain Name Server. In the process, you might be met with a message such as “DNS server not responding”, which basically means that the decentralized naming systems responsible for turning hostnames into IP addresses failed to respond.  

## DNS Records
DNS records associate a domain with a web-based service.  

DNS records (aka zone files) are instructions that live in authoritative DNS servers and provide information about a domain including what IP address is associated with that domain and how to handle requests for that domain. These records consist of a series of text files written in what is known as DNS syntax. DNS syntax is just a string of characters used as commands that tell the DNS server what to do. All DNS records also have a ‘TTL’, which stands for time-to-live, and indicates how often a DNS server will refresh that record.  

You can think of a set of DNS records like a business listing on Yelp. That listing will give you a bunch of useful information about a business such as their location, hours, services offered, etc. All domains are required to have at least a few essential DNS records for a user to be able to access their website using a domain name, and there are several optional records that serve additional purposes.  

There are several different types of DNS records, but in most cases, only 4 or 5 types of DNS records are used:  

- **A record**s: Used to point a domain or a subdomain at an IPv4 address. This is the rule used to point a domain like example.com to the web server where the example.com website lives. (Note: If a web server uses and IPv6 address rather than an IPv4 address, then an AAAA record is used rather than an A record).
- **CNAME records**: Used to associate a subdomain to the primary or canonical domain. This type of rule is commonly used to associate a www subdomain with the primary domain, such as www.example.com with example.com.
- **MX records**: Used to associate a domain with an email service. This is the type of rule used if you want mail for example.com to be delivered to a specific email service such as Gmail.
- **TXT records**: Used to associate any arbitrary text to a domain. Most commonly, TXT records are used to associate SPF records with a domain to improve email deliverability and protect against spammers misusing the domain name when sending out spam. Check out our in-depth blog post on email authentication and why it’s important.

## Web Services
In our case, the web service is website hosting. An A record (or AAAA record) must be added to a domain’s nameservers to associate that domain with the web servers that host the website.  

There are many other types of web services that are associated with a domain through DNS records: email, SFTP, hosting control panels, webmail applications, and phpMyAdmin just to name a few.


## How Does DNS Work?

- DNS는 요청받은 도메인 명을 IP주소로 변환시켜주는데 이를 DNS resolution이라고 함
- DNS resolution은 IP주소를 알아내기 위해 아래의 4가지 종류의 DNS 서버를 필요로함

When a user enters a URL in their web browser, DNS gets to work to connect that URL to the IP address of the actual server. This is called DNS name resolution and involves a DNS recursor querying various nameservers to figure out the actual IP address of a server.  


## There are 4 DNS servers involved in loading a webpage:

- **DNS recursor**: The recursor can be thought of as a librarian who is asked to go find a particular book somewhere in a library. The DNS recursor is a server designed to receive queries from client machines through applications such as web browsers. Typically the recursor is then responsible for making additional requests in order to satisfy the client’s DNS query.
- **Root nameserver**: The root server is the first step in translating (resolving) human readable host names into IP addresses. It can be thought of like an index in a library that points to different racks of books - typically it serves as a reference to other more specific locations.
- **TLD nameserver**: The top level domain server (TLD) can be thought of as a specific rack of books in a library. This nameserver is the next step in the search for a specific IP address, and it hosts the last portion of a hostname (In example.com, the TLD server is “com”).
- **Authoritative nameserver**: This final nameserver can be thought of as a dictionary on a rack of books, in which a specific name can be translated into its definition. The authoritative nameserver is the last stop in the nameserver query. If the authoritative name server has access to the requested record, it will return the IP address for the requested hostname back to the DNS Recursor (the librarian) that made the initial request.

## DNS Propagation
When you make a change to the DNS of a given domain – such as updating a DNS record or switching nameservers – those changes take some time to take effect. This time is called propagation.  

Propagation varies considerably from one situation to the next.  

In the case of DNS records, each record has an associated TTL (Time to Live) value. This value determines how quickly changes to DNS records will take effect.  

In most cases, TTL for DNS records is set to 1 or 4 hours by default. This means that most of the time DNS changes will take as much as 4 hours to take effect. Higher TTL values are also possible and will mean that when a DNS record is updated that it will take more time before the changes take full effect. In some extreme cases, some might have TTL values as high as one week.  

In the case of nameservers, the registrar determines the TTL value and it generally cannot be changed. This means that when you switch to new nameservers it can take from a few minutes up to a day or longer for those changes to take effect.  

The hosting provider (Kinsta) cannot speed up DNS propagation. What you can do is reduce TTL well in advance of making any changes to DNS records so that the changes propagate as quickly as possible. You can use an online tool like whatsmydns.net to test to see if your DNS changes have finished propagating.  

## What are the steps in a DNS lookup?
For most situations, DNS is concerned with a domain name being translated into the appropriate IP address. To learn how this process works, it helps to follow the path of a DNS lookup as it travels from a web browser, through the DNS lookup process, and back again. Let's take a look at the steps.  

Note: Often DNS lookup information will be cached either locally inside the querying computer or remotely in the DNS infrastructure. There are typically 8 steps in a DNS lookup. When DNS information is cached, steps are skipped from the DNS lookup process which makes it quicker. The example below outlines all 8 steps when nothing is cached.  

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

## What is a DNS resolver?
The DNS resolver is the first stop in the DNS lookup, and it is responsible for dealing with the client that made the initial request. The resolver starts the sequence of queries that ultimately leads to a URL being translated into the necessary IP address.  

Note: A typical uncached DNS lookup will involve both recursive and iterative queries.  

It's important to differentiate between a recursive DNS query and a recursive DNS resolver. The query refers to the request made to a DNS resolver requiring the resolution of the query. A DNS recursive resolver is the computer that accepts a recursive query and processes the response by making the necessary requests.  

![](/images/dns_query_2.png)

## What are the types of DNS queries?  

In a typical DNS lookup three types of queries occur. By using a combination of these queries, an optimized process for DNS resolution can result in a reduction of distance traveled. In an ideal situation cached record data will be available, allowing a DNS name server to return a non-recursive query.  

3 types of DNS queries:  

- Recursive query - In a recursive query, a DNS client requires that a DNS server (typically a DNS recursive resolver) will respond to the client with either the requested resource record or an error message if the resolver can't find the record.
- Iterative query - in this situation the DNS client will allow a DNS server to return the best answer it can. If the queried DNS server does not have a match for the query name, it will return a referral to a DNS server authoritative for a lower level of the domain namespace. The DNS client will then make a query to the referral address. This process continues with additional DNS servers down the query chain until either an error or timeout occurs.
- Non-recursive query - typically this will occur when a DNS resolver client queries a DNS server for a record that it has access to either because it's authoritative for the record or the record exists inside of its cache. Typically, a DNS server will cache DNS records to prevent additional bandwidth consumption and load on upstream servers.

## What is DNS caching? Where does DNS caching occur?

The purpose of caching is to temporarily stored data in a location that results in improvements in performance and reliability for data requests. DNS caching involves storing data closer to the requesting client so that the DNS query can be resolved earlier and additional queries further down the DNS lookup chain can be avoided, thereby improving load times and reducing bandwidth/CPU consumption. DNS data can be cached in a variety of locations, each of which will store DNS records for a set amount of time determined by a time-to-live (TTL).  

### Browser DNS caching
Modern web browsers are designed by default to cache DNS records for a set amount of time. The purpose here is obvious; the closer the DNS caching occurs to the web browser, the fewer processing steps must be taken in order to check the cache and make the correct requests to an IP address. When a request is made for a DNS record, the browser cache is the first location checked for the requested record.   

In Chrome, you can see the status of your DNS cache by going to chrome://net-internals/#dns.  

### Operating system (OS) level DNS caching
The operating system level DNS resolver is the second and last local stop before a DNS query leaves your machine. The process inside your operating system that is designed to handle this query is commonly called a “stub resolver” or DNS client. When a stub resolver gets a request from an application, it first checks its own cache to see if it has the record. If it does not, it then sends a DNS query (with a recursive flag set), outside the local network to a DNS recursive resolver inside the Internet service provider (ISP).  

When the recursive resolver inside the ISP receives a DNS query, like all previous steps, it will also check to see if the requested host-to-IP-address translation is already stored inside its local persistence layer.  

The recursive resolver also has additional functionality depending on the types of records it has in its cache:  

- If the resolver does not have the A records, but does have the NS records for the authoritative nameservers, it will query those name servers directly, bypassing several steps in the DNS query. This shortcut prevents lookups from the root and .com nameservers (in our search for example.com) and helps the resolution of the DNS query occur more quickly.
- If the resolver does not have the NS records, it will send a query to the TLD servers (.com in our case), skipping the root server.
- In the unlikely event that the resolver does not have records pointing to the TLD servers, it will then query the root servers. This event typically occurs after a DNS cache has been purged.
Learn about what differentiates Cloudflare DNS from other DNS providers.


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

## 리눅스 DNS 질의 과정과 우선순위

1. nscd ( Name Service Cache Daemon ) - nscd 데몬이 설치되었을 경우에만 활성화. 윈도우의 dns cache와 같다.
2. `/etc/host.conf` 파일의 설정에 따라서 순서가 바뀔 수 있다. 기본 설정으로는 /etc/hosts 파일을 참조한다. 두번째로 bind 패키지를 따른다. bind 패키지로 리눅스 DNS 서버를 구축할 수 있다. 이는 패키지가 설치되어 있을 경우에만 활성화된다. bind 내부 설정에 따른 순위 변화는 생략.
3. 리눅스에 따라 GUI 환경의 네트워크 설정 어플리케이션으로 DNS 설정(리눅스마다 약간씩 차이가 있을 수 있음. 보통은 GUI 환경에서 설정하는 것이 우선적으로 작용한다.)
4. `/etc/resolvconf/resolv.conf.d` 디렉토리 내부 설정. 이 디렉토리는 base, head 파일과 `/etc/network/interfaces` 파일을 이용하여 `resolv.conf` 파일을 수정함.(리눅스마다 약간씩 차이가 있을 수 있음. 우분투에서 확인)
5. `/etc/resolv.conf` 파일 : 윈도우의 네트워크 인터페이스 설정과 같음.
6. 내부 네트워크 DNS 질의 - 5번 과정에서 내부 네트워크 DNS로 맵핑했을 경우. ex) Kerberos Linux DNS server, Active Directory DNS, VMWare의 Gateway 등.
7. 외부 네트워크 DNS 질의


위의 과정을 크게 나누어 보면 아래와 같다.

1. Local 환경 쿼리 (자기 자신)
2. 내부 네트워크 쿼리
3. 외부 공인 DNS 쿼리


리눅스에서 DNS 질의 과정 추적 명령어 dig를 사용할 수 있다. 윈도우는 따로 설치해야 한다.  

추가 : 공유기에서 할당하는 DNS 설정은 보통 KT, SKT 등의 통신사 DNS 서버인데, 공유기에서 설정하는 값 보다 시스템에서 설정하는 값이 먼저이다. 하지만 별도의 설정이 없다면 OS 부팅 시 DHCP를 공유기 정보에서 받아 설정하도록 되어있다.  


## Nameserver

[kinsta, What Is a Nameserver? Why Are Nameservers Important?](https://kinsta.com/knowledgebase/what-is-a-nameserver/){:target="_blank"}

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


# 참고

- [How To Set Permanent DNS Nameservers in Ubuntu and Debian](https://www.tecmint.com/set-permanent-dns-nameservers-in-ubuntu-debian/){:target="_blank"}
- [kinsta, What Is DNS? Domain Name System Explained](https://kinsta.com/knowledgebase/what-is-dns/){:target="_blank"}
- [kinsta, What Is a Nameserver? Why Are Nameservers Important?](https://kinsta.com/knowledgebase/what-is-a-nameserver/){:target="_blank"}
- [CLOUDFLARE, What is DNS?](https://www.cloudflare.com/ko-kr/learning/dns/what-is-dns/){:target="_blank"}
- [IT_Dexter:티스토리](https://itdexter.tistory.com/261){:target="_blank"}
- [Whackur's Blog:티스토리](https://whackur.tistory.com/45){:target="_blank"}