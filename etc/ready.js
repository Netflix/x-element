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
