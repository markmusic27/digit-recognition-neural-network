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
  
The basic structure for the network then looks like this:

![](https://i.ibb.co/JwXXcxkq/Clean-Shot-2025-07-08-at-09-12-49-2x.png)

I chose 2 hidden layers with 16 neurons because that's what Grant Sanderson did in his series, and it renders nicely on the demo website. These are things that you can tweak. What's important to note here is that our hope is that as the data gets processed from the first neuron to the last, the model is able to capture distinguishing features of the image that help it identify which digit it represents. Hence, we can think of each layer as an inner function that modifies the data in such a way that it brings us closer to classifying the image.

### Forward Pass

Each neuron in any layer is defined as follows: it's the weighted sum of all of the activations in the previous layer plus a bias. Each one of these weights determines how much of a previous layer's activation affects the current activation. This is done for every neuron in the layer. We define this weighted sum and the bias as $z$.

$$
\mathbf{z^{(l)}}=W^{(l)}\cdot \mathbf{a^{(l-1)}}+\mathbf{b^{(l)}}
$$

where 
- $W^{(l)}$ is the weight matrix for layer $l$ through layer $l-1$
- $\mathbf{a^{(l-1)}}$ is the activation vector for the layer $l-1$. Think of this as the input to the layer $l$
- $\mathbf{b^{(l)}}$ the bias vector for the layer $l$

This weight matrix is indexed as follows: each entry $w^{(l)}_{jk}$ describes the strength of the connection between the previous activation $a^{(l-1)}_k$ and the current one $a^{(l)}_j$. To clarify, __$j$ is the index of the neuron in the current layer__ and __$k$ is the index of the neuron in the previous layer.__ Moreover, we think of each individual activation as being the dot-product of a __row__ in the weight matrix and the previous activations + a bias.

$$
z^{(l)}_{k}=W^{(l)}_{(\text{row } k)}\cdot \mathbf{a^{(l-1)}}+b^{(l)}_{k}
$$

I emphasize that we conduct this operation layer by layer. This is how the algorithm is designed to run: conducting this linear combination for each layer until we arrive at an output. The way this is built out in code is by establishing a `Layer` class with two methods: `forward` and `backward`. We'll go into backward (which handles backpropagation) later. But all the method does is take a series of inputs $a^{(l-1)}$, compute the aforementioned operation, and spit out the output.

The issue with the operation above is that it spits out values in $\mathbb{R}^n$. Activations are values between 0 and 1. Hence, use an activation function called the sigmoid function. You can think of it as squishing the real number line into values between 0 and 1. Very large values tend to 1 and very small values tend to 0.

$$
\sigma (x)=\frac{1}{1+e^{-x}}
$$

![](https://i.ibb.co/DfTHf3Y5/final.png)

Hence, our activations can be written as

$$\mathbf{a^{(l)}}=\sigma (\mathbf{z^{(l)}})$$

Now, we have all of the math we need to implement the forward function:
```py
# Returns activation given, old activations, and weights
    def forward(self, x):
        self.x = x
        self.z = np.dot(self.W, x) + self.b
        self.a = sigmoid(self.z)
        
        return self.a
```

### Backward Pass (Learning)

The big unanswered question at this point is _for what weights and biases is the neural network most accurate?_ What is meant by machine learning, in this context, is tweaking these knobs (weights and biases) to get the best results. To achieve this, we must provide the model with a way for it to determine its performance. We call this the loss function $\mathcal{L}$.

$$
\mathcal{L}(\mathbf{a}, \mathbf{y})=\frac{1}{2}\|\mathbf{a}-\mathbf{y}\|^2
$$

We call this the mean squared error loss function. Here, we take the output of a layer, or the model itself, $\mathbf{a}$ and compare it against the expected output $\mathbf{y}$. In other words, the question becomes:

> For what weight and bias values is ${\mathcal{L}}(\mathbf{a}, \mathbf{y})$ smallest. And how can we change these values for $W$ and $b$ such that $\mathcal{L}$ is minimized.

We solve this by taking the gradient of the loss with respect to both the weights ($\frac{\partial \mathcal{L}}{\partial W}$) and the biases ($\frac{\partial \mathcal{L}}{\partial b}$). We can then use these to perform a [gradient descent](https://en.wikipedia.org/wiki/Gradient_descent) step. In this example, we use Stochastic Gradient Descent, where backpropagation is performed after every training example. Hence, the gradients aren't averaged like its supposed to be done in conventional gradient descent. Lets find $\frac{\partial \mathcal{L}}{\partial W}$ and $\frac{\partial \mathcal{L}}{\partial b}$ mathematically.

### Finding $\frac{\partial \mathcal{L}}{\partial W}$
We start off with the relevant loss function deliniated above $\mathcal{L}(\mathbf{a}, \mathbf{y})=\frac{1}{2}\|\mathbf{a}-\mathbf{y}\|^2$. We also note that $\mathbf{a}=\sigma (\mathbf{z})$. Hence, $\mathcal{L}$ depends on $\mathbf{a}$ which depends on $\mathbf{z}$ which depends on $\mathbf{W}$.

$$
\mathcal{L}\rightarrow\mathbf{a}\rightarrow\mathbf{z}\rightarrow\mathbf{W}
$$

Hence, we apply the chain rule to obtain

$$
\frac{\partial \mathcal{L}}{\partial W}=\frac{\partial \mathcal{L}}{\partial \mathbf{a}}\frac{\partial\mathbf{a}}{\partial\mathbf{z}}\frac{\partial\mathbf{z}}{\partial\mathbf{W}}
$$

Hence, we can find the relevant partial derivatives to compute $\frac{\partial \mathcal{L}}{\partial W}$.

- $\frac{\partial \mathcal{L}}{\partial \mathbf{a}}$ will be inputted to the `backward` method. This represents how the activations need to change
- $\frac{\partial \mathbf{a}}{\partial \mathbf{z}}=\frac{d}{d\mathbf{z}} (\sigma (\mathbf{z}))=\sigma'(\mathbf{z})$ where $\sigma' = \frac{\sigma}{1-\sigma}$
- $\frac{\partial \mathbf{z}}{\partial \mathbf{W}}=\frac{d}{d\mathbf{W}}(W\cdot \mathbf{a^{(l-1)}}+\mathbf{b})=\mathbf{a^{(l-1)}}$ where $\mathbf{a^{(l-1)}}$ are the inputs of the layer

Putting this all together, we get

$$
\frac{\partial \mathcal{L}}{\partial W}=\underbrace{\frac{\partial \mathcal{L}}{\partial \mathbf{a}}}_{\text{we're given}}\cdot \sigma ' (\mathbf{z})\cdot \mathbf{a^{(l-1)}}
$$

This is all we need to compute the gradient with respect to the weights.

### Finding $\frac{\partial \mathcal{L}}{\partial \mathbf{b}}$
We use the same chain rule method to obtain this partial derrivative... and it stays largely the same! The only difference is we differentiate $z$ with respect to $b$ and not $W$. In other words, we have

$$
\frac{\partial \mathcal{L}}{\partial \mathbf{b}}=\underbrace{\frac{\partial \mathcal{L}}{\partial \mathbf{a}}\frac{\partial\mathbf{a}}{\partial\mathbf{z}}}_{\text{same as before}}\frac{\partial\mathbf{z}}{\partial\mathbf{b}}
$$

$$
\implies \frac{d}{d\mathcal{b}}(W\cdot \mathbf{a^{(l-1)}}+\mathbf{b})=\mathbf{1}
$$

Therefore...

$$
\therefore \frac{\partial \mathcal{L}}{\partial b}=\underbrace{\frac{\partial \mathcal{L}}{\partial \mathbf{a}}}_{\text{we're given}}\cdot \sigma ' (\mathbf{z})\cdot 1
$$

### Gradient Descent Step

With all of these equations in mind, we can now perform the gradient descent step necessary for backpropagation. What we do now is update our weights and biases in the direction of $\frac{\partial \mathcal{L}}{\partial W}$ and $\frac{\partial \mathcal{L}}{\partial b}$. We update

$$
\mathbf{W}:=\mathbf{W}-\eta \cdot \frac{\partial \mathcal{L}}{\partial \mathbf{W}}
$$

and

$$
\mathbf{b}:=\mathbf{b}-\eta \cdot \frac{\partial \mathcal{L}}{\partial \mathbf{b}}
$$

where $\eta$ is the learning rate. Basically, this determines how big a change to make with each passing training example.

### Implementation
I skipped over a big component of the math which describes the dimension of the individual components necessary to make the math work. More specifically, performing the `backward` pass requires the outer and matrix-vector product operation, which sometimes requires the transpose. That said, here's the implementation of the backpropagation:

```py
def backward(self, da, learning_rate):
        # Step 1: dz = da * sigmoid'(z)
        sig_der_at_z = sigmoid_derivative(self.a)  # Shape: (output, 1)
        dz = da * sig_der_at_z                     # Element-wise multiply

        # Step 2: dW = outer product of dz and x
        dW = np.outer(dz, self.x)                  # Shape: (output, input)

        # Step 3: db = dz
        db = dz                                    # Shape: (output, 1)

        # Step 4: Gradient descent step
        self.W -= learning_rate * dW               # Update weights
        self.b -= learning_rate * db               # Update biases

        # Step 5: dx = matrix-vector multiplication of W.T and dz
        dx = np.matmul(self.W.T, dz)               # Shape: (input, 1)

        return dx
```

## Citations

I'm not currently in school so I don't necessarily plan to be _academic_ about this. Here are the sources I used to learn about how these things work and how to build them:
1. [3Blue1Brown's series on Neural Networks:](https://youtu.be/aircAruvnKk?si=mRS-NlKrfyDwxWpz) Hats off to Grant Sanderson for all of his work. This series helps you build an intuitive understanding for how neural nets work, and most importantly, learn. I stopped watching after the Backpropagation Calculus episode, but I'm very eager to watch the LLM ones.
2. Michael Nielson's Book [_Neural Networks and Deep Learning_ Chapter 1](http://neuralnetworksanddeeplearning.com/chap1.html): Fantastic write up on the math and how these things work, but I'd recommend the more visual approach that 3Blue1Brown takes. Goes into much more depth though.