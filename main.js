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

      isPositiveInteger(...args) {
        const [arg] = args;
        return SS.isInteger(arg) && arg > 0;
      },

      isNonNegativeInteger(...args) {
        const [arg] = args;
        return SS.isInteger(arg) && arg >= 0;
      },

      isCallable(...args) {
        const [arg] = args;
        return arg && arg.call && arg.call.call && arg.apply && arg.apply.apply;
      },

      isIterable(...args) {
        const [arg] = args;
        try {
          return arg && SS.isNonNegativeInteger(arg.length) && (arg[0], true);
        } catch (e_) {
          return false;
        }
      },
    },
  ));

  console.debug('==========END_OF_DEFINITION=========='); // eslint-disable-line

  return Promise.resolve(SS); // explicitly create a new Promise object because the argument may have "then()" method

}).then(HH => {
  'use strict';

  const {document} = window; // eslint-disable-line no-undef
  const {console} = window; // eslint-disable-line no-undef
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
        return document.querySelectorAll(query);
      },
    },
    {
      // Others

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

  // helper functions
  const SS = Object.freeze(Object.assign(
    {},
    HH,
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
        SS.assert(args.length > 0);
        const [func, ...restArgs] = args;
        SS.assert(SS.isCallable(func), args);
        const that = this;
        SS.assert(that, args);
        return func(that, ...restArgs);
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
      identity(...args) {
        SS.assert(args.length > 0); // allow to be called by Array.prorotype.filter()
        return args[0];
      },

      partial(...args) {
        SS.assert(args.length > 1, args);
        const [func, ...restArgs] = args;
        SS.assert(SS.isCallable(func), args);
        return function partialHelper(...args) {
          SS.assert(args.length >= 0); // allow no appended argument (just only used as lazy)
          return func(...restArgs, ...args);
        };
      },

      partialRight(...args) {
        SS.assert(args.length > 1, args);
        const [func, ...restArgs] = args;
        SS.assert(SS.isCallable(func), args);
        return function partialRightHelper(...args) {
          SS.assert(args.length >= 0); // allow no prepended argument (just only used as lazy)
          return func(...args, ...restArgs);
        };
      },

      //----------------------------------------------------------------------

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
        SS.assert(args.length > 0);
        SS.assert(SS.isCallable(args[0]), args);
        return SS.nativeArrayFuncProxy(
          SS.applyThis,
          (seq, ret_) => seq,
          args,
          'SS.tap():',
        );
      },

      forEach(...args) {
        SS.assert(args.length === 1, args);
        SS.assert(SS.isCallable(args[0]), args);
        return SS.nativeArrayFuncProxy(
          'forEach',
          (seq, ret_) => seq,
          args,
        );
      },

      filter(...args) {
        SS.assert(args.length === 1, args);
        SS.assert(SS.isCallable(args[0]), args);
        return SS.nativeArrayFuncProxy(
          'filter',
          (seq_, ret) => Object.freeze(ret),
          args,
        );
      },

      map(...args) {
        SS.assert(args.length === 1, args);
        SS.assert(SS.isCallable(args[0]), args);
        return SS.nativeArrayFuncProxy(
          'map',
          (seq_, ret) => Object.freeze(ret),
          args,
        );
      },

      reduce(...args) {
        SS.assert(args.length === 1 || args.length === 2, args);
        SS.assert(SS.isCallable(args[0]), args);
        return SS.nativeArrayFuncProxy(
          'reduce',
          (seq_, ret) => ret, // not freeze
          args,
        );
      },

      reduceRight(...args) {
        SS.assert(args.length === 1 || args.length === 2, args);
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
        SS.assert(args.length === 1, args);
        SS.assert(SS.isCallable(args[0]), args);
        return SS.nativeArrayFuncProxy(
          'every',
          (seq_, ret) => ret, // not freeze
          args,
        );
      },

      some(...args) {
        SS.assert(args.length === 1, args);
        SS.assert(SS.isCallable(args[0]), args);
        return SS.nativeArrayFuncProxy(
          'some',
          (seq_, ret) => ret, // not freeze
          args,
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
        const func1 = seq => ((seq.length < pos + 1) ? undefined : seq[pos]);
        const func2 = seq => ((seq.length < -pos) ? undefined : seq[seq.length + pos]);
        const func = pos >= 0 ? func1 : func2;
        return SS.nativeArrayFuncProxy(
          SS.applyThis,
          (seq_, ret) => ret, // not freeze
          [func],
          name,
        );
      },

      last(...args) {
        SS.assert(args.length === 0, args);
        return SS.nativeArrayFuncProxy(
          SS.applyThis,
          (seq_, ret) => ret, // not freeze
          [seq => seq.length === 0 ? undefined : seq[seq.length - 1]],
          'SS.last():',
        );
      },

      //----------------------------------------------------------------------

      tapAssert(...args) {
        SS.assert(args.length > 0);
        const [pred, ...restArgs] = args;
        SS.assert(SS.isCallable(pred), args);
        const stacktrace = [args, SS.saveStackTrace('SS.tapAssert():')];
        return SS.tap(seq => SS.assert(pred(seq), seq, ...restArgs, ...stacktrace));
      },

      assertEvery(...args) {
        SS.assert(args.length > 0);
        const [pred, ...restArgs] = args;
        SS.assert(SS.isCallable(pred), args);
        const stacktrace = [args, SS.saveStackTrace('SS.assertEvery():')];
        return SS.forEach((e, i, arr) => SS.assert(pred(e), e, i, arr, ...restArgs, ...stacktrace));
      },

      //----------------------------------------------------------------------

      fromPairs(...args) { // curried version of http://folktale.origamitower.com/api/v2.1.0/en/folktale.core.object.from-pairs.frompairs.html
        SS.assert(args.length === 0, args);
        const stacktrace = [args, SS.saveStackTrace('SS.fromPairs():')];
        return SS.pipe(
          SS.assertEvery(SS.isSeq, ...stacktrace),
          SS.assertEvery(x => x.length === 2, ...stacktrace),
          SS.reduce((acc, [name, value]) => Object.defineProperty(acc, name, {value: value, enumerable: true}), {}),
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
        SS.assert(table instanceof Object, args);
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
  const SS = Object.freeze(Object.assign(
    {},
    HH,
    {
      assert: HH.assert,
      error: HH.error,
      debug: HH.debug,
      log: HH.log,
      warn: HH.warn,
    },
  ));

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
      SS.fromPairs(),
      Object.freeze,
    );
  }

  const config = generateFormReader()(SS.querySelector('#GlobalNavigation').childNodes);
  SS.debug(config);
  SS.debug(config.GlobalSwitch);
  console.debug('=================================================='); // eslint-disable-line

  /* eslint-disable no-magic-numbers */
  /* eslint-disable comma-spacing */

  SS.debug(SS.toSeq(1,2,3));
  SS.debug(SS.toSeq([1,2,3]));
  SS.debug(SS.toSeq([1,2,3], [4,5,6], [7,8,9]));
  console.debug('=================================================='); // eslint-disable-line
  SS.debug(SS.last()(SS.toSeq(1,2,3)));
  SS.debug(SS.last()(SS.toSeq([1])));
  SS.debug(SS.last()(SS.toSeq([])));
  console.debug('=================================================='); // eslint-disable-line
  const pairs = Object.freeze(['aaa', 1, 'bbb', 2, 'ccc', 3, 'ddd', 4, 'eee', 5]);
  SS.debug(SS.chunk()(pairs));
  SS.debug(SS.chunk(2)(pairs));
  SS.debug(SS.chunk(3)(pairs));
  SS.debug(SS.seq2obj()(pairs));
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

  console.debug('==========END_OF_MAIN=========='); // eslint-disable-line
});

setTimeout(() => console.debug('setTimeout(0ms)')); // eslint-disable-line
console.debug('==========END_OF_FILE=========='); // eslint-disable-line
