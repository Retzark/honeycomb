export type BlockArgs = {
  ops: string[];
  root: string;
  prev_root: string;
  chain: string[];
};

export type RamArgs = {
  lastUpdate: number;
  Hive: string;
  behind: number;
  head: number;
  hiveDyn: any;
};

export type PlasmaArgs = {
  id?: number;
  consensus: string;
  pending: object;
  page: any;
  hashLastIBlock: number;
  hashSecIBlock: number;
  hashBlock: any;
};

export type StartingBlockArgs = {
  startingBlock: number;
};

export type UserResponse = {
  balance: number;
  claim: number;
  poweredUp: number;
  granted: any;
  granting: any;
  heldCollateral: number;
  contracts: any;
  up: any;
  down: any;
  power_downs: any;
  gov: any;
  tick: string;
};

export type ProcessArgs = {
  processor: any;
};

export type DexInfoArgs = {
  hive: {
    low: number;
    bv: string;
    tv: string;
    high: number;
    bid: number;
    ask: number;
  };
  hbd: {
    low: number;
    high: number;
    bv: number;
    tv: number;
    bid: number;
    ask: number;
  };
};

export type OrderBookArgs = {
  timestamp: number;
  bids: any[];
  asks: any[];
  ticker_id: string;
};
