<p align="center">
<p align="center">
   <img width="170" height="170" src="https://github.com/markmusic27/digit-recognition-neural-network/blob/main/docs/box.png?raw=true" alt="Logo">
  </p>
  <h1 align="center"><b>Digit Recognizer Neural Network</b></h1>
  <p align="center">
  ✶ Classifies 28x28px handwritten digits with ~90% accuracy ✶
    <br />
    <a href="https://digit-recognition-nn.vercel.app/">Try it out »</a>
    <br />
  </p>
</p>

_Note on accuracy:_ the ~90% accuracy score was computed by testing the model on images from the [MNIST database](https://www.kaggle.com/datasets/hojjatk/mnist-dataset) that had not been used in training (~10k of them). I've noticed user-generated images can differ significantly from what's found in MNIST, so the demo's accuracy _is likely worse (perhaps significantly)._

![Project Demo](https://github.com/markmusic27/digit-recognition-neural-network/blob/main/docs/thumbnail_readme.png?raw=true)

I built this as an exercise to learn more about the mathematical underpinnings of modern AI tech. Don't get me wrong: vanilla neural nets, and got forbid my implementation of them, are nowhere near "the latest in AI." But I found it to be a good exercise to learn the basics of Neural Networks: how they work and how they learn.

## Basic Structure

What's cool about extending a project beyond just a Python script is you get a feel for how these systems are deployed.

> **Big learning:**
> AI models aren't run in Python at scale. What I mean by this is that when you send ChatGPT a question, it's not Python code that's running in OpenAI's servers handling your request (at least that I know of). _Python is used to train models._ Once you get the weights, the product of training, the models are run in Go or some other language that's optimized to handle requests.

This is exactly what I employed in this project. I first focused on training the model with a version of the MNIST database, a database of 28 square pixel images of handwritten digits with labels. All of this code is in the root of the project. Then I made my model accessible to the internet through an API written with FastAPI. This way, I could predict a digit given a set of 784 pixel values ($28^2$ activations). Finally, I built a React website where users can draw digits and use my algorithm to classify them. All of that code is in the `\demo` folder.

## Math Behind Network

By far the most useful part of this project was the realization that Neural Networks are just math functions that input an image (represented mathematically as a vector of pixel values) and outputs a prediction (vector representing confidence that the image is an arbitrary digit).

> **On the math level required for this project:**
> I just took [Math 51](https://web.stanford.edu/class/math51/), Stanford's Linear Algebra and Multivariable Calculus course, and the math felt very familiar. You can definitely understand everything with basic calculus skills. Expressing everything as linear algebra makes everything more notationally convenient. It's also convention so most Python frameworks, like `numpy` use Linear Algebra operations like the transpose. I'd recommend 3Blue1Brown's calculus and nerual network courses for anyone who is going into this with little to no calculus experience.

Lets get into it. As I mentioned above, Neural Networks are just elaborate math functions. Hence, we need ways to numerically describe the input and output to this function:
- Input is a 28x28px image in black and white. We represent this as a list of the pixel values where each value is between 0 (black) and 1 (white). This corresponds to an input space of $784$ or $28^2$ numbers.
- Output is a list of the possible digits (integers between 0 and 9) that the image could represent. We represent this as a list of the model's confidence that the image represents a certain number. This corresponds to an output space of $10$.
  


## Citations

I'm not currently in school so I don't necessarily plan to be _academic_ about this. Here are the sources I used to learn about how these things work and how to build them:
1. [3Blue1Brown's series on Neural Networks:](https://youtu.be/aircAruvnKk?si=mRS-NlKrfyDwxWpz) Hats off to Grant Sanderson for all of his work. This series helps you build an intuitive understanding for how neural nets work, and most importantly, learn. I stopped watching after the Backpropagation Calculus episode, but I'm very eager to watch the LLM ones.
2. Michael Nielson's Book [_Neural Networks and Deep Learning_ Chapter 1](http://neuralnetworksanddeeplearning.com/chap1.html): Fantastic write up on the math and how these things work, but I'd recommend the more visual approach that 3Blue1Brown takes. Goes into much more depth though.