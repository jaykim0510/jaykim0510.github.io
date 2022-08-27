---
layout: post
title:  'Kafka Series [Part4]: 카프카의 데이터 저장'
description: 
date:   2022-01-25 15:01:35 +0300
image:  '/images/kafka_78.png'
logo_image:  '/images/kafka_logo.png'
categories:   DE
tags: Kafka
---

---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---  

# 카프카의 데이터 저장 방식

Kafka is everywhere these days. With the advent of Microservices and distributed computing, Kafka has become a regular occurrence in the architecture of every product. In this article, I’ll try to explain how Kafka’s internal storage mechanism works.  

Kafka is typically referred to as a Distributed, Replicated Messaging Queue, which although technically true, usually leads to some confusion depending on your definition of a messaging queue. Instead, I prefer to call it a Distributed, Replicated Commit Log. This, I think, clearly represents what Kafka does, as all of us understand how logs are written to disk. And in this case, it is the messages pushed into Kafka that are stored to disk.  

Regarding storage in Kafka, you’ll always hear two terms - Partition and Topic. Partitions are the units of storage in Kafka for messages. And Topic can be thought of as being a container in which these partitions lie.  

![](/images/kafka_80.png)

## Partition

I am going to start by creating a topic in Kafka with three partitions.  

```sh
kafka-topics.sh --create --topic freblogg --partitions 3 --replication-factor 1 --zookeeper localhost:2181
```

If I go into Kafka’s log directory, I see three directories created as follows.

```
$ tree freblogg*
freblogg-0
|-- 00000000000000000000.index
|-- 00000000000000000000.log
|-- 00000000000000000000.timeindex
`-- leader-epoch-checkpoint
freblogg-1
|-- 00000000000000000000.index
|-- 00000000000000000000.log
|-- 00000000000000000000.timeindex
`-- leader-epoch-checkpoint
freblogg-2
|-- 00000000000000000000.index
|-- 00000000000000000000.log
|-- 00000000000000000000.timeindex
`-- leader-epoch-checkpoint
```

We have three directories created because we’ve given three partitions for our topic, which means that each partition gets a directory on the file system. You also see some files like index, log etc. We’ll get to them shortly.  

One more thing that you should be able to see from here is that in Kafka, the topic is more of a logical grouping than anything else and that the Partition is the actual unit of storage in Kafka. That is what is physically stored on the disk. Let’s understand partitions in some more detail.  

Now let us send a couple of messages and see what happens. To send the messages I’m using the console producer as follows:  

```
kafka-console-producer.sh --topic freblogg --broker-list localhost:9092
```

```
$ ls -lh freblogg*
freblogg-0:
total 20M
- freblogg 197121 10M Aug  5 08:26 00000000000000000000.index
- freblogg 197121   0 Aug  5 08:26 00000000000000000000.log
- freblogg 197121 10M Aug  5 08:26 00000000000000000000.timeindex
- freblogg 197121   0 Aug  5 08:26 leader-epoch-checkpoint

freblogg-1:
total 21M
- freblogg 197121 10M Aug  5 08:26 00000000000000000000.index
- freblogg 197121  68 Aug  5 10:15 00000000000000000000.log
- freblogg 197121 10M Aug  5 08:26 00000000000000000000.timeindex
- freblogg 197121  11 Aug  5 10:15 leader-epoch-checkpoint

freblogg-2:
total 21M
- freblogg 197121 10M Aug  5 08:26 00000000000000000000.index
- freblogg 197121  79 Aug  5 09:59 00000000000000000000.log
- freblogg 197121 10M Aug  5 08:26 00000000000000000000.timeindex
- freblogg 197121  11 Aug  5 09:59 leader-epoch-checkpoint
```

Our two messages went into two of the partitions where you can see that the log files have a non zero size. This is because the messages in the partition are stored in the ‘xxxx.log’ file. To confirm that the messages are indeed stored in the log file, we can just see what’s inside that log file.  

```
$ cat freblogg-2/*.log
@^@^BÂ°Â£Ã¦Ãƒ^@^K^XÃ¿Ã¿Ã¿Ã¿Ã¿Ã¿^@^@^@^A"^@^@^A^VHello World^@
```

The file format of the ‘log’ file is not conducive for textual representation but, you should see the ‘Hello World’ at the end indicating that this file got updated when we have sent the message into the topic. The second message we have sent went into the other partition.  

Notice that the first message we sent, went into the third partition (freblogg-2) and the second message went into the second partition (freblogg-1). This is because Kafka arbitrarily picks the partition for the first message and then distributes the messages to partitions in a round-robin fashion. If a third message comes now, it would go into freblogg-0 and this order of partition continues for any new message that comes in. We can also make Kafka choose the same partition for our messages by adding a key to the message. Kafka stores all the messages with the same key into a single partition.  

Each new message in the partition gets an Id which is one more than the previous Id number. This Id number is also called the Offset. So, the first message is at ‘offset’ 0, the second message is at offset 1 and so on. These offset Id’s are always incremented from the previous value.  

![](/images/kafka_75.png)

We can understand those random characters in the log file, using a Kafka tool.  

```sh
kafka-run-class.bat kafka.tools.DumpLogSegments --deep-iteration --print-data-log --files logs\freblogg-2\00000000000000000000.log
```

This gives the output

```sh
Dumping logs\freblogg-2\00000000000000000000.log
Starting offset: 0

offset: 0 position: 0 CreateTime: 1533443377944 isvalid: true keysize: -1 valuesize: 11 producerId: -1 headerKeys: [] payload: Hello World

offset: 1 position: 79 CreateTime: 1533462689974 isvalid: true keysize: -1 valuesize: 6 producerId: -1 headerKeys: [] payload: amazon
```

CreateTime과 같은 값은 컨슈머로 가져와서 사용할 수 있는 값이 아니다. 카프카 내부적으로 가지고 있는 메타데이터이다. 그렇기 때문에 데이터의 타임스탬프가 필요하다면, 데이터를 생성할 때 내부적으로 메세지에 명시적으로 담아서 브로커에 담아야 한다.  

You can see that it stores information of the offset, time of creation, key and value sizes etc along with the actual message payload in the log file.  

It is also important to note that a partition is tied to a broker. In other words, If we have three brokers and if the folder freblogg-0 exists on broker-1, you can be sure that it will not appear in any of the other brokers. Partitions of a topic can be spread out to multiple brokers but a partition is always present on one single Kafka broker (When the replication factor has its default value, which is 1. Replication is mentioned further below).  


## Segment

We’ll finally talk about those index and log files we’ve seen in the partition directory. Partition might be the standard unit of storage in Kafka, but it is not the lowest level of abstraction provided. Each partition is divided into segments.  

A segment is simply a collection of messages of a partition. Instead of storing all the messages of a partition in a single file (think of the log file analogy again), Kafka splits them into chunks called segments. Doing this provides several advantages. Divide and Conquer FTW!  

Most importantly, it makes purging data easy. As previously introduced partition is immutable from a consumer perspective. But Kafka can still remove the messages based on the “Retention policy” of the topic. Deleting segments is much simpler than deleting things from a single file, especially when a producer might be pushing data into it.  


The directory has the following files  

- `.log` file: This file contains the actual records and maintains the records up to a specific offset. The name of the file depicts the starting offset added to this file.
- .index file: This file has an index that maps a record offset to the byte offset of the record within the** .log **file. This mapping is used to read the record from any specific offset.
- `.timeindex` file: This file contains the mapping of the timestamp to record offset, which internally maps to the byte offset of the record using the .index file. This helps in accessing the records from the specific timestamp.
- `.snapshot` file: contains a snapshot of the producer state regarding sequence IDs used to avoid duplicate records. It is used when, after a new leader is elected, the preferred one comes back and needs such a state to become a leader again. This is only available for the active segment (log file)
- `.leader-epoch-checkpoint`: It refers to the number of leaders previously assigned by the controller. The replicas use the leader epoch as a means of verifying the current leader. The leader-epoch-checkpoint file contains two columns: epochs and offsets. Each row is a checkpoint for the latest recorded leader epoch and the leader's latest offset upon becoming leader


Kafka always writes the messages into these segment files under a partition. There is always an active segment to which Kafka writes to. Once the segment’s size limit is reached, a new segment file is created and that becomes the active segment.  

One of the common operations in Kafka is to read the message at a particular offset. For this, if it has to go to the log file to find the offset, it becomes an expensive task especially because the log file can grow to huge sizes (Default—1G). This is where the .index file becomes useful. Index file stores the offsets and physical position of the message in the log file.  

An index file for the log file I’ve showed in the ‘Quick detour’ above would look something like this:  

![](/images/kafka_76.png)  

If you need to read the message at offset 1, you first search for it in the index file and figure out that the message is in position 79. Then you directly go to position 79 in the log file and start reading. This makes it quite effective as you can use binary search to quickly get to the correct offset in the already sorted index file.  

![](/images/kafka_81.png)  

# 저장된 데이터의 포맷(Kafka messages are just bytes)

Kafka messages are just bytes. Kafka messages are organized into topics. Each message is a key/value, but that is all that Kafka requires. Both key and value are just bytes when they are stored in Kafka. This makes Kafka applicable to a wide range of use cases, but it also means that developers have the responsibility of deciding how to serialize the data.

There are various serialization formats with common ones including:  

- JSON
- Avro
- Protobuf
- String delimited (e.g., CSV

There are advantages and disadvantages to each of these—well, except delimited, in which case it’s only disadvantages 😉  

Choosing a serialization format  

- **Schema**: A lot of the time your data will have a schema to it. You may not like the fact, but it’s your responsibility as a developer to preserve and propagate this schema. The schema provides the contract between your services. Some message formats (such as Avro and Protobuf) have strong schema support, whilst others have lesser support (JSON) or none at all (delimited string).
- **Ecosystem compatibility**: Avro, Protobuf, and JSON are first-class citizens in the Confluent Platform, with native support from the  Confluent Schema Registry, Kafka Connect, ksqlDB, and more.
- **Message size**: Whilst JSON is plain text and relies on any compression configured in Kafka itself, Avro and Protobuf are both binary formats and thus provide smaller message sizes.
- **Language support**: For example, support for Avro is strong in the Java space, whilst if you’re using Go, chances are you’ll be expecting to use Protobuf.

데이터를 브로커에 저장할 때는 전송된 데이터의 포맷과는 상관없이 원하는 포맷으로 브로커에 저장할 수 있다. 예를 들어 프로듀서가 JSON으로 보냈다고 하더라도 브로커에 저장할 때 포맷은 Avro, Parquet, String 뭘 하든 상관없다. 다만 중요한 것은 Serializer로 Avro를 선택했다면, Deserializer도 반드시 Avro를 선택해야 한다. 그러고 나면 컨슈머에서 전달 받는 데이터의 포맷은 자연스럽게 다시 JSON 형태를 얻게 된다.  

![](/images/kafka_78.png)

Remember, Kafka messages are just pairs of key/value bytes, and you need to specify the converter for both keys and value, using the `key.converter` and `value.converter` configuration setting. In some situations, you may use different converters for the key and the value.   

Here’s an example of using the String converter. Since it’s just a string, there’s no schema to the data, and thus it’s not so useful to use for the value:  

```sh
"key.converter": "org.apache.kafka.connect.storage.StringConverter",
```

Some converters have additional configuration. For Avro, you need to specify the Schema Registry. For JSON, you need to specify if you want Kafka Connect to embed the schema in the JSON itself. When you specify converter-specific configurations, always use the `key.converter`. or `value.converter`. prefix. For example, to use Avro for the message payload, you’d specify the following:  

```
"value.converter": "io.confluent.connect.avro.AvroConverter",
"value.converter.schema.registry.url": "http://schema-registry:8081",
```

Common converters include:  

```sh
# Avro
io.confluent.connect.avro.AvroConverter

# Protobuf
io.confluent.connect.protobuf.ProtobufConverter

# String
org.apache.kafka.connect.storage.StringConverter

# JSON
org.apache.kafka.connect.json.JsonConverter

# JSON schema
io.confluent.connect.json.JsonSchemaConverter

# ByteArray
org.apache.kafka.connect.converters.ByteArrayConverter
```

JSON의 경우 스키마가 설정을 안하는 것이 디폴트다. 하지만 스키마를 고정하고 싶은 경우 두 가지 방법을 사용할 수 있다.  

1. JSON schema `io.confluent.connect.json.JsonSchemaConverter`를 쓴다 (with 스키마 레지스트리)
   ```
   "value.converter": "io.confluent.connect.json.JsonSchemaConverter",
   "value.converter.schema.registry.url": "http://schema-registry:8081",
   ```
2. 비효율적이지만 매번 메시지에 스키마를 담아서 전송/저장한다.
   ```
   value.converter=org.apache.kafka.connect.json.JsonConverter
   value.converter.schemas.enable=true
   ```

2번 방식을 사용하면 메세지가 다음과 같이 schema 부분과, payload 부분이 함께 저장된다.  

```
{
  "schema": {
    "type": "struct",
    "fields": [
      {
        "type": "int64",
        "optional": false,
        "field": "registertime"
      },
      {
        "type": "string",
        "optional": false,
        "field": "userid"
      },
      {
        "type": "string",
        "optional": false,
        "field": "regionid"
      },
      {
        "type": "string",
        "optional": false,
        "field": "gender"
      }
    ],
    "optional": false,
    "name": "ksql.users"
  },
  "payload": "Hello World"
}
```

이렇게 하면 메세지 사이즈가 커지기 때문에 비효율적이다. 그래서 스키마가 필요한 경우에는 스키마 레지스트리를 사용하는 것이 효율적이다.  

만약 컨버터에 JSON serializer를 사용했고 스키마를 따로 설정하지 않을거라면,  

```
value.converter=org.apache.kafka.connect.json.JsonConverter
value.converter.schemas.enable=false
```

이렇게 schema를 찾을 필요 없다고 명시해주자. (디폴트가 false인데 왜 해줘야하는거지..?)  

아래 표는 serializer와 deserializer의 싱크를 어떻게 맞춰야 에러가 안나는지 알려준다. 기본적으로 serializer는 메세지나 상황에 맞게 원하는 것을 선택하고, deserializer는 serializer와 같은 포맷을 사용하도록 하면 된다.    

![](/images/kafka_79.png)

# 성능 향상을 위한 파티션 수

To guarantee the order of reading messages from a partition, Kafka restricts to having only one consumer (from a consumer group) per partition. So, if a partition gets messages a,f and k, the consumer will also read them in the order a,f and k. This is an important thing to make a note of as the order of message consumption is not guaranteed at a topic level when you have multiple partitions.  

Just increasing the number of consumers won’t increase the parallelism. You need to scale your partitions accordingly. To read data from a topic in parallel with two consumers, you create two partitions so that each consumer can read from its own partition. Also since partitions of a topic can be on different brokers, two consumers of a topic can read the data from two different brokers.  

# 장애 복구를 위한 복제
Let’s talk about replication. Whenever we’re creating a topic in Kafka, we need to specify the replication factor we need for that topic. Let's say we've two brokers and so we've given the replication-factor as 2. What this means is that Kafka will try to always ensure that each partition of this topic has a backup/replica. The way Kafka distributes the partitions is quite similar to how HDFS distributes its data blocks across nodes.  

Say for the freblogg topic that we've been using so far, we've given the replication factor as 2. The resulting distribution of its three partitions will look something like this.  

![](/images/kafka_77.png)

Even when you have a replicated partition on a different broker, Kafka wouldn’t let you read from it because in each replicated set of partitions, there is a LEADER and the rest of them are just mere FOLLOWERS serving as backup. The followers keep on syncing the data from the leader partition periodically, waiting for their chance to shine. When the leader goes down, one of the in-sync follower partitions is chosen as the new leader and now you can consume data from this partition.  

A Leader and a Follower of a single partition are never in a single broker. It should be quite obvious why that is so.  


# 로그 설정을 통해 효율적으로 보관하기(Log Retention)

Apache Kafka is a commit-log system. The records are appended at the end of each Partition, and each Partition is also split into segments. Segments help delete older records through Compaction, improve performance, and much more.  

Kafka allows us to optimize the log-related configurations, we can control the rolling of segments, log retention, etc. These configurations determine how long the record will be stored and we’ll see how it impacts the broker's performance, especially when the cleanup policy is set to Delete.  

For better performance and maintainability, multiple segments get created, and rather than reading from one huge Partition, Consumers can now read faster from a smaller segment file. A directory with the partition name gets created and maintains all the segments for that partition as various files.  

![](/images/kafka_81.png)

The active segment is the only file available for reading and writing while consumers can use other log segments (non-active) to read data. When the active segment becomes full (configured by log.segment.bytes, default 1 GB) or the configured time (log.roll.hours or log.roll.ms, default 7 days) passes, the segment gets rolled. This means that the active segment gets closed and re-opens with read-only mode and a new segment file (active segment) will be created in read-write mode.

## Role of Indexing within the Partition
Indexing helps consumers to read data starting from any specific offset or using any time range. As mentioned previously, the .index file contains an index that maps the logical offset to the byte offset of the record within the .log file. You might expect that this mapping is available for each record, but it doesn’t work this way.  

How these entries are added inside the index file is defined by the log.index.interval.bytes parameter, which is 4096 bytes by default. This means that after every 4096 bytes added to the log, an entry gets added to the index file. Suppose the producer is sending records of 100 bytes each to a Kafka topic. In this case, a new index entry will be added to the .index file after every 41 records (41*100 = 4100 bytes) appended to the log file.  

![](/images/kafka_82.png)

As we can see in the above diagram, the offset with id 41 is at 4100 bytes in the log file, offset 82 is at 8200 bytes in the log file, and so on.  

If a consumer wants to read starting at a specific offset, a search for the record is made as follows:  

- Search for the .index file based on its name. For e.g. If the offset is 1191, the index file will be searched whose name has a value less than 1191. The naming convention for the index file is the same as that of the log file
- Search for an entry in the .index file where the requested offset falls.
- Use the mapped byte offset to access the** .log** file and start consuming the records from that byte offset.

As we mentioned, consumers may also want to read the records from a specific timestamp. This is where the .timeindex file comes into the picture. It maintains a timestamp and offset mapping (which maps to the corresponding entry in the .index file), which maps to the actual byte offset in the .log file.  

![](/images/kafka_83.png)

## Rolling segments
As discussed in the above sections, the active segment gets rolled once any of these conditions are met-

1. Maximum segment size - configured by log.segment.bytes, defaults to 1 Gb
2. Rolling segment time - configured by log.roll.ms and log.roll.hours, defaults to 7 days
3. Index/timeindex is full - The index and timeindex share the same maximum size, which is defined by the** log.index.size.max.bytes**, defaults to 10 MB


The 3rd condition is not well known but it also impacts the segment rolling. We know that because** log.index.interval.bytes** is 4096 bytes by default, an entry is added in the index every 4096 bytes of records. It means that for a 1 GiB segment size, 1 GiB / 4096 bytes = 262144 entries are added to the index. One entry in the index file takes 8 bytes so this equals 2 MB of the index (262144 * 8 bytes). The default index size of 10 MB is enough to handle a segment size of 5 GiB.  

By increasing the segment size over 5 GiB, you would also need to increase the index file size as well. Likewise, if you decide to reduce the index file size, it is possible that you might want to decrease the segment size accordingly.  

The timeindex might also need attention. Because each timeindex entry is 1.5x bigger than an entry in the index (12 bytes versus 8 bytes), it can fill up earlier and cause a new segment to be rolled. For the same example as above, for 1 GiB segment size, the timeindex file will take 262144 * 12 = 3 MB.  

## Impact of increasing/decreasing the segment size
Generally you don’t want to increase/decrease the log.segment.bytes and keep it as default. But let’s discuss the impact of changing this value so that you can make an informed decision if there’s a need.  

- Decrease this size for better compaction - You have the deletion policy as compact(Compaction is a separate topic which will be covered later) and the data coming to the topic is not very fast, so it may take a lot of time to compact the partition as compaction occurs only when the segment gets closed. Now, if the Producer is not sending a lot of data and the segment is not filling, it would be better to decrease **log.segment.bytes **to compact the partition effectively.
- Increase the size if you have more partitions to host on a single broker - When a Producer produces the records, it gets appended to the active segment and the consumer can read records from any segment. The broker can host many partitions and there could be so many open files to produce and read data from.  

The maximum open files (nofile) limit has a default value of 1024 on some versions of Linux. You might have encountered the “Too many open files” issue while working with Kafka and this is the reason for that. You can increase the value of nofile to the appropriate number and Kafka recommends this to be 100000. But in scenarios where you have a lot of partitions hosted on a single broker, you can keep within this limit by increasing the **log.segment.bytes **to a higher number (within the limit of the system’s RAM). Having a higher segment size decrease the number of segments (files), which will eventually decrease the number of open files.  

## Log retention - The records may persist longer than the retention time
Kafka, with its feature of retaining the log for a longer duration rather than deleting it like traditional messaging queues once consumed, provides many added advantages. Multiple consumers can read the same data, apart from reading the data it can also be sent to data warehouses for further analytics.  

How long is the data retained in Kafka? This is configurable using the maximum number of bytes to retain by using the** log.retention.bytes** parameter. If you want to set a retention period, you can use the log.retention.ms, log.retention.minutes, or log.retention.hours (7 days by default) parameters.  

Suppose you configure the topic by specifying a retention time of 600000 ms (10 mins) and a segment size of 16384 bytes, the expectation would be to roll the segment once its size reaches 16 Kb but this is the max size if the record to be inserted is of more size than available in the active segment, the segment will be rolled and the record will get saved in the new segment.  

Regarding the log retention, the expectation would be that the record will be persisted for 10 mins and after that, it should get deleted. A segment, together with the records it contains, can be deleted only when it is closed. So the following things may impact when the records get deleted-

- If the producer is slow and the maximum size of 16 Kb is not reached within 10 minutes, older records won’t be deleted. In this case, the log retention would be higher than 10 mins.
- If the active segment is filled quickly, it will be closed but only get deleted once the last inserted record persists for 10 mins. So in this case as well, the latest inserted record would be persisted for more than 10 mins. - Suppose the segment is getting filled in 7 mins and getting closed, the last inserted record will stay for 10 mins so the actual retention time for the first record inserted into the segment would be 17 mins.
- The log can be persisted for an even longer duration than the last added record in the segment. How? Because the thread which gets executed and checks which log segments need to be deleted runs every 5 mins. This is configurable using log.retention.check.interval.ms configurations. - Depending on the last added record to the segment, this cleanup thread can miss the 10 min retention deadline. So in our example above instead of persisting the segment for 17 mins, it could be persisted for 22 mins.
- Do you think that this would be the maximum time the record is persisted in Kafka? No, the cleaner thread checks and just marks the segment to be deleted. The log.segment.delete.delay.ms broker parameter defines when the file will actually be removed from the file system when it’s marked as “deleted” (default, 1 min) - Going back to our example the log is still available even after 23 mins, which is way longer than the retention time of 10 mins.

So The usual retention limits are set by using log.retention.ms defines a kind of minimum time the record will be persisted in the file system.  

Consumers get records from closed segments but not from deleted ones, even if they are just marked as “deleted” but not actually removed from the file system.  

Note: I have described a single record getting appended to the segment for simplicity and to let you understand the concept clearly but in actuality multiple records (record batch) get appended to the segment file.  

## Conclusion
As discussed in this blog, configuration parameters can have a surprisingly big influence on how long your data is retained. Understanding these parameters and how you can adjust them gives you a lot more control over how you handle your data. Let’s summarize what parameters we have discussed here-  

![](/images/kafka_84.png)


# 참고
- [Data types for Kafka connector](https://docs.cloudera.com/csa/1.2.0/flink-sql-table-api/topics/csa-kafka-sql-datatypes.html){:target="_blank"}
- [Kafka Connect Deep Dive – Converters and Serialization Explained](https://www.confluent.io/blog/kafka-connect-deep-dive-converters-serialization-explained/){:target="_blank"}
- [dol9, Kafka 스키마 관리, Schema Registry](https://dol9.tistory.com/274){:target="_blank"}
- [A Practical Introduction to Kafka Storage Internals](https://www.freblogg.com/kafka-storage-internals){:target="_blank"}
- [Here’s what makes Apache Kafka so fast](https://www.freecodecamp.org/news/what-makes-apache-kafka-so-fast-a8d4f94ab145/){:target="_blank"}
- [stackoverflow: Which directory does apache kafka store the data in broker nodes](https://stackoverflow.com/questions/40369238/which-directory-does-apache-kafka-store-the-data-in-broker-nodes#){:target="_blank"}
- [Abhishek Sharma, How kafka stores data](https://medium.com/@abhisheksharma_59226/how-kafka-stores-data-37ee611c89a2){:target="_blank"}
- [Rohith Sankepally:g Deep Dive Into Apache Kafka. Storage Internals](https://rohithsankepally.github.io/Kafka-Storage-Internals/){:target="_blank"}
- [towardsdatascience, Log Compacted Topics in Apache Kafka](https://towardsdatascience.com/log-compacted-topics-in-apache-kafka-b1aa1e4665a7){:target="_blank"}
- [conduktor, Understanding Kafka's Internal Storage and Log Retention](https://www.conduktor.io/understanding-kafkas-internal-storage-and-log-retention){:target="_blank"}
- [What is a commit log and why should you care?](https://dev.to/heroku/what-is-a-commit-log-and-why-should-you-care-pib){:target="_blank"}