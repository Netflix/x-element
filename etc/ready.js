/**
 * Await document completeness. Will likely be replaced by built-in apis.
 * Check out https://github.com/Netflix/x-element/issues/65 for details.
 * @param {Document} target
 * @returns {Promise<any>}
 */
const ready = target => {
  return new Promise(resolve => {
    if (target.readyState === 'complete') {
      resolve(target);
    } else {
      const handle = evt => {
        if (evt.target.readyState === 'complete') {
          target.removeEventListener('readystatechange', handle);
          resolve(target);
        }
      };
      target.addEventListener('readystatechange', handle);
    }
  });
};

export default ready;
