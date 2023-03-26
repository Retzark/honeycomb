import { Base64Utils } from '@src/utils';

const Coin = () => {
  const coinCheck = (state: any) => {
    let supply = 0;
    let lbal = 0;
    for (const bal in state.balances) {
      supply += state.balances[bal];
      lbal += state.balances[bal];
    }
    let cbal = 0;
    for (const bal in state.cbalances) {
      supply += state.cbalances[bal];
      cbal += state.cbalances[bal];
    }
    var gov = 0,
      govt = 0;
    var con = 0;
    for (const user in state.contracts) {
      for (const contract in state.contracts[user]) {
        if (
          state.contracts[user][contract].amount &&
          !state.contracts[user][contract].buyer &&
          (state.contracts[user][contract].type == 'hive:sell' ||
            state.contracts[user][contract].type == 'hbd:sell')
        ) {
          supply += state.contracts[user][contract].amount;
          con += state.contracts[user][contract].amount;
        }
      }
    }
    let coll = 0;
    for (const user in state.col) {
      supply += state.col[user];
      coll += state.col[user];
    }
    let div = 0;
    for (const user in state.div) {
      supply += state.div[user].b;
      div += state.div[user].b;
    }
    try {
      govt = state.gov.t - coll;
    } catch (e) { }
    for (const bal in state.gov) {
      if (bal != 't') {
        supply += state.gov[bal];
        gov += state.gov[bal];
      }
    }
    console.log(Object.keys(state));
    var pow = 0,
      powt = state.pow.t;
    for (const bal in state.pow) {
      if (bal != 't') {
        supply += state.pow[bal];
        pow += state.pow[bal];
      }
    }
    var ah = 0;
    for (const item in state.ah) {
      ah += state.ah[item].b || 0;
      supply += state.ah[item].b || 0;
    }
    var am = 0;
    for (const item in state.am) {
      am += state.am[item].b || 0;
      supply += state.am[item].b || 0;
    }
    var bond = 0;
    for (const item in state.sets) {
      const it =
        state.sets[item].b *
        (Base64Utils.toNumber(state.sets[item].m) -
          Base64Utils.toNumber(state.sets[item].o) -
          (state.sets[item].d || 0) +
          1);
      bond += it;
      supply += it;
    }

    let info = {};
    let check = `supply check:state:${state.stats.tokenSupply
      } vs check: ${supply}: ${state.stats.tokenSupply - supply}`;
    if (state.stats.tokenSupply != supply) {
      info = { lbal, gov, govt, pow, powt, con, ah, am, bond, div };
    } else {
      info = {
        liquid_supply:
          lbal -
          state.balances.rc -
          state.balances.ra -
          state.balances.rm -
          state.balances.rn -
          state.balances.ri,
        locked_gov: govt,
        locked_pow: powt,
        in_contracts: con,
        in_auctions: ah,
        in_market: am,
        in_NFTS: bond,
        in_dividends: div,
        in_claims: cbal,
      };
    }
    return { check, info, supply };
  };

  return { coinCheck };
};

export default Coin;
