var rune = (function (exports) {
  'use strict';

  /// Hook used to construct an async sleep function.
  function js_sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  var __wbg_star0 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    js_sleep: js_sleep
  });

  let wasm$1;

  function addToExternrefTable0(obj) {
      const idx = wasm$1.__externref_table_alloc();
      wasm$1.__wbindgen_externrefs.set(idx, obj);
      return idx;
  }

  const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
      ? { register: () => {}, unregister: () => {} }
      : new FinalizationRegistry(state => state.dtor(state.a, state.b));

  let cachedDataViewMemory0 = null;
  function getDataViewMemory0() {
      if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm$1.memory.buffer)) {
          cachedDataViewMemory0 = new DataView(wasm$1.memory.buffer);
      }
      return cachedDataViewMemory0;
  }

  function getStringFromWasm0(ptr, len) {
      ptr = ptr >>> 0;
      return decodeText(ptr, len);
  }

  let cachedUint8ArrayMemory0 = null;
  function getUint8ArrayMemory0() {
      if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
          cachedUint8ArrayMemory0 = new Uint8Array(wasm$1.memory.buffer);
      }
      return cachedUint8ArrayMemory0;
  }

  function handleError(f, args) {
      try {
          return f.apply(this, args);
      } catch (e) {
          const idx = addToExternrefTable0(e);
          wasm$1.__wbindgen_exn_store(idx);
      }
  }

  function isLikeNone(x) {
      return x === undefined || x === null;
  }

  function makeMutClosure(arg0, arg1, dtor, f) {
      const state = { a: arg0, b: arg1, cnt: 1, dtor };
      const real = (...args) => {

          // First up with a closure we increment the internal reference
          // count. This ensures that the Rust closure environment won't
          // be deallocated while we're invoking it.
          state.cnt++;
          const a = state.a;
          state.a = 0;
          try {
              return f(a, state.b, ...args);
          } finally {
              state.a = a;
              real._wbg_cb_unref();
          }
      };
      real._wbg_cb_unref = () => {
          if (--state.cnt === 0) {
              state.dtor(state.a, state.b);
              state.a = 0;
              CLOSURE_DTORS.unregister(state);
          }
      };
      CLOSURE_DTORS.register(real, state, state);
      return real;
  }

  function passStringToWasm0(arg, malloc, realloc) {
      if (realloc === undefined) {
          const buf = cachedTextEncoder.encode(arg);
          const ptr = malloc(buf.length, 1) >>> 0;
          getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
          WASM_VECTOR_LEN = buf.length;
          return ptr;
      }

      let len = arg.length;
      let ptr = malloc(len, 1) >>> 0;

      const mem = getUint8ArrayMemory0();

      let offset = 0;

      for (; offset < len; offset++) {
          const code = arg.charCodeAt(offset);
          if (code > 0x7F) break;
          mem[ptr + offset] = code;
      }
      if (offset !== len) {
          if (offset !== 0) {
              arg = arg.slice(offset);
          }
          ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
          const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
          const ret = cachedTextEncoder.encodeInto(arg, view);

          offset += ret.written;
          ptr = realloc(ptr, len, offset, 1) >>> 0;
      }

      WASM_VECTOR_LEN = offset;
      return ptr;
  }

  let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
  cachedTextDecoder.decode();
  const MAX_SAFARI_DECODE_BYTES = 2146435072;
  let numBytesDecoded = 0;
  function decodeText(ptr, len) {
      numBytesDecoded += len;
      if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
          cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
          cachedTextDecoder.decode();
          numBytesDecoded = len;
      }
      return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
  }

  const cachedTextEncoder = new TextEncoder();

  if (!('encodeInto' in cachedTextEncoder)) {
      cachedTextEncoder.encodeInto = function (arg, view) {
          const buf = cachedTextEncoder.encode(arg);
          view.set(buf);
          return {
              read: arg.length,
              written: buf.length
          };
      };
  }

  let WASM_VECTOR_LEN = 0;

  function wasm_bindgen__convert__closures_____invoke__h28f01e19a8155a14(arg0, arg1, arg2) {
      wasm$1.wasm_bindgen__convert__closures_____invoke__h28f01e19a8155a14(arg0, arg1, arg2);
  }

  function wasm_bindgen__convert__closures_____invoke__hb1aafbf7113c5e43(arg0, arg1, arg2, arg3) {
      wasm$1.wasm_bindgen__convert__closures_____invoke__hb1aafbf7113c5e43(arg0, arg1, arg2, arg3);
  }

  const __wbindgen_enum_RequestMode = ["same-origin", "no-cors", "cors", "navigate"];

  /**
   * @param {string} input
   * @param {any} config
   * @returns {Promise<any>}
   */
  function compile(input, config) {
      const ptr0 = passStringToWasm0(input, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm$1.compile(ptr0, len0, config);
      return ret;
  }

  const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);

  async function __wbg_load(module, imports) {
      if (typeof Response === 'function' && module instanceof Response) {
          if (typeof WebAssembly.instantiateStreaming === 'function') {
              try {
                  return await WebAssembly.instantiateStreaming(module, imports);
              } catch (e) {
                  const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);

                  if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                      console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                  } else {
                      throw e;
                  }
              }
          }

          const bytes = await module.arrayBuffer();
          return await WebAssembly.instantiate(bytes, imports);
      } else {
          const instance = await WebAssembly.instantiate(module, imports);

          if (instance instanceof WebAssembly.Instance) {
              return { instance, module };
          } else {
              return instance;
          }
      }
  }

  function __wbg_get_imports() {
      const imports = {};
      imports.wbg = {};
      imports.wbg.__wbg___wbindgen_is_function_8d400b8b1af978cd = function(arg0) {
          const ret = typeof(arg0) === 'function';
          return ret;
      };
      imports.wbg.__wbg___wbindgen_is_undefined_f6b95eab589e0269 = function(arg0) {
          const ret = arg0 === undefined;
          return ret;
      };
      imports.wbg.__wbg___wbindgen_string_get_a2a31e16edf96e42 = function(arg0, arg1) {
          const obj = arg1;
          const ret = typeof(obj) === 'string' ? obj : undefined;
          var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm$1.__wbindgen_malloc, wasm$1.__wbindgen_realloc);
          var len1 = WASM_VECTOR_LEN;
          getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
          getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
      };
      imports.wbg.__wbg___wbindgen_throw_dd24417ed36fc46e = function(arg0, arg1) {
          throw new Error(getStringFromWasm0(arg0, arg1));
      };
      imports.wbg.__wbg__wbg_cb_unref_87dfb5aaa0cbcea7 = function(arg0) {
          arg0._wbg_cb_unref();
      };
      imports.wbg.__wbg_call_3020136f7a2d6e44 = function() { return handleError(function (arg0, arg1, arg2) {
          const ret = arg0.call(arg1, arg2);
          return ret;
      }, arguments) };
      imports.wbg.__wbg_call_abb4ff46ce38be40 = function() { return handleError(function (arg0, arg1) {
          const ret = arg0.call(arg1);
          return ret;
      }, arguments) };
      imports.wbg.__wbg_fetch_8119fbf8d0e4f4d1 = function(arg0, arg1) {
          const ret = arg0.fetch(arg1);
          return ret;
      };
      imports.wbg.__wbg_instanceof_Response_cd74d1c2ac92cb0b = function(arg0) {
          let result;
          try {
              result = arg0 instanceof Response;
          } catch (_) {
              result = false;
          }
          const ret = result;
          return ret;
      };
      imports.wbg.__wbg_instanceof_Window_b5cf7783caa68180 = function(arg0) {
          let result;
          try {
              result = arg0 instanceof Window;
          } catch (_) {
              result = false;
          }
          const ret = result;
          return ret;
      };
      imports.wbg.__wbg_new_1ba21ce319a06297 = function() {
          const ret = new Object();
          return ret;
      };
      imports.wbg.__wbg_new_ff12d2b041fb48f1 = function(arg0, arg1) {
          try {
              var state0 = {a: arg0, b: arg1};
              var cb0 = (arg0, arg1) => {
                  const a = state0.a;
                  state0.a = 0;
                  try {
                      return wasm_bindgen__convert__closures_____invoke__hb1aafbf7113c5e43(a, state0.b, arg0, arg1);
                  } finally {
                      state0.a = a;
                  }
              };
              const ret = new Promise(cb0);
              return ret;
          } finally {
              state0.a = state0.b = 0;
          }
      };
      imports.wbg.__wbg_new_no_args_cb138f77cf6151ee = function(arg0, arg1) {
          const ret = new Function(getStringFromWasm0(arg0, arg1));
          return ret;
      };
      imports.wbg.__wbg_new_with_str_e8aac3eec73c239d = function() { return handleError(function (arg0, arg1) {
          const ret = new Request(getStringFromWasm0(arg0, arg1));
          return ret;
      }, arguments) };
      imports.wbg.__wbg_parse_a09a54cf72639456 = function() { return handleError(function (arg0, arg1) {
          const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
          return ret;
      }, arguments) };
      imports.wbg.__wbg_queueMicrotask_9b549dfce8865860 = function(arg0) {
          const ret = arg0.queueMicrotask;
          return ret;
      };
      imports.wbg.__wbg_queueMicrotask_fca69f5bfad613a5 = function(arg0) {
          queueMicrotask(arg0);
      };
      imports.wbg.__wbg_resolve_fd5bfbaa4ce36e1e = function(arg0) {
          const ret = Promise.resolve(arg0);
          return ret;
      };
      imports.wbg.__wbg_set_method_76c69e41b3570627 = function(arg0, arg1, arg2) {
          arg0.method = getStringFromWasm0(arg1, arg2);
      };
      imports.wbg.__wbg_set_mode_611016a6818fc690 = function(arg0, arg1) {
          arg0.mode = __wbindgen_enum_RequestMode[arg1];
      };
      imports.wbg.__wbg_static_accessor_GLOBAL_769e6b65d6557335 = function() {
          const ret = typeof global === 'undefined' ? null : global;
          return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
      };
      imports.wbg.__wbg_static_accessor_GLOBAL_THIS_60cf02db4de8e1c1 = function() {
          const ret = typeof globalThis === 'undefined' ? null : globalThis;
          return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
      };
      imports.wbg.__wbg_static_accessor_SELF_08f5a74c69739274 = function() {
          const ret = typeof self === 'undefined' ? null : self;
          return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
      };
      imports.wbg.__wbg_static_accessor_WINDOW_a8924b26aa92d024 = function() {
          const ret = typeof window === 'undefined' ? null : window;
          return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
      };
      imports.wbg.__wbg_stringify_655a6390e1f5eb6b = function() { return handleError(function (arg0) {
          const ret = JSON.stringify(arg0);
          return ret;
      }, arguments) };
      imports.wbg.__wbg_text_51046bb33d257f63 = function() { return handleError(function (arg0) {
          const ret = arg0.text();
          return ret;
      }, arguments) };
      imports.wbg.__wbg_then_429f7caf1026411d = function(arg0, arg1, arg2) {
          const ret = arg0.then(arg1, arg2);
          return ret;
      };
      imports.wbg.__wbg_then_4f95312d68691235 = function(arg0, arg1) {
          const ret = arg0.then(arg1);
          return ret;
      };
      imports.wbg.__wbindgen_cast_26bdcd5fa6415ea4 = function(arg0, arg1) {
          // Cast intrinsic for `Closure(Closure { dtor_idx: 1149, function: Function { arguments: [Externref], shim_idx: 1150, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
          const ret = makeMutClosure(arg0, arg1, wasm$1.wasm_bindgen__closure__destroy__h03504125dc1411fe, wasm_bindgen__convert__closures_____invoke__h28f01e19a8155a14);
          return ret;
      };
      imports.wbg.__wbindgen_init_externref_table = function() {
          const table = wasm$1.__wbindgen_externrefs;
          const offset = table.grow(4);
          table.set(0, undefined);
          table.set(offset + 0, undefined);
          table.set(offset + 1, null);
          table.set(offset + 2, true);
          table.set(offset + 3, false);
      };
      imports['./snippets/rune-wasm-66e7e446edbe2776/module.js'] = __wbg_star0;

      return imports;
  }

  function __wbg_finalize_init(instance, module) {
      wasm$1 = instance.exports;
      __wbg_init.__wbindgen_wasm_module = module;
      cachedDataViewMemory0 = null;
      cachedUint8ArrayMemory0 = null;


      wasm$1.__wbindgen_start();
      return wasm$1;
  }

  function initSync(module) {
      if (wasm$1 !== undefined) return wasm$1;


      if (typeof module !== 'undefined') {
          if (Object.getPrototypeOf(module) === Object.prototype) {
              ({module} = module);
          } else {
              console.warn('using deprecated parameters for `initSync()`; pass a single object instead');
          }
      }

      const imports = __wbg_get_imports();
      if (!(module instanceof WebAssembly.Module)) {
          module = new WebAssembly.Module(module);
      }
      const instance = new WebAssembly.Instance(module, imports);
      return __wbg_finalize_init(instance, module);
  }

  async function __wbg_init(module_or_path) {
      if (wasm$1 !== undefined) return wasm$1;


      if (typeof module_or_path !== 'undefined') {
          if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
              ({module_or_path} = module_or_path);
          } else {
              console.warn('using deprecated parameters for the initialization function; pass a single object instead');
          }
      }


      const imports = __wbg_get_imports();

      if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
          module_or_path = fetch(module_or_path);
      }

      const { instance, module } = await __wbg_load(await module_or_path, imports);

      return __wbg_finalize_init(instance, module);
  }

  var exports$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    compile: compile,
    default: __wbg_init,
    initSync: initSync
  });

  var wasm = async (opt = {}) => {
                  let {importHook, serverPath} = opt;

                  let path = "/js/assets/rune_wasm-b86b8774.wasm";

                  if (serverPath != null) {
                      path = serverPath + /[^\/\\]*$/.exec(path)[0];
                  }

                  if (importHook != null) {
                      path = importHook(path);
                  }

                  await __wbg_init(path);
                  return exports$1;
              };

  async function init(opt) {
      exports.module = await wasm(opt);
  }

  exports.module = null;

  exports.init = init;

  return exports;

})({});
//# sourceMappingURL=rune.js.map
