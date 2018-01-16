;(function(func) {
  'use strict';

  const _ = Object.assign(
    {},
//    folktale.core.lambda,
//    folktale.fantasyLand,
    {
      Maybe: folktale.maybe,
      Result: folktale.result,
      Validation: folktale.validation,
      Union: folktale.adt.union,

      isMonad(m) {
        if (_.Result &&_.isCallable(_.Result.hasInstance) && _.Result.hasInstance(m)) return true;
        if (_.Maybe && _.isCallable(_.Maybe.hasInstance) && _.Maybe.hasInstance(m)) return true;
        return false;
      },

      chainOrCall(m, f) {
        _.assert(_.isCallable(f));
        return _.isMonad(m) ? m.chain(f) : f.call(null, m);
      },
    },
    {
      //------------------------------------------------------------------------
      // Followings are platform-dependent

      assert() {
        const args = Object.freeze(Array.from(arguments));
        console.assert(args.length > 0);
        console.assert.apply(console, args);
        return args[0];
      },

      error() {
        const args = Object.freeze(Array.from(arguments));
        _.assert(args.length > 0);
        console.error.apply(console, args);
        return args[0];
      },

      debug() {
        const args_raw = Object.freeze(Array.from(arguments));
        _.assert(args_raw.length > 0);
        const args = _.saveStackTrace(args_raw, '_.debug():');
        console.debug.apply(console, args);
        return args[0];
      },

      log() {
        const args = Object.freeze(Array.from(arguments));
        _.assert(args.length > 0);
        console.log.apply(console, args);
        return args[0];
      },

      warn() {
        const args = Object.freeze(Array.from(arguments));
        _.assert(args.length > 0);
        console.warn.apply(console, args);
        return args[0];
      },

      querySelectorAll() {
        const args = Object.freeze(Array.from(arguments));
        _.assert(args.length === 1);
        const query = args[0];
        return document.querySelectorAll(query);
      },

      //------------------------------------------------------------------------
      // Followings are platform-independent

      querySelector() {
        const args = Object.freeze(Array.from(arguments));
        _.assert(args.length === 1);
        const query = args[0];
        const results = _.querySelectorAll(query) || [];
        if (results.length !== 1) _.warn('querySelector(): failed (length=' + results.length + '): ' + query);
        return results[0];
      },

      assertEvery() {
        const args_raw = Object.freeze(Array.from(arguments));
        _.assert(args_raw.length > 0);
        const pred = args_raw[0];
        _.assert(_.isCallable(pred));
        const restArgs = _.saveStackTrace(_.slice(1)(args_raw), '_.assertEvery():');
        return function assertEveryHelper() {
          const args = Object.freeze(Array.from(arguments));
          _.assert(args.length === 1);
          const seq = args[0];
          _.assert(_.isSeq(seq));
          _.forEach((e) => _.assert.apply(null, [pred(e), e].concat(restArgs)))(seq);
          return seq;
        };
      },

      saveStackTrace() {
        const args = Object.freeze(Array.from(arguments));
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

      pipe() {
        const args = Object.freeze(Array.from(arguments));
        _.assert(args.length > 0);
        _.assert(args.every(_.isCallable));
        const first = args[0];
        const funcList = _.slice(1)(args);
        return function pipeHelper() {
          const args = Object.freeze(Array.from(arguments));
          const initialValue = (args.length === 1) ? _.chainOrCall(args[0], first) : first.apply(null, args);
          return funcList.reduce((acc, func) => _.chainOrCall(acc, func), initialValue);
        };
      },

      tap() {
        const args = Object.freeze(Array.from(arguments));
        const func = args[0];
        _.assert(_.isCallable(func));
        const restArgs = _.slice(1)(args);
        const stacktrace = _.saveStackTrace('_.tap():');
        return function tapHelper() {
          const args = Object.freeze(Array.from(arguments));
          _.assert(args.length === 1, args, stacktrace);
          const seq = args[0];
          _.assert(_.isSeq(seq), args, stacktrace);
          func.apply(null, [seq].concat(restArgs));
          return seq;
        };
      },

      tapDebug() {
        const args_raw = Object.freeze(Array.from(arguments));
        const args = [_.debug].concat(_.saveStackTrace(args_raw, '_.tapDebug():'));
        return _.tap.apply(null, args);
      },

      forEach() {
        const args = Object.freeze(Array.from(arguments));
        _.assert(args.length === 1);
        const func = args[0];
        _.assert(_.isCallable(func));
        const stacktrace = _.saveStackTrace('_.forEach():');
        return function forEachHelper() {
          const args = Object.freeze(Array.from(arguments));
          _.assert(args.length === 1, args, stacktrace);
          const seq = args[0];
          _.assert(_.isSeq(seq), args, stacktrace);
          Array.prototype.forEach.call(seq, func);
          return seq;
        };
      },

      filter() {
        const args = Object.freeze(Array.from(arguments));
        _.assert(args.length === 1);
        const func = args[0];
        _.assert(_.isCallable(func));
        const stacktrace = _.saveStackTrace('_.filter():');
        return function filterHelper() {
          const args = Object.freeze(Array.from(arguments));
          _.assert(args.length === 1, args, stacktrace);
          const seq = args[0];
          _.assert(_.isSeq(seq), args, stacktrace);
          return Object.freeze(Array.prototype.filter.call(seq, func));
        };
      },

      map() {
        const args = Object.freeze(Array.from(arguments));
        _.assert(args.length === 1);
        const func = args[0];
        _.assert(_.isCallable(func));
        const stacktrace = _.saveStackTrace('_.map():');
        return function mapHelper() {
          const args = Object.freeze(Array.from(arguments));
          _.assert(args.length === 1, args, stacktrace);
          const seq = args[0];
          _.assert(_.isSeq(seq), args, stacktrace);
          return Object.freeze(Array.prototype.map.call(seq, func));
        };
      },

      reduce() {
        const args = Object.freeze(Array.from(arguments));
        _.assert(args.length === 1 || args.length === 2);
        const hasInitialValue = args.length === 2;
        const func = args[0];
        _.assert(_.isCallable(func));
        const initialValue = hasInitialValue && args[1];
        const stacktrace = _.saveStackTrace('_.reduce():');
        return function reduceHelper() {
          const args = Object.freeze(Array.from(arguments));
          _.assert(args.length === 1, args, stacktrace);
          const seq = args[0];
          _.assert(_.isSeq(seq), args, stacktrace);
          if (hasInitialValue) return Array.prototype.reduce.call(seq, func, initialValue);
          return Array.prototype.reduce.call(seq, func);
        };
      },

      reduceRight() {
        const args = Object.freeze(Array.from(arguments));
        _.assert(args.length === 1 || args.length === 2);
        const hasInitialValue = args.length === 2;
        const func = args[0];
        _.assert(_.isCallable(func));
        const initialValue = hasInitialValue && args[1];
        const stacktrace = _.saveStackTrace('_.reduceRight():');
        return function reduceRightHelper() {
          const args = Object.freeze(Array.from(arguments));
          _.assert(args.length === 1, args, stacktrace);
          const seq = args[0];
          _.assert(_.isSeq(seq), args, stacktrace);
          if (hasInitialValue) return Array.prototype.reduceRight.call(seq, func, initialValue);
          return Array.prototype.reduceRight.call(seq, func);
        };
      },

      slice() {
        const args0 = Object.freeze(Array.from(arguments));
        _.assert(args0.length < 3);
        const stacktrace = _.saveStackTrace('_.slice():');
        return function sliceHelper() {
          const args = Object.freeze(Array.from(arguments));
          _.assert(args.length === 1, args, stacktrace);
          const seq = args[0];
          _.assert(_.isSeq(seq), args, stacktrace);
          return Object.freeze(Array.prototype.slice.apply(seq, args0));
        };
      },

      last() {
        const args = Object.freeze(Array.from(arguments));
        _.assert(args.length === 1);
        const stacktrace = _.saveStackTrace('_.last():');
        return function lastHelper() {
          const args = Object.freeze(Array.from(arguments));
          _.assert(args.length === 1, args, stacktrace);
          const seq = args[0];
          _.assert(_.isSeq(seq), args, stacktrace);
          if (seq.length === 0) return undefined;
          return seq[seq.length - 1];
        };
      },

      chunk() { // curried version of https://lodash.com/docs/#chunk
        const args = Object.freeze(Array.from(arguments));
        _.assert(args.length < 2);
        const size = (args.length === 0) ? 1 : args[1];
        _.assert(typeof size === 'number');
        _.assert(size > 0);
        return _.recude((acc, x, i, self) => (i % size === 0) ? [].concat(acc, [_.slice(i, i+size)(self)]) : acc, []);
      },

      fromPairs() { // see http://folktale.origamitower.com/api/v2.1.0/en/folktale.core.object.from-pairs.frompairs.html
        const args = Object.freeze(Array.from(arguments));
        _.assertEvery(_.isSeq)(args);
        _.assertEvery(x => x.length === 2)(args);
        return _.reduce((acc, x) => Object.defineProperty(acc, x[0], {value: x[1], enumerable: true}), {})(args);
      },

      seq2obj() {
        const args = Object.freeze(Array.from(arguments));
        if (args.length === 0) return {};
        if (args.length === 1) {
          _.assert(_.isSeq(args[0]));
          return _.seq2obj.apply(null, args);
        }
        _.assert(args.length % 2 === 0);
        return _.fromPairs(_.chunk(2)(args));
      },

      toSeq() { // flatten
        const args = Object.freeze(Array.from(arguments));
        _.assert(args.length > 0);
        if (args.length > 1) return Object.freeze(Array.prototype.concat.apply([], args.map(x => _.toSeq(x))));
        if (! _.isSeq(args[0])) return args;
        if (Array.isArray(args[0])) return args[0];
        return Object.freeze(Array.from(args[0]));
      },

      isSeq() {
        const args = Object.freeze(Array.from(arguments));
        _.assert(args.length > 0); // allow to be called by Array.prorotype.filter()
        const arg = args[0];
        return arg && typeof arg.length === 'number' && arg.length >= 0;
      },

      isCallable() {
        const args = Object.freeze(Array.from(arguments));
        _.assert(args.length > 0); // allow to be called by Array.prorotype.filter()
        const arg = args[0];
        return arg && arg.call && arg.call.call && arg.apply && arg.apply.apply;
      },

      indirectCall() {
        const args = Object.freeze(Array.from(arguments));
        _.assert(0 < args.length && args.length < 3);
        const table = args[0];
        _.assert(table instanceof Object);
        const keygen = (args.length === 1) ? _.identity : args[1];
        _.assert(_.isCallable(keygen));
        const stacktrace = _.saveStackTrace('_.indirectCall():');
        return function indirectCallHelper() {
          const args = Object.freeze(Array.from(arguments));
          _.assert(args.length > 0, args, stacktrace);
          const func = table[keygen.apply(null, args)];
          if (func === undefined) return undefined;
          _.assert(_.isCallable(func), func, args, table, stacktrace);
          return func.apply(null, args);
        };
      },

      identity() {
        const args = Object.freeze(Array.from(arguments));
        _.assert(args.length > 0); // allow to be called by Array.prorotype.filter()
        return args[0];
      },

    },
  );

  Object.freeze(_);

  window.addEventListener('load', () => func(_));

})((_) => {
  'use strict';

  function getConfig() {
    const table = {
      INPUT: (e) => e.checked,
      SELECT: (e) => e.value,
    };

    const extract = _.pipe(
      _.toSeq,
      _.tapDebug(),
      _.assertEvery(_.identity),
      _.assertEvery(e => typeof e.nodeName === 'string'),
      _.map(e => ({e: e, f: table[e.nodeName.toUpperCase()]})),
      _.tapDebug(),
      _.filter(x => x.f),
      _.tapDebug(),
      _.assertEvery(x => typeof x.e.id === 'string' && x.e.id.length > 0),
      _.reduce((acc, x) => (acc[x.e.id] = x.f(x.e), acc), {}),
      Object.freeze,
    );

    return extract(_.querySelector('nav').childNodes);
  }

  const config = getConfig();
  _.debug(config);
  _.debug(config.GlobalSwitch);
  _.debug('==================================================');
  _.debug(_.toSeq(1,2,3));
  _.debug(_.toSeq([1,2,3]));
  _.debug(_.toSeq([1,2,3], [4,5,6], [7,8,9]));
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
  const ddd = _.pipe(_.identity, (x) => x + x, _.identity)(ccc);
  _.log(ddd);
  _.log(_.Result.hasInstance(ddd));
  const eee = ddd.chain(_.identity);
  _.log(eee);
  _.log(eee.getOrElse('error detected'));
});
