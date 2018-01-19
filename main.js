;(function(window, document, console, sasicae) { // eslint-disable-line
  'use strict';

  const _ = Object.assign(
    {},
    // folktale.core.lambda,
    // folktale.fantasyLand,
    {
      Maybe: folktale.maybe,
      Result: folktale.result,
      Validation: folktale.validation,
      Union: folktale.adt.union,

      isMonad(m) {
        if (_.Result && _.isCallable(_.Result.hasInstance) && _.Result.hasInstance(m)) return true;
        if (_.Maybe && _.isCallable(_.Maybe.hasInstance) && _.Maybe.hasInstance(m)) return true;
        return false;
      },

      chainOrCall(m, f) {
        _.assert(_.isCallable(f));
        return _.isMonad(m) ? m.chain(f) : f(m);
      },
    },
    {
      //------------------------------------------------------------------------
      // Followings are platform-dependent

      assert(...args) {
        console.assert(args.length > 0);
        console.assert(...args);
        return args[0];
      },

      error(...args) {
        _.assert(args.length > 0);
        console.error(...args);
        return args[0];
      },

      debug(...args) {
        _.assert(args.length > 0);
        console.debug(..._.saveStackTrace(args, '_.debug():'));
        return args[0];
      },

      log(...args) {
        _.assert(args.length > 0);
        console.log(...args);
        return args[0];
      },

      warn(...args) {
        _.assert(args.length > 0);
        console.warn(...args);
        return args[0];
      },

      querySelectorAll(...args) {
        _.assert(args.length === 1);
        const query = args[0];
        return document.querySelectorAll(query);
      },

      //------------------------------------------------------------------------
      // Followings are platform-independent

      querySelector(...args) {
        _.assert(args.length === 1);
        const query = args[0];
        const results = _.querySelectorAll(query) || [];
        if (results.length !== 1) _.warn('querySelector(): failed (length=' + results.length + '): ' + query);
        return results[0];
      },

      assertEvery(...args) {
        _.assert(args.length > 0);
        const pred = args[0];
        _.assert(_.isCallable(pred));
        const restArgs = _.saveStackTrace(args.slice(1), '_.assertEvery():');
        return _.forEach((e, i, arr) => _.assert(...[pred(e), e, i, arr].concat(restArgs)));
      },

      saveStackTrace(...args) {
        _.assert(args.length < 3);
        if (args.length === 0) return new Error();
        const description = args[args.length - 1];
        const err = new Error(description);
        if (args.length === 1) return err;
        const seq = args[0];
        if (seq.length > 0 && seq[seq.length - 1] instanceof Error) return seq;
        return Object.freeze([].concat(seq, [err]));
      },

      //------------------------------------------------------------------------
      // Followings are PURE functions

      pipe(...args) {
        _.assert(args.length > 0);
        _.assert(args.every(_.isCallable));
        const first = args[0];
        const funcList = args.slice(1);
        return function pipeHelper(...args) {
          const initialValue = (args.length === 1) ? _.chainOrCall(args[0], first) : first(...args);
          return funcList.reduce((acc, func) => _.chainOrCall(acc, func), initialValue);
        };
      },

      tap(...args) {
        _.assert(args.length > 0);
        return _.nativeArrayFuncProxy(
          _.applyThis,
          (seq, _ret) => seq,
          '_.tap():',
          args,
        );
      },

      tapDebug(...args) {
        return _.nativeArrayFuncProxy(
          _.applyThis,
          (seq, _ret) => seq,
          '_.tapDebug():',
          [_.debug].concat(_.saveStackTrace(args, '_.tapDebug():')),
        );
      },

      forEach(...args) {
        _.assert(args.length === 1);
        return _.nativeArrayFuncProxy(
          Array.prototype.forEach,
          (seq, _ret) => seq,
          '_.forEach():',
          args,
        );
      },

      filter(...args) {
        _.assert(args.length === 1);
        return _.nativeArrayFuncProxy(
          Array.prototype.filter,
          (_seq, ret) => Object.freeze(ret),
          '_.filter():',
          args,
        );
      },

      map(...args) {
        _.assert(args.length === 1);
        return _.nativeArrayFuncProxy(
          Array.prototype.map,
          (_seq, ret) => Object.freeze(ret),
          '_.map():',
          args,
        );
      },

      reduce(...args) {
        _.assert(args.length === 1 || args.length === 2);
        return _.nativeArrayFuncProxy(
          Array.prototype.reduce,
          (_seq, ret) => ret,
          '_.reduce():',
          args,
        );
      },

      reduceRight(...args) {
        _.assert(args.length === 1 || args.length === 2);
        return _.nativeArrayFuncProxy(
          Array.prototype.reduceRight,
          (_seq, ret) => ret,
          '_.reduceRight():',
          args,
        );
      },

      nativeArrayFuncProxy(...args) {
        _.assert(args.length === 4);
        const nativeFunc = args[0];
        _.assert(_.isCallable(nativeFunc));
        const selectResult = args[1];
        _.assert(_.isCallable(selectResult));
        const name = args[2];
        _.assert(typeof name === 'string');
        const baseArgs = args[3];
        const stacktrace = _.saveStackTrace(name);
        return function nativeArrayFuncProxyHelper(...args) {
          _.assert(args.length === 1, args, stacktrace);
          const seq = args[0];
          _.assert(_.isSeq(seq), args, stacktrace);
          const ret = nativeFunc.apply(seq, baseArgs);
          return selectResult(seq, ret);
        };
      },

      slice(...args) {
        _.assert(args.length < 3);
        return _.nativeArrayFuncProxy(
          Array.prototype.slice,
          (_seq, ret) => Object.freeze(ret),
          '_.slice():',
          args,
        );
      },

      last(...args) {
        _.assert(args.length === 0);
        return _.nth(-1);
      },

      nth(...args) {
        _.assert(args.length === 1);
        const pos = args[0];
        _.assert(_.isInteger(pos));
        const name = `_.nth(${pos}):`;
        const func1 = seq => ((seq.length < pos + 1) ? undefined : seq[pos]);
        const func2 = seq => ((seq.length < -pos) ? undefined : seq[seq.length + pos]);
        const func = pos >= 0 ? func1 : func2;
        return _.nativeArrayFuncProxy(
          _.applyThis,
          (_seq, ret) => ret,
          name,
          [func],
        );
      },

      chunk(...args) { // curried version of https://lodash.com/docs/#chunk
        _.assert(args.length < 2);
        const size = (args.length === 0) ? 1 : args[0];
        _.assert(_.isPositiveInteger(size));
        return _.pipe(
          _.recude((acc, _x, i, self) => (i % size === 0) ? [].concat(acc, [_.slice(i, i + size)(self)]) : acc, []),
          Object.freeze,
        );
      },

      fromPairs(...args) { // curried version of http://folktale.origamitower.com/api/v2.1.0/en/folktale.core.object.from-pairs.frompairs.html
        _.assert(args.length === 0);
        const stacktrace = _.saveStackTrace('_.fromPairs():');
        return _.pipe(
          _.assertEvery(_.isSeq, stacktrace),
          _.assertEvery(x => x.length === 2, stacktrace),
          _.reduce((acc, x) => Object.defineProperty(acc, x[0], {value: x[1], enumerable: true}), {}),
          Object.freeze,
        );
      },

      seq2obj(...args) {
        _.assert(args.length === 0);
        const stacktrace = _.saveStackTrace('_.seq2obj():');
        return _.pipe(
          _.tap(seq => _.assert(seq.length % 2 === 0, stacktrace)),
          _.chunk(2),
          _.fromPairs(),
          Object.freeze,
        );
      },

      toSeq(...args) { // flatten
        _.assert(args.length > 0);
        if (args.length > 1) return Object.freeze([].concat(...args.map(x => _.toSeq(x))));
        if (! _.isSeq(args[0])) return args;
        if (Array.isArray(args[0])) return args[0];
        return Object.freeze(Array.from(args[0]));
      },

      isSeq(...args) {
        _.assert(args.length > 0); // allow to be called by Array.prorotype.filter()
        const arg = args[0];
        return arg && _.isNonNegativeInteger(arg.length);
      },

      isCallable(...args) {
        _.assert(args.length > 0); // allow to be called by Array.prorotype.filter()
        const arg = args[0];
        return arg && arg.call && arg.call.call && arg.apply && arg.apply.apply;
      },

      isInteger(...args) {
        _.assert(args.length > 0); // allow to be called by Array.prorotype.filter()
        const arg = args[0];
        return Number.isSafeInteger(arg);
      },

      isPositiveInteger(...args) {
        _.assert(args.length > 0); // allow to be called by Array.prorotype.filter()
        const arg = args[0];
        return _.isInteger(arg) && arg > 0;
      },

      isNonNegativeInteger(...args) {
        _.assert(args.length > 0); // allow to be called by Array.prorotype.filter()
        const arg = args[0];
        return _.isInteger(arg) && arg >= 0;
      },

      indirectCall(...args) {
        _.assert(0 < args.length && args.length < 3);
        const table = args[0];
        _.assert(table instanceof Object);
        const keygen = (args.length === 1) ? _.identity : args[1];
        _.assert(_.isCallable(keygen));
        const stacktrace = _.saveStackTrace('_.indirectCall():');
        return function indirectCallHelper(...args) {
          _.assert(args.length > 0, args, stacktrace);
          const func = table[keygen(...args)];
          if (func === undefined) return undefined;
          _.assert(_.isCallable(func), func, args, table, stacktrace);
          return func(...args);
        };
      },

      applyThis(...args) {
        _.assert(args.length > 0);
        const func = args[0];
        _.assert(_.isCallable(func));
        const restArgs = args.slice(1);
        const that = this;
        _.assert(that);
        return func(...[that].concat(restArgs));
      },

      identity(...args) {
        _.assert(args.length > 0); // allow to be called by Array.prorotype.filter()
        return args[0];
      },

    },
  );

  Object.freeze(_);

  window.addEventListener('load', () => sasicae(_));

})(window, window.document, window.console, _ => {
  'use strict';

  function generateFormReader() {
    const tableForInputElement = {
      checkbox: e => e.checked,
      radio: e => e.checked ? e.value : undefined,
    };

    const table = {
      INPUT: _.indirectCall(tableForInputElement, e => e.type.toLowerCase()),
      SELECT: e => e.value,
    };

    return _.pipe(
      _.toSeq,
      _.tapDebug(),
      _.assertEvery(_.identity),
      _.assertEvery(e => typeof e.nodeName === 'string'),
      _.map(e => ({e: e, value: _.indirectCall(table, x => x.nodeName.toUpperCase())(e)})),
      _.tapDebug(),
      _.filter(x => x.value !== undefined),
      _.tapDebug(),
      _.assertEvery(x => typeof x.e.id === 'string' && x.e.id.length > 0),
      _.map(x => [x.e.id, x.value]),
      _.fromPairs(),
      Object.freeze,
    );
  }

  const config = generateFormReader()(_.querySelector('#GlobalNavigation').childNodes);
  _.debug(config);
  _.debug(config.GlobalSwitch);
  _.debug('==================================================');

  /* eslint-disable no-magic-numbers */
  /* eslint-disable comma-spacing */

  _.debug(_.toSeq(1,2,3));
  _.debug(_.toSeq([1,2,3]));
  _.debug(_.toSeq([1,2,3], [4,5,6], [7,8,9]));
  _.debug('==================================================');
  _.debug(_.last()(_.toSeq(1,2,3)));
  _.debug(_.last()(_.toSeq([1])));
  _.debug(_.last()(_.toSeq([])));
  _.debug('==================================================');

  function sasicaeMain() {
    const replacement = _.querySelector('#Replacement').innerHTML;
    const target = _.querySelector('#TargetParagraph');
    const original = target.innerHTML;
    let isReplaced = false;
    setInterval(() => {
      target.innerHTML = (isReplaced = ! isReplaced) ? replacement : original;
    }, 5000);
  }

  sasicaeMain();

  const bbb = _.Result.Ok('bbb');
  _.log(bbb);
  _.log(_.Result.hasInstance(bbb));
  _.log(bbb.getOrElse('substitute of bbb'));
  const ccc = _.Result.Error(new Error('ccc'));
  _.log(ccc);
  _.log(_.Result.hasInstance(ccc));
  _.log(ccc.getOrElse('substitute of ccc'));
  const ddd = _.pipe(_.identity, x => x + x, _.identity)(ccc);
  _.log(ddd);
  _.log(_.Result.hasInstance(ddd));
  const eee = ddd.chain(_.identity);
  _.log(eee);
  _.log(eee.getOrElse('error detected'));
});
