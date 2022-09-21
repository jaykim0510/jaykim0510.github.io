---
layout: post
title:  'Network Series [Part6]: 네트워크 프로토콜(3) IP'
description: 
date:   2022-02-03 15:01:35 +0300
image:  '/images/ip_1.png'
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
# IP(Internet Protocol)

IP는 네트워크 상에서 데이터를 목적지로 보내는 역할을 하는 인터넷 계층에서 사용하는 프로토콜  

![](/images/ip_1.png)

## IP 주소
IP 주소는 인터넷에 연결하고자 하는 **디바이스가 가지고 있는 NIC(Network Interface Controller)의 고유한 주소**를 뜻합니다. 편지를 주고 받기 위해서는 서로의 주소가 필요한 것처럼 디바이스간 통신을 위해서는 IP주소가 필요합니다. IP주소는 **네트워크 번호와 호스트 번호로 이루어진 32비트 숫자**입니다.(IPv4 기준)  


- 내부 네트워크에 연결되는 라우터의 포트를 이더넷 인터페이스 (이더넷용 IP 주소는 내부에서 부여받은 IP 주소 중 첫 번째 주소)
- 외부(인터넷) 쪽으로 연결되는 인터페이스를 시리얼 인터페이스 (시리얼용 IP 주소는 ISP 업체의 라우터가 가지는 시리얼 인터페이스의 IP 주소)
- 위와 같은 가정에서 우리가 라우터에 부여해야 하는 IP 주소는 두 개가 됨
- IP 주소 중 네트워크 부분: 하나의 브로드캐스트 영역
  - 라우터를 거치지 않고 통신이 가능한 영역
  - 라우터가 라우팅할 때 참고하는 부분
  - 라우터는 다른 네트워크로 갈 때만 필요
- IP 주소 중 호스트 부분: 각각의 PC 또는 장비
- IP 주소의 Class에 따라 어디까지가 네트워크 부분이고, 어디까지가 호스트 부분인지가 나뉨 (네트워크의 크기가 달라짐)
  - 클래스 A는 이진수 중에서 맨 앞쪽 숫자가 항상 0으로 시작되는 것들
    - 호스트 수가 가장 많은 클래스
    - 앞의 8비트가 네트워크 부분, 나머지 24비트가 호스트 부분
    - `1.0.0.0` ~ `126.0.0.0` 까지로 규정 (0 시작과 127 시작은 제외) -> 126개의 네트워크, 각각의 네트워크는 라우터 없이 통신
    - 호스트는 2의 24승 - 2개(모두 0인 경우, 모두 1인 경우) = 16,777,214개 -> 16,777,214개의 호스트가 하나의 네트워크에 연결
    - 따라서 IP 주소를 모두 클래스 A로만 구성한다면 -> 126개의 네트워크 * 16,777,214개의 호스트
  - 클래스 B는 맨 앞이 10으로 시작
    - 앞의 16비트가 네트워크 부분
    - `128.0.0.0` ~ `191.255.0.0` 까지로 규정
  - 클래스 C는 맨 앞이 110으로 시작
    - 앞의 24비트가 네트워크 부분
    - `192.0.0.0` ~ `223.255.255.0` 까지로 규정

- 기본 게이트웨이(Default Gateway)
  - 내부 네트워크에서는 라우터 없이도 통신이 가능
  - 내부 네트워크에 없는 IP 주소로 갈 때는 이 기본 게이트웨이를 통해 나감
  - 즉 라우터의 이더넷 인터페이스를 의미
- 라우터는 인터페이스별로 IP 주소 부여. 스위치나 허브는 장비별로 IP 주소 부여
  
## 서브넷 마스크(Subnet Mask)

- 주어진 네트워크를 가공할 때 사용
- 우리가 일단 어떤 IP 주소를 배정받게 되면 보통 이 주소를 그대로 사용하지 않고 서브넷 마스크를 조합하여 사용
- 우리가 부여받은 net을 여러개의 subnet으로 나눈다는 의미
- 서브넷마스크를 통해 나누어진 서브넷간의 통신은 라우터를 거쳐야함
- 모든 IP 주소에는 서브넷 마스크가 따라다님. 쓰지 않더라도. 그래야 지금 IP 주소가 마스킹 된건지 아닌지 알 수 있음
- 클래스 A의 기본 서브넷 마스크는 `255.0.0.0`, B는 `255.255.0.0`, C는 `255.255.255.0`
- 서브넷 마스크는 IP주소의 어디까지가 네트워크 부분이고, 어디까지가 호스트 부분인지를 나타내는 역할을 함
- 서브넷 마스크의 이진수 1은 네트워크 부분, 이진수 0은 호스트 부분을 의미함
- 즉, 서브넷 마스킹은 기존 IP 주소의 호스트 부분의 일부를 네트워크 부분으로 바꾸는 작업

```
기존 네트워크: 150.150.100.1 => 1001 0110 1001 0110 0110 0100 0000 0001 => 클래스 B => 150.150.0.0이 네트워크를 의미
서브넷 마스크: 255.255.255.0 => 1111 1111 1111 1111 1111 1111 0000 0000 => 네트워크 자리가 16자리에서 24자리 까지로 늘림 (호스트를 8자리로 줄임)
------------------------------------------------------------------------------------------------------------------------------
서브넷: 150.150.100.0 => 1001 01110 1001 01110 01110 0100 0000 0000 => 최종적으로 서브넷 네트워크가 150.150.100.0가 됨
```

- 참고로 호스트 부분이 0인 주소는 호스트 주로로 사용하지 못함. PC에서 사용하는 주소가 아니라 네트워크 자체를 의미
- 또 호스트 부분이 255인 주소 역시 호스트 주소로 사용할 수 없음. 브로드캐스트 주소 (모든 호스트에게 메시지 보낼 때 사용하는 주소)


## IP 주소 예시

- 나의 IP 주소가 `150.150.100.1`이라고 해보자. 
- 그러면 내가 부여받은 IP 주소의 네트워크 주소는?
  - 이 물음에 대답하려면 먼저 내 IP주소의 클래스가 뭔지 알아야 한다.
  - 150.*.*.*는 클래스 B에 속한다 -> 앞의 16자리가 네트워크 주소이다
  - 즉 네트워크 주소는 `150.150.0.0`이다
- 만약 내가 AWS의 VPC와 같은 서비스를 이용해 가상 네트워크를 부여 받았는데 그 값이 `150.150.0.0`이라 해보자
- `150.150.0.0`의 나머지 16비트를 이용해 호스트에게 IP 주소를 부여할 수 있다. -> 2^16개이므로 65,536개. 여기서 2개를 빼면 65,534개를 호스트에 부여할 수 있다
- 여기서 10비트를 더 사용해 서브네팅해보자.

![](/images/subnet_1.png)

![](/images/subnet_2.png)

- 여기서 IP주소를 하나 가져와보자. `150.150.252.211/26`을 예로 들어보자. 이 IP주소를 보고 가질 수 있는 물음은 다음과 같다
  - **이 IP주소의 네트워크 주소는?**
    - 26비트가 네트워크 주소이므로, 24자리 150.150.252까지는 당연하고, 
    - 나머지 211을 이진수로 나타내면 1101 0011인데 이중 왼쪽 2자리까지가 네트워크 주소에 포함되므로,
    - `150.150.252.192.0`이 서브넷 네트워크 주소가 된다
  - **이 IP주소의 기본 서브넷 사용시 네트워크 주소는?**
    - `150.150.252.211/26`는 클래스 B이므로 기본 서브넷은 16비트일 것이다
    - 그러면 기본 네트워크 주소는 `150.150.0.0`이 될 것이다
  - **이 IP주소는** `150.150.255.193`**과 같은 서브넷 안에 있는가? (라우팅 없이 통신이 가능한가?)**
    - 라우팅 없이 통신이 가능한지 보려면 같은 네트워크 주소가 같은지 확인해보면 된다
    - `150.150.252.211/26`는 `150.150.252.192.0`였고,
    - `150.150.255.193`는 `150.150.255.192`이므로 서로 다른 네트워크 상에 있다 -> 라우터가 있어야 한다
  - **이 IP주소가 속한 네트워크의 브로드캐스트 주소는?**
    - 이를 구하려면 나의 IP주소 중 호스트 부분을 모두 1로 바꾸면 된다
    - `150.150.252.255/26`가 될 것이다
    - 주의할 점은 브로드캐스트 주소는 무조건 끝자리가 255로 끝나지는 않는다. 
      - 이를 확인하기 위해 `150.150.0.130/26`가 있는 네트워크 상의 브로드캐스트 주소를 한 번 구해보자
      - 이는 2진수로 1001 0110. 1001 0110. 0000 0000. 1000 0010인데 여기서 호스트 부분이 오른쪽 6자리를 1로 바꿔보자
      - 1001 0110. 1001 0110. 0000 0000. 1011 1111 -> `150.150.0.191/26`이 브로드캐스트 주소가 된다




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

# 라우팅

목적지 IP 주소를 찾아가는 과정  

## 라우팅 테이블

MAC addresses are determined for a device when it is manufactured. They don't change wherever you go. So assume MAC addresses as your name(assume it's unique).  

Ip addresses are assigned(by your ISP) when your machine connects to the network. It depends on your location. So assume it as your address.  

If someone needs to send you a post, if they use your unique name, then routing that post to you will be difficult. Now if they use your address, routing becomes easier.  

That's why IP addresses are used. Routing a packet to a IP address is easier than routing it to a MAC address.  

The routing table is used to find out if a packet should be delivered locally, or routed to some network interface using a known gateway address.


MAC addresses are layer-2 addresses, IP addresses are layer-3 addresses, and ports are layer-4 addresses.  

MAC addresses are not in the packet headers, they are in the frame headers. Only layer-3 addresses are in the packet headers. Ports are in the segment headers.  

MAC addresses are only significant on a LAN. They are in the frame headers, and frames are stripped at layer-3 boundaries (routers). The routers then use the layer-3 headers with the layer-3 address to forward a packet to the next interface, where  

![](/images/network_46.png)

- 서버든 라우터든 패킷을 보내기 위해서는 일단 라우팅 테이블을 참조함
- 라우팅 테이블을 보니 라우팅 엔트리는 `1.1.1.0/24`, Gateway는 없음 -> 목적지 주소가 나와 같은 네트워크에 존재함을 확인
  ![](/images/network_47.png)
- 이제 Server1은 목적지 주소 `1.1.1.20`에 대한 MAC 주소를 알기위해 자신의 ARP 테이블을 참조함
- 그런데 ARP 테이블이 비어있음 -> ARP miss
  ![](/images/network_48.png)
- Server1은 Server2(`1.1.1.20`)의 MAC 주소를 알아내기 위해 lan1 포트로 ARP request 패킷을 보냄
- Switch1은 이 패킷을 수신하고, 수신 패킷의 Source MAC 주소를 배웁니다
  - (Switch1의 MAC 테이블에 Server1의 MAC주소와 Switch1의 port를 기록)
  ![](/images/netwrork_49.png)
- Switch1은 이 ARP request 패킷을 보고 Destination MAC이 브로드 캐스팅 주소임을 확인
- Switch1은 수신포트 fe1을 제외한 나머지 모든 포트로 flooding
- 라우터 R1은 패킷의 Target IP 주소를 보고 자기 것이 아닌 것을 확인하고 버림
- Server2는 자신의 IP 주소임을 확인 -> 자신의 MAC 주소를 필드에 담아 ARP reply 패킷을 lan1 포트로 보냄
- 이 패킷을 수신한 Switch1은 Source MAC Learning을 하여 MAC 테이블에 기록
  ![](/images/network_50.png)
- Server1은 자신의 ARP 테이블에 MAC 주소를 기록
  ![](/images/network_51.png)
- 이제 Server1은 Server2로 IP 패킷을 보냄
- Server1은 목적지 주소 `1.1.1.20`에 대한 MAC 주소를 ARP 테이블에서 얻어오고 이동해야할 포트 번호를 MAC 테이블을 통해 확인
- 이 패킷은 fe2 포트를 통해 나가고, Server2가 패킷을 수신

## 게이트웨이  
다른 네트워크로 가기위한 통로  

A traditional "gateway" can mean a device that (sometimes) is able to route traffic, but
whose primary goal is to *translate* from one protocol to another. For example- I would
use a "gateway" if I wanted to send packets from my IPv4 network to/from a IPv6 network,
or maybe an AppleTalk network to/from a Token Ring network.  

게이트웨이는 개념적인 용어, 라우터는 장비   

네트워크 구성환경에 따라 라우터가 게이트웨이 역할을 할 수도 있고, 다른 장비나 소프트웨어가 게이트웨이 역할을 할 수도 있다.    

더 깊게 들어가면 L3 장비들인데요.  Layer3 는 IP를 와 연관되어 있습니다.  
source: 192.168.1.10 / destination : 8.8.8.8   

source 가 되는 PC에도 routing table 이 있습니다. (cmd - route print)  
여기에 목적지 정보가 없으면 무조건 gateway 로 패킷을 보냅니다.  
즉, 어떤 host 에게 Gateway 란건 내 패킷을 무조건 라우팅 시켜줄 통로입니다.  

gateway 가 되는 장비들이 L3 장비들이고 Router 가 되겠죠.  

공유기는 간단히 표현하면 Router + DHCP + NAT 역할을 합니다  
방화벽은 간단히 표현하면 Router + ACL + Firewall 등등의 기능을 합니다.  

다시 정리하자면.. Gateway 는 개념이지 장비명이 아닙니다.  

결론적으로 말하자면 cisco에서 얘기하는 게이트웨이 모드는 간단하게 얘기했을 때 우리가 흔히 말하는 공유기처럼 NAT가 활성화된 상태를 말하고, 라우터 모드는 NAT가 비활성화된 상태를 말합니다.   

사실 게이트웨이라는 것은 라우터와 구분되는 개념이 아니라, 라우터 중에서 관문(gateway) 역할을 하는 라우터를 게이트웨이 라우터라고 하는데 이를 그냥 게이트웨이라고 짧게 부르는 것 뿐입니다.  

고속도로로 비유한다면 게이트웨이가 아닌 라우터는 JC이고 게이트웨이인 라우터는 IC라고 볼 수 있겠네요. 둘다 도로와 도로를 이어주는 역할을 수행하지만(routing) IC는 특히 일반도로에서 고속도로로 진입하는 관문(gateway) 역할을 하는 점에서 생각해보면 될 것 같습니다.  

네트워크와 네트워크 사이를 이어주는 역할을 하는 것이 라우터이고, 그 중에서도 가장 끄트머리에 위치한 네트워크(가정이나 회사)를 중앙(인터넷 등)으로 연결해주는 라우터를 그저 좀 특별하게 부르는 것이 게이트웨이인 것입니다.  

방화벽 그자체의 의미로는 라우팅의 개념은 전혀 없고 단지 조건에 따라 패킷을 걸러주는 역할을 하는 것 뿐입니다. 방화벽 장비 중에 라우팅 역할도 하는 장비가 있을 뿐이지요.  

# 참고
- [Microsoft, Understand TCP/IP addressing and subnetting basics](https://docs.microsoft.com/en-us/troubleshoot/windows-client/networking/tcpip-addressing-and-subnetting){:target="_blank"}
- [groom, 서브넷과 Broadcast 주소](https://velog.io/@dnstlr2933/%EC%84%9C%EB%B8%8C%EB%84%B7%EA%B3%BC-Broadcast-%EC%A3%BC%EC%86%8C){:target="_blank"}
- [IT_Dexter:티스토리](https://itdexter.tistory.com/261){:target="_blank"}
- [Whackur's Blog:티스토리](https://whackur.tistory.com/45){:target="_blank"}
- [How To Set Permanent DNS Nameservers in Ubuntu and Debian](https://www.tecmint.com/set-permanent-dns-nameservers-in-ubuntu-debian/){:target="_blank"}
- [kinsta, What Is DNS? Domain Name System Explained](https://kinsta.com/knowledgebase/what-is-dns/){:target="_blank"}
- [kinsta, What Is a Nameserver? Why Are Nameservers Important?](https://kinsta.com/knowledgebase/what-is-a-nameserver/){:target="_blank"}
- [CLOUDFLARE, What is DNS?](https://www.cloudflare.com/ko-kr/learning/dns/what-is-dns/){:target="_blank"}
- [스위칭과 라우팅... 참 쉽죠잉~ (1편: Ethernet 스위칭)](https://www.netmanias.com/ko/?m=view&id=blog&no=5501){:target="_blank"}
- [스위칭과 라우팅... 참 쉽죠잉~ (2편: IP 라우팅)](https://www.netmanias.com/ko/?m=view&id=blog&no=5502){:target="_blank"}