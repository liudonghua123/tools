"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runPhpTags = exports.PhpWeb = void 0;

var _PhpBase2 = require("./PhpBase");

var _phpWeb = _interopRequireDefault(require("./php-web"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var PhpWeb = /*#__PURE__*/function (_PhpBase) {
  _inherits(PhpWeb, _PhpBase);

  var _super = _createSuper(PhpWeb);

  function PhpWeb() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, PhpWeb);

    return _super.call(this, _phpWeb["default"], args);
  }

  _createClass(PhpWeb, [{
    key: "run",
    value: function run(phpCode) {
      var _this = this;

      return this.binary.then(function (php) {
        var sync = !php.persist ? Promise.resolve() : new Promise(function (accept) {
          return php.FS.syncfs(true, function (err) {
            if (err) console.warn(err);
            accept();
          });
        });
        var run = sync.then(function () {
          return _get(_getPrototypeOf(PhpWeb.prototype), "run", _this).call(_this, phpCode);
        });

        if (!php.persist) {
          return run;
        }

        return run.then(function () {
          return new Promise(function (accept) {
            return php.FS.syncfs(false, function (err) {
              if (err) console.warn(err);
              accept(run);
            });
          });
        });
      })["finally"](function () {
        return _this.flush();
      });
    }
  }, {
    key: "exec",
    value: function exec(phpCode) {
      var _this2 = this;

      return this.binary.then(function (php) {
        var sync = new Promise(function (accept) {
          return php.FS.syncfs(true, function (err) {
            if (err) console.warn(err);
            accept();
          });
        });
        var run = sync.then(function () {
          return _get(_getPrototypeOf(PhpWeb.prototype), "exec", _this2).call(_this2, phpCode);
        });
        return run.then(function () {
          return new Promise(function (accept) {
            return php.FS.syncfs(false, function (err) {
              if (err) console.warn(err);
              accept(run);
            });
          });
        });
      })["finally"](function () {
        return _this2.flush();
      });
    }
  }]);

  return PhpWeb;
}(_PhpBase2.PhpBase);

exports.PhpWeb = PhpWeb;

var runPhpScriptTag = function runPhpScriptTag(element) {
  var tags = {
    stdin: null,
    stdout: null,
    stderr: null
  };

  if (element.hasAttribute('data-stdout')) {
    tags.stdout = document.querySelector(element.getAttribute('data-stdout'));
  }

  if (element.hasAttribute('data-stderr')) {
    tags.stderr = document.querySelector(element.getAttribute('data-stderr'));
  }

  if (element.hasAttribute('data-stdin')) {
    tags.stdin = document.querySelector(element.getAttribute('data-stdin'));
  }

  var stdout = '';
  var stderr = '';
  var ran = false;
  var getCode = Promise.resolve(element.innerText);

  if (element.hasAttribute('src')) {
    getCode = fetch(element.getAttribute('src')).then(function (response) {
      return response.text();
    });
  }

  var getInput = Promise.resolve('');

  if (tags.stdin) {
    getInput = Promise.resolve(tags.stdin.innerText);

    if (tags.stdin.hasAttribute('src')) {
      getInput = fetch(tags.stdin.getAttribute('src')).then(function (response) {
        return response.text();
      });
    }
  }

  var getAll = Promise.all([getCode, getInput]);
  getAll.then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        code = _ref2[0],
        input = _ref2[1];

    var php = new PhpWeb();
    php.inputString(input);

    var outListener = function outListener(event) {
      stdout += event.detail;

      if (ran && tags.stdout) {
        tags.stdout.innerHTML = stdout;
      }
    };

    var errListener = function errListener(event) {
      stderr += event.detail;

      if (ran && tags.stderr) {
        tags.stderr.innerHTML = stderr;
      }
    };

    php.addEventListener('output', outListener);
    php.addEventListener('error', errListener);
    php.addEventListener('ready', function () {
      php.run(code).then(function (exitCode) {
        return console.log(exitCode);
      })["catch"](function (error) {
        return console.warn(error);
      })["finally"](function () {
        ran = true;
        php.flush();
        tags.stdout && (tags.stdout.innerHTML = stdout);
        tags.stderr && (tags.stderr.innerHTML = stderr);
      });
    }); // const observer = new MutationObserver((mutations, observer) => {
    // 	for(const mutation of mutations)
    // 	{
    // 		for(const addedNode of mutation.addedNodes)
    // 		{
    // 			console.log(addedNode);
    // 			// php.inputString(addedNode);
    // 			// php.run(code)
    // 			// .then(exitCode => console.log(exitCode))
    // 			// .catch(error => console.warn(error))
    // 			// .finally(() => {
    // 			// 	php.flush();
    // 			// 	tags.stdout && (tags.stdout.innerHTML = stdout);
    // 			// 	tags.stderr && (tags.stderr.innerHTML = stderr);
    // 			// 	php.removeEventListener('output', outListener);
    // 			// 	php.removeEventListener('error',  errListener);
    // 			// });
    // 		}
    // 	}
    // });
    // observer.observe(element, {childList: true, subtree: true});
  });
};

var phpSelector = 'script[type="text/php"]';

var runPhpTags = function runPhpTags(doc) {
  var phpNodes = doc.querySelectorAll(phpSelector);

  var _iterator = _createForOfIteratorHelper(phpNodes),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var phpNode = _step.value;
      var code = phpNode.innerText.trim();
      runPhpScriptTag(phpNode);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var observer = new MutationObserver(function (mutations, observer) {
    var _iterator2 = _createForOfIteratorHelper(mutations),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var mutation = _step2.value;

        var _iterator3 = _createForOfIteratorHelper(mutation.addedNodes),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var addedNode = _step3.value;

            if (!addedNode.matches || !addedNode.matches(phpSelector)) {
              continue;
            }

            runPhpScriptTag(addedNode);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  });
  observer.observe(document.body.parentElement, {
    childList: true,
    subtree: true
  });
};

exports.runPhpTags = runPhpTags;