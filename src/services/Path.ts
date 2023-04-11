import { store } from 'src';

const Path = () => {
  const getPathNum = (path: string[]) => {
    return new Promise((resolve, reject) => {
      store.get(path, (err, obj) => {
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
    return new Promise((resolve, _reject) => {
      store.get(path, (err, obj) => {
        if (err) {
          resolve({});
        } else {
          resolve(obj);
        }
      });
    });
  };

  return { getPathNum, getPathObj };
};

export default Path;
