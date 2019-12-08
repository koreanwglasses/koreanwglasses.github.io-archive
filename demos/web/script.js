function boxMuller() {
    let u1 = Math.random()
    let u2 = Math.random()

    let r = Math.sqrt(-2*Math.log(u1))
    let t = 2 * Math.PI * u2

    let z0 = r*Math.cos(t)
    let z1 = r*Math.sin(t)

    return [z0, z1]
}

function predict(y0, y1, y2, y3, y4) {
    return 1.2629257907542577*y0 + 0.15513039841849158*y1 - 0.22186359489051086*y2 - 
   0.25422844434306535*y3 + 0.05803585006082676*y4
}

function Circle(x, y, dx, dy, radius, opacity, predict) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.radius = radius    
    this.opacity = opacity

    // prediction
    this.predict = predict
    this.x_history = [x, x, x, x, x]
    this.y_history = [y, y, y, y, y]

    this.next_x = x
    this.next_y = y

    // Optimization
    this.uid = Circle.UID_COUNTER++
}

Circle.UID_COUNTER = 0

Circle.prototype.tick = function(dt, maxX, maxY) {
    // prediction
    if(this.predict) {
        this.x_history.pop()
        this.y_history.pop()
        this.x_history.splice(0, 0, this.next_x)
        this.y_history.splice(0, 0, this.next_y)

        this.x = predict(...this.x_history)
        this.y = predict(...this.y_history)

        return;
    }

    // moving
    this.x += this.dx * dt
    this.y += this.dy * dt

    // bouncing
    if(this.x - this.radius < 0) {
        this.x = this.radius;
        this.dx *= -1;
    }

    if(this.x + this.radius> maxX) {
        this.x = maxX - this.radius;
        this.dx *= -1;
    }

    if(this.y - this.radius < 0) {
        this.y = this.radius;
        this.dy *= -1;
    }

    if(this.y + this.radius> maxY) {
        this.y = maxY - this.radius;
        this.dy *= -1;
    }
}

Circle.prototype.draw = function(ctx) {
    // Draw circle
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
}

Circle.prototype.setPos = function(x, y) {
    this.next_x = x
    this.next_y = y
}

Circle.random = function(maxX, maxY) {
    let x = Math.random() * maxX
    let y = Math.random() * maxY

    let [dx, dy] = boxMuller()
    dx *= 15
    dy *= 15


    let radius = Math.random() * 10 + 5

    let opacity = Math.pow(Math.random(), 1.3) + 0.05

    return new Circle(x, y, dx, dy, radius, opacity)
}

function Line(circle1, circle2) {
    this.circle1 = circle1
    this.circle2 = circle2
}

Line.prototype.draw = function(ctx, p, r) {
    let length2 = Math.pow(this.circle1.x - this.circle2.x, 2) + Math.pow(this.circle1.y - this.circle2.y, 2)

    let opacity = Math.min(1, Math.pow(r, p) / Math.pow(length2, p/2))

    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
    ctx.lineWidth = 1.5

    ctx.beginPath();
    ctx.moveTo(this.circle1.x, this.circle1.y)
    ctx.lineTo(this.circle2.x, this.circle2.y)
    ctx.stroke();
}

/**
 * Select the kth smallest element in xs
 * O(n)
 * @param {number} k 
 * @param {number[]} xs 
 */
function kSelect(k, xs) {
    let pivot = xs[Math.floor(Math.random() * xs.length)];
    let low = xs.filter(x=>x<pivot)

    if(low.length + 1 == k) {
        return pivot
    }

    if(low.length >= k) {
        return kSelect(k, low)
    } else {
        let high = xs.filter(x=>x>=pivot)
        return kSelect(k - low.length, high)
    }
}

/**
 * Computes the mean of xs
 * O(n)
 * @param {*} xs 
 */
function median(xs) {
    let k = Math.floor(xs.length / 2)
    if(xs.length % 2) {
        return kSelect(k, xs)
    } else {
        return (kSelect(k-1, xs) + kSelect(k, xs))/2
    }
}

/**
 * Constructs a KDTree
 * O(n log n)
 * @param {*} circles 
 * @param {*} split_threshold 
 * @param {*} max_depth 
 */
function KDTree(circles, split_threshold, max_depth) {
    this.isLeaf = max_depth == 0 || circles.length <= split_threshold
    if(this.isLeaf) {
        this.circles = circles
        return
    }

    let xs = circles.map(c=>c.x)
    let ys = circles.map(c=>c.y)

    let rangeX = Math.max(...xs) - Math.min(...xs)
    let rangeY = Math.max(...ys) - Math.min(...ys)

    this.splitByX = rangeX > rangeY

    if (this.splitByX) {
        this.splitPoint = median(xs)
        this.low = new KDTree(circles.filter(c=>c.x < this.splitPoint), split_threshold, max_depth - 1)
        this.high = new KDTree(circles.filter(c=>c.x >= this.splitPoint), split_threshold, max_depth - 1)
    } else {
        this.splitPoint = median(ys)
        this.low = new KDTree(circles.filter(c=>c.y < this.splitPoint), split_threshold, max_depth - 1)
        this.high = new KDTree(circles.filter(c=>c.y >= this.splitPoint), split_threshold, max_depth - 1)
    }
}

/**
 * O(log n)
 */
KDTree.prototype.query = function(x, y, radius) {
    if(this.isLeaf) {
        return this.circles.filter(c=>Math.pow(c.x-x, 2) + Math.pow(c.y-y, 2) <= Math.pow(radius, 2))
    }

    let results = []
    if(this.splitByX) {
        if(x - radius < this.splitPoint) {
            results.push(...this.low.query(x, y, radius))
        }
        if(x + radius >= this.splitPoint) {
            results.push(...this.high.query(x, y, radius))
        }
    } else {
        if(y - radius < this.splitPoint) {
            results.push(...this.low.query(x, y, radius))
        }
        if(y + radius >= this.splitPoint) {
            results.push(...this.high.query(x, y, radius))
        }
    }

    return results
}

KDTree.prototype.draw = function(ctx, minX, maxX, minY, maxY, depth=0) {
    if(this.isLeaf) {
        return;
    }

    ctx.strokeStyle = 'red'
    ctx.lineWidth = 10 * Math.pow(1.2, -depth)
    if(this.splitByX) {
        ctx.beginPath()
        ctx.moveTo(this.splitPoint, minY)
        ctx.lineTo(this.splitPoint, maxY)
        ctx.stroke()

        this.low.draw(ctx, minX, this.splitPoint, minY, maxY, depth + 1)
        this.high.draw(ctx, this.splitPoint, maxX, minY, maxY, depth + 1)
    } else {
        ctx.beginPath()
        ctx.moveTo(minX, this.splitPoint)
        ctx.lineTo(maxX, this.splitPoint)
        ctx.stroke()

        this.low.draw(ctx, minX, maxX, minY, this.splitPoint, depth + 1)
        this.high.draw(ctx, minX, maxX, this.splitPoint, maxY, depth + 1)
    }
}

/**
 * Returns a set of lines that connect circles that are within radius of each other
 * O(n log n)
 * @param {*} circles 
 * @param {*} radius 
 */
function connectLines(circles, radius) {
    let kdtree = new KDTree(circles, 3, 10)
    let lines = []
    for(let circle of circles) {
        let neighbors = kdtree.query(circle.x, circle.y, radius)
        let neighborsToConnect = neighbors.filter(n=>n.uid > circle.uid)
        for(let neighbor of neighborsToConnect) {
            lines.push(new Line(circle, neighbor))
        }
    }

    return {lines, kdtree}
}

function Box(circles, maxX, maxY) {
    this.circles = circles

    // boundaries
    this.maxX = maxX
    this.maxY = maxY

    // drawing parameters
    this.p = 5
    this.r = 60

    this.lineOpacityThreshold = 1/128

    this.drawKDTree = false
}

Box.prototype.tick = function(dt) {
    for(let circle of this.circles) {
        circle.tick(dt, this.maxX, this.maxY)
    }
}

Box.prototype.getMaxLineLength = function() {
    return this.r * Math.pow(this.lineOpacityThreshold, -1/this.p)
}

Box.prototype.draw = function(ctx) {
    // Draw background
    ctx.fillStyle = "rgb(51, 102, 153)";
    ctx.fillRect(0, 0, this.maxX, this.maxY);

    // Draw lines
    let {lines, kdtree} = connectLines(this.circles, this.getMaxLineLength())
    for(let line of lines) {
        line.draw(ctx, this.p, this.r)
    }

    // Draw each circle
    for(let circle of this.circles) {
        circle.draw(ctx)
    }

    // Draw kdtree
    if(this.drawKDTree) {
        kdtree.draw(ctx, 0, this.maxX, 0, this.maxY)
    }
}

Box.random = function(numCircles, maxX, maxY) {
    let circles = []
    for(let i = 0; i < numCircles; i++) {
        circles.push(Circle.random(maxX, maxY))
    }
    return new Box(circles, maxX, maxY)
}

// Globals are evil, we will deal with them for now
let box = null
let count = 100

function onResize() {
    let width = $(window).width()
    let height = $(window).height()
    $('canvas').width(width)
    $('canvas').height(height)

    let ctx = $('canvas')[0].getContext('2d')
    ctx.canvas.width = width
    ctx.canvas.height = height

    box.maxX = width
    box.maxY = height
}

function animate() {
    let ctx = $('canvas')[0].getContext('2d')
    box.tick(1/60)
    box.draw(ctx)
    requestAnimationFrame(animate)
}

$(function() {
    // initialization
    let width = $(window).width()
    let height = $(window).height()
    box = Box.random(count, width, height)
    onResize()

    animate()
});

$(window).resize(onResize)

$('canvas').mouseenter(function(e) {
    let x = e.clientX
    let y = e.clientY

    box.circles[count] = new Circle(x, y, 0, 0, 0, 0, true) 
})
$('canvas').mousemove(function(e) {
    let x = e.clientX
    let y = e.clientY

    box.circles[count].setPos(x, y)
})

$('canvas').mouseleave(function() {
    box.circles.splice(count, 1)
})