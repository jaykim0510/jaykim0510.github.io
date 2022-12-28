---
layout: post
title:  'MLOps Series [Part6]: Testing Code, Data and Model'
description: 
date:   2022-09-07 15:01:35 +0300
image:  '/images/mlops_logo.png'
logo_image:  '/images/mlops_logo.png'
categories: data_engineering
tags: MLOps
---
---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---

- Learn how to test ML artifacts (code, data and models) to ensure a reliable ML system.


# Intuition

- 머신러닝 시스템을 신뢰성있게 반복하기 위해 코드, 데이터, 모델을 테스트하는 방법을 배워야 한다
- 테스트는 무엇인가가 우리의 의도대로 동작한다는 것을 확신시켜준다
- 우리는 가능한 에러를 빨리 찾음으로써 다운 스트림 태스크로 에러가 확장되지 않도록 해야한다

## How should we test

테스트 코드의 방법론은 다음과 같이 Arrange-Act-Assert로 이루어진다

- **Arrange**: 여러 다른 입력 데이터를 준비한다
- **Act**: 준비된 입력 데이터를 테스트 하고 싶은 요소에 넣는다
- **Assert**: 결과물을 우리의 기대값과 비교한다

<div class="pen-para">
    <div class="pen-bar">
      <i class="fas fa-hammer"></i>Tools
    </div>
    <div class="pen-content">
      In Python, there are many tools, such as `unittest`, `pytest`, etc. that allow us to easily implement our tests while adhering to the Arrange Act Assert framework. These tools come with powerful built-in functionality such as parametrization, filters, and more, to test many conditions at scale.  
    </div>
</div>



## What should we test

우리는 대표적으로 데이터 자체에 대한 테스트, 그리고 데이터를 모델에 넣고난 후 나온 결과에 대한 테스트 해야한다.  

- inputs: data types, format, length, edge cases (min/max, small/large, etc.)
- outputs: data types, formats, exceptions, intermediary and final outputs


# Hierachy

- tests 디렉터리에 저장
- `test_` 접두사
- 코드 하나당 테스트 코드 하나인 경우도 있고, 코드 하나에 여러 기능을 내포한 경우 함수 하나당 테스트 코드 하나인 경우도 있다

```
root
├── code
│   └── train.py
└── tests
    ├── code
    │   └── test_train.py
    │   └── test_valid.py
    ├── data
    └── model
```

# Testing Code

## Initialization

```
pip install pytest
```

- `pytest`는 기본적으로 `tests` 폴더의 `test_`로 시작하는 파일들을 테스트하지만, 설정을 통해 변경할 수도 있다.  

```ini
# pyproject.toml

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = "test_*.py"
```

## Assertions

- Let's see what a sample test and it's results look like. Assume we have a simple function that determines whether a fruit is crisp or not:

```py
# food/fruits.py
def is_crisp(fruit):
    if fruit:
        fruit = fruit.lower()
    if fruit in ["apple", "watermelon", "cherries"]:
        return True
    elif fruit in ["orange", "mango", "strawberry"]:
        return False
    else:
        raise ValueError(f"{fruit} not in known list of fruits.")
    return False
```

```py
# tests/food/test_fruits.py
def test_is_crisp():
    assert is_crisp(fruit="apple")
    assert is_crisp(fruit="Apple")
    assert not is_crisp(fruit="orange")
    with pytest.raises(ValueError):
        is_crisp(fruit=None)
        is_crisp(fruit="pear")

```

## Execution

We can execute our tests above using several different levels of granularity:

```sh
python3 -m pytest                                           # all tests
python3 -m pytest tests/food                                # tests under a directory
python3 -m pytest tests/food/test_fruits.py                 # tests for a single file
python3 -m pytest tests/food/test_fruits.py::test_is_crisp  # tests for a single function
```

```sh
# 테스트 성공했을 때 출력
tests/food/test_fruits.py::test_is_crisp .           [100%]

# 테스트 실패했을 때 출력
tests/food/test_fruits.py F                          [100%]

    def test_is_crisp():
>       assert is_crisp(fruit="orange")
E       AssertionError: assert False
E        +  where False = is_crisp(fruit='orange')
```

## Classes

We can also test classes and their respective functions by creating test classes. Within our test class, we can optionally define functions which will automatically be executed when we setup or teardown a class instance or use a class method.

- `setup_class`: 클래스에서 가장 처음 실행되는 메서드 이전에 딱 한 번 실행되는 메서드
- `teardown_class`: 클래스에서 가장 나중에 실행되는 메서드 이후에 딱 한 번 실행되는 메서드
- `setup_method`: 클래스 내의 모든 메서드(setup_method, teardown_method 제외)가 실행되기 전에 먼저 실행되는 메서드
- `teardown_method`: 클래스 내의 모든 메서드(setup_method, teardown_method 제외)가 실행되고 나서 실행되는 메서드

- 이 방법은 `unittest`에서 즐겨쓰는 방법으로, `pytest`에서는 Fixture를 더 많이 사용한다

```py
class Fruit(object):
    def __init__(self, name):
        self.name = name

class TestFruit(object):
    @classmethod
    def setup_class(cls):
        """Set up the state for any class instance."""
        pass

    @classmethod
    def teardown_class(cls):
        """Teardown the state created in setup_class."""
        pass

    def setup_method(self):
        """Called before every method to setup any state."""
        self.fruit = Fruit(name="apple")

    def teardown_method(self):
        """Called after every method to teardown any state."""
        del self.fruit

    def test_init(self):
        assert self.fruit.name == "apple"

```

- We can execute all the tests for our class by specifying the class name:

```sh
python3 -m pytest tests/food/test_fruits.py::TestFruit
```

## Parametrize

- `assert`문이 계속 반복되는 문제를 해결해준다
- `@pytest.mark.parametrize` 데코레이터를 이용한다

```py
@pytest.mark.parametrize("fruit, crisp",[("apple", True), ("Apple", True), ("orange", False),],)
def test_is_crisp_parametrize(fruit, crisp):
    assert is_crisp(fruit=fruit) == crisp

```

```py
@pytest.mark.parametrize("fruit, exception",[("pear", ValueError),],)
def test_is_crisp_exceptions(fruit, exception):
    with pytest.raises(exception):
        is_crisp(fruit=fruit)

```


## Fixture

- Parametrize는 함수내에서 `assert`문을 없애줬다
- Fixture는 여러 함수에서 적용되는 반복 요소를 줄여준다
- `@pytest.fixture` 데코레이터를 이용한다
- 테스트 함수에는 Fixture의 이름을 쓰면 된다 (ex. `my_fruit`)

```py
@pytest.fixture
def my_fruit():
    # 여기서만 한 번 Fruit 객체를 생성하면 된다 (매번 생성할 필요 없다)
    fruit = Fruit(name="apple")
    return fruit

def test_fruit(my_fruit):
    assert my_fruit.name == "apple"

# 이렇게 하면 테스트 클래스의 어떤 메소드에도 사용할 수 있다
@pytest.mark.usefixtures("my_fruit")
class TestFruit:
    ...

```

- Fixtures can have different scopes depending on how we want to use them.

- `function`: fixture is destroyed after every test. [default]
- `class`: fixture is destroyed after the last test in the class.
- `module`: fixture is destroyed after the last test in the module (script).
- `package`: fixture is destroyed after the last test in the package.
- `session`: fixture is destroyed after the last test of the session.

```py
@pytest.fixture(scope="module")
def df():
    data = [
        {"title": "a0", "description": "b0", "tag": "c0"},
        {"title": "a1", "description": "b1", "tag": "c1"},
        {"title": "a2", "description": "b2", "tag": "c1"},
        {"title": "a3", "description": "b3", "tag": "c2"},
        {"title": "a4", "description": "b4", "tag": "c2"},
        {"title": "a5", "description": "b5", "tag": "c2"},
    ]
    df = pd.DataFrame(data * 10)
    return df
```

## Markers

- we can create custom granularity by using markers.
- Parametrize도 Marker중 하나 (`@pytest.mark.parametrize`)
- there are several other builtin markers as well. For example, the `skipif` marker allows us to skip execution of a test if a condition is met

```py
# GPU 사용이 불가하면 training을 test하는 코드를 건너띈다
@pytest.mark.skipif(not torch.cuda.is_available(), reason="Full training tests require a GPU.")
def test_training():
    pass
```

```py
# 필터링 할 수 있다
@pytest.mark.fruits
def test_fruit(my_fruit):
    assert my_fruit.name == "apple"

```

```sh
pytest -m "fruits"      #  runs all tests marked with `fruits`
pytest -m "not fruits"  #  runs all tests besides those marked with `fruits`
```


# Data

So far, we've used unit and integration tests to test the functions that interact with our data but we haven't tested the validity of the data itself. We're going to use the `great_expectations` library to test what our data is expected to look like. It's a library that allows us to create expectations as to what our data should look like in a standardized way. It also provides modules to seamlessly connect with backend data sources such as local file systems, S3, databases, etc. Let's explore the library by implementing the expectations we'll need for our application.  

```sh
pip install great_expectations
```

```py
import great_expectations as ge
import json
import pandas as pd
from urllib.request import urlopen

# Load labeled projects
projects = pd.read_csv("https://raw.githubusercontent.com/GokuMohandas/Made-With-ML/main/datasets/projects.csv")
tags = pd.read_csv("https://raw.githubusercontent.com/GokuMohandas/Made-With-ML/main/datasets/tags.csv")
df = ge.dataset.PandasDataset(pd.merge(projects, tags, on="id"))
print (f"{len(df)} projects")
df.head(5)

```

## Expectations

- When it comes to creating expectations as to what our data should look like, we want to think about our entire dataset and all the features (columns) within it.

```py
# Presence of specific features
df.expect_table_columns_to_match_ordered_list(
    column_list=["id", "created_on", "title", "description", "tag"]
)

# Unique combinations of features (detect data leaks!)
df.expect_compound_columns_to_be_unique(column_list=["title", "description"])

# Missing values
df.expect_column_values_to_not_be_null(column="tag")

# Unique values
df.expect_column_values_to_be_unique(column="id")

# Type adherence
df.expect_column_values_to_be_of_type(column="title", type_="str")

# List (categorical) / range (continuous) of allowed values
tags = ["computer-vision", "graph-learning", "reinforcement-learning",
        "natural-language-processing", "mlops", "time-series"]
df.expect_column_values_to_be_in_set(column="tag", value_set=tags)

```

Each of these expectations will create an output with details about success or failure, expected and observed values, expectations raised, etc. For example, the expectation `df.expect_column_values_to_be_of_type(column="title", type_="str")` would produce the following if successful:  

```json
{
  "exception_info": {
    "raised_exception": false,
    "exception_traceback": null,
    "exception_message": null
  },
  "success": true,
  "meta": {},
  "expectation_config": {
    "kwargs": {
      "column": "title",
      "type_": "str",
      "result_format": "BASIC"
    },
    "meta": {},
    "expectation_type": "_expect_column_values_to_be_of_type__map"
  },
  "result": {
    "element_count": 955,
    "missing_count": 0,
    "missing_percent": 0.0,
    "unexpected_count": 0,
    "unexpected_percent": 0.0,
    "unexpected_percent_nonmissing": 0.0,
    "partial_unexpected_list": []
  }
}

```

There are just a few of the different expectations that we can create. Be sure to explore all the [expectations](https://greatexpectations.io/expectations/), including [custom expectations](https://docs.greatexpectations.io/docs/guides/expectations/creating_custom_expectations/overview/). Here are some other popular expectations that don't pertain to our specific dataset but are widely applicable:  

- feature value relationships with other feature values → `expect_column_pair_values_a_to_be_greater_than_b`
- row count (exact or range) of samples → `expect_table_row_count_to_be_between`
- value statistics (mean, std, median, max, min, sum, etc.) → `expect_column_mean_to_be_between`



## Organization

- When it comes to organizing expectations, it's recommended to start with table-level ones and then move on to individual feature columns.

```py
# Presence of specific features
df.expect_table_columns_to_match_ordered_list(
    column_list=["id", "created_on", "title", "description", "tag"]
)

# Unique combinations of features (detect data leaks!)
df.expect_compound_columns_to_be_unique(column_list=["title", "description"])

# Missing values
df.expect_column_values_to_not_be_null(column="tag")

# Unique values
df.expect_column_values_to_be_unique(column="id")

# Type adherence
df.expect_column_values_to_be_of_type(column="title", type_="str")

# List (categorical) / range (continuous) of allowed values
tags = ["computer-vision", "graph-learning", "reinforcement-learning",
        "natural-language-processing", "mlops", "time-series"]
df.expect_column_values_to_be_in_set(column="tag", value_set=tags)

```

- We can group all the expectations together to create an Expectation Suite object which we can use to validate any Dataset module.

```py
# Expectation suite
expectation_suite = df.get_expectation_suite(discard_failed_expectations=False)
print(df.validate(expectation_suite=expectation_suite, only_return_failures=True))
-------------------------------------------------------------------------------------

{
  "success": true,
  "results": [],
  "statistics": {
    "evaluated_expectations": 11,
    "successful_expectations": 11,
    "unsuccessful_expectations": 0,
    "success_percent": 100.0
  },
  "evaluation_parameters": {}
}
```

## Projects

- So far we've worked with the Great Expectations library at the adhoc script / notebook level but we can further organize our expectations by creating a Project.

```sh
cd tests
great_expectations init

---------------------------------
tests/great_expectations/
├── checkpoints/
├── expectations/
├── plugins/
├── uncommitted/
├── .gitignore
└── great_expectations.yml
```

- The first step is to establish our datasource which tells Great Expectations where our data lives:

```sh
great_expectations datasource new
-----------------------------------------------------------------------------
What data would you like Great Expectations to connect to?
    1. Files on a filesystem (for processing with Pandas or Spark) 👈
    2. Relational database (SQL)
-----------------------------------------------------------------------------
What are you processing your files with?
1. Pandas 👈
2. PySpark
-----------------------------------------------------------------------------
Enter the path of the root directory where the data files are stored: ../data

```

- Create expectations manually, interactively or automatically and save them as suites (a set of expectations for a particular data asset).

```
great_expectations suite new
```

```
How would you like to create your Expectation Suite?
    1. Manually, without interacting with a sample batch of data (default)
    2. Interactively, with a sample batch of data 👈
    3. Automatically, using a profiler
```

```
Which data asset (accessible by data connector "default_inferred_data_connector_name") would you like to use?
    1. labeled_projects.csv
    2. projects.csv 👈
    3. tags.csv
------------------------------------------------------------------------------------------------------------
Name the new Expectation Suite [projects.csv.warning]: projects

```

This will open up an interactive notebook where we can add expectations. Copy and paste the expectations below and run all the cells. Repeat this step for `tags.csv` and `labeled_projects.csv`.


```py
# Expections for projects.csv

# Presence of features
validator.expect_table_columns_to_match_ordered_list(
    column_list=["id", "created_on", "title", "description"])
validator.expect_compound_columns_to_be_unique(column_list=["title", "description"])  # data leak

# id
validator.expect_column_values_to_be_unique(column="id")

# create_on
validator.expect_column_values_to_not_be_null(column="created_on")
validator.expect_column_values_to_match_strftime_format(
    column="created_on", strftime_format="%Y-%m-%d %H:%M:%S")

# title
validator.expect_column_values_to_not_be_null(column="title")
validator.expect_column_values_to_be_of_type(column="title", type_="str")

# description
validator.expect_column_values_to_not_be_null(column="description")
validator.expect_column_values_to_be_of_type(column="description", type_="str")

```

```py
# Expections for tags.csv

# Presence of features
validator.expect_table_columns_to_match_ordered_list(column_list=["id", "tag"])

# id
validator.expect_column_values_to_be_unique(column="id")

# tag
validator.expect_column_values_to_not_be_null(column="tag")
validator.expect_column_values_to_be_of_type(column="tag", type_="str")

```

```py
# Expections for labeled_projects.csv

# Presence of features
validator.expect_table_columns_to_match_ordered_list(
    column_list=["id", "created_on", "title", "description", "tag"])
validator.expect_compound_columns_to_be_unique(column_list=["title", "description"])  # data leak

# id
validator.expect_column_values_to_be_unique(column="id")

# create_on
validator.expect_column_values_to_not_be_null(column="created_on")
validator.expect_column_values_to_match_strftime_format(
    column="created_on", strftime_format="%Y-%m-%d %H:%M:%S")

# title
validator.expect_column_values_to_not_be_null(column="title")
validator.expect_column_values_to_be_of_type(column="title", type_="str")

# description
validator.expect_column_values_to_not_be_null(column="description")
validator.expect_column_values_to_be_of_type(column="description", type_="str")

# tag
validator.expect_column_values_to_not_be_null(column="tag")
validator.expect_column_values_to_be_of_type(column="tag", type_="str")

```

- All of these expectations have been saved under `great_expectations/expectations`:

```
great_expectations/
├── expectations/
│   ├── labeled_projects.csv
│   ├── projects.csv
│   └── tags.csv
```

- And we can also list the suites with:

```
great_expectations suite list
--------------------------------
Using v3 (Batch Request) API
3 Expectation Suites found:
 - labeled_projects
 - projects
 - tags
```

- To edit a suite, we can execute the follow CLI command:

```
great_expectations suite edit <SUITE_NAME>

```

- Create Checkpoints where a Suite of Expectations are applied to a specific data asset. This is a great way of programmatically applying checkpoints on our existing and new data sources.


```
cd tests
great_expectations checkpoint new CHECKPOINT_NAME
```

- So for our project, it would be:

```
great_expectations checkpoint new projects
great_expectations checkpoint new tags
great_expectations checkpoint new labeled_projects
```

Each of these checkpoint creation calls will launch a notebook where we can define which suites to apply this checkpoint to. We have to change the lines for `data_asset_name` (which data asset to run the checkpoint suite on) and `expectation_suite_name` (name of the suite to use). For example, the `projects` checkpoint would use the `projects.csv` data asset and the projects suite.

Repeat these same steps for the `tags` and `labeled_projects` checkpoints and then we're ready to execute them:

```
great_expectations checkpoint run projects
great_expectations checkpoint run tags
great_expectations checkpoint run labeled_projects
```

![](/images/test_data_1.png)

At the end of this lesson, we'll create a target in our `Makefile` that run all these tests (code, data and models) and we'll automate their execution in our pre-commit lesson.

<div class="pen-para">
    <div class="pen-bar"><i class="fas fa-pen"></i>Note</div>
    <div class="fire-content">We've applied expectations on our source dataset but there are many other key areas to test the data as well. For example, the intermediate outputs from processes such as cleaning, augmentation, splitting, preprocessing, tokenization, etc.</div>
</div>

## Documentation

When we create expectations using the CLI application, Great Expectations automatically generates documentation for our tests. It also stores information about validation runs and their results. We can launch the generate data documentation with the following command: `great_expectations docs build`

![](/images/test_data_2.png)

- By default, Great Expectations stores our expectations, results and metrics locally but for production, we'll want to set up remote metadata stores.

## Production

The advantage of using a library such as great expectations, as opposed to isolated assert statements is that we can:

- reduce redundant efforts for creating tests across data modalities
- automatically create testing checkpoints to execute as our dataset grows
- automatically generate documentation on expectations and report on runs
- easily connect with backend data sources such as local file systems, S3, databases, etc.

Many of these expectations will be executed when the data is extracted, loaded and transformed during our DataOps workflows. Typically, the data will be extracted from a source (database, API, etc.) and loaded into a data system (ex. data warehouse) before being transformed there (ex. using dbt) for downstream applications. Throughout these tasks, Great Expectations checkpoint validations can be run to ensure the validity of the data and the changes applied to it. We'll see a simplified version of when data validation should occur in our data workflows in the orchestration lesson.

![](/images/test_data_3.png)

# 참고 

- [Made With ML, Testing Machine Learning Systems: Code, Data and Models View all lessons](https://madewithml.com/courses/mlops/testing/){:target="_blank"}
