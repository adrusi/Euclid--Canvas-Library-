###
  Euclid (Canvas Library)
  Abstracts canvas shapes into easiliy manipulatable objects

  Copyright 2011 Adrian Sinclair (adrusi)
  
  Easing functions modified from http://developer.yahoo.com/yui/docs/Easing.js.html BSD license
###

@rgba = (r, g, b, a) ->
  "rgba(#{r}, #{g}, #{b}, #{a})"

@rgb = (r, g, b) ->
  "rgba(#{r}, #{g}, #{b}, 1)"

@hex = (value) ->
  value = value.replace /^\#/, ""
  digits = value.split ""
  arr = [
    parseInt digits[0] + digits[1], 16
    parseInt digits[2] + digits[3], 16
    parseInt digits[4] + digits[5], 16
  ]
  "rgba(#{arr[0]}, #{arr[1]}, #{arr[2]}, 1)"

class @Canvas
  constructor: ->
    args = Array::slice.call arguments, 0 # get the arguments object as an array

    if args[0]? and args[0] instanceof HTMLElement # if the first arg is an html element
      elem = args[0]
    else if args[0]? and typeof args[0] is "string" # if the first arg is the id of an element
      elem = document.getElementById args[0]
    else if typeof args[0] is "object" # if the first arg is an options object
      props =
        element: document.createElement "canvas"
        width: 200
        height: 200
      props[prop] = args[0][prop] for prop of args[0] # override the defalults in `props` if set by the user
      elem = if props.element instanceof HTMLElement then props.element else document.getElementById props.element
      console.log elem
      width = props.width
      height = props.height
    else if typeof args[0] is "number" or not args[0]? # if the first arg doesn't refer to an element
      elem = document.createElement "canvas"

    if elem.tagName is "CANVAS" # if the element passed is the canvas itself
      @canvas = elem
    else # if the element passed is another element that we should put a canvas in
      canvas = document.createElement "canvas"
      elem.appendChild canvas
      @canvas = canvas

    @canvas.width = if width? then width else 200 # default dimensions
    @canvas.height = if height? then height else 200

    if args[0]? and typeof args[0] is "number" # if only dimensions were passed as regular params
      @canvas.width = args[0]
      @canvas.height = if args[1]? and typeof args[1] is "number" then args[1] else args[0]
    else if args[1]? and typeof args[1] is "number" # if an element and dimensions were passed as regular params
      @canvas.width = args[1]
      @canvas.height = if args[2]? and typeof args[2] is "number" then args[2] else args[1]

    @ctx = @canvas.getContext "2d"
    ##== add relative drawing to canvas for use in paths
    @ctx.cursor = { x: 0, y: 0 }
    @ctx.relLineTo = (x, y) =>
      @ctx.lineTo x + @ctx.cursor.x, y + @ctx.cursor.y
      @ctx.cursor = { x: @ctx.cursor.x + x, y: @ctx.cursor.y + y }
    @ctx.relMoveTo = (x, y) =>
      @ctx.moveTo x + @ctx.cursor.x, y + @ctx.cursor.y
      @ctx.cursor = { x: @ctx.cursor.x + x, y: @ctx.cursor.y + y }
    @ctx.relArc = (x, y, radius, startAngle, endAngle, anticlockwise) =>
      @ctx.arc x + @ctx.cursor.x, y + @ctx.cursor.y, radius, startAngle, endAngle, anticlockwise
      @ctx.cursor = { x: @ctx.cursor.x + x, y: @ctx.cursor.y + y }
    @ctx.relQuadraticCurveTo = (cp1x, cp1y, x, y) =>
      @ctx.quadraticCurveTo cp1x + @ctx.cursor.x, cp1y + @ctx.cursor.y, x + @ctx.cursor.x, y + @ctx.cursor.y
      @ctx.cursor = { x: @ctx.cursor.x + x, y: @ctx.cursor.y + y }
    @ctx.relBezierCurveTo = (cp1x, cp1y, cp2x, cp2y, x, y) =>
      @ctx.bezierCurveTo cp1x + @ctx.cursor.x, cp1y + @ctx.cursor.y, cp2x + @ctx.cursor.x, cp2y + @ctx.cursor.y,
        x + @ctx.cursor.x, y + @ctx.cursor.y
      @ctx.cursor = { x: @ctx.cursor.x + x, y: @ctx.cursor.y + y }
    ##== END
    @autoDraw.state = on

  registry: {}
  easing:
    linear: (t, b, c, d) -> # current time in animation, start value, delta betweend start and end, duration
      c * t/d + b
    easeIn: (t, b, c, d) ->
      c * (t /= d) * t + b
    easeOut: (t, b, c, d) ->
      -c * (t /= d) * (t - 2) + b
    easeInOut: (t, b, c, d) ->
      if (t /= d/2) < 1
        c/2 * t*t + b
      else
        -c/2 * ((--t) * (t-2) - 1) + b
    easeInStrong: (t, b, c, d) ->
      c * (t /= d)* t*t*t + b
    easeOutStrong: (t, b, c, d) ->
      -c * ((t = t/d - 1) * t*t*t - 1) + b
    easeInOutStrong: (t, b, c, d) ->
    	if (t /= d/2) < 1
        c/2 * t*t*t*t + b
  	  else
  	    -1 * c/2 * ((t -= 2) * t*t*t - 2) + b
  	  console.log "foo"
    elasticIn: (t, b, c, d, a, p) ->
      `(function() {
        if (t == 0) {
          return b;
        }
        if ( (t /= d) == 1 ) {
          return b + c;
        }
        if (!p) {
          p = d * .3;
        }

      	if (!a || a < Math.abs(c)) {
          a = c; 
          var s = p/4;
        }
    	  else {
          var s = p/(2*Math.PI) * Math.asin (c/a);
        }

      	return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
      })()`
    elasticOut: (t, b, c, d, a, p) ->
      `(function() {
      	if (t == 0) {
          return b;
        }
        if ( (t /= d) == 1 ) {
          return b+c;
        }
        if (!p) {
          p=d*.3;
        }

      	if (!a || a < Math.abs(c)) {
          a = c;
          var s = p / 4;
        }
      	else {
          var s = p/(2*Math.PI) * Math.asin (c/a);
        }

      	return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
      })()`
    elasticInOut: (t, b, c, d, a, p) ->
      `(function() {
      	if (t == 0) {
          return b;
        }

        if ( (t /= d/2) == 2 ) {
          return b+c;
        }

        if (!p) {
          p = d*(.3*1.5);
        }

      	if ( !a || a < Math.abs(c) ) {
          a = c; 
          var s = p/4;
        }
      	else {
          var s = p/(2*Math.PI) * Math.asin (c/a);
        }

      	if (t < 1) {
          return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        }
      	return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
      })()`
    backIn: (t, b, c, d) ->
      c * (t /= d) * t * (2.70158 * t - 1.70158) + b
    backOut: (t, b, c, d) ->
      c * ((t = t/d - 1) * t * (2.70158 * t + 1.70158) + 1) + b
    backInOut: (t, b, c, d) ->
      s = 1.70158
      if (t /= d/2) < 1
        `c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b`
      else
        `c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b`
    bounceIn: (t, b, c, d) ->
      c - Canvas::easing.bounceOut(d - t, 0, c, d) + b
    bounceOut: (t, b, c, d) ->
      if (t /= d) < (1/2.75)
        c*(7.5625*t*t) + b
      else if t < (2/2.75)
        c*(7.5625*(t-=(1.5/2.75))*t + .75) + b
      else if t < (2.5/2.75)
        c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b
      else
        c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b
    bounceInOut: (t, b, c, d) ->
      if t < d / 2
        Canvas::easing.bounceIn(t*2, 0, c, d) * .5 + b
      else
        Canvas::easing.bounceOut(t*2-d, 0, c, d) * .5 + c*.5 + b
  
  get: (shape) ->
    @registry[shape]
  
  rectangle: (id, options) ->
    defaults = if not @registry[id]?
      {
        type: "rectangle"
        x: 0
        y: 0
        width: 0
        height: 0
        fillColor: rgba(0,0,0,0)
        strokeColor: rgba(0,0,0,0)
        strokeWidth: 0
        strokeCap: "butt"
        strokeJoin: "miter"
      }
    else
      @registry[id]
    _opts = {}
    for $default of defaults
      _opts[$default] = if options[$default]? and $default isnt "type" then options[$default] else defaults[$default]
    options = _opts
    @registry[id] = options
  
  circle: (id, options) ->
    defaults = if not @registry[id]?
      {
        type: "circle"
        x: 0
        y: 0
        radius: 0
        fillColor: rgba(0,0,0,0)
        strokeColor: rgba(0,0,0,0)
        strokeWidth: 0
        strokeCap: "butt"
        strokeJoin: "miter"
      }
    else
      @registry[id]
    _opts = {}
    for $default of defaults
      _opts[$default] = if options[$default]? and $default isnt "type" then options[$default] else defaults[$default]
    options = _opts
    @registry[id] = options
  
  path: (id, options) ->
    defaults = if not @registry[id]?
      {
        type: "path"
        x: 0
        y: 0
        path: ->
        params: []
        fillColor: rgba(0,0,0,0)
        strokeColor: rgba(0,0,0,0)
        strokeWidth: 0
        strokeCap: "butt"
        strokeJoin: "miter"
      }
    else
      @registry[id]
    _opts = {}
    for $default of defaults
      _opts[$default] = if options[$default]? and $default isnt "type" then options[$default] else defaults[$default]
    options = _opts
    @registry[id] = options
  
  plot: (id, options) ->
    defaults = if not @registry[id]?
      {
        type: "plot"
        x: 0
        y: 0
        xMax: 0
        yMax: 0
        xMin: 0
        yMin: 0
        xScale: 1
        yScale: 1
        equation: (x, params) ->
          x
        params: []
        lineColor: rgba(0,0,0,0)
        lineWidth: 0
      }
    else
      @registry[id]
    _opts = {}
    for $default of defaults
      _opts[$default] = if options[$default]? and $default isnt "type" then options[$default] else defaults[$default]
    options = _opts
    @registry[id] = options
    
  arc: (id, options) ->
    defaults = if not @registry[id]?
      {
        type: "arc"
        x: 0
        y: 0
        radius: 0
        start: 0
        arcLength: 0
        closed: no
        fillColor: rgba(0,0,0,0)
        strokeColor: rgba(0,0,0,0)
        strokeWidth: 0
        strokeCap: "butt"
        strokeJoin: "miter"
      }
    else
      @registry[id]
    _opts = {}
    for $default of defaults
      _opts[$default] = if options[$default]? and $default isnt "type" then options[$default] else defaults[$default]
    options = _opts
    @registry[id] = options

  draw: ->
    @ctx.clearRect 0, 0, @canvas.width, @canvas.height
    for id, shape of @registry
      switch shape.type
        when "rectangle"
          @ctx.beginPath()
          @ctx.fillStyle = shape.fillColor
          @ctx.strokeStyle = shape.strokeColor
          @ctx.lineWidth = shape.strokeWidth
          @ctx.lineCap = shape.strokeCap
          @ctx.lineJoin = shape.strokeJoin
          @ctx.rect shape.x, shape.y, shape.width, shape.height
          @ctx.closePath()
          @ctx.fill()
          @ctx.stroke()
        when "circle"
          @ctx.beginPath()
          @ctx.fillStyle = shape.fillColor
          @ctx.strokeStyle = shape.strokeColor
          @ctx.lineWidth = shape.strokeWidth
          @ctx.lineCap = shape.strokeCap
          @ctx.lineJoin = shape.strokeJoin
          @ctx.arc shape.x, shape.y, shape.radius, 0, 2 * Math.PI, true
          @ctx.closePath()
          @ctx.fill()
          @ctx.stroke()
        when "path"
          @ctx.beginPath()
          @ctx.fillStyle = shape.fillColor
          @ctx.strokeStyle = shape.strokeColor
          @ctx.lineWidth = shape.strokeWidth
          @ctx.lineCap = shape.strokeCap
          @ctx.lineJoin = shape.strokeJoin
          @ctx.cursor = { x: shape.x, y: shape.y }
          @ctx.moveTo shape.x, shape.y
          if shape.params.constructor.name is "Array"
            shape.path.apply @ctx, shape.params
          else if shape.params.constructor.name is "Object"
            shape.path.call @ctx, shape.params
          @ctx.fill()
          @ctx.stroke()
          @ctx.closePath()
        when "plot"
          @ctx.beginPath()
          @ctx.strokeStyle = shape.lineColor
          @ctx.lineWidth = shape.lineWidth
          pixelsPerXUnit = shape.xScale # the pixels for every `1` on the x axis
          incrementXPerPixel = 1 / pixelsPerXUnit # the value by which to increment x every pixel
          pixelsPerYUnit = shape.yScale
          incrementYPerPixel = 1 / pixelsPerYUnit
          xStart = shape.x + pixelsPerXUnit * shape.xMin # the absolute x coordinate of the start of the plot
          xEnd = shape.x + pixelsPerXUnit * shape.xMax
          yClipTop = shape.y - pixelsPerYUnit * shape.yMax # the absolute y coordinate of where to clip the plot at the top
          yClipBottom = shape.y - pixelsPerYUnit * shape.yMin
          @ctx.moveTo xStart, shape.y - (shape.equation x, shape.params) * pixelsPerYUnit
          for xPix in [xStart...xEnd]
            x = shape.xMin + (xPix - xStart) / pixelsPerXUnit
            #console.log x
            result = shape.equation x, shape.params
            yPix = shape.y - result * pixelsPerYUnit
            #console.log yPix
            #console.log x is result
            if yClipTop < yPix < yClipBottom
              @ctx.lineTo xPix, yPix
            else if yPix < yClipTop
              @ctx.moveTo xPix * ((yClipTop - yPix) / -yPix), yClipTop
          @ctx.stroke()
          @ctx.closePath()
        when "arc"
          @ctx.beginPath()
          @ctx.fillStyle = shape.fillColor
          @ctx.strokeStyle = shape.strokeColor
          @ctx.lineWidth = shape.strokeWidth
          @ctx.lineCap = shape.strokeCap
          @ctx.lineJoin = shape.strokeJoin
          @ctx.arc shape.x, shape.y, shape.radius, shape.start, shape.arcLength, false
          @ctx.fill()
          @ctx.stroke()
          @ctx.closePath()
              
          
  autoDraw: (fps = 30) ->
    @autoDraw.state = on
    rec = (previous) ->
      if @autoDraw.state is on
        th = @
        @draw()
        setTimeout ->
          rec.call th
        , 1000 / fps
    rec.call @

  stopDrawing: ->
    @autoDraw.state = off

  animate: (shape, destination, duration, easing, callback, fps = 30) ->
    orig = {}
    
    easing = if easing? and typeof easing isnt "string"
      easing
    else if easing? and typeof easing is "string"
      @easing[easing]
      
    for prop of destination
      if typeof @registry[shape][prop] is "string" and /^rgba\((?:\d|\d+)\, (?:\d|\d+)\, (?:\d|\d+)\, (?:\d|[\d\.]+)\)$/.exec @registry[shape][prop]
        orig[prop] = {rgba: []}
        oldDest = destination[prop]
        destination[prop] = {rgba: []}
        for channel in @registry[shape][prop].replace("rgba(", "").replace(")", "").split /\, ?/
          orig[prop].rgba.push parseFloat channel
        for channel in oldDest.replace("rgba(", "").replace(")", "").split /\, ?/
          destination[prop].rgba.push parseFloat channel
      else
        orig[prop] = @registry[shape][prop]
    timePassed = 0
    rec = ->
      unless timePassed >= duration
        th = @
        for prop of orig
          if orig[prop].constructor.name is "Object" and orig[prop].rgba?
            red = easing timePassed, orig[prop].rgba[0], destination[prop].rgba[0] - orig[prop].rgba[0], duration
            green = easing timePassed, orig[prop].rgba[1], destination[prop].rgba[1] - orig[prop].rgba[1], duration
            blue = easing timePassed, orig[prop].rgba[2], destination[prop].rgba[2] - orig[prop].rgba[2], duration
            alpha = easing timePassed, orig[prop].rgba[3], destination[prop].rgba[3] - orig[prop].rgba[3], duration
            @registry[shape][prop] = rgba(Math.round(red), Math.round(green), Math.round(blue), alpha)
          else if orig[prop].constructor.name is "Object"
            final = {}
            for key, value of orig[prop]
              final[key] = easing timePassed, orig[prop][key], destination[prop][key] - orig[prop][key], duration
            @registry[shape][prop] = final
          else if orig[prop].constructor.name is "Array"
            final = []
            for v, i in orig[prop]
              final.push easing timePassed, orig[prop][i], destination[prop][i] - orig[prop][i], duration
            @registry[shape][prop] = final
          else
            @registry[shape][prop] = easing timePassed, orig[prop], destination[prop] - orig[prop], duration
        setTimeout ->
          rec.call th
          timePassed += 1000 / fps
        , 1000 / fps
    rec.call @
    setTimeout callback, duration
    
  arrayAnimate: (shape, index, destination, duration, easing, callback, fps = 30) ->
    orig = @registry[shape].params[index]
    easing = if easing? and typeof easing isnt "string"
      easing
    else if easing? and typeof easing is "string"
      @easing[easing]
    timePassed = 0
    rec = ->
      unless timePassed >= duration
        th = @
        @registry[shape].params[index] = easing timePassed, orig, destination - orig, duration
        setTimeout ->
          rec.call th
          timePassed += 1000 / fps
        , 1000 / fps
    rec.call @
    setTimeout callback, duration
  
  objAnimate: (shape, property, destination, duration, easing, callback, fps = 30) ->
    orig = @registry[shape].params[property]
    easing = if easing? and typeof easing isnt "string"
      easing
    else if easing? and typeof easing is "string"
      @easing[easing]
    timePassed = 0
    rec = ->
      unless timePassed >= duration
        th = @
        @registry[shape].params[property] = easing timePassed, orig, destination - orig, duration
        setTimeout ->
          rec.call th
          timePassed += 1000 / fps
        , 1000 / fps
    rec.call @
    setTimeout callback, duration
  
  moveToBack: (shape) ->
    _shape = @registry[shape]
    delete @registry[shape]
    @registry[shape] = _shape
    bounceInOut: (t, b, c, d) ->
      if t < d / 2
        Canvas::easing.bounceIn(t*2, 0, c, d) * .5 + b
      else
        Canvas::easing.bounceOut(t*2-d, 0, c, d) * .5 + c*.5 + b
  
  get: (shape) ->
    @registry[shape]