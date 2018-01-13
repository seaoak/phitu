;(function(func) {
  'use strict';

  const myglobal = {
    querySelectorAll(query) {
      return document.querySelectorAll(query);
    }
  };

  Object.freeze(myglobal);

  window.addEventListener('load', () => func(myglobal));

})((myglobal) => {
  'use strict';

  function sasicaeMain() {
    const replacement = myglobal.querySelectorAll('#Replacement')[0].innerHTML;
    const target = myglobal.querySelectorAll('#TargetParagraph')[0];
    const original = target.innerHTML;
    let isReplaced = false;
    setInterval(() => {
      target.innerHTML = (isReplaced = ! isReplaced) ? replacement : original;
    }, 5000);
  }

  sasicaeMain();
});
