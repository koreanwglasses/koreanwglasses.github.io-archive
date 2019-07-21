---
replicate: true
command: 'cat blog/mandelbrot.md'
date: '19 Sep 2018'
---

*19 Sep 2018*

A staple of any computer visualizataion is generating the mandelbrot set. But generating the mandelbrot set can be slow, especially for large number of iterations across a large screen. So I decided to take advantage of my GPU, and write my own shaders to render the mandelbrot set.

[![The point -0.1604247 + 1.0376410i at a scale of 1px = 1.936E-6.](/resources/assets/mandelbrot/capture.png)](/demos/mandelbrot.html)

**Try it out here -> [Mandelbrot](/demos/mandelbrot.html)**. Warning: Some regions may take a while ( > 5s) to render. This may cause your graphics card to freeze or crash. At least for Google Chrome, a restart of the browser is all it needed to get things working again.

## What is the Mandelbrot Set?

Take a complex number $C = a + bi$. Consider the sequence defined by the following rules

$$ 
z\_0 = 0, z\_{n+1} = z\_n^2 + C 
$$ 
 
The Mandelbrot set is the set of numbers $C$ such that the corresponding sequence does not diverge. 

What does this mean? First lets define iteration. An iteration is simply one step of a repeated process. So the an iteration in this example would be "square the previous number and add C", or in precise mathematical language:

$$ z_{n+1} = z_n^2 + C $$

So multiple iterations is multiple repetitions of this step. Lets work out the example where $ C = -1 $:

$$
\\begin{align\*}
z_0 &= 0 \\\\
z_1 &= 0^2 + -1 = -1 \\\\
z_2 &= (-1)^2 -1 = 1 - 1 = 0 \\\\
z_3 &= 0^2 + -1 = -1 \\\\
\\vdots
\\end{align\*}
$$

So after 3 iterations, we see that this sequence repeats. Thus it will never diverge and it is in the set. Lets try again with $C = 1 + i$:

$$
\\begin{align\*}
z_0 &= 0 \\\\
z_1 &= 0^2 + 1 + i = 1 + i \\\\
z_2 &= (1 + i)^2 + 1 + i = 2i + 1 + i = 1 + 3i \\\\
z_3 &= (1 + 3i)^2 + 1 + i = -8 + 6i + 1 + i = -7 + 7i \\\\
z_4 &= (1 + 3i)^2 + 1 + i = -98i + 1 + i = 1 - 97i \\\\
\\vdots
\\end{align\*}
$$

If we were to keep going, the numbers would just keep getting larger. We say that this sequence diverges, and so it is not in the Mandelbrot set.

## How can we visualize it?

We can visualize the Mandelbrot set by plotting the points that are in the set. By associating every point on the screen with a complex number, we can put a color at that point depending on whether or not it is the set. But how do we tell? and where do the colors come from?

In this application, I implemented what is called an escape time algorithm. Basically, I just do what I did above, repeating the formula for thousands of iterations. If at any point $ \vert z_n \vert > 2 $, then any further iterations will just get larger, and the sequence will diverge. So when at some iteration $ n $, $ \vert z_n \vert > 2 $, we say that the point "escaped" at iteration $ n $.  By assigning a different color to each $ n $ when it escapes, we can get the array of colors shown in the application. 

However, not all numbers will escape. After all, the Mandelbrot set is not empty! So we put a limit on the iterations. If after, say 15000 iterations the point does not escape, then we'll tentatively say that it is in the set, and color it black. This is what you see in the application above

## What is different about this implementation?

Perhaps you are already familiar with the Mandelbrot set. So why is this particular visualization interesting? Well it uses the fact that each point can be calculated indepently to get the GPU do the work. By writing a particular fragment shader, the GPU runs thousands of iterations for each point with its multiple processors to get the work done faster than any sequential CPU could do. 

But of course, there are a lot of programs out there that can do that. However, I added extra precision. Even though graphics cards do not generally support 64-bit floating point numbers in graphics shaders, with a lot of math and some extra code, we can emulate 64-bit floats with regular 32-bit floating point numbers. That way we can explore more of the Mandelbrot set faster, and with almost the same precision a CPU could offer. 

## Implementation

This was the shader code used to generate the image (with comments!)

Vertex Shader:

```c
varying vec2 texCoords;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    // This position is interpolated to let the fragment shader know
    // where we are on the screen
    texCoords = position.xy;
}
```

Fragment Shader:

```c
// Tells the shader what coordinate the center of the screen is
uniform vec2 center;

// Used for extra precision beyond 32-bit floating point
uniform vec2 offset;

uniform float scale;

varying vec2 texCoords;

// Used for coloring
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Mandelbrot Set checking with regular 32-bit floating point numbers
void f32() {
    float lastX = 0.0;
    float lastY = 0.0;
    
    float x = 0.0;
    float y = 0.0;
    
    float cx = texCoords.x / scale + center.x;
    float cy = texCoords.y / scale + center.y;
    
    // Cardioid check
    float q = (cx - 0.25) * (cx - 0.25) + cy * cy;
    if(q * (q + cx - 0.25) < 0.25 * y * y) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }
    
    bool escaped = false;
    float escapeIter = 0.0;
    
    // Escape time algorithm
    for(int i = 0; i <` + maxIter + `; i++) {
        x = lastX * lastX - lastY * lastY + cx;
        y = 2.0 * lastX * lastY + cy;
        
        // Fixed point check
        if(lastX == x && lastY == y) {
            break;
        }
        
        if(x * x + y * y > 4.0) {
            escaped = true;
            escapeIter = float(i);
            break;
        }
        
        lastX = x;
        lastY = y;
    }
    
    if(escaped) {
        gl_FragColor = vec4(hsv2rgb(vec3(escapeIter / 500.0 + 0.5, 1, 1)), 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}

// These functions are helper functions for emulated 64-bit arithmetic
vec2 quick_two_sum(float a, float b) {
    float s = (a + b);
    if(s == 0.0) s = 0.0;
    float e = b - (s - a);
    if(e == 0.0) e = 0.0;
    return vec2(s, e);
}

vec2 two_sum(float a, float b) {
    float s = a + b;
    if(s == 0.0) s = 0.0;
    float v = s - a;
    if(v == 0.0) v = 0.0;
    float e = (a - (s - v)) + (b - v);
    if(e == 0.0) e = 0.0;
    return vec2(s, e);
}

vec2 d_add(vec2 a, vec2 b) {
    vec2 s = two_sum(a.x, b.x);
    vec2 t = two_sum(a.y, b.y);
    s.y += t.x;
    s = quick_two_sum(s.x, s.y);
    s.y += t.y;
    s = quick_two_sum(s.x, s.y);
    return s;
}

vec2 split(float a) {
    const float split = 4097.0;
    float t = a * split;
    float u = t - a;
    if(u == 0.0) u = 0.0;
    float a_hi = t - u;
    float a_lo = a - a_hi;
    return vec2(a_hi, a_lo);
}

vec2 two_prod(float a, float b) {
    float p = a * b;
    if(p == 0.0) p = 0.0;
    vec2 aS = split(a);
    vec2 bS = split(b);
    float err = ((aS.x * bS.x - p) 
        + aS.x * bS.y + aS.y * bS.x)
        + aS.y * bS.y;
    return vec2(p, err);
}

vec2 d_mult(vec2 a, vec2 b) {
    vec2 p = two_prod(a.x, b.x);
    p.y += a.x * b.y;
    p.y += a.y * b.x;
    p = quick_two_sum(p.x, p.y);
    return p;
}

// Mandelbrot set testing with emulated 64-bit numbers
void df64() {                
    vec2 x, y;
    
    vec2 cx = two_sum(center.x, texCoords.x / scale + offset.x);
    vec2 cy = two_sum(center.y, texCoords.y / scale + offset.y);
    
    bool escaped = false;
    float escapeIter = 0.0;
    
    // Escape time algorithm
    for(int i = 0; i <` + maxIter + `; i++) {
        vec2 tempX = d_add(d_add(d_mult(x, x), -d_mult(y, y)), cx);
        vec2 a = d_mult(x, y);
        y = d_add(2.0 * a, cy);
        x = tempX;
        
        if(x.x * x.x + y.x * y.x > 4.0) {
            escaped = true;
            escapeIter = float(i);
            break;
        }
    }
    
    if(escaped) {
        gl_FragColor = vec4(hsv2rgb(vec3(escapeIter / 500.0 + 0.5, 1, 1)), 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}

// Automatic switching between the two modes for speed
void main() {
    if(scale < 2.5e4) {
        f32();
    } else {
        df64();
    }
}
```
