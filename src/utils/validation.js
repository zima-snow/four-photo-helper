export const isValidURL = (string) => {
  const res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  return (res !== null);
};

export const testImage = (url, timeoutT) => {
  return new Promise((resolve, reject) => {
      const timeout = timeoutT || 5000;
      let timer;
      const img = new Image();

      img.onerror = img.onabort = () => {
        clearTimeout(timer);
        reject('error');
      };

      img.onload = () => {
        clearTimeout(timer);
        resolve('success');
      };

      timer = setTimeout(() => {
          img.src = '//!!!!/test.jpg';
          reject('timeout');
      }, timeout);
      img.src = url;
  });
}
