import { PathService } from '@src/services';
import { Hive } from './../application';
import { BlockArgs, PlasmaArgs, RamArgs, StartingBlockArgs } from 'types';
import { store } from '..';

export const status: any = {
  cleaner: [],
};

export let PROCCESS_STATE: { processor: any } = {
  processor: '',
};

export const arrToObjUtils = (arr: any) => {
  const obj: any = {};

  arr.forEach((el: any, idx: number) => {
    obj[idx] = el;
  });

  return obj;
};

export const BLOCK: BlockArgs = {
  ops: [],
  root: '',
  prev_root: '',
  chain: [],
};

export const RAM: RamArgs = {
  lastUpdate: 0,
  Hive: '',
  behind: 0,
  head: 0,
  hiveDyn: {},
};

export const TXIDUtils = {
  blocknumber: 0,
  saveNumber: 0,
  streaming: false,
  store: (msg: string, txid: string) => {
    try {
      status[txid.split(':')[1]] = msg;
      status.cleaner.push(txid);
    } catch (e) {
      console.log(e);
    }
  },
  getBlockNum: () => {
    return TXIDUtils.blocknumber;
  },
};

export const PLASMA: PlasmaArgs = {
  id: 0,
  consensus: '',
  pending: {},
  page: [],
  hashLastIBlock: 0,
  hashSecIBlock: 0,
  hashBlock: '',
};

export const STARTING_BLOCK: StartingBlockArgs = {
  startingBlock: 0,
};

export const unwrapOps = (arr: any) => {
  return new Promise((resolve, reject) => {
    var d = [];
    if (arr[arr.length - 1] !== 'W') arr.push('W');
    if (arr.length) write(0);
    else resolve([]);
    function write(int: any) {
      d = [];
      for (let i = int; i < arr.length; i++) {
        var e = arr[i];
        try {
          e = JSON.parse(e);
        } catch (e) {
          e = arr[i];
        }
        if (e == 'W' && i == arr.length - 1) {
          store.batch(d, [resolve, null, i + 1]);
          break;
        } else if (e == 'W') {
          store.batch(d, [write, null, i + 1]);
          break;
        } else d.push(e);
      }
    }
  });
};

let owners: any = {};

export const Owners = {
  is: (acc: string) => {
    if (owners[acc]) return 1;
    else return 0;
  },
  activeUpdate: (acc: string, key: any) => {
    delete owners[owners[acc]];
    owners[acc].key = key;
  },
  getKey: (acc: string) => {
    return owners[acc]?.key;
  },
  getAKey: (i = 0) => {
    return owners[Object.keys(owners)[i]]?.key;
  },
  numKeys: () => {
    return Object.keys(owners).length;
  },
  init: () => {
    const { getPathObj } = PathService();

    getPathObj(['stats', 'ms', 'active_account_auths']).then((auths: any) => {
      const q: string[] = [];

      for (const key in auths) {
        q.push(key);
      }

      Hive.getAccounts(q).then((r: any) => {
        owners = {};
        for (let i = 0; i < r.length; i++) {
          owners[r[i].name] = { key: r[i].active.key_auths[0][0] };
        }
      });
    });
  },
};

export const alphabeticShift = (inputString: string) => {
  const newString = [];

  for (let i = 0; i < inputString.length; i++) {
    if (i == inputString.length - 1) {
      newString.push(String.fromCharCode(inputString.charCodeAt(i) + 1));
    } else {
      newString.push(String.fromCharCode(inputString.charCodeAt(i)));
    }
  }

  return newString.join('');
};
