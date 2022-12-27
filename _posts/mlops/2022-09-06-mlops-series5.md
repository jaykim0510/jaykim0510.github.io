---
layout: post
title:  'MLOps Series [Part5]: Weights and Biases'
description: 
date:   2022-09-06 15:01:35 +0300
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

# Intuition

- Machine learning experiment tracking, dataset versioning, and model evaluation  

- Weights & Biases is the machine learning platform for developers to build better models faster. Use W&B's lightweight, interoperable tools to quickly track experiments, version and iterate on datasets, evaluate model performance, reproduce models, visualize results and spot regressions, and share findings with colleagues.

- Set up W&B in 5 minutes, then quickly iterate on your machine learning pipeline with the confidence that your datasets and models are tracked and versioned in a reliable system of record.

- [Experiment Tracking](https://docs.wandb.ai/guides/track)
- [Hyperparameter Tuning](https://docs.wandb.ai/guides/sweeps)
- [Data and Model Versioning](https://docs.wandb.ai/guides/data-and-model-versioning)
- [Artifact](https://docs.wandb.ai/guides/artifacts)
- [Model Management](https://docs.wandb.ai/guides/models)
- [Data Visualization](https://docs.wandb.ai/guides/data-vis)

# Initialization

```sh
pip install wandb
wandb login
```

```py
wandb.init(project_name="my-project") 
```

# Experiment Tracking

- Track and visualize experiments in real time, compare baselines, and iterate quickly on ML projects


- `wandb.init()`: Launch Experiments with wandb.init
  - Initialize a new run at the top of your script. This returns a Run object and creates a local directory where all logs and files are saved, then streamed asynchronously to a W&B server. If you want to use a private server instead of our hosted cloud server, we offer Self-Hosting.

```py
import wandb

config = dict (
  learning_rate = 0.01,
  momentum = 0.2,
  architecture = "CNN",
  dataset_id = "peds-0192",
  infra = "AWS",
)

# Config: Track hyperparameters, architecture, dataset, and anything else you'd like to use to reproduce your model.
# we can group, sort, and filter runs dynamically in the app through Config

# Project: A project is a set of experiments you can compare together.

# Notes: A quick commit message to yourself, the note can be set from your script and is editable in the table.

# Tags: Identify baseline runs and favorite runs. You can filter runs using tags, and they're editable in the table.

wandb.init(
  project="detect-pedestrians",
  notes="tweak baseline",
  tags=["baseline", "paper1"],
  config=config,
)
```


- `wandb.config`: Configure Experiments with wandb.config
  - Set the wandb.config object in your script to save your training configuration: hyperparameters, input settings like dataset name or model type, and any other independent variables for your experiments. 
  - The model settings (you capture in config) are useful later to organize and query your results.
  - (Note that output metrics or dependent variables (like loss and accuracy) should be saved with `wandb.log` instead.)

```py
wandb.init(
  project="detect-pedestrians",
  config=config,
)

wandb.config.update({"lr": 0.1, "channels": 16})
```

- `wandb.log()`: Log Data with wandb.log
  - Keep track of metrics, videos, custom plots, and more
  - Each time you log, we increment the step by default, so you can see how your models and data evolve over time.
  - Log metrics over time in a training loop, such as accuracy and loss. By default, when you call wandb.log it appends a new step to the history object and updates the summary object.
  - history: An array of dictionary-like objects that tracks metrics over time. These time series values are shown as default line plots in the UI.
  - summary: By default, the final value of a metric logged with wandb.log(). You can set the summary for a metric manually to capture the highest accuracy or lowest loss instead of the final value. These values are used in the table, and plots that compare runs — for example, you could visualize at the final accuracy for all runs in your project.

```py
wandb.log({"loss": 0.314, "epoch": 5,
           "inputs": wandb.Image(inputs),
           "logits": wandb.Histogram(ouputs),
           "captions": wandb.Html(captions)})

my_table = wandb.Table(columns=["a", "b"], data=[["a1", "b1"], ["a2", "b2"]])
run.log({"Table Name": my_table})

example_images.append(wandb.Image(
                data[0], caption="Pred: {} Truth: {}".format(pred[0].item(), target[0])))
run.log({"Image": example_images})

run.log({'roc': wandb.plots.ROC(y_test, y_prob_pred, cnb.classes_)})
```


# Artifact

- `wandb.log_artifact`: 
  - Artifacts to track datasets, models, dependencies, and results through each step of your machine learning pipeline. Artifacts make it easy to get a complete and auditable history of changes to your files.
  - Artifacts can be thought of as a versioned directory. Artifacts are either an input of a run or an output of a run. Common artifacts include entire training sets and models. Store datasets directly into artifacts, or use artifact references to point to data in other systems like Amazon S3, GCP, or your own system.
  - Save outputs of a run, like the model weights or a table of predictions. This lets you track not just model training, but all the pipeline steps that affect the final model.
  - An artifact is like a directory of data. Each entry is either an actual file stored in the artifact, or a reference to an external URI. You can nest folders inside an artifact just like a regular filesystem. You can store any data, including: datasets, models, images, HTML, code, audio, raw binary data and more.
  - Every time you change the contents of this directory, Weights & Biases will create a new version of your artifact instead of overwriting the previous contents.

```py
run = wandb.init(project="artifacts-example", job_type='dataset')

# artifact 오브젝트 생성
artifact = wandb.Artifact(name='bicycle-dataset', type='dataset')

# artifact에 넣고싶은 것 추가
artifact.add_file(local_path='dataset.h5')

# run에 artifact 로그
run.log_artifact(artifact)

------

# artifact를 사용
artifact = run.use_artifact('bicycle-dataset:latest')

# artifact를 다운
artifact_dir = artifact.download()

```

# Versioning

- Use Artifacts for dataset versioning, model versioning, and tracking dependencies and results across machine learning pipelines

```py
run = wandb.init(project="my_project")
artifact = wandb.Artifact("new_dataset", type="ver1")

# model: model이 저장된 경로
model.save("model")

# train: train 데이터가 저장된 경로
for dir in ["train", "val", "test"]:
	artifact.add_dir(dir)

# 모델이 저장된 경로인 model을 artifact에 추가
artifact.add_dir("model")

run.log_artifact(artifact)

```

# Hyperparameter Tuning

- Hyperparameter search and model optimization with W&B Sweeps
- Use Weights & Biases Sweeps to automate hyperparameter search and explore the space of possible models.

![](/images/wandb_1.png)

There are two components to Weights & Biases Sweeps: a controller and one or more agents. 

- Controller picks out new hyperparameter combinations. 
- Agents query the Weights & Biases server for hyperparameters and use them to run model training. The training results are then reported back to the Sweep server. Agents can run one or more processes on one or more machines. The flexibility of agents to run multiples processes across multiples machines makes it easy to parallelize and scale Sweeps. 

Create a W&B Sweep with the following steps:  

- **Add W&B to your code**: In your Python script, add a couple lines of code to log hyperparameters and output metrics from your script. See Add W&B to your code for more information.

```py
import numpy as np 
import random

# 🐝 Step 1: Define training function that takes in hyperparameter 
# values from `wandb.config` and uses them to train a model and return metric
def train_one_epoch(epoch, lr, bs): 
  acc = 0.25 + ((epoch/30) +  (random.random()/10))
  loss = 0.2 + (1 - ((epoch-1)/10 +  random.random()/5))
  return acc, loss

def evaluate_one_epoch(epoch): 
  acc = 0.1 + ((epoch/20) +  (random.random()/10))
  loss = 0.25 + (1 - ((epoch-1)/10 +  random.random()/6))
  return acc, loss

def main():
    # Use the wandb.init() API to generate a background process 
    # to sync and log data as a Weights and Biases run.
    # Optionally provide the name of the project. 
    run = wandb.init(project='my-first-sweep')

    # note that we define values from `wandb.config` instead of 
    # defining hard values
    lr  =  wandb.config.lr
    bs = wandb.config.batch_size
    epochs = wandb.config.epochs

    for epoch in np.arange(1, epochs):
      train_acc, train_loss = train_one_epoch(epoch, lr, bs)
      val_acc, val_loss = evaluate_one_epoch(epoch)

      wandb.log({
        'epoch': epoch, 
        'train_acc': train_acc,
        'train_loss': train_loss, 
        'val_acc': val_acc, 
        'val_loss': val_loss
      })
```

- **Define the sweep configuration**: Define the variables and ranges to sweep over. Pick a search strategy— we support grid, random, and Bayesian search, plus techniques for faster iterations like early stopping. See Define sweep configuration for more information.

```py
# 🐝 Step 2: Define sweep config
sweep_configuration = {
    'method': 'random',
    'name': 'sweep',
    'metric': {'goal': 'maximize', 'name': 'val_acc'},
    'parameters': 
    {
        'batch_size': {'values': [16, 32, 64]},
        'epochs': {'values': [5, 10, 15]},
        'lr': {'max': 0.1, 'min': 0.0001}
     }
}
```

- **Initialize sweep**: Start the Sweep server. We host this central controller and coordinate between the agents that execute the sweep. See Initialize sweeps for more information.

```py
# 🐝 Step 3: Initialize sweep by passing in config
sweep_id = wandb.sweep(sweep=sweep_configuration, project='my-first-sweep')
```

- **Start sweep**: Run a single-line command on each machine you'd like to use to train models in the sweep. The agents ask the central sweep server what hyperparameters to try next, and then they execute the runs. See Start sweep agents for more information. 

```py
# 🐝 Step 4: Call to `wandb.agent` to start a sweep
wandb.agent(sweep_id, function=main, count=4)
```

- **Visualize results (optional)**: Open our live dashboard to see all your results in one central place.

![](/images/wandb_2.png)




# 참고

- [wandb 공식문서](https://docs.wandb.ai/){:target="_blank"}
- [neptune, Best Tools for Model Tuning and Hyperparameter Optimization](https://neptune.ai/blog/best-tools-for-model-tuning-and-hyperparameter-optimization){:target="_blank"}
- [pebpung, Sweep이란? - Hyper Parameter 최적화 Tool](https://pebpung.github.io/wandb/2021/10/10/WandB-2.html){:target="_blank"}
- [pebpung, WandB의 다양한 시각화방법 (feat. Confusion Matrices)](https://pebpung.github.io/wandb/2021/10/17/WandB-3.html)