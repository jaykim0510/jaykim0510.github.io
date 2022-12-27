---
layout: post
title:  'Python Advanced Series [Part5]: Code Documenting'
description: 
date:   2022-02-17 15:01:35 +0300
image:  '/images/python_advanced_logo.png'
logo_image: '/images/python_advanced_logo.png'
categories: programming_language
tags: Python
---
---
**Table of Contents**
{: #toc }
*  TOC
{:toc}

---


- Documenting code for your team and your future self.  

We can further organize our code by documenting it to make it easier for others (and our future selves) to easily navigate and extend it. We know our code base best the moment we finish writing it but fortunately documenting it will allow us to quickly get back to that familiar state of mind. Documentation can mean many different things to developers, so let's define the most common components:  

- **comments**: short descriptions as to why a piece of code exists.
- **typing**: specification of a function's inputs and outputs' data types, providing information pertaining to what a function consumes and produces.
- **docstrings**: meaningful descriptions for functions and classes that describe overall utility, arguments, returns, etc.
- **docs**: rendered webpage that summarizes all the functions, classes, workflows, examples, etc.

# Typing

It's important to be as explicit as possible with our code. We've already discussed choosing explicit names for variables, functions, etc. but another way we can be explicit is by defining the types for our function's inputs and outputs.

So far, our functions have looked like this:

```py
from typing import List

def some_function(a: List, b: int = 0) -> np.ndarray:
    return c
```

There are many other data types that we can work with, including `List`, `Set`, `Dict`, `Tuple`, `Sequence` and more, as well as included types such as `int`, `float`, etc. You can also use types from packages we install (ex. `np.ndarray`) and even from our own defined classes (ex. `LabelEncoder`).


<div class="pen-para">
    <div class="pen-bar">
      <i class="fas fa-pen"></i>Tip
    </div>
    <div class="pen-content">
      Starting from Python 3.9+, common types are built in so we don't need to import them with from typing import List, Set, Dict, Tuple, Sequence anymore.
    </div>
</div>

# Docstrings

- We can make our code even more explicit by adding docstrings to describe overall utility, arguments, returns, exceptions and more. Let's take a look at an example:

```py
from typing import List
def some_function(a: List, b: int = 0) -> np.ndarray:
    """Function description.

    ```python
    c = some_function(a=[], b=0)
    print (c)
    ```
    <pre>
    [[1 2]
     [3 4]]
    </pre>

    Args:
        a (List): description of `a`.
        b (int, optional): description of `b`. Defaults to 0.

    Raises:
        ValueError: Input list is not one-dimensional.

    Returns:
        np.ndarray: Description of `c`.

    """
    return c

```

<div class="pen-para">
    <div class="pen-bar">
      <i class="fas fa-pen"></i>Tip
    </div>
    <div class="pen-content">
      If using Visual Studio Code, be sure to use the Python Docstrings Generator extension so you can type `"""` under a function and then hit the `Shift` key to generate a template docstring. It will autofill parts of the docstring using the typing information and even exception in your code!
    </div>
</div>

# 참고 
- [sol-a-qua, 파이썬 Typing 파헤치기 - 기초편](https://sjquant.tistory.com/68){:target="_blank"}
- [Made With ML, Documenting Code](https://madewithml.com/courses/mlops/documentation/){:target="_blank"}