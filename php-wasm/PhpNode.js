"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PhpNode = void 0;

var _PhpBase2 = require("./PhpBase");

var _phpNode = _interopRequireDefault(require("./php-node"));

var _nodePath = _interopRequireDefault(require("node:path"));

var _nodeUrl = _interopRequireDefault(require("node:url"));

var _nodeFs = _interopRequireDefault(require("node:fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var PhpNode = /*#__PURE__*/function (_PhpBase) {
  _inherits(PhpNode, _PhpBase);

  var _super = _createSuper(PhpNode);

  function PhpNode() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, PhpNode);

    var dir;

    if (typeof __dirname === 'undefined') {
      dir = _nodePath["default"].dirname(_nodeUrl["default"].fileURLToPath(import.meta.url));
    } else {
      dir = __dirname;
    }

    var locateFile = function locateFile(wasmBinary) {
      return _nodePath["default"].resolve(dir, wasmBinary);
    };

    return _super.call(this, _phpNode["default"], _objectSpread(_objectSpread({}, args), {}, {
      locateFile: locateFile
    }));
  }

  _createClass(PhpNode, [{
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
          return _get(_getPrototypeOf(PhpNode.prototype), "run", _this).call(_this, phpCode);
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
          return _get(_getPrototypeOf(PhpNode.prototype), "exec", _this2).call(_this2, phpCode);
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

  return PhpNode;
}(_PhpBase2.PhpBase);

exports.PhpNode = PhpNode;