"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PhpBase = void 0;

var _globalThis$CustomEve;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var STR = 'string';
var NUM = 'number';

var PhpBase = /*#__PURE__*/function (_EventTarget) {
  _inherits(PhpBase, _EventTarget);

  var _super = _createSuper(PhpBase);

  function PhpBase(PhpBinary) {
    var _globalThis$phpSettin;

    var _this;

    var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, PhpBase);

    _this = _super.call(this);
    var FLAGS = {};

    _this.onerror = function () {};

    _this.onoutput = function () {};

    _this.onready = function () {};

    Object.defineProperty(_assertThisInitialized(_this), 'encoder', {
      value: new TextEncoder()
    });
    Object.defineProperty(_assertThisInitialized(_this), 'buffers', {
      value: {
        stdin: [],
        stdout: new EventBuffer(_assertThisInitialized(_this), 'output', -1),
        stderr: new EventBuffer(_assertThisInitialized(_this), 'error', -1)
      }
    });
    Object.freeze(_this.buffers);
    var defaults = {
      stdin: function stdin() {
        var _this$buffers$stdin$s;

        return (_this$buffers$stdin$s = _this.buffers.stdin.shift()) !== null && _this$buffers$stdin$s !== void 0 ? _this$buffers$stdin$s : null;
      },
      stdout: function stdout(_byte) {
        return _this.buffers.stdout.push(_byte);
      },
      stderr: function stderr(_byte2) {
        return _this.buffers.stderr.push(_byte2);
      },
      postRun: function postRun() {
        var event = new _Event('ready');

        _this.onready(event);

        _this.dispatchEvent(event);
      }
    };
    var fixed = {
      onRefresh: new Set()
    };
    var phpSettings = (_globalThis$phpSettin = globalThis.phpSettings) !== null && _globalThis$phpSettin !== void 0 ? _globalThis$phpSettin : {};
    _this.binary = new PhpBinary(Object.assign({}, defaults, phpSettings, args, fixed)).then(function (php) {
      var retVal = php.ccall('pib_init', NUM, [STR], []);
      return php;
    })["catch"](function (error) {
      return console.error(error);
    });
    return _this;
  }

  _createClass(PhpBase, [{
    key: "inputString",
    value: function inputString(byteString) {
      this.input(this.encoder.encode(byteString));
    }
  }, {
    key: "input",
    value: function input(items) {
      var _this$buffers$stdin;

      (_this$buffers$stdin = this.buffers.stdin).push.apply(_this$buffers$stdin, _toConsumableArray(items));
    }
  }, {
    key: "flush",
    value: function flush() {
      this.buffers.stdout.flush();
      this.buffers.stderr.flush();
    }
  }, {
    key: "run",
    value: function run(phpCode) {
      var _this2 = this;

      return this.binary.then(function (php) {
        return php.ccall('pib_run', NUM, [STR], ["?>".concat(phpCode)], {
          async: true
        });
      })["finally"](function () {
        return _this2.flush();
      });
    }
  }, {
    key: "exec",
    value: function exec(phpCode) {
      var _this3 = this;

      return this.binary.then(function (php) {
        return php.ccall('pib_exec', STR, [STR], [phpCode], {
          async: true
        });
      })["finally"](function () {
        return _this3.flush();
      });
    }
  }, {
    key: "tokenize",
    value: function tokenize(phpCode) {
      return this.binary.then(function (php) {
        return php.ccall('pib_tokenize', STR, [STR], [phpCode], {
          async: true
        });
      });
    }
  }, {
    key: "refresh",
    value: function refresh() {
      var call = this.binary.then(function (php) {
        var _iterator = _createForOfIteratorHelper(php.onRefresh),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var callback = _step.value;
            callback();
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return php.ccall('pib_refresh', NUM, [], [], {
          async: true
        });
      });
      call["catch"](function (error) {
        return console.error(error);
      });
      return call;
    }
  }]);

  return PhpBase;
}( /*#__PURE__*/_wrapNativeSuper(EventTarget));

exports.PhpBase = PhpBase;

var _Event = (_globalThis$CustomEve = globalThis.CustomEvent) !== null && _globalThis$CustomEve !== void 0 ? _globalThis$CustomEve : /*#__PURE__*/function (_globalThis$Event) {
  _inherits(_class, _globalThis$Event);

  var _super2 = _createSuper(_class);

  function _class(name) {
    var _this4;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, _class);

    _this4 = _super2.call(this, name, options);
    _this4.detail = options.detail;
    return _this4;
  }

  return _class;
}(globalThis.Event);

var EventBuffer = /*#__PURE__*/function () {
  function EventBuffer(target, eventType, maxLength) {
    _classCallCheck(this, EventBuffer);

    Object.defineProperty(this, 'target', {
      value: target
    });
    Object.defineProperty(this, 'buffer', {
      value: []
    });
    Object.defineProperty(this, 'eventType', {
      value: eventType
    });
    Object.defineProperty(this, 'maxLength', {
      value: maxLength
    });
    Object.defineProperty(this, 'decoder', {
      value: new TextDecoder()
    });
  }

  _createClass(EventBuffer, [{
    key: "push",
    value: function push() {
      var _this$buffer;

      (_this$buffer = this.buffer).push.apply(_this$buffer, arguments);

      var end = this.buffer.length - 1;

      if (this.maxLength === -1 && this.buffer[end] === 10) {
        this.flush();
      }

      if (this.maxLength >= 0 && this.buffer.length >= this.maxLength) {
        this.flush();
      }
    }
  }, {
    key: "flush",
    value: function flush() {
      if (!this.buffer.length) {
        return;
      }

      var event = new _Event(this.eventType, {
        detail: [this.decoder.decode(new Uint8Array(this.buffer))]
      });

      if (this.target['on' + this.eventType]) {
        if (this.target['on' + this.eventType](event) === false) {
          return;
        }
      }

      if (!this.target.dispatchEvent(event)) {
        return;
      }

      this.buffer.splice(0);
    }
  }]);

  return EventBuffer;
}();