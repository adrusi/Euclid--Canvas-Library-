(function() {
  /*
    Euclid (Canvas Library)
    Abstracts canvas shapes into easiliy manipulatable objects

    Copyright 2011 Adrian Sinclair (adrusi)

    Easing functions modified from http://developer.yahoo.com/yui/docs/Easing.js.html BSD license
  */  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  this.rgba = function(r, g, b, a) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
  };
  this.rgb = function(r, g, b) {
    return "rgba(" + r + ", " + g + ", " + b + ", 1)";
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
      args = Array.prototype.slice.call(arguments, 0);
      if ((args[0] != null) && args[0] instanceof HTMLElement) {
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
        console.log(elem);
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
      if ((args[0] != null) && typeof args[0] === "number") {
        this.canvas.width = args[0];
        this.canvas.height = (args[1] != null) && typeof args[1] === "number" ? args[1] : args[0];
      } else if ((args[1] != null) && typeof args[1] === "number") {
        this.canvas.width = args[1];
        this.canvas.height = (args[2] != null) && typeof args[2] === "number" ? args[2] : args[1];
      }
      this.ctx = this.canvas.getContext("2d");
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
      this.autoDraw.state = true;
    }
    Canvas.prototype.registry = {};
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
          c / 2 * t * t * t * t + b;
        } else {
          -1 * c / 2 * ((t -= 2) * t * t * t - 2) + b;
        }
        return console.log("foo");
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
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fillColor: rgba(0, 0, 0, 0),
        strokeColor: rgba(0, 0, 0, 0),
        strokeWidth: 0,
        strokeCap: "butt",
        strokeJoin: "miter"
      } : this.registry[id];
      _opts = {};
      for ($default in defaults) {
        _opts[$default] = (options[$default] != null) && $default !== "type" ? options[$default] : defaults[$default];
      }
      options = _opts;
      return this.registry[id] = options;
    };
    Canvas.prototype.circle = function(id, options) {
      var $default, defaults, _opts;
      defaults = !(this.registry[id] != null) ? {
        type: "circle",
        x: 0,
        y: 0,
        radius: 0,
        fillColor: rgba(0, 0, 0, 0),
        strokeColor: rgba(0, 0, 0, 0),
        strokeWidth: 0,
        strokeCap: "butt",
        strokeJoin: "miter"
      } : this.registry[id];
      _opts = {};
      for ($default in defaults) {
        _opts[$default] = (options[$default] != null) && $default !== "type" ? options[$default] : defaults[$default];
      }
      options = _opts;
      return this.registry[id] = options;
    };
    Canvas.prototype.path = function(id, options) {
      var $default, defaults, _opts;
      defaults = !(this.registry[id] != null) ? {
        type: "path",
        x: 0,
        y: 0,
        path: function() {},
        params: [],
        fillColor: rgba(0, 0, 0, 0),
        strokeColor: rgba(0, 0, 0, 0),
        strokeWidth: 0,
        strokeCap: "butt",
        strokeJoin: "miter"
      } : this.registry[id];
      _opts = {};
      for ($default in defaults) {
        _opts[$default] = (options[$default] != null) && $default !== "type" ? options[$default] : defaults[$default];
      }
      options = _opts;
      return this.registry[id] = options;
    };
    Canvas.prototype.plot = function(id, options) {
      var $default, defaults, _opts;
      defaults = !(this.registry[id] != null) ? {
        type: "plot",
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
        lineWidth: 0
      } : this.registry[id];
      _opts = {};
      for ($default in defaults) {
        _opts[$default] = (options[$default] != null) && $default !== "type" ? options[$default] : defaults[$default];
      }
      options = _opts;
      return this.registry[id] = options;
    };
    Canvas.prototype.arc = function(id, options) {
      var $default, defaults, _opts;
      defaults = !(this.registry[id] != null) ? {
        type: "arc",
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
        strokeJoin: "miter"
      } : this.registry[id];
      _opts = {};
      for ($default in defaults) {
        _opts[$default] = (options[$default] != null) && $default !== "type" ? options[$default] : defaults[$default];
      }
      options = _opts;
      return this.registry[id] = options;
    };
    Canvas.prototype.draw = function() {
      var id, incrementXPerPixel, incrementYPerPixel, pixelsPerXUnit, pixelsPerYUnit, result, shape, x, xEnd, xPix, xStart, yClipBottom, yClipTop, yPix, _ref, _results;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      _ref = this.registry;
      _results = [];
      for (id in _ref) {
        shape = _ref[id];
        _results.push((function() {
          switch (shape.type) {
            case "rectangle":
              this.ctx.beginPath();
              this.ctx.fillStyle = shape.fillColor;
              this.ctx.strokeStyle = shape.strokeColor;
              this.ctx.lineWidth = shape.strokeWidth;
              this.ctx.lineCap = shape.strokeCap;
              this.ctx.lineJoin = shape.strokeJoin;
              this.ctx.rect(shape.x, shape.y, shape.width, shape.height);
              this.ctx.closePath();
              this.ctx.fill();
              return this.ctx.stroke();
            case "circle":
              this.ctx.beginPath();
              this.ctx.fillStyle = shape.fillColor;
              this.ctx.strokeStyle = shape.strokeColor;
              this.ctx.lineWidth = shape.strokeWidth;
              this.ctx.lineCap = shape.strokeCap;
              this.ctx.lineJoin = shape.strokeJoin;
              this.ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI, true);
              this.ctx.closePath();
              this.ctx.fill();
              return this.ctx.stroke();
            case "path":
              this.ctx.beginPath();
              this.ctx.fillStyle = shape.fillColor;
              this.ctx.strokeStyle = shape.strokeColor;
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
              this.ctx.fill();
              this.ctx.stroke();
              return this.ctx.closePath();
            case "plot":
              this.ctx.beginPath();
              this.ctx.strokeStyle = shape.lineColor;
              this.ctx.lineWidth = shape.lineWidth;
              pixelsPerXUnit = shape.xScale;
              incrementXPerPixel = 1 / pixelsPerXUnit;
              pixelsPerYUnit = shape.yScale;
              incrementYPerPixel = 1 / pixelsPerYUnit;
              xStart = shape.x + pixelsPerXUnit * shape.xMin;
              xEnd = shape.x + pixelsPerXUnit * shape.xMax;
              yClipTop = shape.y - pixelsPerYUnit * shape.yMax;
              yClipBottom = shape.y - pixelsPerYUnit * shape.yMin;
              this.ctx.moveTo(xStart, shape.y - (shape.equation(x, shape.params)) * pixelsPerYUnit);
              for (xPix = xStart; (xStart <= xEnd ? xPix < xEnd : xPix > xEnd); (xStart <= xEnd ? xPix += 1 : xPix -= 1)) {
                x = shape.xMin + (xPix - xStart) / pixelsPerXUnit;
                result = shape.equation(x, shape.params);
                yPix = shape.y - result * pixelsPerYUnit;
                if ((yClipTop < yPix && yPix < yClipBottom)) {
                  this.ctx.lineTo(xPix, yPix);
                } else if (yPix < yClipTop) {
                  this.ctx.moveTo(xPix * ((yClipTop - yPix) / -yPix), yClipTop);
                }
              }
              this.ctx.stroke();
              return this.ctx.closePath();
            case "arc":
              this.ctx.beginPath();
              this.ctx.fillStyle = shape.fillColor;
              this.ctx.strokeStyle = shape.strokeColor;
              this.ctx.lineWidth = shape.strokeWidth;
              this.ctx.lineCap = shape.strokeCap;
              this.ctx.lineJoin = shape.strokeJoin;
              this.ctx.arc(shape.x, shape.y, shape.radius, shape.start, shape.arcLength, false);
              this.ctx.fill();
              this.ctx.stroke();
              return this.ctx.closePath();
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
        var alpha, blue, final, green, i, key, prop, red, th, v, value, _len, _ref, _ref2;
        if (!(timePassed >= duration)) {
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
              _ref = orig[prop];
              for (key in _ref) {
                value = _ref[key];
                final[key] = easing(timePassed, orig[prop][key], destination[prop][key] - orig[prop][key], duration);
              }
              this.registry[shape][prop] = final;
            } else if (orig[prop].constructor.name === "Array") {
              final = [];
              _ref2 = orig[prop];
              for (i = 0, _len = _ref2.length; i < _len; i++) {
                v = _ref2[i];
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
        }
      };
      rec.call(this);
      return setTimeout(callback, duration);
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
        if (!(timePassed >= duration)) {
          th = this;
          this.registry[shape].params[index] = easing(timePassed, orig, destination - orig, duration);
          return setTimeout(function() {
            rec.call(th);
            return timePassed += 1000 / fps;
          }, 1000 / fps);
        }
      };
      rec.call(this);
      return setTimeout(callback, duration);
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
        if (!(timePassed >= duration)) {
          th = this;
          this.registry[shape].params[property] = easing(timePassed, orig, destination - orig, duration);
          return setTimeout(function() {
            rec.call(th);
            return timePassed += 1000 / fps;
          }, 1000 / fps);
        }
      };
      rec.call(this);
      return setTimeout(callback, duration);
    };
    Canvas.prototype.moveToBack = function(shape) {
      var _shape;
      _shape = this.registry[shape];
      delete this.registry[shape];
      this.registry[shape] = _shape;
      return {
        bounceInOut: function(t, b, c, d) {
          if (t < d / 2) {
            return Canvas.prototype.easing.bounceIn(t * 2, 0, c, d) * .5 + b;
          } else {
            return Canvas.prototype.easing.bounceOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
          }
        }
      };
    };
    Canvas.prototype.get = function(shape) {
      return this.registry[shape];
    };
    return Canvas;
  })();
}).call(this);
