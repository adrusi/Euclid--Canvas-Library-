(function() {
  /*
    Euclid (Canvas Library)
    Abstracts canvas shapes into easiliy manipulatable objects
  
    Copyright 2011 Adrian Sinclair (adrusi)
    
    Easing functions modified from http://developer.yahoo.com/yui/docs/Easing.js.html BSD license
  */  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  this.rgba = function(r, g, b, a) {
    return "rgba(" + (Math.round(r)) + ", " + (Math.round(g)) + ", " + (Math.round(b)) + ", " + a + ")";
  };
  this.rgb = function(r, g, b) {
    return "rgba(" + (Math.round(r)) + ", " + (Math.round(g)) + ", " + (Math.round(b)) + ", 1)";
  };
  this.hex = function(value) {
    var arr, digits;
    value = value.replace(/^\#/, "");
    digits = value.split("");
    arr = [parseInt(digits[0] + digits[1], 16), parseInt(digits[2] + digits[3], 16), parseInt(digits[4] + digits[5], 16)];
    return "rgba(" + arr[0] + ", " + arr[1] + ", " + arr[2] + ", 1)";
  };
  this.Canvas = (function() {
    function Canvas() {
      var args, canvas, elem, height, prop, props, width;
      args = Array.prototype.slice.call(arguments);
      if ((args[0] != null) && (args[0].nodeType != null)) {
        elem = args[0];
      } else if ((args[0] != null) && typeof args[0] === "string") {
        elem = document.getElementById(args[0]);
      } else if (typeof args[0] === "object") {
        props = {
          element: document.createElement("canvas"),
          width: 200,
          height: 200
        };
        for (prop in args[0]) {
          props[prop] = args[0][prop];
        }
        elem = props.element instanceof HTMLElement ? props.element : document.getElementById(props.element);
        width = props.width;
        height = props.height;
      } else if (typeof args[0] === "number" || !(args[0] != null)) {
        elem = document.createElement("canvas");
      }
      if (elem.tagName === "CANVAS") {
        this.canvas = elem;
      } else {
        canvas = document.createElement("canvas");
        elem.appendChild(canvas);
        this.canvas = canvas;
      }
      this.canvas.width = width != null ? width : 200;
      this.canvas.height = height != null ? height : 200;
      this.hiddenCanvas = document.createElement("canvas");
      this.hiddenCanvas.width = width != null ? width : 200;
      this.hiddenCanvas.height = height != null ? height : 200;
      this.cursorPos = [0, 0];
      this.canvas.addEventListener("mousemove", __bind(function(event) {
        var callback, cursorPos, id, shape, _ref, _results;
        this.cursorPos = [event.layerX, event.layerY];
        cursorPos = this.cursorPos;
        _ref = this.registry;
        _results = [];
        for (id in _ref) {
          shape = _ref[id];
          _results.push((function() {
            var _i, _len, _ref2, _results2;
            if (shape.isMouseOver) {
              _ref2 = shape.events.mousemove;
              _results2 = [];
              for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
                callback = _ref2[_i];
                _results2.push(callback != null ? callback.prototype.constructor.length === 0 ? callback() : callback({
                  canvas: {
                    x: cursorPos[0],
                    y: cursorPos[1]
                  },
                  shape: {
                    x: shape.x - cursorPos[0],
                    y: shape.y - cursorPos[1]
                  }
                }) : void 0);
              }
              return _results2;
            }
          })());
        }
        return _results;
      }, this), false);
      this.canvas.addEventListener("click", __bind(function(event) {
        var callback, cursorPos, id, shape, _ref, _results;
        cursorPos = this.cursorPos;
        _ref = this.registry;
        _results = [];
        for (id in _ref) {
          shape = _ref[id];
          _results.push((function() {
            var _i, _len, _ref2, _results2;
            if (shape.isMouseOver) {
              _ref2 = shape.events.click;
              _results2 = [];
              for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
                callback = _ref2[_i];
                _results2.push(callback != null ? callback.prototype.constructor.length === 0 ? callback() : callback({
                  canvas: {
                    x: cursorPos[0],
                    y: cursorPos[1]
                  },
                  shape: {
                    x: shape.x - cursorPos[0],
                    y: shape.y - cursorPos[1]
                  }
                }) : void 0);
              }
              return _results2;
            }
          })());
        }
        return _results;
      }, this), false);
      this.canvas.addEventListener("mousedown", __bind(function(event) {
        var callback, cursorPos, id, shape, _ref, _results;
        cursorPos = this.cursorPos;
        _ref = this.registry;
        _results = [];
        for (id in _ref) {
          shape = _ref[id];
          _results.push((function() {
            var _i, _len, _ref2, _results2;
            if (shape.isMouseOver) {
              _ref2 = shape.events.mousedown;
              _results2 = [];
              for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
                callback = _ref2[_i];
                _results2.push(callback != null ? callback.prototype.constructor.length === 0 ? callback() : callback({
                  canvas: {
                    x: cursorPos[0],
                    y: cursorPos[1]
                  },
                  shape: {
                    x: cursorPos[0] - shape.x,
                    y: cursorPos[1] - shape.y
                  }
                }) : void 0);
              }
              return _results2;
            }
          })());
        }
        return _results;
      }, this), false);
      this.canvas.addEventListener("mouseup", __bind(function(event) {
        var callback, cursorPos, id, shape, _ref, _results;
        cursorPos = this.cursorPos;
        _ref = this.registry;
        _results = [];
        for (id in _ref) {
          shape = _ref[id];
          _results.push((function() {
            var _i, _len, _ref2, _results2;
            if (shape.isMouseOver) {
              _ref2 = shape.events.mouseup;
              _results2 = [];
              for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
                callback = _ref2[_i];
                _results2.push(callback != null ? callback.prototype.constructor.length === 0 ? callback() : callback({
                  canvas: {
                    x: cursorPos[0],
                    y: cursorPos[1]
                  },
                  shape: {
                    x: shape.x - cursorPos[0],
                    y: shape.y - cursorPos[1]
                  }
                }) : void 0);
              }
              return _results2;
            }
          })());
        }
        return _results;
      }, this), false);
      if ((args[0] != null) && typeof args[0] === "number") {
        this.canvas.width = args[0];
        this.canvas.height = (args[1] != null) && typeof args[1] === "number" ? args[1] : args[0];
        this.hiddenCanvas.width = args[0];
        this.hiddenCanvas.height = (args[1] != null) && typeof args[1] === "number" ? args[1] : args[0];
      } else if ((args[1] != null) && typeof args[1] === "number") {
        this.canvas.width = args[1];
        this.canvas.height = (args[2] != null) && typeof args[2] === "number" ? args[2] : args[1];
        this.hiddenCanvas.width = args[1];
        this.hiddenCanvas.height = (args[2] != null) && typeof args[2] === "number" ? args[2] : args[1];
      }
      this.ctx = this.canvas.getContext("2d");
      this.hiddenCtx = this.hiddenCanvas.getContext("2d");
      this.ctx.cursor = {
        x: 0,
        y: 0
      };
      this.ctx.relLineTo = __bind(function(x, y) {
        this.ctx.lineTo(x + this.ctx.cursor.x, y + this.ctx.cursor.y);
        return this.ctx.cursor = {
          x: this.ctx.cursor.x + x,
          y: this.ctx.cursor.y + y
        };
      }, this);
      this.ctx.relMoveTo = __bind(function(x, y) {
        this.ctx.moveTo(x + this.ctx.cursor.x, y + this.ctx.cursor.y);
        return this.ctx.cursor = {
          x: this.ctx.cursor.x + x,
          y: this.ctx.cursor.y + y
        };
      }, this);
      this.ctx.relArc = __bind(function(x, y, radius, startAngle, endAngle, anticlockwise) {
        this.ctx.arc(x + this.ctx.cursor.x, y + this.ctx.cursor.y, radius, startAngle, endAngle, anticlockwise);
        return this.ctx.cursor = {
          x: this.ctx.cursor.x + x,
          y: this.ctx.cursor.y + y
        };
      }, this);
      this.ctx.relQuadraticCurveTo = __bind(function(cp1x, cp1y, x, y) {
        this.ctx.quadraticCurveTo(cp1x + this.ctx.cursor.x, cp1y + this.ctx.cursor.y, x + this.ctx.cursor.x, y + this.ctx.cursor.y);
        return this.ctx.cursor = {
          x: this.ctx.cursor.x + x,
          y: this.ctx.cursor.y + y
        };
      }, this);
      this.ctx.relBezierCurveTo = __bind(function(cp1x, cp1y, cp2x, cp2y, x, y) {
        this.ctx.bezierCurveTo(cp1x + this.ctx.cursor.x, cp1y + this.ctx.cursor.y, cp2x + this.ctx.cursor.x, cp2y + this.ctx.cursor.y, x + this.ctx.cursor.x, y + this.ctx.cursor.y);
        return this.ctx.cursor = {
          x: this.ctx.cursor.x + x,
          y: this.ctx.cursor.y + y
        };
      }, this);
      this.hiddenCtx.cursor = {
        x: 0,
        y: 0
      };
      this.hiddenCtx.relLineTo = __bind(function(x, y) {
        this.hiddenCtx.lineTo(x + this.hiddenCtx.cursor.x, y + this.hiddenCtx.cursor.y);
        return this.hiddenCtx.cursor = {
          x: this.hiddenCtx.cursor.x + x,
          y: this.hiddenCtx.cursor.y + y
        };
      }, this);
      this.hiddenCtx.relMoveTo = __bind(function(x, y) {
        this.hiddenCtx.moveTo(x + this.hiddenCtx.cursor.x, y + this.hiddenCtx.cursor.y);
        return this.hiddenCtx.cursor = {
          x: this.hiddenCtx.cursor.x + x,
          y: this.hiddenCtx.cursor.y + y
        };
      }, this);
      this.hiddenCtx.relArc = __bind(function(x, y, radius, startAngle, endAngle, anticlockwise) {
        this.hiddenCtx.arc(x + this.hiddenCtx.cursor.x, y + this.hiddenCtx.cursor.y, radius, startAngle, endAngle, anticlockwise);
        return this.hiddenCtx.cursor = {
          x: this.hiddenCtx.cursor.x + x,
          y: this.hiddenCtx.cursor.y + y
        };
      }, this);
      this.hiddenCtx.relQuadraticCurveTo = __bind(function(cp1x, cp1y, x, y) {
        this.hiddenCtx.quadraticCurveTo(cp1x + this.hiddenCtx.cursor.x, cp1y + this.hiddenCtx.cursor.y, x + this.hiddenCtx.cursor.x, y + this.hiddenCtx.cursor.y);
        return this.hiddenCtx.cursor = {
          x: this.hiddenCtx.cursor.x + x,
          y: this.hiddenCtx.cursor.y + y
        };
      }, this);
      this.hiddenCtx.relBezierCurveTo = __bind(function(cp1x, cp1y, cp2x, cp2y, x, y) {
        this.hiddenCtx.bezierCurveTo(cp1x + this.hiddenCtx.cursor.x, cp1y + this.hiddenCtx.cursor.y, cp2x + this.hiddenCtx.cursor.x, cp2y + this.hiddenCtx.cursor.y, x + this.hiddenCtx.cursor.x, y + this.hiddenCtx.cursor.y);
        return this.hiddenCtx.cursor = {
          x: this.hiddenCtx.cursor.x + x,
          y: this.hiddenCtx.cursor.y + y
        };
      }, this);
      this.autoDraw.state = true;
    }
    Canvas.prototype.registry = {};
    Canvas.prototype.zIndecies = [];
    Canvas.prototype.easing = {
      linear: function(t, b, c, d) {
        return c * t / d + b;
      },
      easeIn: function(t, b, c, d) {
        return c * (t /= d) * t + b;
      },
      easeOut: function(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
      },
      easeInOut: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
          return c / 2 * t * t + b;
        } else {
          return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }
      },
      easeInStrong: function(t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
      },
      easeOutStrong: function(t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
      },
      easeInOutStrong: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
          return c / 2 * t * t * t * t + b;
        } else {
          return -1 * c / 2 * ((t -= 2) * t * t * t - 2) + b;
        }
      },
      elasticIn: function(t, b, c, d, a, p) {
        return (function() {
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
      })();
      },
      elasticOut: function(t, b, c, d, a, p) {
        return (function() {
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
      })();
      },
      elasticInOut: function(t, b, c, d, a, p) {
        return (function() {
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
      })();
      },
      backIn: function(t, b, c, d) {
        return c * (t /= d) * t * (2.70158 * t - 1.70158) + b;
      },
      backOut: function(t, b, c, d) {
        return c * ((t = t / d - 1) * t * (2.70158 * t + 1.70158) + 1) + b;
      },
      backInOut: function(t, b, c, d) {
        var s;
        s = 1.70158;
        if ((t /= d / 2) < 1) {
          return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        } else {
          return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        }
      },
      bounceIn: function(t, b, c, d) {
        return c - Canvas.prototype.easing.bounceOut(d - t, 0, c, d) + b;
      },
      bounceOut: function(t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
          return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
          return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
          return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
        } else {
          return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
        }
      },
      bounceInOut: function(t, b, c, d) {
        if (t < d / 2) {
          return Canvas.prototype.easing.bounceIn(t * 2, 0, c, d) * .5 + b;
        } else {
          return Canvas.prototype.easing.bounceOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
      }
    };
    Canvas.prototype.get = function(shape) {
      return this.registry[shape];
    };
    Canvas.prototype.rectangle = function(id, options) {
      var $default, defaults, _opts;
      defaults = !(this.registry[id] != null) ? {
        type: "rectangle",
        zIndex: this.zIndecies.length,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fillColor: rgba(0, 0, 0, 0),
        strokeColor: rgba(0, 0, 0, 0),
        strokeWidth: 0,
        strokeCap: "butt",
        strokeJoin: "miter",
        rotate: 0,
        rotateOrigin: "center",
        events: {
          mousein: [],
          mouseout: [],
          click: [],
          mousemove: [],
          mouseup: [],
          mousedown: []
        }
      } : this.registry[id];
      _opts = {};
      for ($default in defaults) {
        _opts[$default] = (options[$default] != null) && $default !== "type" ? options[$default] : defaults[$default];
      }
      options = _opts;
      this.registry[id] = options;
      if (!this.zIndecies[options.zIndex]) {
        return this.zIndecies.push(id);
      }
    };
    Canvas.prototype.circle = function(id, options) {
      var $default, defaults, _opts;
      defaults = !(this.registry[id] != null) ? {
        type: "circle",
        zIndex: this.zIndecies.length,
        x: 0,
        y: 0,
        radius: 0,
        fillColor: rgba(0, 0, 0, 0),
        strokeColor: rgba(0, 0, 0, 0),
        strokeWidth: 0,
        strokeCap: "butt",
        strokeJoin: "miter",
        rotate: 0,
        rotateOrigin: "center",
        events: {
          mousein: [],
          mouseout: [],
          click: [],
          mousemove: [],
          mouseup: [],
          mousedown: []
        }
      } : this.registry[id];
      _opts = {};
      for ($default in defaults) {
        _opts[$default] = (options[$default] != null) && $default !== "type" ? options[$default] : defaults[$default];
      }
      options = _opts;
      this.registry[id] = options;
      if (!this.zIndecies[options.zIndex]) {
        return this.zIndecies.push(id);
      }
    };
    Canvas.prototype.path = function(id, options) {
      var $default, defaults, _opts;
      defaults = !(this.registry[id] != null) ? {
        type: "path",
        zIndex: this.zIndecies.length,
        x: 0,
        y: 0,
        path: function() {},
        params: [],
        fillColor: rgba(0, 0, 0, 0),
        strokeColor: rgba(0, 0, 0, 0),
        strokeWidth: 0,
        strokeCap: "butt",
        strokeJoin: "miter",
        fillPath: true,
        closePath: true,
        isMouseOver: false,
        rotate: 0,
        rotateOrigin: "center",
        events: {
          mousein: [],
          mouseout: [],
          click: [],
          mousemove: [],
          mouseup: [],
          mousedown: []
        }
      } : this.registry[id];
      _opts = {};
      for ($default in defaults) {
        _opts[$default] = (options[$default] != null) && $default !== "type" ? options[$default] : defaults[$default];
      }
      options = _opts;
      this.registry[id] = options;
      if (!this.zIndecies[options.zIndex]) {
        return this.zIndecies.push(id);
      }
    };
    Canvas.prototype.plot = function(id, options) {
      var $default, defaults, _opts;
      defaults = !(this.registry[id] != null) ? {
        type: "plot",
        zIndex: this.zIndecies.length,
        x: 0,
        y: 0,
        xMax: 0,
        yMax: 0,
        xMin: 0,
        yMin: 0,
        xScale: 1,
        yScale: 1,
        equation: function(x, params) {
          return x;
        },
        params: [],
        lineColor: rgba(0, 0, 0, 0),
        lineWidth: 0,
        isMouseOver: false,
        rotate: 0,
        rotateOrigin: "center",
        events: {
          mousein: [],
          mouseout: [],
          click: [],
          mousemove: [],
          mouseup: [],
          mousedown: []
        }
      } : this.registry[id];
      _opts = {};
      for ($default in defaults) {
        _opts[$default] = (options[$default] != null) && $default !== "type" ? options[$default] : defaults[$default];
      }
      options = _opts;
      this.registry[id] = options;
      if (!this.zIndecies[options.zIndex]) {
        return this.zIndecies.push(id);
      }
    };
    Canvas.prototype.arc = function(id, options) {
      var $default, defaults, _opts;
      defaults = !(this.registry[id] != null) ? {
        type: "arc",
        zIndex: this.zIndecies.length,
        x: 0,
        y: 0,
        radius: 0,
        start: 0,
        arcLength: 0,
        closed: false,
        fillColor: rgba(0, 0, 0, 0),
        strokeColor: rgba(0, 0, 0, 0),
        strokeWidth: 0,
        strokeCap: "butt",
        strokeJoin: "miter",
        isMouseOver: false,
        rotate: 0,
        rotateOrigin: "center",
        events: {
          mousein: [],
          mouseout: [],
          click: [],
          mousemove: [],
          mouseup: [],
          mousedown: []
        }
      } : this.registry[id];
      _opts = {};
      for ($default in defaults) {
        _opts[$default] = (options[$default] != null) && $default !== "type" ? options[$default] : defaults[$default];
      }
      options = _opts;
      this.registry[id] = options;
      if (!this.zIndecies[options.zIndex]) {
        return this.zIndecies.push(id);
      }
    };
    Canvas.prototype.lowLevel = function(id, options) {
      var $default, defaults, _opts;
      defaults = !(this.registry[id] != null) ? {
        type: "lowLevel",
        zIndex: this.zIndecies.length,
        operation: function(canvas, params) {},
        params: []
      } : this.registry[id];
      _opts = {};
      for ($default in defaults) {
        _opts[$default] = (options[$default] != null) && $default !== "type" ? options[$default] : defaults[$default];
      }
      options = _opts;
      this.registry[id] = options;
      if (!this.zIndecies[options.zIndex]) {
        return this.zIndecies.push(id);
      }
    };
    Canvas.prototype.draw = function() {
      var callback, id, imgd, pix, rotateOrigin, shape, _i, _j, _len, _len2, _ref, _ref2, _results;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      _ref = this.zIndecies;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        id = _ref[_i];
        shape = this.registry[id];
        this.hiddenCtx.clearRect(0, 0, this.hiddenCanvas.width, this.hiddenCanvas.height);
        this.registry[id].wasMouseOver = shape.isMouseOver;
        switch (shape.type) {
          case "rectangle":
            rotateOrigin = shape.rotateOrigin === "center" ? [shape.x + shape.width / 2, shape.y + shape.height / 2] : shape.rotateOrigin;
            this.hiddenCtx.save();
            this.hiddenCtx.translate(rotateOrigin[0], rotateOrigin[1]);
            this.hiddenCtx.rotate(shape.rotate);
            this.hiddenCtx.translate(-rotateOrigin[0], -rotateOrigin[1]);
            this.hiddenCtx.beginPath();
            this.hiddenCtx.fillStyle = "#000000";
            this.hiddenCtx.strokeStyle = "#000000";
            this.hiddenCtx.lineWidth = shape.strokeWidth;
            this.hiddenCtx.lineCap = shape.strokeCap;
            this.hiddenCtx.lineJoin = shape.strokeJoin;
            this.hiddenCtx.rect(shape.x, shape.y, shape.width, shape.height);
            this.hiddenCtx.closePath();
            this.hiddenCtx.fill();
            this.hiddenCtx.stroke();
            this.hiddenCtx.restore();
            imgd = this.hiddenCtx.getImageData(this.cursorPos[0], this.cursorPos[1], 1, 1);
            pix = imgd.data;
            shape.isMouseOver = pix[3] === 255;
            this.ctx.save();
            this.ctx.translate(rotateOrigin[0], rotateOrigin[1]);
            this.ctx.rotate(shape.rotate);
            this.ctx.translate(-rotateOrigin[0], -rotateOrigin[1]);
            this.ctx.beginPath();
            this.ctx.fillStyle = !(shape.fillColor.gradient != null) ? shape.fillColor : shape.fillColor.gradient === "linear" ? this.getLinearGradient(shape.fillColor.name) : void 0;
            this.ctx.strokeStyle = !(shape.strokeColor.gradient != null) ? shape.strokeColor : shape.strokeColor.gradient === "linear" ? this.getLinearGradient(shape.strokeColor.name) : void 0;
            this.ctx.lineWidth = shape.strokeWidth;
            this.ctx.lineCap = shape.strokeCap;
            this.ctx.lineJoin = shape.strokeJoin;
            this.ctx.rect(shape.x, shape.y, shape.width, shape.height);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.restore();
            break;
          case "circle":
            rotateOrigin = shape.rotateOrigin === "center" ? [shape.x, shape.y] : shape.rotateOrigin;
            this.hiddenCtx.save();
            this.hiddenCtx.translate(rotateOrigin[0], rotateOrigin[1]);
            this.hiddenCtx.rotate(shape.rotate);
            this.hiddenCtx.translate(-rotateOrigin[0], -rotateOrigin[1]);
            this.hiddenCtx.beginPath();
            this.hiddenCtx.fillStyle = "#000000";
            this.hiddenCtx.strokeStyle = "#000000";
            this.hiddenCtx.lineWidth = shape.strokeWidth;
            this.hiddenCtx.lineCap = shape.strokeCap;
            this.hiddenCtx.lineJoin = shape.strokeJoin;
            this.hiddenCtx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI, true);
            this.hiddenCtx.closePath();
            this.hiddenCtx.fill();
            this.hiddenCtx.stroke();
            this.hiddenCtx.restore();
            imgd = this.hiddenCtx.getImageData(this.cursorPos[0], this.cursorPos[1], 1, 1);
            pix = imgd.data;
            shape.isMouseOver = pix[3] === 255;
            this.ctx.save();
            this.ctx.translate(rotateOrigin[0], rotateOrigin[1]);
            this.ctx.rotate(shape.rotate);
            this.ctx.translate(-rotateOrigin[0], -rotateOrigin[1]);
            this.ctx.beginPath();
            this.ctx.fillStyle = !(shape.fillColor.gradient != null) ? shape.fillColor : shape.fillColor.gradient === "linear" ? this.getLinearGradient(shape.fillColor.name) : void 0;
            this.ctx.strokeStyle = !(shape.strokeColor.gradient != null) ? shape.strokeColor : shape.strokeColor.gradient === "linear" ? this.getLinearGradient(shape.strokeColor.name) : void 0;
            this.ctx.lineWidth = shape.strokeWidth;
            this.ctx.lineCap = shape.strokeCap;
            this.ctx.lineJoin = shape.strokeJoin;
            this.ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI, true);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.restore();
            break;
          case "path":
            rotateOrigin = shape.rotateOrigin;
            this.hiddenCtx.save();
            this.hiddenCtx.translate(rotateOrigin[0], rotateOrigin[1]);
            this.hiddenCtx.rotate(shape.rotate);
            this.hiddenCtx.translate(-rotateOrigin[0], -rotateOrigin[1]);
            this.hiddenCtx.beginPath();
            this.hiddenCtx.fillStyle = shape.closePath ? "#000000" : rgba(0, 0, 0, 0);
            this.hiddenCtx.strokeStyle = "#000000";
            this.hiddenCtx.lineWidth = shape.strokeWidth;
            this.hiddenCtx.lineCap = shape.strokeCap;
            this.hiddenCtx.lineJoin = shape.strokeJoin;
            this.hiddenCtx.cursor = {
              x: shape.x,
              y: shape.y
            };
            this.hiddenCtx.moveTo(shape.x, shape.y);
            if (shape.params.constructor.name === "Array") {
              shape.path.apply(this.hiddenCtx, shape.params);
            } else if (shape.params.constructor.name === "Object") {
              shape.path.call(this.hiddenCtx, shape.params);
            }
            if (shape.closePath) {
              this.hiddenCtx.closePath();
            }
            if (shape.fillPath) {
              this.hiddenCtx.fill();
            }
            this.hiddenCtx.stroke();
            this.hiddenCtx.restore();
            imgd = this.hiddenCtx.getImageData(this.cursorPos[0], this.cursorPos[1], 1, 1);
            pix = imgd.data;
            shape.isMouseOver = pix[3] === 255;
            this.ctx.save();
            this.ctx.translate(rotateOrigin[0], rotateOrigin[1]);
            this.ctx.rotate(shape.rotate);
            this.ctx.translate(-rotateOrigin[0], -rotateOrigin[1]);
            this.ctx.beginPath();
            this.ctx.fillStyle = !(shape.fillColor.gradient != null) ? shape.fillColor : shape.fillColor.gradient === "linear" ? this.getLinearGradient(shape.fillColor.name) : void 0;
            this.ctx.strokeStyle = !(shape.strokeColor.gradient != null) ? shape.strokeColor : shape.strokeColor.gradient === "linear" ? this.getLinearGradient(shape.strokeColor.name) : void 0;
            this.ctx.lineWidth = shape.strokeWidth;
            this.ctx.lineCap = shape.strokeCap;
            this.ctx.lineJoin = shape.strokeJoin;
            this.ctx.cursor = {
              x: shape.x,
              y: shape.y
            };
            this.ctx.moveTo(shape.x, shape.y);
            if (shape.params.constructor.name === "Array") {
              shape.path.apply(this.ctx, shape.params);
            } else if (shape.params.constructor.name === "Object") {
              shape.path.call(this.ctx, shape.params);
            }
            if (shape.closePath) {
              this.ctx.closePath();
            }
            if (shape.fillPath) {
              this.ctx.fill();
            }
            this.ctx.stroke();
            this.ctx.restore();
            break;
          case "arc":
            rotateOrigin = shape.rotateOrigin === "center" ? [shape.x, shape.y] : shape.rotateOrigin;
            this.hiddenCtx.save();
            this.hiddenCtx.translate(rotateOrigin[0], rotateOrigin[1]);
            this.hiddenCtx.rotate(shape.rotate);
            this.hiddenCtx.translate(-rotateOrigin[0], -rotateOrigin[1]);
            this.hiddenCtx.beginPath();
            this.hiddenCtx.fillStyle = "#000000";
            this.hiddenCtx.strokeStyle = "#000000";
            this.hiddenCtx.lineWidth = shape.strokeWidth;
            this.hiddenCtx.lineCap = shape.strokeCap;
            this.hiddenCtx.lineJoin = shape.strokeJoin;
            this.hiddenCtx.arc(shape.x, shape.y, shape.radius, shape.start, shape.arcLength, false);
            this.hiddenCtx.fill();
            this.hiddenCtx.stroke();
            this.hiddenCtx.closePath();
            this.hiddenCtx.restore();
            imgd = this.hiddenCtx.getImageData(this.cursorPos[0], this.cursorPos[1], 1, 1);
            pix = imgd.data;
            shape.isMouseOver = pix[3] === 255;
            this.ctx.save();
            this.ctx.translate(rotateOrigin[0], rotateOrigin[1]);
            this.ctx.rotate(shape.rotate);
            this.ctx.translate(-rotateOrigin[0], -rotateOrigin[1]);
            this.ctx.beginPath();
            this.ctx.fillStyle = !(shape.fillColor.gradient != null) ? shape.fillColor : shape.fillColor.gradient === "linear" ? this.getLinearGradient(shape.fillColor.name) : void 0;
            this.ctx.strokeStyle = !(shape.strokeColor.gradient != null) ? shape.strokeColor : shape.strokeColor.gradient === "linear" ? this.getLinearGradient(shape.strokeColor.name) : void 0;
            this.ctx.lineWidth = shape.strokeWidth;
            this.ctx.lineCap = shape.strokeCap;
            this.ctx.lineJoin = shape.strokeJoin;
            this.ctx.arc(shape.x, shape.y, shape.radius, shape.start, shape.arcLength, false);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.restore();
            break;
          case "lowLevel":
            if (Object.prototype.toString.call(shape.params) === "[object Array]") {
              shape.operation.apply(this.ctx, [this.canvas].concat(shape.params));
            } else {
              shape.operation.call(this.ctx, this.canvas, shape.params);
            }
        }
        if (shape.isMouseOver && !shape.wasMouseOver) {
          _ref2 = shape.events.mousein;
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            callback = _ref2[_j];
            if (callback != null) {
              if (callback.prototype.constructor.length === 0) {
                callback();
              } else {
                callback({
                  canvas: {
                    x: this.cursorPos[0],
                    y: this.cursorPos[1]
                  },
                  shape: {
                    x: shape.x - this.cursorPos[0],
                    y: shape.y - this.cursorPos[1]
                  }
                });
              }
            }
          }
        }
        _results.push((function() {
          var _k, _len3, _ref3, _results2;
          if (!shape.isMouseOver && shape.wasMouseOver) {
            _ref3 = shape.events.mouseout;
            _results2 = [];
            for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
              callback = _ref3[_k];
              _results2.push(callback != null ? callback.prototype.constructor.length === 0 ? callback() : callback({
                canvas: {
                  x: this.cursorPos[0],
                  y: this.cursorPos[1]
                },
                shape: {
                  x: shape.x - this.cursorPos[0],
                  y: shape.y - this.cursorPos[1]
                }
              }) : void 0);
            }
            return _results2;
          }
        }).call(this));
      }
      return _results;
    };
    Canvas.prototype.autoDraw = function(fps) {
      var rec;
      if (fps == null) {
        fps = 30;
      }
      this.autoDraw.state = true;
      rec = function(previous) {
        var th;
        if (this.autoDraw.state === true) {
          th = this;
          this.draw();
          return setTimeout(function() {
            return rec.call(th);
          }, 1000 / fps);
        }
      };
      return rec.call(this);
    };
    Canvas.prototype.stopDrawing = function() {
      return this.autoDraw.state = false;
    };
    Canvas.prototype.animate = function(shape, destination, duration, easing, callback, fps) {
      var channel, oldDest, orig, prop, rec, timePassed, _i, _j, _len, _len2, _ref, _ref2;
      if (fps == null) {
        fps = 30;
      }
      orig = {};
      easing = (easing != null) && typeof easing !== "string" ? easing : (easing != null) && typeof easing === "string" ? this.easing[easing] : void 0;
      for (prop in destination) {
        if (typeof this.registry[shape][prop] === "string" && /^rgba\((?:\d|\d+)\, (?:\d|\d+)\, (?:\d|\d+)\, (?:\d|[\d\.]+)\)$/.exec(this.registry[shape][prop])) {
          orig[prop] = {
            rgba: []
          };
          oldDest = destination[prop];
          destination[prop] = {
            rgba: []
          };
          _ref = this.registry[shape][prop].replace("rgba(", "").replace(")", "").split(/\, ?/);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            channel = _ref[_i];
            orig[prop].rgba.push(parseFloat(channel));
          }
          _ref2 = oldDest.replace("rgba(", "").replace(")", "").split(/\, ?/);
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            channel = _ref2[_j];
            destination[prop].rgba.push(parseFloat(channel));
          }
        } else {
          orig[prop] = this.registry[shape][prop];
        }
      }
      timePassed = 0;
      rec = function() {
        var alpha, blue, final, green, i, key, prop, red, th, v, value, _len3, _ref3, _ref4;
        if (timePassed <= duration) {
          th = this;
          for (prop in orig) {
            if (orig[prop].constructor.name === "Object" && (orig[prop].rgba != null)) {
              red = easing(timePassed, orig[prop].rgba[0], destination[prop].rgba[0] - orig[prop].rgba[0], duration);
              green = easing(timePassed, orig[prop].rgba[1], destination[prop].rgba[1] - orig[prop].rgba[1], duration);
              blue = easing(timePassed, orig[prop].rgba[2], destination[prop].rgba[2] - orig[prop].rgba[2], duration);
              alpha = easing(timePassed, orig[prop].rgba[3], destination[prop].rgba[3] - orig[prop].rgba[3], duration);
              this.registry[shape][prop] = rgba(Math.round(red), Math.round(green), Math.round(blue), alpha);
            } else if (orig[prop].constructor.name === "Object") {
              final = {};
              _ref3 = orig[prop];
              for (key in _ref3) {
                value = _ref3[key];
                final[key] = easing(timePassed, orig[prop][key], destination[prop][key] - orig[prop][key], duration);
              }
              this.registry[shape][prop] = final;
            } else if (orig[prop].constructor.name === "Array") {
              final = [];
              _ref4 = orig[prop];
              for (i = 0, _len3 = _ref4.length; i < _len3; i++) {
                v = _ref4[i];
                final.push(easing(timePassed, orig[prop][i], destination[prop][i] - orig[prop][i], duration));
              }
              this.registry[shape][prop] = final;
            } else {
              this.registry[shape][prop] = easing(timePassed, orig[prop], destination[prop] - orig[prop], duration);
            }
          }
          return setTimeout(function() {
            rec.call(th);
            return timePassed += 1000 / fps;
          }, 1000 / fps);
        } else {
          return this.registry[shape][prop] = destination[prop];
        }
      };
      rec.call(this);
      if ((callback != null) && (duration != null) && duration > 0) {
        return setTimeout(callback, duration);
      }
    };
    Canvas.prototype.arrayAnimate = function(shape, index, destination, duration, easing, callback, fps) {
      var orig, rec, timePassed;
      if (fps == null) {
        fps = 30;
      }
      orig = this.registry[shape].params[index];
      easing = (easing != null) && typeof easing !== "string" ? easing : (easing != null) && typeof easing === "string" ? this.easing[easing] : void 0;
      timePassed = 0;
      rec = function() {
        var th;
        if (timePassed <= duration) {
          th = this;
          this.registry[shape].params[index] = easing(timePassed, orig, destination - orig, duration);
          return setTimeout(function() {
            rec.call(th);
            return timePassed += 1000 / fps;
          }, 1000 / fps);
        } else {
          return this.registry[shape].params[index] = destination;
        }
      };
      rec.call(this);
      if ((callback != null) && (duration != null) && duration > 0) {
        return setTimeout(callback, duration);
      }
    };
    Canvas.prototype.objAnimate = function(shape, property, destination, duration, easing, callback, fps) {
      var orig, rec, timePassed;
      if (fps == null) {
        fps = 30;
      }
      orig = this.registry[shape].params[property];
      easing = (easing != null) && typeof easing !== "string" ? easing : (easing != null) && typeof easing === "string" ? this.easing[easing] : void 0;
      timePassed = 0;
      rec = function() {
        var th;
        if (timePassed <= duration) {
          th = this;
          this.registry[shape].params[property] = easing(timePassed, orig, destination - orig, duration);
          return setTimeout(function() {
            rec.call(th);
            return timePassed += 1000 / fps;
          }, 1000 / fps);
        } else {
          return this.registry[shape].params[property] = destination;
        }
      };
      rec.call(this);
      if ((callback != null) && (duration != null) && duration > 0) {
        return setTimeout(callback, duration);
      }
    };
    Canvas.prototype.moveToBack = function(shape) {
      var id, index, zIndex, _len, _ref, _results;
      zIndex = this.registry[shape].zIndex;
      this.zIndecies.splice(zIndex, 1);
      this.zIndecies.unshift(shape);
      _ref = this.zIndecies;
      _results = [];
      for (index = 0, _len = _ref.length; index < _len; index++) {
        id = _ref[index];
        _results.push(this.registry[id].zIndex = index);
      }
      return _results;
    };
    Canvas.prototype.moveToFront = function(shape) {
      var id, index, zIndex, _len, _ref, _results;
      zIndex = this.registry[shape].zIndex;
      this.zIndecies.splice(zIndex, 1);
      this.zIndecies.push(shape);
      _ref = this.zIndecies;
      _results = [];
      for (index = 0, _len = _ref.length; index < _len; index++) {
        id = _ref[index];
        _results.push(this.registry[id].zIndex = index);
      }
      return _results;
    };
    Canvas.prototype.moveBack = function(shape) {
      var id, index, zIndex, _len, _ref, _results;
      zIndex = this.registry[shape].zIndex;
      this.zIndecies.splice(zIndex, 1);
      this.zIndecies.splice(zIndex - 1, 0, shape);
      _ref = this.zIndecies;
      _results = [];
      for (index = 0, _len = _ref.length; index < _len; index++) {
        id = _ref[index];
        _results.push(this.registry[id].zIndex = index);
      }
      return _results;
    };
    Canvas.prototype.get = function(shape) {
      return this.registry[shape];
    };
    Canvas.prototype.bindEvent = function(type, shape, callback) {
      var index;
      index = this.registry[shape].events[type].length;
      this.registry[shape].events[type].push(callback);
      return index;
    };
    Canvas.prototype.removeEvent = function(type, shape, event) {
      return delete this.registry[shape].events[type][event];
    };
    Canvas.prototype.linearGradient = function(opts) {
      return this.gradientRegistry.linear[opts.name] = {
        x: opts.x,
        y: opts.y,
        endX: opts.endX,
        endY: opts.endY,
        params: opts.params,
        fn: opts.fn
      };
    };
    Canvas.prototype.getLinearGradient = function(name) {
      var data, gradient;
      data = this.gradientRegistry.linear[name];
      gradient = this.ctx.createLinearGradient(data.x, data.y, data.endX, data.endY);
      if (toString.call(data.params) === "[object Array]") {
        data.fn.apply(gradient, data.params);
      } else {
        data.fn.call(gradient, data.params);
      }
      return gradient;
    };
    Canvas.prototype.linearGradientAnimate = function(name, props, duration, easing, callback, fps) {
      var _fn, _fn2, _index, _item, _len, _prop, _ref, _ref2;
      if (fps == null) {
        fps = 30;
      }
      easing = (easing != null) && typeof easing !== "string" ? easing : (easing != null) && typeof easing === "string" ? this.easing[easing] : void 0;
      for (_prop in props) {
        if (_prop === "params") {
          if (toString.call(props[_prop]) === "[object Array]") {
            _ref = props[_prop];
            _fn = __bind(function() {
              var index, item, orig, prop, rec, timePassed;
              prop = _prop;
              item = _item;
              index = _index;
              timePassed = 0;
              orig = this.gradientRegistry.linear[name].params[index];
              rec = __bind(function() {
                if (timePassed <= duration) {
                  this.gradientRegistry.linear[name].params[index] = easing(timePassed, orig, item - orig, duration);
                  return setTimeout(__bind(function() {
                    rec();
                    return timePassed += 1000 / fps;
                  }, this), 1000 / fps);
                } else {
                  return this.gradientRegistry.linear[name].params[index] = item;
                }
              }, this);
              return rec();
            }, this);
            for (_index = 0, _len = _ref.length; _index < _len; _index++) {
              _item = _ref[_index];
              _fn();
            }
          } else {
            _ref2 = props[prop];
            _fn2 = __bind(function() {
              var index, item, orig, prop, rec, timePassed;
              prop = _prop;
              item = _item;
              index = _index;
              timePassed = 0;
              orig = this.gradientRegistry.linear[name].params[index];
              rec = __bind(function() {
                if (timePassed <= duration) {
                  this.gradientRegistry.linear[name].params[index] = easing(timePassed, orig, item - orig, duration);
                  return setTimeout(__bind(function() {
                    rec();
                    return timePassed += 1000 / fps;
                  }, this), 1000 / fps);
                } else {
                  return this.gradientRegistry.linear[name].params[index] = item;
                }
              }, this);
              return rec();
            }, this);
            for (_item in _ref2) {
              _index = _ref2[_item];
              _fn2();
            }
          }
        } else {
          (__bind(function() {
            var orig, prop, rec, timePassed;
            prop = _prop;
            timePassed = 0;
            orig = this.gradientRegistry.linear[name][prop];
            rec = __bind(function() {
              if (timePassed <= duration) {
                this.gradientRegistry.linear[name][prop] = easing(timePassed, orig, props[prop] - orig, duration);
                return setTimeout(__bind(function() {
                  rec();
                  return timePassed += 1000 / fps;
                }, this), 1000 / fps);
              } else {
                return this.gradientRegistry.linear[name][prop] = props[prop];
              }
            }, this);
            return rec();
          }, this))();
        }
      }
      if ((callback != null) && (duration != null) && duration > 0) {
        return setTimeout(callback, duration);
      }
    };
    Canvas.prototype.gradientRegistry = {
      linear: {}
    };
    return Canvas;
  })();
}).call(this);
