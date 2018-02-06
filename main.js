;Promise.resolve().then(() => { // eslint-disable-line no-extra-semi
  'use strict';

  // platform-independent fundamental pure functions
  const SS = Object.freeze(Object.assign(
    {},
    {
      // predicate

      isInteger(...args) {
        const [arg] = args;
        return Number.isSafeInteger(arg);
      },

      isSafeInteger(...args) {
        const [arg] = args;
        return Number.isSafeInteger(arg);
      },

      isPositiveInteger(...args) {
        const [arg] = args;
        return SS.isInteger(arg) && arg > 0;
      },

      isNonNegativeInteger(...args) {
        const [arg] = args;
        return SS.isInteger(arg) && arg >= 0;
      },

      isInt32(...args) {
        // two's complement representation
        const [arg] = args;
        const width = 32;
        const max = 2 ** (width - 1);
        return SS.isInteger(arg) && -max <= arg && arg < max;
      },

      isDereferenceable(...args) {
        const [arg] = args;
        if (arg === undefined) return false;
        if (arg === null) return false;
        if (typeof arg === 'boolean') return false;
        if (typeof arg === 'number') return false;
        if (typeof arg === 'symbol') return false;
        return true;
      },

      isObjectLike(...args) {
        const [arg] = args;
        if (! SS.isDereferenceable(arg)) return false;
        if (typeof arg === 'string') return false;
        if (Array.isArray(arg)) return true;
        if (typeof arg === 'object' && arg instanceof Object) return true;
        if (typeof arg === 'object') return true; // allow the object created by "Object.create(null)"
        if (typeof arg === 'function') return true; // different from "Lodash.isObjectLike()"
        return true; // allow "Host object (provided by the JavaScript environment)"
      },

      isCallable(...args) {
        const [arg] = args;
        return typeof arg === 'function';
      },

      isIterable(...args) {
        const [arg] = args;
        if (! SS.isDereferenceable(arg)) return false;
        if (! SS.isNonNegativeInteger(arg.length)) return false;
        return true;
      },
    },
    {
      toJS(...args) {
        const [arg] = args;
        return arg;
      },
    },
  ));

  console.debug('==========END_OF_DEFINITION=========='); // eslint-disable-line

  return Promise.resolve(SS); // explicitly create a new Promise object because the argument may have "then()" method

}).then(HH => {
  'use strict';

  const {document} = window; // eslint-disable-line no-undef
  const {console} = window; // eslint-disable-line no-undef
  const {HTMLElement} = window; // eslint-disable-line no-undef
  const onload = handler => window.addEventListener('load', () => handler()); // eslint-disable-line no-undef

  // platform-dependent helper functions
  const SS = Object.freeze(Object.assign(
    {},
    HH,
    {
      // Console API

      assert(...args) {
        console.assert(args.length > 0);
        console.assert(...args);
      },

      error(...args) {
        SS.assert(args.length > 0);
        console.error(...args);
        return args[0];
      },

      debug(...args) {
        SS.assert(args.length > 0);
        console.debug(...SS.saveStackTrace(args, 'SS.debug():'));
        return args[0];
      },

      log(...args) {
        SS.assert(args.length > 0);
        console.log(...args);
        return args[0];
      },

      warn(...args) {
        SS.assert(args.length > 0);
        console.warn(...args);
        return args[0];
      },
    },
    {
      // DOM API

      querySelectorAll(...args) {
        SS.assert(args.length === 1, args);
        const [query] = args;
        SS.assert(typeof query === 'string' && query, args);
        return document.querySelectorAll(query);
      },

      on(...args) {
        SS.assert(args.length === 4, args);
        const [elemOrArrayOrQuery, name, handler, manager] = args;
        if (Array.isArray(elemOrArrayOrQuery)) {
          return elemOrArrayOrQuery.reduce((acc, e) => SS.on(e, name, handler, acc), manager);
        }
        if (typeof elemOrArrayOrQuery === 'string') {
          return [...SS.querySelectorAll(elemOrArrayOrQuery)].reduce((acc, e) => SS.on(e, name, handler, acc), manager);
        }
        const elem = elemOrArrayOrQuery;
        SS.assert(name && typeof name === 'string', args);
        SS.assert(SS.isCallable(handler), args);
        SS.assert(manager, args);
        if (elem instanceof HTMLElement) {
          if (elem.nodeName === 'INPUT' || elem.nodeName === 'SELECT') {
            SS.assert(name === 'change', args);
            elem.addEventListener(name, handler);
            manager.add(() => elem.removeEventListener(name, handler));
            return manager;
          }
          SS.fatal('SS.on():', 'unknown nodeName:', elem.nodeName, args);
        }
        SS.fatal('SS.on():', 'unknown target:', elem, args);
        return undefined; // never reach
      },
    },
    {
      // Others

      fatal(...args) {
        throw new Error('SS.fatal():', ...args);
      },

      assertLazy(...args) {
        // 2nd argument "logger" is lazily evaluated
        console.assert(args.length === 2, args);
        const [pred, logger] = args;
        console.assert(SS.isCallable(pred), args);
        console.assert(SS.isCallable(logger), args);
        const stacktrace = [SS.saveStackTrace('SS.assertLazy():')];
        return function assertLazyHelper(...args) {
          const cond = pred(...args);
          if (! cond) SS.assert(cond, ...args, ...logger(...args), ...stacktrace);
        };
      },

      saveStackTrace(...args) {
        SS.assert(args.length < 3, args);
        if (args.length === 0) return new Error();
        const description = args[args.length - 1];
        SS.assert(typeof description === 'string', args);
        const err = new Error(description);
        if (args.length === 1) return err;
        const [seq] = args;
        SS.assert(SS.isIterable(seq), args);
        if (seq.length > 0 && seq[seq.length - 1] instanceof Error) return seq; // drop "err"
        return Object.freeze([...seq, err]);
      },

      getPromiseForOnLoad(...args) {
        SS.assert(args.length === 1, args);
        const [arg] = args;
        return new Promise(resolve => onload(() => resolve(arg)));
      },
    },
  ));

  console.debug('==========END_OF_DEFINITION=========='); // eslint-disable-line

  return Promise.resolve(SS); // explicitly create a new Promise object because the argument may have "then()" method

}).then(HH => {
  'use strict';

  // helper functions
  const SS = Object.freeze(Object.assign(
    {},
    HH,
    {
      identity(...args) {
        SS.assert(args.length > 0); // allow to be called by Array.prototype.filter()
        return args[0];
      },

      not(...args) {
        SS.assert(args.length > 0); // allow to be called by Array.prototype.filter()
        return ! args[0];
      },

      truthy() {
        return true;
      },

      falsy() {
        return false;
      },

      noop() {
        // do nothing
      },

      partial(...args) {
        SS.assert(args.length > 0); // allow no prepended argument (just only used as lazy)
        const [func, ...restArgs] = args;
        SS.assert(SS.isCallable(func), args);
        return function partialHelper(...args) {
          SS.assert(args.length >= 0); // allow no appended argument (just only used as lazy)
          return func(...restArgs, ...args);
        };
      },

      partialRight(...args) {
        SS.assert(args.length > 0); // allow no appended argument (just only used as lazy)
        const [func, ...restArgs] = args;
        SS.assert(SS.isCallable(func), args);
        return function partialRightHelper(...args) {
          SS.assert(args.length >= 0); // allow no prepended argument (just only used as lazy)
          return func(...args, ...restArgs);
        };
      },

      applyRecursively(...args) {
        SS.assert(args.length === 1 || args.length === 2, args);
        const [func, predOrUndef] = args;
        SS.assert(SS.isCallable(func), args);
        const pred = args.length === 2 ? predOrUndef : SS.truthy;
        SS.assert(SS.isCallable(pred), args);
        const stacktrace = [args, SS.saveStackTrace('applyRecursively():')];
        return function applyRecursivelyHelper(...args) {
          SS.assert(args.length > 0, args, ...stacktrace); // allow to be called by Array.prototype.forEach()
          const [obj] = args;
          if (! pred(obj)) return obj;
          if (SS.isObjectLike(obj)) {
            SS.warn('applyRecursivelyHelper():', 'keys:', SS.keys(obj));
            SS.values(obj).forEach(SS.applyRecursively(func, pred));
          }
          SS.warn('applyRecursively():', 'apply:', obj);
          return func(obj);
        };
      },
    },
    {
      setProperty(...args) {
        SS.assert(args.length === 4, args);
        const [obj, name, value, isOverridable] = args;
        SS.assert(obj, args);
        SS.assert(typeof name === 'string', args);
        SS.assert(name, args);
        if (Object.getOwnPropertyDescriptor(obj, name)) {
          SS.warn(`SS.setProperty(): the property "${name}" already exists`, args);
          if (! isOverridable) return null;
        }
        return Object.freeze(Object.defineProperty(Object.assign({}, obj), name, {value: value, enumerable: true}));
      },

      getOrElse(...args) {
        // NOTE: Using numeric key for Object is not recommended.
        //       If using it, explicit type-casting is required at the calling of this function.
        SS.assert(args.length === 3, args);
        const [obj, key, defaultValue] = args;
        SS.assert(SS.isDereferenceable(obj), args);
        if (typeof key === 'number') {
          SS.assert(! isNaN(key) && isFinite(key), args);
          SS.assert(SS.isNonNegativeInteger(key), args);
          SS.assert(SS.isIterable(obj), args);
          if (key > obj.length - 1) return defaultValue;
          return obj[key];
        }
        SS.assert(SS.isDereferenceable(key), args);
        const name = String(key);
        SS.assert(name, args);
        const status = Object.getOwnPropertyDescriptor(obj, name);
        if (! status) return defaultValue;
        return status.value;
      },

      keys(...args) {
        SS.assert(args.length === 1, args);
        const [obj] = args;
        SS.assert(typeof obj === 'object' || typeof obj === 'function', args);
        SS.assert(obj, args);
        const filters = Object.freeze([
          // should return one of true/false/undefined ("undefined" means "leave it to next")
          x => ! x.includes('$') && undefined,
          _ => true, // sentinel
        ]);
        const isAcceptable = x => filters.reduce((acc, pred) => acc === undefined ? pred(x) : acc, undefined);
        return Object.freeze(Object.getOwnPropertyNames(obj).filter(isAcceptable));
      },

      values(...args) {
        SS.assert(args.length === 1, args);
        const [obj] = args;
        const keys = SS.keys(obj);
        const result = Array.prototype.map.call(keys, x => obj[x]);
        return Object.freeze(result);
      },

      sealDeep(...args) {
        SS.assert(args.length === 1, args);
        const [arg] = args;
        return SS.applyRecursively(Object.seal, SS.isObjectLike)(arg);
      },

      freezeDeep(...args) {
        SS.assert(args.length === 1, args);
        const [arg] = args;
        return SS.applyRecursively(Object.freeze, SS.isObjectLike)(arg);
      },
    },
    {
      nativeArrayFuncProxy(...args) {
        SS.assert(args.length === 3 || args.length === 4, args);
        const [nativeFuncOrName, selectResult, baseArgs, nameOrUndef] = args;
        SS.assert(nativeFuncOrName, args);
        const isShortForm = args.length === 3;
        SS.assert(! isShortForm || (typeof nativeFuncOrName === 'string' && nativeFuncOrName), args);
        const nativeFunc = isShortForm ? Array.prototype[nativeFuncOrName] : nativeFuncOrName;
        SS.assert(SS.isCallable(nativeFunc), nativeFunc, args);
        SS.assert(SS.isCallable(selectResult), selectResult, args);
        SS.assert(isShortForm || (typeof nameOrUndef === 'string' && nameOrUndef), args);
        const name = nameOrUndef || `SS.${nativeFuncOrName}():`;
        const stacktrace = [args, SS.saveStackTrace(name)];
        return function nativeArrayFuncProxyHelper(...args) {
          SS.assert(args.length === 1, args, ...stacktrace);
          const [seq] = args;
          SS.assert(SS.isIterable(seq), args, ...stacktrace);
          const ret = nativeFunc.apply(seq, baseArgs);
          return selectResult(seq, ret);
        };
      },

      applyThis(...args) {
        SS.assert(args.length > 0); // allow appended arguments
        const [func, ...restArgs] = args;
        SS.assert(SS.isCallable(func), args);
        const that = this;
        SS.assert(that, args);
        return func(that, ...restArgs);
      },
    },
    {
      getDisposerManager(...args) {
        SS.assert(args.length === 1, args);
        const [name] = args;
        SS.assert(name && typeof name === 'string', args);
        const list = [];
        const manager = Object.freeze({
          toString: () => name,

          name: name,

          add(...args) {
            SS.assert(args.length === 1, args);
            const [disposer] = args;
            SS.isCallable(disposer, args);
            const index = list.length;
            const stacktrace = [args, SS.saveStackTrace('SS.disposerHelper():')];
            const disposerHelper = (...args) => {
              SS.assert(args.length === 0, args, ...stacktrace);
              SS.assert(list[index], manager, index, ...stacktrace); // error if called twice
              list[index] = null;
              return disposer();
            };
            list.push(disposerHelper);
            return disposerHelper;
          },

          cleanup(...args) {
            SS.assert(args.length === 0, args);
            const count = list.filter(SS.identity).map(f => f()).length;
            SS.warn('SS.disposers:', `"${name}":`, 'cleanup:', count);
            SS.assert(list.every(SS.not), list);
          },
        });
        return manager;
      },
    },
    {
      calculateXorShift128(...args) {
        // This is a *pure* function
        // https://ja.wikipedia.org/wiki/Xorshift
        SS.assert(args.length < 2, args);
        const [vec] = args;
        if (args.length === 0 || vec === undefined) {
          /* eslint-disable no-magic-numbers */
          const x = 123456789;
          const y = 362436069;
          const z = 521288629;
          const w = 88675123;
          /* eslint-enable no-magic-numbers */
          return SS.calculateXorShift128(Object.freeze([x, y, z, w]));
        }
        SS.assert(Array.isArray(vec), args);
        SS.assert(vec.length === 4, args);
        SS.assert(vec.every(SS.isInt32), args);
        const [x, y, z, w] = vec;
        /* eslint-disable no-magic-numbers, no-bitwise */
        const t = x ^ (x << 11);
        const x1 = y;
        const y1 = z;
        const z1 = w;
        const w1 = (w ^ (w >>> 19)) ^ (t ^ (t >>> 8));
        /* eslint-enable no-magic-numbers, no-bitwise */
        return Object.freeze([w1, Object.freeze([x1, y1, z1, w1])]);
      },

      getRandomizerXorshift128(...args) {
        // This is *NOT* a pure function
        // https://ja.wikipedia.org/wiki/Xorshift
        SS.assert(args.length === 0, args);
        /* eslint-disable no-magic-numbers */
        let x = 123456789;
        let y = 362436069;
        let z = 521288629;
        let w = 88675123;
        /* eslint-enable no-magic-numbers */
        return (function* randomizerXorshift128(...args) {
          SS.assert(args.length === 0, args);
          for (;;) {
            /* eslint-disable no-magic-numbers, no-bitwise */
            const t = x ^ (x << 11);
            x = y;
            y = z;
            z = w;
            w = (w ^ (w >>> 19)) ^ (t ^ (t >>> 8));
            /* eslint-enable no-magic-numbers, no-bitwise */
            yield w;
          }
        })();
      },

      reduceToDecimalFraction(...args) {
        // make a "[0,1)" decimal fraction from two 32bit signed integers
        SS.assert(args.length === 2, args);
        SS.assert(args.every(SS.isInt32), args);
        const [x, y] = args;
        const significantBits = 31;
        const dropBits = 1 + significantBits - (Math.floor(Math.log2(Number.MAX_SAFE_INTEGER)) - significantBits); // 9 or 10
        SS.assert(0 < dropBits && dropBits < significantBits);
        /* eslint-disable no-bitwise */
        const x1 = x >>> dropBits; // always non-negative number
        const y1 = y >>> 1; // drop MSB (always non-negative number)
        /* eslint-enable no-bitwise */
        if (x1 + 1 === 2 ** (significantBits - dropBits) && y1 + 1 === 2 ** significantBits) return 0;
        const z = x1 * (2 ** significantBits) + y1;
        SS.assert(SS.isSafeInteger(z) && SS.isNonNegativeInteger(z), z, x1, y1, x, y, dropBits, args);
        const result = z / Number.MAX_SAFE_INTEGER;
        SS.assert(result >= 0 && result <= 1, result, z, x1, y1, args);
        return result;
      },

      getRandomizer(...args) {
        // Deterministic (replayable) pseudo-random number generator
        // This is a *pure* function
        SS.assert(args.length === 0, args);
        const stacktrace = [SS.saveStackTrace('getRandomizer():')];
        const [_, vec] = SS.calculateXorShift128();
        const randomizer = Object.freeze({
          // Iterable-like Immutable object
          next(...args) {
            SS.assert(args.length === 0, args);
            const that = this;
            SS.assert(typeof that === 'object' && that && that.next === randomizer.next && Array.isArray(that.vec), that, ...stacktrace);
            const [x, vec2] = SS.calculateXorShift128(that.vec);
            const [y, vec3] = SS.calculateXorShift128(vec2);
            const value = SS.reduceToDecimalFraction(x, y);
            const result = Object.freeze({
              next: randomizer.next,
              value: value,
              done: false,
              vec: vec3,
            });
            return result;
          },

          vec: vec,
        });
        return randomizer.next();
      },
    },
  ));

  console.debug('==========END_OF_DEFINITION=========='); // eslint-disable-line

  return Promise.resolve(SS); // explicitly create a new Promise object because the argument may have "then()" method

}).then(HH => {
  'use strict';

  // import from folktale
  const SS = Object.freeze(Object.assign(
    {},
    HH,
    // folktale.core.lambda, // eslint-disable-line no-undef
    // folktale.fantasyLand, // eslint-disable-line no-undef
    {
      Maybe: folktale.maybe, // eslint-disable-line no-undef
      Result: folktale.result, // eslint-disable-line no-undef
      Validation: folktale.validation, // eslint-disable-line no-undef
      Union: folktale.adt.union, // eslint-disable-line no-undef
    },
    {
      isMonad(m) {
        if (SS.Result && SS.isCallable(SS.Result.hasInstance) && SS.Result.hasInstance(m)) return true;
        if (SS.Maybe && SS.isCallable(SS.Maybe.hasInstance) && SS.Maybe.hasInstance(m)) return true;
        return false;
      },

      chainOrCall(m, f) {
        SS.assert(SS.isCallable(f), m, f);
        return SS.isMonad(m) ? m.chain(f) : f(m);
      },
    },
  ));

  console.debug('==========END_OF_DEFINITION=========='); // eslint-disable-line

  return Promise.resolve(SS); // explicitly create a new Promise object because the argument may have "then()" method

}).then(HH => {
  'use strict';

  const MM = mobx; // eslint-disable-line no-undef

  const disposers = HH.getDisposerManager('disposers for MobX');

  // always enable "strict mode" of MobX
  MM.useStrict(true);

  // import from MobX
  const SS = Object.freeze(Object.assign(
    {},
    HH,
    {
      // computed: MM.computed,
      action: MM.action,
      runInAction: MM.runInAction,
    },
    {
      observable(...args) {
        return SS.sealDeep(MM.observable(...args));
      },
    },
    {
      autorun(...args) {
        return disposers.add(MM.autorun(...args));
      },

      autorunAsync(...args) {
        return disposers.add(MM.autorunAsync(...args));
      },

      reaction(...args) {
        return disposers.add(MM.reaction(...args));
      },

      when(...args) {
        return disposers.add(MM.when(...args));
      },
    },
    {
      disposerAll(...args) {
        return disposers.cleanup(...args);
      },
    },
    {
      toJS(...args) { // overwrite
        SS.assert(args.length === 1, args);
        const [target] = args;
        SS.assert(typeof target === 'object', args);
        SS.assert(target, args);
        if (MM.isObservable(target)) return MM.toJS(target);
        return HH.toJS(target); // delegate
      },
    },
  ));

  console.debug('==========END_OF_DEFINITION=========='); // eslint-disable-line

  return Promise.resolve(SS); // explicitly create a new Promise object because the argument may have "then()" method

}).then(HH => {
  'use strict';

  // core functions
  const SS = Object.freeze(Object.assign(
    {},
    HH,
    {
      isSeq: HH.isIterable,

      toSeq(...args) { // flatten
        SS.assert(args.length > 0);
        if (args.length > 1) return Object.freeze([].concat(...args.map(x => SS.toSeq(x))));
        const [arg] = args;
        if (! SS.isSeq(arg)) return Object.freeze([arg]);
        return Object.freeze([...arg]);
      },

      //----------------------------------------------------------------------

      pipe(...args) {
        SS.assert(args.length > 0);
        SS.assertEvery(SS.isCallable)(args);
        const [first, ...funcList] = args;
        return function pipeHelper(...args) {
          const initialValue = (args.length === 1) ? SS.chainOrCall(args[0], first) : first(...args);
          return funcList.reduce((acc, func) => SS.chainOrCall(acc, func), initialValue);
        };
      },

      //----------------------------------------------------------------------

      tap(...args) {
        SS.assert(args.length > 0); // allow appended arguments
        SS.assert(SS.isCallable(args[0]), args);
        return SS.nativeArrayFuncProxy(
          SS.applyThis,
          (seq, ret_) => seq,
          args,
          'SS.tap():',
        );
      },

      forEach(...args) {
        SS.assert(args.length > 0, args); // allow appended arguments
        const func = SS.partialRight(...args);
        return SS.nativeArrayFuncProxy(
          'forEach',
          (seq, ret_) => seq,
          [func],
        );
      },

      filter(...args) {
        SS.assert(args.length > 0, args); // allow appended arguments
        const func = SS.partialRight(...args);
        return SS.nativeArrayFuncProxy(
          'filter',
          (seq_, ret) => Object.freeze(ret),
          [func],
        );
      },

      map(...args) {
        SS.assert(args.length > 0, args); // allow appended arguments
        const func = SS.partialRight(...args);
        return SS.nativeArrayFuncProxy(
          'map',
          (seq_, ret) => Object.freeze(ret),
          [func],
        );
      },

      reduce(...args) {
        SS.assert(args.length === 2, args); // disallow omitting "initialValue"
        SS.assert(SS.isCallable(args[0]), args);
        return SS.nativeArrayFuncProxy(
          'reduce',
          (seq_, ret) => ret, // not freeze
          args,
        );
      },

      reduceRight(...args) {
        SS.assert(args.length === 2, args); // disallow omitting "initialValue"
        SS.assert(SS.isCallable(args[0]), args);
        return SS.nativeArrayFuncProxy(
          'reduceRight',
          (seq_, ret) => ret, // not freeze
          args,
        );
      },

      slice(...args) {
        SS.assert(args.length < 3, args);
        SS.assert(args.length === 0 || SS.isInteger(args[0]), args);
        SS.assert(args.length < 2 || SS.isNonNegativeInteger(args[1]), args);
        return SS.nativeArrayFuncProxy(
          'slice',
          (seq_, ret) => Object.freeze(ret),
          args,
        );
      },

      every(...args) {
        SS.assert(args.length > 0, args); // allow appended arguments
        const func = SS.partialRight(...args);
        return SS.nativeArrayFuncProxy(
          'every',
          (seq_, ret) => ret, // not freeze
          [func],
        );
      },

      some(...args) {
        SS.assert(args.length > 0, args); // allow appended arguments
        const func = SS.partialRight(...args);
        return SS.nativeArrayFuncProxy(
          'some',
          (seq_, ret) => ret, // not freeze
          [func],
        );
      },

      indexOf(...args) {
        SS.assert(args.length === 1, args);
        return SS.nativeArrayFuncProxy(
          'indexOf',
          (seq_, ret) => ret, // not freeze
          args,
        );
      },

      lastIndexOf(...args) {
        SS.assert(args.length === 1, args);
        return SS.nativeArrayFuncProxy(
          'lastIndexOf',
          (seq_, ret) => ret, // not freeze
          args,
        );
      },

      find(...args) {
        SS.assert(args.length > 0, args); // allow appended arguments
        const func = SS.partialRight(...args);
        return SS.nativeArrayFuncProxy(
          'find',
          (seq_, ret) => ret, // not freeze
          [func],
        );
      },

      findIndex(...args) {
        SS.assert(args.length > 0, args); // allow appended arguments
        const func = SS.partialRight(...args);
        return SS.nativeArrayFuncProxy(
          'findIndex',
          (seq_, ret) => ret, // not freeze
          [func],
        );
      },

      chunk(...args) { // curried version of https://lodash.com/docs/#chunk
        SS.assert(args.length < 2, args);
        SS.assertEvery(SS.isPositiveInteger)(args);
        const [size = 1] = args;
        return SS.pipe(
          SS.reduce((acc, x_, i, self) => (i % size === 0) ? [...acc, SS.slice(i, i + size)(self)] : acc, []),
          Object.freeze,
        );
      },

      nth(...args) {
        SS.assert(args.length === 1, args);
        const [pos] = args;
        SS.assert(SS.isInteger(pos), args);
        const name = `SS.nth(${pos}):`;
        return SS.nthOrElse(pos, undefined, name);
      },

      last(...args) {
        SS.assert(args.length === 0, args);
        return SS.nthOrElse(-1, undefined, 'SS.last():');
      },

      first(...args) {
        SS.assert(args.length === 0, args);
        return SS.nthOrElse(0, undefined, 'SS.first():');
      },

      tail(...args) {
        SS.assert(args.length === 0 || args.length === 1, args);
        const offset = SS.firstOrElse(1)(args);
        SS.assert(SS.isNonNegativeInteger(offset), args); // allow 0
        return SS.nativeArrayFuncProxy(
          Array.prototype.slice,
          (seq_, ret) => Object.freeze(ret),
          [offset],
          'SS.tail():',
        );
      },

      //----------------------------------------------------------------------

      findOrElse(...args) {
        SS.assert(args.length === 2, args); // no appended argument is allowed
        const [pred, defaultValue] = args;
        SS.assert(SS.isCallable(pred), args);
        return SS.nativeArrayFuncProxy(
          Array.prototype.findIndex,
          (seq, ret) => ret === -1 ? defaultValue : seq[ret], // not freeze
          [pred],
          'SS.findOrElse():',
        );
      },

      nthOrElse(...args) {
        SS.assert(args.length === 2 || args.length === 3, args);
        const [pos, defaultValue, nameOrUndef] = args;
        SS.assert(SS.isInteger(pos), args);
        SS.assert(args.length === 2 || (typeof nameOrUndef === 'string' && nameOrUndef), args);
        const name = nameOrUndef || `SS.nthOrElse(${pos}):`;
        const func1 = seq => ((seq.length < pos + 1) ? defaultValue : seq[pos]);
        const func2 = seq => ((seq.length < -pos) ? defaultValue : seq[seq.length + pos]);
        const func = pos >= 0 ? func1 : func2;
        return SS.nativeArrayFuncProxy(
          SS.applyThis,
          (seq_, ret) => ret, // not freeze
          [func],
          name,
        );
      },

      lastOrElse(...args) {
        SS.assert(args.length === 1, args);
        const [defaultValue] = args;
        return SS.nthOrElse(-1, defaultValue, 'SS.lastOrElse():');
      },

      firstOrElse(...args) {
        SS.assert(args.length === 1, args);
        const [defaultValue] = args;
        return SS.nthOrElse(0, defaultValue, 'SS.firstOrElse():');
      },

      //----------------------------------------------------------------------

      tapAssert(...args) {
        SS.assert(args.length > 0); // allow appended arguments
        const [pred, ...restArgs] = args;
        SS.assert(SS.isCallable(pred), args);
        const stacktrace = [args, SS.saveStackTrace('SS.tapAssert():')];
        return SS.tap(seq => SS.assert(pred(seq), seq, ...restArgs, ...stacktrace));
      },

      assertEvery(...args) {
        SS.assert(args.length > 0); // allow appended arguments
        const [pred, ...restArgs] = args;
        SS.assert(SS.isCallable(pred), args);
        const stacktrace = [args, SS.saveStackTrace('SS.assertEvery():')];
        return SS.forEach((e, i, arr) => SS.assert(pred(e), e, i, arr, ...restArgs, ...stacktrace));
      },

      //----------------------------------------------------------------------

      fromPairs(...args) {
        SS.assert(args.length < 2, args);
        const isOverridable = SS.firstOrElse(false)(args);
        const stacktrace = [args, SS.saveStackTrace('SS.fromPairs():')];
        return SS.pipe(
          SS.assertEvery(SS.isSeq, ...stacktrace),
          SS.assertEvery(x => x.length === 2, ...stacktrace),
          SS.reduce((acc, [name, value]) => acc && SS.setProperty(acc, name, value, isOverridable), {}),
          Object.freeze,
        );
      },

      seq2obj(...args) {
        SS.assert(args.length === 0, args);
        const stacktrace = [args, SS.saveStackTrace('SS.seq2obj():')];
        return SS.pipe(
          SS.tapAssert(seq => seq.length % 2 === 0, ...stacktrace),
          SS.chunk(2),
          SS.fromPairs(),
          Object.freeze,
        );
      },
    },
  ));

  console.debug('==========END_OF_DEFINITION=========='); // eslint-disable-line

  return Promise.resolve(SS); // explicitly create a new Promise object because the argument may have "then()" method

}).then(HH => {
  'use strict';

  // derived utility functions
  const SS = Object.freeze(Object.assign(
    {},
    HH,
    {
      imply(...args) {
        SS.assert(args.length > 1, args);
        const index = SS.findIndex(SS.not)(args); // must evaluate in order (left-to-right)
        return index !== args.length - 1;
      },
    },
    {
      querySelector(...args) {
        SS.assert(args.length === 1, args);
        const [query] = args;
        const results = SS.querySelectorAll(query) || [];
        if (results.length !== 1) SS.warn('querySelector(): failed (length=' + results.length + '): ' + query);
        return results[0];
      },
    },
    {
      tapDebug(...args) {
        return SS.nativeArrayFuncProxy(
          SS.applyThis,
          (seq, ret_) => seq,
          [SS.debug, ...SS.saveStackTrace(args, 'SS.tapDebug():')],
          'SS.tapDebug():',
        );
      },
    },
    {
      indirectCall(...args) {
        SS.assert(args.length === 1 || args.length === 2, args);
        SS.assertEvery(SS.identity)(args);
        const [table, keygen = SS.identity] = args;
        SS.assert(SS.isDereferenceable(table), args);
        SS.assert(SS.isCallable(keygen), args);
        const stacktrace = [args, SS.saveStackTrace('SS.indirectCall():')];
        return function indirectCallHelper(...args) {
          SS.assert(args.length > 0, args, ...stacktrace);
          const func = table[keygen(...args)];
          if (func === undefined) return undefined;
          SS.assert(SS.isCallable(func), func, args, table, ...stacktrace);
          return func(...args);
        };
      },
    },
  ));

  console.debug('==========END_OF_DEFINITION=========='); // eslint-disable-line

  return Promise.resolve(SS); // explicitly create a new Promise object because the argument may have "then()" method

}).then(HH => {
  'use strict';

  // supplement
  const SS = Object.freeze(Object.assign(
    {},
    HH,
    {
    },
  ));

  console.debug('==========END_OF_DEFINITION=========='); // eslint-disable-line

  return Promise.resolve(SS); // explicitly create a new Promise object because the argument may have "then()" method

}).then(HH => {
  'use strict';

  const excludes = HH.pipe(
    Object.freeze,
    HH.assertEvery(HH.isDereferenceable),
    HH.assertEvery(HH.isCallable),
    HH.map(x => x.name),
    HH.assertEvery(name => typeof name === 'string'),
    HH.assertEvery(name => name !== 'anonymous'),
    HH.map(name => [name, true]),
    HH.fromPairs(),
  )([
    HH.isIterable,
    HH.saveStackTrace,
    HH.nativeArrayFuncProxy,
    HH.applyThis,
    HH.calculateXorShift128,
    HH.reduceToDecimalFraction,
  ]);

  // NOTE: Use the name space "SS" because of following reasons:
  //       - The underscore ("_") would not be suitable:
  //         * An single underscore ("_") is often used as a placeholder.
  //         * An identifier which starts with the underscore (e.g., "_foo") is often used as a private identifier.
  //       - The dollar-sign ("$") would not be suitable:
  //         * Old versions of ECMAScript specification explicitly say that the dollar sign is intended for use only in mechanically generated code.
  //         * The single dollar-sign is already used by jQuery.
  //         * A $-prefixed variable name is often used to show that it holds a jQuery object.
  //         * Prefixes "$" and "$$" are reserved by AngularJS.
  //       - A single alphabet letter is hard to search.
  //       - The letter "S" is initial letter of this software.
  const SS = HH.pipe(
    Object.entries,
    HH.filter(([name, value_]) => ! excludes[name]),
    HH.fromPairs(),
    Object.freeze,
  )(HH);

  console.debug('==========END_OF_SS=========='); // eslint-disable-line

  return Promise.resolve(SS); // explicitly create a new Promise object because the argument may have "then()" method

}).then(SS => {
  'use strict';

  return SS.getPromiseForOnLoad(SS);

}).then(SS => {
  'use strict';

  console.debug('==========START_OF_MAIN=========='); // eslint-disable-line

  function generateFormReader() {
    const tableForInputElement = {
      checkbox: e => e.checked,
      radio: e => e.checked ? e.value : undefined,
    };

    const table = {
      INPUT: SS.indirectCall(tableForInputElement, e => e.type.toLowerCase()),
      SELECT: e => e.value,
    };

    return SS.pipe(
      SS.toSeq,
      SS.tapDebug(),
      SS.assertEvery(SS.identity),
      SS.assertEvery(e => typeof e.nodeName === 'string'),
      SS.map(e => ({e: e, value: SS.indirectCall(table, x => x.nodeName.toUpperCase())(e)})),
      SS.tapDebug(),
      SS.filter(x => x.value !== undefined),
      SS.tapDebug(),
      SS.assertEvery(x => typeof x.e.id === 'string' && x.e.id.length > 0),
      SS.map(x => [x.e.id, x.value]),
      // seq => { const e = seq[3]; return [...seq, e] }, // this line makes the result "null", and finally causes "TypeError"
      SS.fromPairs(),
      Object.freeze,
    );
  }

  const config = generateFormReader()(SS.querySelector('#GlobalNavigation').childNodes);
  SS.log(config);
  SS.log(config.GlobalSwitch);
  console.debug('=================================================='); // eslint-disable-line

  /* eslint-disable no-magic-numbers */
  /* eslint-disable comma-spacing */

  SS.log(SS.toSeq(1,2,3));
  SS.log(SS.toSeq([1,2,3]));
  SS.log(SS.toSeq([1,2,3], [4,5,6], [7,8,9]));
  console.debug('=================================================='); // eslint-disable-line
  SS.log(SS.last()(SS.toSeq(1,2,3)));
  SS.log(SS.last()(SS.toSeq([1])));
  SS.log(SS.last()(SS.toSeq([])));
  console.debug('=================================================='); // eslint-disable-line
  const list = SS.toSeq([11, 22, 33, null, 55, undefined, 66, undefined, 77, null]);
  SS.log(SS.forEach(SS.log, 'foo', 'bar')(list));
  SS.log(SS.filter(SS.not)(list));
  SS.log(SS.every(x => ! (x instanceof Object))(list));
  SS.log(SS.some(x => x instanceof Object)(list));
  SS.log(SS.indexOf(undefined)(list));
  SS.log(SS.lastIndexOf(undefined)(list));
  SS.log(SS.find(SS.not)(list));
  SS.log(SS.findIndex(SS.not)(list));
  SS.log(SS.nth(-4)(list));
  SS.log(SS.last()(list));
  SS.log(SS.first()(list));
  SS.log(SS.tail()(list));
  console.debug('=================================================='); // eslint-disable-line
  SS.log(SS.nth(99)(list));
  SS.log(SS.last()([]));
  SS.log(SS.first()([]));
  SS.log(SS.tail()([]));
  SS.log(SS.nthOrElse(99, 'aaa')(list));
  SS.log(SS.lastOrElse('bbb')([]));
  SS.log(SS.firstOrElse('ccc')([]));
  SS.log(SS.findOrElse(SS.not, 'ddd')(list));
  SS.log(SS.findOrElse(x => x instanceof Object, 'eee')(list));
  console.debug('=================================================='); // eslint-disable-line
  SS.log(SS.getOrElse(list, 2, new Error('defaultValue of 2')));
  SS.log(SS.getOrElse(list, 99, new Error('defaultValue of 99')));
  SS.log(SS.getOrElse(list, '2', new Error('defaultValue of "2"')));
  SS.log(SS.getOrElse(list, 'length', new Error('defaultValue of "length"')));
  SS.log(SS.getOrElse(list, 'zzz', new Error('defaultValue of "zzz"')));
  console.debug('=================================================='); // eslint-disable-line
  const pairs = Object.freeze(['aaa', 1, 'bbb', 2, 'ccc', 3, 'ddd', 4, 'eee', 5]);
  SS.log(SS.chunk()(pairs));
  SS.log(SS.chunk(2)(pairs));
  SS.log(SS.chunk(3)(pairs));
  SS.log(SS.seq2obj()(pairs));
  console.debug('=================================================='); // eslint-disable-line
  SS.log(SS.imply(true, true));
  SS.log(SS.imply(true, undefined));
  SS.log(SS.imply(true, true, true, true, true, true));
  SS.log(SS.imply(true, true, true, true, true, undefined));
  SS.log(SS.imply(true, true, true, undefined, true, undefined));
  SS.log(SS.imply(undefined, true, true, true, true, undefined));
  console.debug('=================================================='); // eslint-disable-line
  SS.log('SS.isIterable:', SS.getOrElse(SS, 'isIterable', new Error('SS.isIterable() is not defined')));
  console.debug('=================================================='); // eslint-disable-line
  SS.log('Random:', SS.getRandomizer());
  SS.log('Random:', SS.getRandomizer());
  SS.log('Random:', SS.getRandomizer().next());
  SS.log('Random:', SS.getRandomizer().next());
  SS.log('Random:', SS.getRandomizer().next().next());
  SS.log('Random:', SS.getRandomizer().next().next());
  SS.log((() => {
    const generator = SS.getRandomizerXorshift128();
    return [
      generator,
      generator.next(),
      generator.next(),
      generator.next(),
      generator.next().value,
    ];
  })());
  console.debug('=================================================='); // eslint-disable-line

  function sasicaeMain() {
    const replacement = SS.querySelector('#Replacement').innerHTML;
    const target = SS.querySelector('#TargetParagraph');
    const original = target.innerHTML;
    let isReplaced = false;
    setInterval(() => { // eslint-disable-line no-undef
      target.innerHTML = (isReplaced = ! isReplaced) ? replacement : original;
    }, 5000);
  }

  sasicaeMain();

  const bbb = SS.Result.Ok('bbb');
  SS.log(bbb);
  SS.log(SS.Result.hasInstance(bbb));
  SS.log(bbb.getOrElse('substitute of bbb'));
  const ccc = SS.Result.Error(new Error('ccc'));
  SS.log(ccc);
  SS.log(SS.Result.hasInstance(ccc));
  SS.log(ccc.getOrElse('substitute of ccc'));
  const ddd = SS.pipe(SS.identity, x => x + x, SS.identity)(ccc);
  SS.log(ddd);
  SS.log(SS.Result.hasInstance(ddd));
  const eee = ddd.chain(SS.identity);
  SS.log(eee);
  SS.log(eee.getOrElse('error detected'));
  console.debug('=================================================='); // eslint-disable-line

  (() => {
    function xor(...args) {
      if (args.length === 1 && typeof args === 'object') {
        const [arg] = args;
        return xor(...Object.values(arg));
      }
      return args.reduce((acc, x) => acc === undefined ? Boolean(x) : Boolean(acc) !== Boolean(x), undefined);
    }

    const state = SS.observable({
      config: {
        GlobalSwitch: false,
        CSSAssistSwitch: false,
        UrlHashSwitch: false,
      },

      get flagInner() {
        return xor(this.config);
      },

      get flagGetter() {
        return Object.values(this.config).filter(SS.not).length;
      },
    });

    const derivation = SS.observable({
      get count() {
        return [...Object.values(state.config), state.flagInner].reduce((acc, x) => acc + (x ? 1 : 0), 0);
      },
    });

    const invariant = SS.observable({
      get neverEveryTrue() {
        SS.log('invariant: evaluated: neverEveryTrue');
        return Object.values(state.config).some(SS.not);
      },

      get neverBeUndefined() {
        SS.log('invariant: evaluated: neverBeUndefined');
        return state.config.GlobalSwitch !== undefined;
      },
    });

    const loggerWithState = (...args) => () => {
      SS.warn('loggerWithState: evaluated:', ...args);
      return [...args, SS.toJS(state)];
    };

    SS.keys(invariant).forEach(name => {
      const logger = loggerWithState(name);
      SS.autorun(() => {
        SS.log('Mobx: autorun: invariant:', name);
        SS.assertLazy(() => invariant[name], logger)();
      });
    });

    SS.autorun(() => {
      SS.log('Mobx: autorun: config:', state.config);
    });

    SS.autorun(() => {
      SS.log('Mobx: autorun: GlobalSwitch:', state.config.GlobalSwitch);
    });

    SS.autorun(() => {
      SS.log('Mobx: autorun: CSSAssistSwitch:', state.config.CSSAssistSwitch);
    });

    SS.autorun(() => {
      SS.log('Mobx: autorun: UrlHashSwitch:', state.config.UrlHashSwitch);
    });

    SS.autorun(() => {
      SS.log('Mobx: autorun: flagInner:', state.flagInner);
    });

    SS.autorun(() => {
      SS.log('Mobx: autorun: flagGetter:', state.flagGetter);
    });

    SS.autorun(() => {
      SS.log('Mobx: autorun: count:', derivation.count);
    });

    SS.autorun(() => {
      SS.log('Mobx: autorun: flags:', state.flagInner, state.flagGetter, derivation.count);
    });

    const disposers = SS.getDisposerManager('onchange of INPUT elements');

    const elem = SS.querySelector('#GlobalSwitch');
    SS.on(elem, 'change', SS.action(() => {
      SS.log('====================');
      SS.log('onchange: GlobalSwitch: start:', elem.checked, state.config.GlobalSwitch);
      Promise.resolve().then(() => SS.log('onchange: GlobalSwitch: resolved:', elem.checked, state.config.GlobalSwitch));
      setTimeout(() => SS.log('onchange: GlobalSwitch: setTimeout(0):', elem.checked, state.config.GlobalSwitch), 0); // eslint-disable-line no-undef
      setTimeout(() => SS.log('onchange: GlobalSwitch: setTimeout(1):', elem.checked, state.config.GlobalSwitch), 1); // eslint-disable-line no-undef
      setTimeout(() => SS.log('onchange: GlobalSwitch: setTimeout(100):', elem.checked, state.config.GlobalSwitch), 100); // eslint-disable-line no-undef
      state.config.GlobalSwitch = elem.checked;
      SS.log('onchange: GlobalSwitch: intermediate1:', elem.checked, state.config.GlobalSwitch);
      state.config.GlobalSwitch = ! elem.checked;
      SS.log('onchange: GlobalSwitch: intermediate2:', elem.checked, state.config.GlobalSwitch);
      state.config.GlobalSwitch = elem.checked;
      SS.log('onchange: GlobalSwitch: end:', elem.checked, state.config.GlobalSwitch);
    }), disposers);

    const elem2 = SS.querySelector('#CSSAssistSwitch');
    SS.on(elem2, 'change', () => {
      SS.log('====================');
      SS.log('onchange: CSSAssistSwitch: start:', elem2.checked, state.config.CSSAssistSwitch);
      Promise.resolve().then(() => SS.log('onchange: CSSAssistSwitch: resolved:', elem2.checked, state.config.CSSAssistSwitch));
      setTimeout(() => SS.log('onchange: CSSAssistSwitch: setTimeout(0):', elem2.checked, state.config.CSSAssistSwitch), 0); // eslint-disable-line no-undef
      setTimeout(() => SS.log('onchange: CSSAssistSwitch: setTimeout(1):', elem2.checked, state.config.CSSAssistSwitch), 1); // eslint-disable-line no-undef
      setTimeout(() => SS.log('onchange: CSSAssistSwitch: setTimeout(100):', elem2.checked, state.config.CSSAssistSwitch), 100); // eslint-disable-line no-undef
      // state.config.CSSAssistSwitch = elem2.checked; // This line causes Error under "strict mode" of MobX
      SS.runInAction(() => {
        SS.log('onchange: CSSAssistSwitch: intermediate1:', elem2.checked, state.config.CSSAssistSwitch);
        state.config.CSSAssistSwitch = elem2.checked;
        SS.log('onchange: CSSAssistSwitch: intermediate2:', elem2.checked, state.config.CSSAssistSwitch);
        state.config.CSSAssistSwitch = ! elem2.checked;
        SS.log('onchange: CSSAssistSwitch: intermediate3:', elem2.checked, state.config.CSSAssistSwitch);
        state.config.CSSAssistSwitch = elem2.checked;
        SS.log('onchange: CSSAssistSwitch: intermediate4:', elem2.checked, state.config.CSSAssistSwitch);
      });
      if (SS.querySelector('#IntervalSelect').value === '60sec') SS.disposerAll();
      if (SS.querySelector('#IntervalSelect').value === '1sec') disposers.cleanup();
      SS.log('onchange: CSSAssistSwitch: end:', elem2.checked, state.config.CSSAssistSwitch);
    }, disposers);

    const elem3 = SS.querySelector('#UrlHashSwitch');
    SS.on(elem3, 'change', () => {
      SS.log('====================');
      SS.log('onchange: UrlHashSwitch: start:', elem3.checked, state.config.UrlHashSwitch);
      Promise.resolve().then(() => SS.log('onchange: UrlHashSwitch: resolved:', elem3.checked, state.config.UrlHashSwitch));
      setTimeout(() => SS.log('onchange: UrlHashSwitch: setTimeout(0):', elem3.checked, state.config.UrlHashSwitch), 0); // eslint-disable-line no-undef
      setTimeout(() => SS.log('onchange: UrlHashSwitch: setTimeout(1):', elem3.checked, state.config.UrlHashSwitch), 1); // eslint-disable-line no-undef
      setTimeout(() => SS.log('onchange: UrlHashSwitch: setTimeout(100):', elem3.checked, state.config.UrlHashSwitch), 100); // eslint-disable-line no-undef
      SS.runInAction(() => {
        SS.log('onchange: UrlHashSwitch: intermediate1a:', elem3.checked, state.config.UrlHashSwitch);
        state.config.UrlHashSwitch = elem3.checked;
        SS.log('onchange: UrlHashSwitch: intermediate1b:', elem3.checked, state.config.UrlHashSwitch);
      });
      SS.log('onchange: UrlHashSwitch: intermediate2:', elem3.checked, state.config.UrlHashSwitch);
      SS.runInAction(() => {
        SS.log('onchange: UrlHashSwitch: intermediate3a:', elem3.checked, state.config.UrlHashSwitch);
        state.config.UrlHashSwitch = ! elem3.checked;
        SS.log('onchange: UrlHashSwitch: intermediate3b:', elem3.checked, state.config.UrlHashSwitch);
      });
      SS.log('onchange: UrlHashSwitch: intermediate4:', elem3.checked, state.config.UrlHashSwitch);
      SS.runInAction(() => {
        SS.log('onchange: UrlHashSwitch: intermediate5a:', elem3.checked, state.config.UrlHashSwitch);
        state.config.UrlHashSwitch = elem3.checked;
        SS.log('onchange: UrlHashSwitch: intermediate5b:', elem3.checked, state.config.UrlHashSwitch);
      });
      SS.log('onchange: UrlHashSwitch: end:', elem3.checked, state.config.UrlHashSwitch);
    }, disposers);
  })();
  console.debug('=================================================='); // eslint-disable-line

  console.debug('==========END_OF_MAIN=========='); // eslint-disable-line
});

setTimeout(() => console.debug('setTimeout(0ms)')); // eslint-disable-line
console.debug('==========END_OF_FILE=========='); // eslint-disable-line
