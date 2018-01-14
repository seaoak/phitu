;(function(func) {
  'use strict';

  const myglobal = {
    warn() {
      console.log.apply(console, arguments);
    },

    querySelectorAll(query) {
      return document.querySelectorAll(query);
    },

    //========================================================================
    // followings are independent from the platform
    //========================================================================

    querySelector(query) {
      const results = myglobal.querySelectorAll(query) || [];
      if (results.length !== 1) myglobal.warn('querySelector(): failed (length=' + results.length + '): ' + query);
      return results[0];
    },
  };

  Object.freeze(myglobal);

  window.addEventListener('load', () => func(myglobal));

})((myglobal) => {
  'use strict';

  function sasicaeMain() {
    const replacement = myglobal.querySelector('#Replacement').innerHTML;
    const target = myglobal.querySelector('#TargetParagraph');
    const original = target.innerHTML;
    let isReplaced = false;
    setInterval(() => {
      target.innerHTML = (isReplaced = ! isReplaced) ? replacement : original;
    }, 5000);
  }

  sasicaeMain();
});
