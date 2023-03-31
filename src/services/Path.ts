import { store } from 'src';

const Path = () => {
  const getPathNum = (path: string[]) => {
    return new Promise(function (resolve, reject) {
      store.get(path, function (err, obj) {
        if (err) {
          reject(err);
        } else {
          if (typeof obj != 'number') {
            resolve(0);
          } else {
            resolve(obj);
          }
        }
      });
    });
  };

  const getPathObj = (path: string[]) => {
    return new Promise(function (resolve, reject) {
      store.get(path, function (err, obj) {
        if (err) {
          resolve({});
          reject(err);
        } else {
          resolve(obj);
        }
      });
    });
  };

  return { getPathNum, getPathObj };
};

export default Path;
