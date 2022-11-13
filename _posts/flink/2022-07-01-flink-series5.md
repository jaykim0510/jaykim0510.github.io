---
layout: post
title: 'Flink Series [Part5]: PyFlink'
description: 
date: 2022-07-01 15:01:35 +0300
logo_image: '/images/flink_logo.png'
image: '/images/flink_logo.png'
categories: data_engineering
tags: Flink
---
---

**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

# PyFlink

![](/images/flink_30.png)  

```
pip install apache-flink
```

- PyFlink는 **실시간 데이터 처리 파이프라인 작업을 수행하는데 필요한 고수준 API를 제공**
- 크게 두 가지의 **Table API, DataStream API**를 제공
- 제공받은 API를 이용해 실시간 데이터 처리를 위한 스크립트를 **파이썬** 언어로 작성할 수 있음

- Table API는 SQL과 유사한 형태의 강력한 관계형 쿼리를 작성하는데 필요한 기능을 제공


# DataStream API

- DataStream API는 시간, 상태와 같은 스트림 처리의 핵심이 되는 개념들을 다루는데 필요한 기능을 제공
- **Filtering, Update state, Defining window, Aggregating**과 같은 스트림 데이터 변환 기능을 제공

## DataStream API 맛보기

```python
# DataStream API 관련 패키지 임포트하기

from pyflink.common import WatermarkStrategy, Encoder, Types
from pyflink.datastream import StreamExecutionEnvironment, RuntimeExecutionMode
from pyflink.datastream.connectors import (FileSource, StreamFormat, FileSink, OutputFileConfig, RollingPolicy)
```

- create a StreamExecutionEnvironment

```python
# 스트리밍 프로그램이 실행되는 실행환경
# 작업의 특성을 설정
# 소스 생성
# 작업의 실행 트리거

env = StreamExecutionEnvironment.get_execution_environment()
env.set_runtime_mode(RuntimeExecutionMode.BATCH)
env.set_parallelism(1)
```

- create Source DataSream

```python
# env를 이용해서 소스 생성
# 소스는 외부시스템에서 데이터 가져옴

ds = env.from_source(
    source=FileSource.for_record_stream_format(StreamFormat.text_line_format(),
                                               input_path)
                     .process_static_file_set().build(),
    watermark_strategy=WatermarkStrategy.for_monotonous_timestamps(),
    source_name="file_source"
)
```

- define the execution logic

```python
ds = ds.map(lambda a: Row(a % 4, 1), output_type=Types.ROW([Types.LONG(), Types.LONG()])) \
        .key_by(lambda a: a[0]) \
        .map(MyMapFunction(), output_type=Types.TUPLE([Types.LONG(), Types.LONG()]))
```

- create sink and emit result to sink

```python
# 데이터 변환
# 싱크에 데이터 쓰기

ds.sink_to(
    sink=FileSink.for_row_format(
        base_path=output_path,
        encoder=Encoder.simple_string_encoder())
    .with_output_file_config(
        OutputFileConfig.builder()
        .with_part_prefix("prefix")
        .with_part_suffix(".ext")
        .build())
    .with_rolling_policy(RollingPolicy.default_rolling_policy())
    .build()
)

def split(line):
    yield from line.split()


ds = ds.flat_map(split) \
       .map(lambda i: (i, 1), output_type=Types.TUPLE([Types.STRING(), Types.INT()])) \
       .key_by(lambda i: i[0]) \
       .reduce(lambda i, j: (i[0], i[1] + j[1]))

```

```python
# 스트림 작업 실행
# 플링크는 lazy operation -> MapReduce에서 Map과 같은 연산이 일어나는 시점에 클러스터로 작업 전달

env.execute()
```

[**전체 코드 참고**](https://nightlies.apache.org/flink/flink-docs-master/docs/dev/python/datastream_tutorial/){:target="_blank"}  

## Execution Mode (Batch/Streaming)

The DataStream API supports different runtime execution modes from which you can choose depending on the requirements of your use case and the characteristics of your job.  

There is the “classic” execution behavior of the DataStream API, which we call STREAMING execution mode. This should be used for unbounded jobs that require continuous incremental processing and are expected to stay online indefinitely.  

Additionally, there is a batch-style execution mode that we call BATCH execution mode. This executes jobs in a way that is more reminiscent of batch processing frameworks such as MapReduce. This should be used for bounded jobs for which you have a known fixed input and which do not run continuously.  

Apache Flink’s unified approach to stream and batch processing means that a DataStream application executed over bounded input will produce the same final results regardless of the configured execution mode. It is important to note what final means here: a job executing in STREAMING mode might produce incremental updates (think upserts in a database) while a BATCH job would only produce one final result at the end. The final result will be the same if interpreted correctly but the way to get there can be different.  

By enabling BATCH execution, we allow Flink to apply additional optimizations that we can only do when we know that our input is bounded. For example, different join/aggregation strategies can be used, in addition to a different shuffle implementation that allows more efficient task scheduling and failure recovery behavior. We will go into some of the details of the execution behavior below.  

## When can/should I use BATCH execution mode?

The BATCH execution mode can only be used for Jobs/Flink Programs that are bounded. Boundedness is a property of a data source that tells us whether all the input coming from that source is known before execution or whether new data will show up, potentially indefinitely. A job, in turn, is bounded if all its sources are bounded, and unbounded otherwise.  

STREAMING execution mode, on the other hand, can be used for both bounded and unbounded jobs.  

As a rule of thumb, you should be using BATCH execution mode when your program is bounded because this will be more efficient. You have to use STREAMING execution mode when your program is unbounded because only this mode is general enough to be able to deal with continuous data streams.  

Another case where you might run a bounded job using STREAMING mode is when writing tests for code that will eventually run with unbounded sources. For testing it can be more natural to use a bounded source in those cases.  

## Configuring BATCH execution mode

```
- STREAMING: The classic DataStream execution mode (default)
- BATCH: Batch-style execution on the DataStream API
- AUTOMATIC: Let the system decide based on the boundedness of the sources
```

```python
StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
env.setRuntimeMode(RuntimeExecutionMode.BATCH);
```

- Streaming

In STREAMING execution mode, all tasks need to be online/running all the time. This allows Flink to immediately process new records through the whole pipeline, which we need for continuous and low-latency stream processing. This also means that the TaskManagers that are allotted to a job need to have enough resources to run all the tasks at the same time.  

Network shuffles are pipelined, meaning that records are immediately sent to downstream tasks, with some buffering on the network layer. Again, this is required because when processing a continuous stream of data there are no natural points (in time) where data could be materialized between tasks (or pipelines of tasks). This contrasts with BATCH execution mode where intermediate results can be materialized, as explained below.  

- Batch

In BATCH execution mode, the tasks of a job can be separated into stages that can be executed one after another. We can do this because the input is bounded and Flink can therefore fully process one stage of the pipeline before moving on to the next. In the above example the job would have three stages that correspond to the three tasks that are separated by the shuffle barriers.  

Instead of sending records immediately to downstream tasks, as explained above for STREAMING mode, processing in stages requires Flink to materialize intermediate results of tasks to some non-ephemeral storage which allows downstream tasks to read them after upstream tasks have already gone off line. This will increase the latency of processing but comes with other interesting properties. For one, this allows Flink to backtrack to the latest available results when a failure happens instead of restarting the whole job. Another side effect is that BATCH jobs can execute on fewer resources (in terms of available slots at TaskManagers) because the system can execute tasks sequentially one after the other.  

TaskManagers will keep intermediate results at least as long as downstream tasks have not consumed them. (Technically, they will be kept until the consuming pipelined regions have produced their output.) After that, they will be kept for as long as space allows in order to allow the aforementioned backtracking to earlier results in case of a failure.  

# Table API  

- 배치, 스트림 처리를 위한 필요한 기능을 제공
- EDA, ETL과 같은 애플리케이션을 쉽게 정의하기 위해 일반적으로 사용됨
- 데이터가 유한(Bounded), 무한(Unbounded)한 경우에 관계없이 같은 의미


```python
from pyflink.common import Row
from pyflink.table import (EnvironmentSettings, TableEnvironment,       
                           TableDescriptor, Schema,
                           DataTypes, FormatDescriptor)
from pyflink.table.expressions import lit, col
from pyflink.table.udf import udtf
```


```python
# 테이블 환경 생성
# 플링크 런타임과 상호작용하기 위한 엔트리 포인트
# 실행을 위한 세팅(재시작 전략, 병렬성 등)
t_env = TableEnvironment.create(EnvironmentSettings.in_streaming_mode())
t_env.get_config().set("parallelism.default", "1")
```

```python
# 테이블 생성

t_env.create_temporary_table(
    'source',
    TableDescriptor.for_connector('filesystem')
        .schema(Schema.new_builder()
                .column('word', DataTypes.STRING())
                .build())
        .option('path', input_path)
        .format('csv')
        .build())
tab = t_env.from_path('source')

t_env.create_temporary_table(
    'sink',
    TableDescriptor.for_connector('filesystem')
        .schema(Schema.new_builder()
                .column('word', DataTypes.STRING())
                .column('count', DataTypes.BIGINT())
                .build())
        .option('path', output_path)
        .format(FormatDescriptor.for_format('canal-json')
                .build())
        .build())
```

테이블을 정의하기 위해 `TableEnvironment.execute_sql()` 메서드를 사용할 수도 있다  

```python
my_source_ddl = """
    create table source (
        word STRING
    ) with (
        'connector' = 'filesystem',
        'format' = 'csv',
        'path' = '{}'
    )
""".format(input_path)

my_sink_ddl = """
    create table sink (
        word STRING,
        `count` BIGINT
    ) with (
        'connector' = 'filesystem',
        'format' = 'canal-json',
        'path' = '{}'
    )
""".format(output_path)

t_env.execute_sql(my_source_ddl)
t_env.execute_sql(my_sink_ddl)
```

`source`라는 테이블과 `sink`라는 이름의 테이블을 `t_env`에 등록한다

소스를 만들고, 변환하고, 싱크에 데이터를 쓰는 모든 작업은 lazy하게 실행된다. execute와 같은 메서드가 호출되었을 떄만 모든 작업이 전달된다.  

```python
@udtf(result_types=[DataTypes.STRING()])
def split(line: Row):
    for s in line[0].split():
        yield Row(s)

# compute word count
tab.flat_map(split).alias('word') \
   .group_by(col('word')) \
   .select(col('word'), lit(1).count) \
   .execute_insert('sink') \
   .wait()
```

[**전체 코드 참고**](https://nightlies.apache.org/flink/flink-docs-master/docs/dev/python/table_api_tutorial/){:target="_blank"}  


# 참고
- [Apache Flink: pyflink 공식문서](https://nightlies.apache.org/flink/flink-docs-master/docs/dev/python/overview/){:target="_blank"}
- [Apache Flink" pyflink Docs 공식문서](https://nightlies.apache.org/flink/flink-docs-master/api/python/){:target="_blank"}

