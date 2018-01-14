;(function(func) {
  'use strict';

  const _ = Object.assign({
    assert() {
      console.assert.apply(console, arguments);
    },

    error() {
      console.error.apply(console, arguments);
    },

    debug() {
      console.debug.apply(console, arguments);
    },

    log() {
      console.log.apply(console, arguments);
    },

    warn() {
      console.warn.apply(console, arguments);
    },

    querySelectorAll(query) {
      return document.querySelectorAll(query);
    },

    //------------------------------------------------------------------------
    // Followings are platform-independent

    querySelector(query) {
      const results = _.querySelectorAll(query) || [];
      if (results.length !== 1) _.warn('querySelector(): failed (length=' + results.length + '): ' + query);
      return results[0];
    },

    //------------------------------------------------------------------------
    // Followings are PURE functions

    pipe() {
      const funcList = Array.from(arguments);
      _.assert(funcList.length > 0);
      _.assert(funcList.every(_.identity));
      _.assert(funcList.every(_.isCallable));
      const first = funcList.shift();
      Object.freeze(funcList); // just in case
      return function pipeHelper() {
        const args = Array.from(arguments);
        const initialValue = (args.length === 1) ? _.chainOrCall(args[0], first) : first.apply(null, args);
        return funcList.reduce((acc, func) => _.chainOrCall(acc, func), initialValue);
      };
    },

    isCallable(arg) {
      return (arg && arg.call && arg.call.call && arg.apply && arg.apply.apply) ? true : false;
    },

  }, {
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
  }, folktale.fantasyLand, folktale.core.lambda);

  Object.freeze(_);

  window.addEventListener('load', () => func(_));

})((_) => {
  'use strict';

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
