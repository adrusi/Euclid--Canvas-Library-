Euclid (Canvas Library)
=======================
Canvas, unlike SVG, does not treat shapes as individual objects. In canvas, the only directly manipulatable objects are individual pixels. Euclid abstracts canvas and makes shapes act like separate objects. In addition, Euclid also provides very powerful animation and path manipulation helpers. Read the tutorial that follows for more information.

Initializing Euclid
-------------------
After including the Euclid script on your page, there are 10 (!) ways to initialize the library:

    new Canvas(document.getElementById("canvas")); // directly pass a DOM element (a canvas)
    new Canvas("canvas"); // pass the ID of an element (a canvas)
    new Canvas(document.getElementById("container")); // a DOM element (not a canvas)
    new Canvas("container"); // and ID (not a canvas)
    new Canvas(); // create a new canvas, but don't append it to the DOM tree yet
    new Canvas(300); // 300 x 300 px canvas
    new Canvas(100, 300); // 100 x 300 canvas
    new Canvas("canvas", 300); // pass a reference to a node either with an ID or the actual node; 300 x 300
    new Canvas("canvas", 100, 300); // reference; 100 x 300
    new Canvas({
      element: "canvas",
      width: 100,
      height: 300
    });

If you don't specify dimensions, they default to 200 x 200. If you use one of the methods that don't require that you pass an element or ID, you must access the canvas element using `Canvas::canvas` (ex: `var canvas = new Canvas(); document.body.appendChild(canvas.canvas);`).

Drawing Basic Shapes
--------------------
Rectangles are easy, you just specify position, dimensions and styling. Assuming that `canvas` is an instance of `Canvas`:

    canvas.rectangle("box", {
      x: 20,
      y: 10,
      width: 100,
      height: 150,
      fillColor: rgb(255, 0, 0) 
    });

The first parameter is the ID of the shape, it is used to identify it later on. Think of it as a variable. The second parameter is the properties of the rectangle. The names of the properties are self-explanatory; here are the default values:

    x: 0,
    y: 0,
    width: 0,
    height: 0,
    fillColor: rgba(0, 0, 0, 0),
    strokeColor: rgba(0, 0, 0, 0),
    strokeWidth: 0,
    strokeCap: "butt",
    strokeJoin: "miter"

You'll notice that colors don't need to be quoted. Euclid provides several color function: rgb, rgba and hex. rgb and rgba work just as you'd expect. Hex isn't quite the same. You pass a string to the hex function: `hex("ff0000")` with an optional "#" prefix.

If you want to modify the properties of a shape, you do so just as if you were creating a new one, but instead of the defaulting to what is shown above, the defaults will be the current values.

Drawing circles is almost identical. You use the `circle` method and pass a radius instead of a width and height.

Displaying Shapes
-----------------
If you tried out any of the above code, you will have noticed that nothing happened. This is because you need to _draw_ the shapes. Try this code:

    var canvas = new Canvas(500, 500);
    canvas.rectangle("box", {
      x: 20,
      y: 10,
      width: 100,
      height: 150,
      fillColor: rgb(255, 0, 0) 
    });
    canvas.draw();
    document.body.appendChild canvas.canvas

Animating
---------
It would be easy enough to just draw static shapes without Euclid, but animations are significantly more complicated. The animate function accepts: an ID parameter to set which shape to animate, the properties and values to which to animate, the duration, the easing and an optional frames per second parameter (defaults to 30, like TV). Here's an example:

    canvas.animate("box", {
      y: 350,
      fillColor: rgb(0, 127, 255)
    }, 1000, "bounceOut");

If you add this code to the previous example, nothing will happen. This is because we only told the canvas to draw _once_. To animate shapes, we have to continuously draw with `canvas.autoDraw()` which also accepts a fps parameter. Now you'll see that the box drops to the bottom and the bounces. You'll also notice that colors are animated as you would expect.

Paths
-----
The most complex feature of Euclid is paths. Using paths requires knowledge of canvas, but only enough to draw paths statically. Apart from the regular properties of shapes, paths have the `path` and `params` properties. `Path` is a function, which can have any number of parameters. `Params` is an array or parameters to be passed to the `path`. Within `path`, you write regular canvas code, where the drawing context is bound to `this`. Parameters are used for animations; You can animate the params array to animate the parameters passed the `path`. This gives you very precise control over path animations. Here's an example:

    canvas.path("path", {
      path: function(x, y, dims, skew) {
        this.lineTo(x + dims, y);
        this.lineTo(x + dims + skew, y + dims);
        this.lineTo(x + dims + skew, y + dims);
        this.lineTo(x + skew, y + dims);
        this.lineTo(x, y);
      },
      params: [20, 20, 100, 5],
      fillColor: rgb(0, 255, 0),
      x: 20,
      y: 20
    });

So when we draw this path it looks like a parallelogram. You can animate it just like anything else, modifying the entire `params` array, or animate each param individually. The latter is more powerful because it allows you to specify different easing and duration to different params. This is done using the `pathAnimate` method, which accepts the following parameters:

    canvas.pathAnimate(shapeId, paramIndex, animateTo, duration, easing);
    
You can animate the skew of the above path like so:

    canvas.pathAnimate("path", 3, 50, 1000, "elasticOut");