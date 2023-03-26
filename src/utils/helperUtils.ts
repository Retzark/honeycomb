import { BlockArgs, PlasmaArgs, RamArgs, StartingBlockArgs } from 'types';
import { store } from '..';

const status: any = {
  cleaner: [],
};

export const PROCESSOR: any = ''

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
