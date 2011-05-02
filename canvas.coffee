###
  Euclid (Canvas Library)
  Abstracts canvas shapes into easiliy manipulatable objects

  Copyright 2011 Adrian Sinclair (adrusi)
  
  Easing functions modified from http://developer.yahoo.com/yui/docs/Easing.js.html BSD license
###

@rgba = (r, g, b, a) ->
  "rgba(#{Math.round(r)}, #{Math.round(g)}, #{Math.round(b)}, #{a})"

@rgb = (r, g, b) ->
  "rgba(#{Math.round(r)}, #{Math.round(g)}, #{Math.round(b)}, 1)"

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
    args = Array::slice.call arguments # get the arguments object as an array

    if args[0]? and args[0].nodeType? # if the first arg is an html element
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
    
    @hiddenCanvas = document.createElement "canvas" # the hidden canvas is used for testing to see if the mouse is over a shape
    @hiddenCanvas.width = if width? then width else 200
    @hiddenCanvas.height = if height? then height else 200
    
    @cursorPos = [0, 0]
    
    @canvas.addEventListener "mousemove", (event) =>
      @cursorPos = [event.layerX, event.layerY]
      cursorPos = @cursorPos
      for id, shape of @registry
        if shape.isMouseOver
          for callback in shape.events.mousemove
            if callback?
              if callback::constructor.length is 0
                callback()
              else
                callback
                  canvas:
                    x: cursorPos[0]
                    y: cursorPos[1]
                  shape:
                    x: shape.x - cursorPos[0]
                    y: shape.y - cursorPos[1]
    , false
    @canvas.addEventListener "click", (event) =>
      cursorPos = @cursorPos
      for id, shape of @registry
        if shape.isMouseOver
          for callback in shape.events.click
            if callback?
              if callback::constructor.length is 0
                callback()
              else
                callback
                  canvas:
                    x: cursorPos[0]
                    y: cursorPos[1]
                  shape:
                    x: shape.x - cursorPos[0]
                    y: shape.y - cursorPos[1]
    , false
    @canvas.addEventListener "mousedown", (event) =>
      cursorPos = @cursorPos
      for id, shape of @registry
        if shape.isMouseOver
          for callback in shape.events.mousedown
            if callback?
              if callback::constructor.length is 0
                callback()
              else
                callback
                  canvas:
                    x: cursorPos[0]
                    y: cursorPos[1]
                  shape:
                    x: cursorPos[0] - shape.x
                    y: cursorPos[1] - shape.y
    , false
    @canvas.addEventListener "mouseup", (event) =>
      cursorPos = @cursorPos
      for id, shape of @registry
        if shape.isMouseOver
          for callback in shape.events.mouseup
            if callback?
              if callback::constructor.length is 0
                callback()
              else
                callback
                  canvas:
                    x: cursorPos[0]
                    y: cursorPos[1]
                  shape:
                    x: shape.x - cursorPos[0]
                    y: shape.y - cursorPos[1]
    , false

    if args[0]? and typeof args[0] is "number" # if only dimensions were passed as regular params
      @canvas.width = args[0]
      @canvas.height = if args[1]? and typeof args[1] is "number" then args[1] else args[0]
      @hiddenCanvas.width = args[0]
      @hiddenCanvas.height = if args[1]? and typeof args[1] is "number" then args[1] else args[0]
    else if args[1]? and typeof args[1] is "number" # if an element and dimensions were passed as regular params
      @canvas.width = args[1]
      @canvas.height = if args[2]? and typeof args[2] is "number" then args[2] else args[1]
      @hiddenCanvas.width = args[1]
      @hiddenCanvas.height = if args[2]? and typeof args[2] is "number" then args[2] else args[1]

    @ctx = @canvas.getContext "2d"
    @hiddenCtx = @hiddenCanvas.getContext "2d"
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
    
    @hiddenCtx.cursor = { x: 0, y: 0 }
    @hiddenCtx.relLineTo = (x, y) =>
      @hiddenCtx.lineTo x + @hiddenCtx.cursor.x, y + @hiddenCtx.cursor.y
      @hiddenCtx.cursor = { x: @hiddenCtx.cursor.x + x, y: @hiddenCtx.cursor.y + y }
    @hiddenCtx.relMoveTo = (x, y) =>
      @hiddenCtx.moveTo x + @hiddenCtx.cursor.x, y + @hiddenCtx.cursor.y
      @hiddenCtx.cursor = { x: @hiddenCtx.cursor.x + x, y: @hiddenCtx.cursor.y + y }
    @hiddenCtx.relArc = (x, y, radius, startAngle, endAngle, anticlockwise) =>
      @hiddenCtx.arc x + @hiddenCtx.cursor.x, y + @hiddenCtx.cursor.y, radius, startAngle, endAngle, anticlockwise
      @hiddenCtx.cursor = { x: @hiddenCtx.cursor.x + x, y: @hiddenCtx.cursor.y + y }
    @hiddenCtx.relQuadraticCurveTo = (cp1x, cp1y, x, y) =>
      @hiddenCtx.quadraticCurveTo cp1x + @hiddenCtx.cursor.x, cp1y + @hiddenCtx.cursor.y, x + @hiddenCtx.cursor.x, y + @hiddenCtx.cursor.y
      @hiddenCtx.cursor = { x: @hiddenCtx.cursor.x + x, y: @hiddenCtx.cursor.y + y }
    @hiddenCtx.relBezierCurveTo = (cp1x, cp1y, cp2x, cp2y, x, y) =>
      @hiddenCtx.bezierCurveTo cp1x + @hiddenCtx.cursor.x, cp1y + @hiddenCtx.cursor.y, cp2x + @hiddenCtx.cursor.x, cp2y + @hiddenCtx.cursor.y,
        x + @hiddenCtx.cursor.x, y + @hiddenCtx.cursor.y
      @hiddenCtx.cursor = { x: @hiddenCtx.cursor.x + x, y: @hiddenCtx.cursor.y + y }
    ##== END
    @autoDraw.state = on

  registry: {}
  zIndecies: []
  
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
        zIndex: @zIndecies.length
        x: 0
        y: 0
        width: 0
        height: 0
        fillColor: rgba(0,0,0,0)
        strokeColor: rgba(0,0,0,0)
        strokeWidth: 0
        strokeCap: "butt"
        strokeJoin: "miter"
        rotate: 0
        rotateOrigin: "center"
        events:
          mousein: []
          mouseout: []
          click: []
          mousemove: []
          mouseup: []
          mousedown: []
      }
    else
      @registry[id]
    _opts = {}
    for $default of defaults
      _opts[$default] = if options[$default]? and $default isnt "type" then options[$default] else defaults[$default]
    options = _opts
    @registry[id] = options
    @zIndecies.push id unless @zIndecies[options.zIndex]
  
  circle: (id, options) ->
    defaults = if not @registry[id]?
      {
        type: "circle"
        zIndex: @zIndecies.length
        x: 0
        y: 0
        radius: 0
        fillColor: rgba(0,0,0,0)
        strokeColor: rgba(0,0,0,0)
        strokeWidth: 0
        strokeCap: "butt"
        strokeJoin: "miter"
        rotate: 0
        rotateOrigin: "center"
        events:
          mousein: []
          mouseout: []
          click: []
          mousemove: []
          mouseup: []
          mousedown: []
      }
    else
      @registry[id]
    _opts = {}
    for $default of defaults
      _opts[$default] = if options[$default]? and $default isnt "type" then options[$default] else defaults[$default]
    options = _opts
    @registry[id] = options
    @zIndecies.push id unless @zIndecies[options.zIndex]
  
  path: (id, options) ->
    defaults = if not @registry[id]?
      {
        type: "path"
        zIndex: @zIndecies.length
        x: 0
        y: 0
        path: ->
        params: []
        fillColor: rgba(0,0,0,0)
        strokeColor: rgba(0,0,0,0)
        strokeWidth: 0
        strokeCap: "butt"
        strokeJoin: "miter"
        fillPath: yes
        closePath: yes
        isMouseOver: no
        rotate: 0
        rotateOrigin: "center"
        events:
          mousein: []
          mouseout: []
          click: []
          mousemove: []
          mouseup: []
          mousedown: []
      }
    else
      @registry[id]
    _opts = {}
    for $default of defaults
      _opts[$default] = if options[$default]? and $default isnt "type" then options[$default] else defaults[$default]
    options = _opts
    @registry[id] = options
    @zIndecies.push id unless @zIndecies[options.zIndex]
  
  plot: (id, options) ->
    defaults = if not @registry[id]?
      {
        type: "plot"
        zIndex: @zIndecies.length
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
        isMouseOver: no
        rotate: 0
        rotateOrigin: "center"
        events:
          mousein: []
          mouseout: []
          click: []
          mousemove: []
          mouseup: []
          mousedown: []
      }
    else
      @registry[id]
    _opts = {}
    for $default of defaults
      _opts[$default] = if options[$default]? and $default isnt "type" then options[$default] else defaults[$default]
    options = _opts
    @registry[id] = options
    @zIndecies.push id unless @zIndecies[options.zIndex]
    
  arc: (id, options) ->
    defaults = if not @registry[id]?
      {
        type: "arc"
        zIndex: @zIndecies.length
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
        isMouseOver: no
        rotate: 0
        rotateOrigin: "center"
        events:
          mousein: []
          mouseout: []
          click: []
          mousemove: []
          mouseup: []
          mousedown: []
      }
    else
      @registry[id]
    _opts = {}
    for $default of defaults
      _opts[$default] = if options[$default]? and $default isnt "type" then options[$default] else defaults[$default]
    options = _opts
    @registry[id] = options
    @zIndecies.push id unless @zIndecies[options.zIndex]
    
  lowLevel: (id, options) ->
    defaults = if not @registry[id]?
      {
        type: "lowLevel"
        zIndex: @zIndecies.length
        operation: (canvas, params) ->
        params: []
      }
    else
      @registry[id]
    _opts = {}
    for $default of defaults
      _opts[$default] = if options[$default]? and $default isnt "type" then options[$default] else defaults[$default]
    options = _opts
    @registry[id] = options
    @zIndecies.push id unless @zIndecies[options.zIndex]

  draw: ->
    @ctx.clearRect 0, 0, @canvas.width, @canvas.height
    for id in @zIndecies
      shape = @registry[id]
      @hiddenCtx.clearRect 0, 0, @hiddenCanvas.width, @hiddenCanvas.height
      @registry[id].wasMouseOver = shape.isMouseOver
      switch shape.type
        when "rectangle"
          rotateOrigin = if shape.rotateOrigin is "center"
            [shape.x + shape.width / 2, shape.y + shape.height / 2]
          else
            shape.rotateOrigin
          @hiddenCtx.save()
          @hiddenCtx.translate rotateOrigin[0], rotateOrigin[1]
          @hiddenCtx.rotate shape.rotate
          @hiddenCtx.translate -rotateOrigin[0], -rotateOrigin[1]
          @hiddenCtx.beginPath()
          @hiddenCtx.fillStyle = "#000000"
          @hiddenCtx.strokeStyle = "#000000"
          @hiddenCtx.lineWidth = shape.strokeWidth
          @hiddenCtx.lineCap = shape.strokeCap
          @hiddenCtx.lineJoin = shape.strokeJoin
          @hiddenCtx.rect shape.x, shape.y, shape.width, shape.height
          @hiddenCtx.closePath()
          @hiddenCtx.fill()
          @hiddenCtx.stroke()
          @hiddenCtx.restore()
          imgd = @hiddenCtx.getImageData @cursorPos[0], @cursorPos[1], 1, 1
          pix = imgd.data
          shape.isMouseOver = pix[3] is 255
          @ctx.save()
          @ctx.translate rotateOrigin[0], rotateOrigin[1]
          @ctx.rotate shape.rotate
          @ctx.translate -rotateOrigin[0], -rotateOrigin[1]
          @ctx.beginPath()
          @ctx.fillStyle = if not shape.fillColor.gradient?
            shape.fillColor
          else if shape.fillColor.gradient is "linear"
            @getLinearGradient shape.fillColor.name
          @ctx.strokeStyle = if not shape.strokeColor.gradient?
            shape.strokeColor
          else if shape.strokeColor.gradient is "linear"
            @getLinearGradient shape.strokeColor.name
          @ctx.lineWidth = shape.strokeWidth
          @ctx.lineCap = shape.strokeCap
          @ctx.lineJoin = shape.strokeJoin
          @ctx.rect shape.x, shape.y, shape.width, shape.height
          @ctx.closePath()
          @ctx.fill()
          @ctx.stroke()
          @ctx.restore()
        when "circle"
          rotateOrigin = if shape.rotateOrigin is "center"
            [shape.x, shape.y]
          else
            shape.rotateOrigin
          @hiddenCtx.save()
          @hiddenCtx.translate rotateOrigin[0], rotateOrigin[1]
          @hiddenCtx.rotate shape.rotate
          @hiddenCtx.translate -rotateOrigin[0], -rotateOrigin[1]
          @hiddenCtx.beginPath()
          @hiddenCtx.fillStyle = "#000000"
          @hiddenCtx.strokeStyle = "#000000"
          @hiddenCtx.lineWidth = shape.strokeWidth
          @hiddenCtx.lineCap = shape.strokeCap
          @hiddenCtx.lineJoin = shape.strokeJoin
          @hiddenCtx.arc shape.x, shape.y, shape.radius, 0, 2 * Math.PI, true
          @hiddenCtx.closePath()
          @hiddenCtx.fill()
          @hiddenCtx.stroke()
          @hiddenCtx.restore()
          imgd = @hiddenCtx.getImageData @cursorPos[0], @cursorPos[1], 1, 1
          pix = imgd.data
          shape.isMouseOver = pix[3] is 255
          @ctx.save()
          @ctx.translate rotateOrigin[0], rotateOrigin[1]
          @ctx.rotate shape.rotate
          @ctx.translate -rotateOrigin[0], -rotateOrigin[1]
          @ctx.beginPath()
          @ctx.fillStyle = if not shape.fillColor.gradient?
            shape.fillColor
          else if shape.fillColor.gradient is "linear"
            @getLinearGradient shape.fillColor.name
          @ctx.strokeStyle = if not shape.strokeColor.gradient?
            shape.strokeColor
          else if shape.strokeColor.gradient is "linear"
            @getLinearGradient shape.strokeColor.name
          @ctx.lineWidth = shape.strokeWidth
          @ctx.lineCap = shape.strokeCap
          @ctx.lineJoin = shape.strokeJoin
          @ctx.arc shape.x, shape.y, shape.radius, 0, 2 * Math.PI, true
          @ctx.closePath()
          @ctx.fill()
          @ctx.stroke()
          @ctx.restore()
        when "path"
          rotateOrigin = shape.rotateOrigin
          @hiddenCtx.save()
          @hiddenCtx.translate rotateOrigin[0], rotateOrigin[1]
          @hiddenCtx.rotate shape.rotate
          @hiddenCtx.translate -rotateOrigin[0], -rotateOrigin[1]
          @hiddenCtx.beginPath()
          @hiddenCtx.fillStyle = if shape.closePath then "#000000" else rgba(0,0,0,0)
          @hiddenCtx.strokeStyle = "#000000"
          @hiddenCtx.lineWidth = shape.strokeWidth
          @hiddenCtx.lineCap = shape.strokeCap
          @hiddenCtx.lineJoin = shape.strokeJoin
          @hiddenCtx.cursor = { x: shape.x, y: shape.y }
          @hiddenCtx.moveTo shape.x, shape.y
          if shape.params.constructor.name is "Array"
            shape.path.apply @hiddenCtx, shape.params
          else if shape.params.constructor.name is "Object"
            shape.path.call @hiddenCtx, shape.params
          @hiddenCtx.closePath() if shape.closePath
          @hiddenCtx.fill() if shape.fillPath
          @hiddenCtx.stroke()
          @hiddenCtx.restore()
          imgd = @hiddenCtx.getImageData @cursorPos[0], @cursorPos[1], 1, 1
          pix = imgd.data
          shape.isMouseOver = pix[3] is 255
          @ctx.save()
          @ctx.translate rotateOrigin[0], rotateOrigin[1]
          @ctx.rotate shape.rotate
          @ctx.translate -rotateOrigin[0], -rotateOrigin[1]
          @ctx.beginPath()
          @ctx.fillStyle = if not shape.fillColor.gradient?
            shape.fillColor
          else if shape.fillColor.gradient is "linear"
            @getLinearGradient shape.fillColor.name
          @ctx.strokeStyle = if not shape.strokeColor.gradient?
            shape.strokeColor
          else if shape.strokeColor.gradient is "linear"
            @getLinearGradient shape.strokeColor.name
          @ctx.lineWidth = shape.strokeWidth
          @ctx.lineCap = shape.strokeCap
          @ctx.lineJoin = shape.strokeJoin
          @ctx.cursor = { x: shape.x, y: shape.y }
          @ctx.moveTo shape.x, shape.y
          if shape.params.constructor.name is "Array"
            shape.path.apply @ctx, shape.params
          else if shape.params.constructor.name is "Object"
            shape.path.call @ctx, shape.params
          @ctx.closePath() if shape.closePath
          @ctx.fill() if shape.fillPath
          @ctx.stroke()
          @ctx.restore()
        when "arc"
          rotateOrigin = if shape.rotateOrigin is "center"
            [shape.x, shape.y]
          else
            shape.rotateOrigin
          @hiddenCtx.save()
          @hiddenCtx.translate rotateOrigin[0], rotateOrigin[1]
          @hiddenCtx.rotate shape.rotate
          @hiddenCtx.translate -rotateOrigin[0], -rotateOrigin[1]
          @hiddenCtx.beginPath()
          @hiddenCtx.fillStyle = "#000000"
          @hiddenCtx.strokeStyle = "#000000"
          @hiddenCtx.lineWidth = shape.strokeWidth
          @hiddenCtx.lineCap = shape.strokeCap
          @hiddenCtx.lineJoin = shape.strokeJoin
          @hiddenCtx.arc shape.x, shape.y, shape.radius, shape.start, shape.arcLength, false
          @hiddenCtx.fill()
          @hiddenCtx.stroke()
          @hiddenCtx.closePath()
          @hiddenCtx.restore()
          imgd = @hiddenCtx.getImageData @cursorPos[0], @cursorPos[1], 1, 1
          pix = imgd.data
          shape.isMouseOver = pix[3] is 255
          @ctx.save()
          @ctx.translate rotateOrigin[0], rotateOrigin[1]
          @ctx.rotate shape.rotate
          @ctx.translate -rotateOrigin[0], -rotateOrigin[1]
          @ctx.beginPath()
          @ctx.fillStyle = if not shape.fillColor.gradient?
            shape.fillColor
          else if shape.fillColor.gradient is "linear"
            @getLinearGradient shape.fillColor.name
          @ctx.strokeStyle = if not shape.strokeColor.gradient?
            shape.strokeColor
          else if shape.strokeColor.gradient is "linear"
            @getLinearGradient shape.strokeColor.name
          @ctx.lineWidth = shape.strokeWidth
          @ctx.lineCap = shape.strokeCap
          @ctx.lineJoin = shape.strokeJoin
          @ctx.arc shape.x, shape.y, shape.radius, shape.start, shape.arcLength, false
          @ctx.fill()
          @ctx.stroke()
          @ctx.closePath()
          @ctx.restore()
        when "lowLevel"
          if Object::toString.call(shape.params) is "[object Array]"
            shape.operation.apply @ctx, [@canvas].concat shape.params
          else
            shape.operation.call @ctx, @canvas, shape.params;
      if shape.isMouseOver and not shape.wasMouseOver
        for callback in shape.events.mousein
          if callback?
            if callback::constructor.length is 0
              callback()
            else
              callback
                canvas:
                  x: @cursorPos[0]
                  y: @cursorPos[1]
                shape:
                  x: shape.x - @cursorPos[0]
                  y: shape.y - @cursorPos[1]
      if not shape.isMouseOver and shape.wasMouseOver
        for callback in shape.events.mouseout
          if callback?
            if callback::constructor.length is 0
              callback()
            else
              callback
                canvas:
                  x: @cursorPos[0]
                  y: @cursorPos[1]
                shape:
                  x: shape.x - @cursorPos[0]
                  y: shape.y - @cursorPos[1]
          
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
      if timePassed <= duration
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
      else
        @registry[shape][prop] = destination[prop]
    rec.call @
    setTimeout callback, duration if callback? and duration? and duration > 0
    
  arrayAnimate: (shape, index, destination, duration, easing, callback, fps = 30) ->
    orig = @registry[shape].params[index]
    easing = if easing? and typeof easing isnt "string"
      easing
    else if easing? and typeof easing is "string"
      @easing[easing]
    timePassed = 0
    rec = ->
      if timePassed <= duration
        th = @
        @registry[shape].params[index] = easing timePassed, orig, destination - orig, duration
        setTimeout ->
          rec.call th
          timePassed += 1000 / fps
        , 1000 / fps
      else
        @registry[shape].params[index] = destination
    rec.call @
    setTimeout callback, duration if callback? and duration? and duration > 0
  
  objAnimate: (shape, property, destination, duration, easing, callback, fps = 30) ->
    orig = @registry[shape].params[property]
    easing = if easing? and typeof easing isnt "string"
      easing
    else if easing? and typeof easing is "string"
      @easing[easing]
    timePassed = 0
    rec = ->
      if timePassed <= duration
        th = @
        @registry[shape].params[property] = easing timePassed, orig, destination - orig, duration
        setTimeout ->
          rec.call th
          timePassed += 1000 / fps
        , 1000 / fps
      else
        @registry[shape].params[property] = destination
    rec.call @
    setTimeout callback, duration if callback? and duration? and duration > 0
  
  moveToBack: (shape) ->
    zIndex = @registry[shape].zIndex
    @zIndecies.splice zIndex, 1
    @zIndecies.unshift shape
    for id, index in @zIndecies
      @registry[id].zIndex = index
  
  moveToFront: (shape) ->
    zIndex = @registry[shape].zIndex
    @zIndecies.splice zIndex, 1
    @zIndecies.push shape
    for id, index in @zIndecies
      @registry[id].zIndex = index
  
  moveBack: (shape) ->
    zIndex = @registry[shape].zIndex
    @zIndecies.splice zIndex, 1
    @zIndecies.splice zIndex - 1, 0, shape
    for id, index in @zIndecies
      @registry[id].zIndex = index
  
  get: (shape) ->
    @registry[shape]
  
  bindEvent: (type, shape, callback) ->
    index = @registry[shape].events[type].length
    @registry[shape].events[type].push callback
    index
  
  removeEvent: (type, shape, event) ->
    delete @registry[shape].events[type][event]
  
  linearGradient: (opts) ->
    @gradientRegistry.linear[opts.name] =
      x: opts.x
      y: opts.y
      endX: opts.endX
      endY: opts.endY
      params: opts.params
      fn: opts.fn
  
  getLinearGradient: (name) ->
    data = @gradientRegistry.linear[name]
    gradient = @ctx.createLinearGradient data.x, data.y, data.endX, data.endY
    if toString.call(data.params) is "[object Array]"
      data.fn.apply gradient, data.params
    else
      data.fn.call gradient, data.params
    gradient
    
  linearGradientAnimate: (name, props, duration, easing, callback, fps = 30) ->
    easing = if easing? and typeof easing isnt "string"
      easing
    else if easing? and typeof easing is "string"
      @easing[easing]
    for _prop of props
      if _prop is "params"
        if toString.call(props[_prop]) is "[object Array]"
          for _item, _index in props[_prop]
            (=>
              prop = _prop
              item = _item
              index = _index
              timePassed = 0
              orig = @gradientRegistry.linear[name].params[index]
              rec = =>
                if timePassed <= duration
                  @gradientRegistry.linear[name].params[index] = easing timePassed, orig, item - orig, duration
                  setTimeout =>
                    rec()
                    timePassed += 1000 / fps
                  , 1000 / fps
                else
                  @gradientRegistry.linear[name].params[index] = item
              rec()
            )()
        else
          for _item, _index of props[prop]
            (=>
              prop = _prop
              item = _item
              index = _index
              timePassed = 0
              orig = @gradientRegistry.linear[name].params[index]
              rec = =>
                if timePassed <= duration
                  @gradientRegistry.linear[name].params[index] = easing timePassed, orig, item - orig, duration
                  setTimeout =>
                    rec()
                    timePassed += 1000 / fps
                  , 1000 / fps
                else
                  @gradientRegistry.linear[name].params[index] = item
              rec()
            )()
      else
        (=>
          prop = _prop
          timePassed = 0
          orig = @gradientRegistry.linear[name][prop]
          rec = =>
            if timePassed <= duration
              @gradientRegistry.linear[name][prop] = easing timePassed, orig, props[prop] - orig, duration
              setTimeout =>
                rec()
                timePassed += 1000 / fps
              , 1000 / fps
            else
              @gradientRegistry.linear[name][prop] = props[prop]
          rec()
        )()
    setTimeout callback, duration if callback? and duration? and duration > 0
  
  gradientRegistry:
    linear: {}