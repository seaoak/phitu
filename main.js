;(function(window, document, console, sasicae) { // eslint-disable-line
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
  const SS = Object.assign(
    {},
    // folktale.core.lambda,
    // folktale.fantasyLand,
    {
      Maybe: folktale.maybe,
      Result: folktale.result,
      Validation: folktale.validation,
      Union: folktale.adt.union,

      isMonad(m) {
        if (SS.Result && SS.isCallable(SS.Result.hasInstance) && SS.Result.hasInstance(m)) return true;
        if (SS.Maybe && SS.isCallable(SS.Maybe.hasInstance) && SS.Maybe.hasInstance(m)) return true;
        return false;
      },

      chainOrCall(m, f) {
        SS.assert(SS.isCallable(f));
        return SS.isMonad(m) ? m.chain(f) : f(m);
      },
    },
    {
      //------------------------------------------------------------------------
      // Followings are platform-dependent

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

      querySelectorAll(...args) {
        SS.assert(args.length === 1);
        const [query] = args;
        return document.querySelectorAll(query);
      },

      //------------------------------------------------------------------------
      // Followings are platform-independent

      querySelector(...args) {
        SS.assert(args.length === 1);
        const [query] = args;
        const results = SS.querySelectorAll(query) || [];
        if (results.length !== 1) SS.warn('querySelector(): failed (length=' + results.length + '): ' + query);
        return results[0];
      },

      assertEvery(...args) {
        SS.assert(args.length > 0);
        const [pred, ...rest] = args;
        SS.assert(SS.isCallable(pred));
        const restArgs = SS.saveStackTrace(rest, 'SS.assertEvery():');
        return SS.forEach((e, i, arr) => SS.assert(pred(e), e, i, arr, ...restArgs));
      },

      saveStackTrace(...args) {
        SS.assert(args.length < 3);
        if (args.length === 0) return new Error();
        const description = args[args.length - 1];
        SS.assert(typeof description === 'string');
        const err = new Error(description);
        if (args.length === 1) return err;
        const [seq] = args;
        SS.assert(SS.isSeq(seq));
        if (seq.length > 0 && seq[seq.length - 1] instanceof Error) return seq;
        return Object.freeze([...seq, err]);
      },

      //------------------------------------------------------------------------
      // Followings are PURE functions

      pipe(...args) {
        SS.assert(args.length > 0);
        SS.assert(args.every(SS.isCallable));
        const [first, ...funcList] = args;
        return function pipeHelper(...args) {
          const initialValue = (args.length === 1) ? SS.chainOrCall(args[0], first) : first(...args);
          return funcList.reduce((acc, func) => SS.chainOrCall(acc, func), initialValue);
        };
      },

      tap(...args) {
        SS.assert(args.length > 0);
        return SS.nativeArrayFuncProxy(
          SS.applyThis,
          (seq, ret_) => seq,
          'SS.tap():',
          args,
        );
      },

      tapDebug(...args) {
        return SS.nativeArrayFuncProxy(
          SS.applyThis,
          (seq, ret_) => seq,
          'SS.tapDebug():',
          [SS.debug, ...SS.saveStackTrace(args, 'SS.tapDebug():')],
        );
      },

      forEach(...args) {
        SS.assert(args.length === 1);
        return SS.nativeArrayFuncProxy(
          Array.prototype.forEach,
          (seq, ret_) => seq,
          'SS.forEach():',
          args,
        );
      },

      filter(...args) {
        SS.assert(args.length === 1);
        return SS.nativeArrayFuncProxy(
          Array.prototype.filter,
          (seq_, ret) => Object.freeze(ret),
          'SS.filter():',
          args,
        );
      },

      map(...args) {
        SS.assert(args.length === 1);
        return SS.nativeArrayFuncProxy(
          Array.prototype.map,
          (seq_, ret) => Object.freeze(ret),
          'SS.map():',
          args,
        );
      },

      reduce(...args) {
        SS.assert(args.length === 1 || args.length === 2);
        return SS.nativeArrayFuncProxy(
          Array.prototype.reduce,
          (seq_, ret) => ret,
          'SS.reduce():',
          args,
        );
      },

      reduceRight(...args) {
        SS.assert(args.length === 1 || args.length === 2);
        return SS.nativeArrayFuncProxy(
          Array.prototype.reduceRight,
          (seq_, ret) => ret,
          'SS.reduceRight():',
          args,
        );
      },

      nativeArrayFuncProxy(...args) {
        SS.assert(args.length === 4);
        const [nativeFunc, selectResult, name, baseArgs] = args;
        SS.assert(SS.isCallable(nativeFunc));
        SS.assert(SS.isCallable(selectResult));
        SS.assert(typeof name === 'string');
        const stacktrace = SS.saveStackTrace(name);
        return function nativeArrayFuncProxyHelper(...args) {
          SS.assert(args.length === 1, args, stacktrace);
          const [seq] = args;
          SS.assert(SS.isSeq(seq), args, stacktrace);
          const ret = nativeFunc.apply(seq, baseArgs);
          return selectResult(seq, ret);
        };
      },

      slice(...args) {
        SS.assert(args.length < 3);
        return SS.nativeArrayFuncProxy(
          Array.prototype.slice,
          (seq_, ret) => Object.freeze(ret),
          'SS.slice():',
          args,
        );
      },

      last(...args) {
        SS.assert(args.length === 0);
        return SS.nth(-1);
      },

      nth(...args) {
        SS.assert(args.length === 1);
        const [pos] = args;
        SS.assert(SS.isInteger(pos));
        const name = `SS.nth(${pos}):`;
        const func1 = seq => ((seq.length < pos + 1) ? undefined : seq[pos]);
        const func2 = seq => ((seq.length < -pos) ? undefined : seq[seq.length + pos]);
        const func = pos >= 0 ? func1 : func2;
        return SS.nativeArrayFuncProxy(
          SS.applyThis,
          (seq_, ret) => ret,
          name,
          [func],
        );
      },

      chunk(...args) { // curried version of https://lodash.com/docs/#chunk
        SS.assert(args.length < 2);
        SS.assertEvery(SS.isPositiveInteger)(args);
        const [size = 1] = args;
        return SS.pipe(
          SS.reduce((acc, x_, i, self) => (i % size === 0) ? [...acc, SS.slice(i, i + size)(self)] : acc, []),
          Object.freeze,
        );
      },

      fromPairs(...args) { // curried version of http://folktale.origamitower.com/api/v2.1.0/en/folktale.core.object.from-pairs.frompairs.html
        SS.assert(args.length === 0);
        const stacktrace = SS.saveStackTrace('SS.fromPairs():');
        return SS.pipe(
          SS.assertEvery(SS.isSeq, stacktrace),
          SS.assertEvery(x => x.length === 2, stacktrace),
          SS.reduce((acc, [name, value]) => Object.defineProperty(acc, name, {value: value, enumerable: true}), {}),
          Object.freeze,
        );
      },

      seq2obj(...args) {
        SS.assert(args.length === 0);
        const stacktrace = SS.saveStackTrace('SS.seq2obj():');
        return SS.pipe(
          SS.tap(seq => SS.assert(seq.length % 2 === 0, stacktrace)),
          SS.chunk(2),
          SS.fromPairs(),
          Object.freeze,
        );
      },

      toSeq(...args) { // flatten
        SS.assert(args.length > 0);
        if (args.length > 1) return Object.freeze([].concat(...args.map(x => SS.toSeq(x))));
        const [arg] = args;
        if (! SS.isSeq(arg)) return Object.freeze([arg]);
        return Object.freeze([...arg]);
      },

      isSeq(...args) {
        SS.assert(args.length > 0); // allow to be called by Array.prorotype.filter()
        const [arg] = args;
        return arg && SS.isNonNegativeInteger(arg.length);
      },

      isCallable(...args) {
        SS.assert(args.length > 0); // allow to be called by Array.prorotype.filter()
        const [arg] = args;
        return arg && arg.call && arg.call.call && arg.apply && arg.apply.apply;
      },

      isInteger(...args) {
        SS.assert(args.length > 0); // allow to be called by Array.prorotype.filter()
        const [arg] = args;
        return Number.isSafeInteger(arg);
      },

      isPositiveInteger(...args) {
        SS.assert(args.length > 0); // allow to be called by Array.prorotype.filter()
        const [arg] = args;
        return SS.isInteger(arg) && arg > 0;
      },

      isNonNegativeInteger(...args) {
        SS.assert(args.length > 0); // allow to be called by Array.prorotype.filter()
        const [arg] = args;
        return SS.isInteger(arg) && arg >= 0;
      },

      indirectCall(...args) {
        SS.assert(0 < args.length && args.length < 3);
        SS.assertEvery(SS.identity)(args);
        const [table, keygen = SS.identity] = args;
        SS.assert(table instanceof Object);
        SS.assert(SS.isCallable(keygen));
        const stacktrace = SS.saveStackTrace('SS.indirectCall():');
        return function indirectCallHelper(...args) {
          SS.assert(args.length > 0, args, stacktrace);
          const func = table[keygen(...args)];
          if (func === undefined) return undefined;
          SS.assert(SS.isCallable(func), func, args, table, stacktrace);
          return func(...args);
        };
      },

      applyThis(...args) {
        SS.assert(args.length > 0);
        const [func, ...restArgs] = args;
        SS.assert(SS.isCallable(func));
        const that = this;
        SS.assert(that);
        return func(that, ...restArgs);
      },

      identity(...args) {
        SS.assert(args.length > 0); // allow to be called by Array.prorotype.filter()
        return args[0];
      },

    },
  );

  Object.freeze(SS);

  window.addEventListener('load', () => sasicae(SS));

})(window, window.document, window.console, SS => {
  'use strict';

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
  SS.debug('==================================================');

  /* eslint-disable no-magic-numbers */
  /* eslint-disable comma-spacing */

  SS.debug(SS.toSeq(1,2,3));
  SS.debug(SS.toSeq([1,2,3]));
  SS.debug(SS.toSeq([1,2,3], [4,5,6], [7,8,9]));
  SS.debug('==================================================');
  SS.debug(SS.last()(SS.toSeq(1,2,3)));
  SS.debug(SS.last()(SS.toSeq([1])));
  SS.debug(SS.last()(SS.toSeq([])));
  SS.debug('==================================================');
  const pairs = Object.freeze(['aaa', 1, 'bbb', 2, 'ccc', 3, 'ddd', 4, 'eee', 5]);
  SS.debug(SS.chunk()(pairs));
  SS.debug(SS.chunk(2)(pairs));
  SS.debug(SS.chunk(3)(pairs));
  SS.debug(SS.seq2obj()(pairs));
  SS.debug('==================================================');

  function sasicaeMain() {
    const replacement = SS.querySelector('#Replacement').innerHTML;
    const target = SS.querySelector('#TargetParagraph');
    const original = target.innerHTML;
    let isReplaced = false;
    setInterval(() => {
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
});
