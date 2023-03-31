import { Request } from 'express';
import { CONFIG } from '@src/config';
import { store } from 'src';
import { RAM } from '@src/utils';
import { PathService } from '.';

const User = () => {
  const { getPathObj } = PathService();

  const user = (req: Request) => {
    let un = req.params.un,
      bal = getPathNum(['balances', un]),
      cbal = getPathNum(['cbalances', un]),
      claims = getPathObj(['claims', un]),
      pb = getPathNum(['pow', un]),
      lp = getPathNum(['granted', un, 't']),
      lg = getPathNum(['granting', un, 't']),
      contracts = getPathObj(['contracts', un]),
      incol = getPathNum(['col', un]), //collateral
      gp = getPathNum(['gov', un]),
      powdown = getPathObj(['powd', un]),
      pup = getPathObj(['up', un]),
      pdown = getPathObj(['down', un]),
      chron = getPathObj(['chrono']),
      tick = getPathObj(['dex', 'hive', 'tick']);

    Promise.all([
      bal,
      pb,
      lp,
      contracts,
      incol,
      gp,
      pup,
      pdown,
      lg,
      cbal,
      claims,
      tick,
      chron,
      powdown,
    ])
      .then((v: any) => {
        const arr = [];

        for (const i in v[3]) {
          const c = v[3][i];
          if (c.partial) {
            c.partials = [];
            for (const p in c.partial) {
              const j = c.partial[p];
              j.txid = p;
              c.partials.push(j);
            }
          }
          arr.push(c);
        }

        const power_downs = v[13];

        if (power_downs) {
          for (const pd in power_downs) {
            power_downs[pd] = v[12][pd];
          }
        }

        return {
          balance: v[0],
          claim: v[9],
          poweredUp: v[1],
          granted: v[2],
          granting: v[8],
          heldCollateral: v[4],
          contracts: arr,
          up: v[6],
          down: v[7],
          power_downs,
          gov: v[5],
          tick: v[11],
          node: CONFIG.username,
          behind: RAM.behind,
        };
      })
      .catch(function (err) {
        console.log(err);
      });

    return {
      balance: 0,
      claim: 0,
      poweredUp: 0,
      granted: {},
      granting: {},
      heldCollateral: 0,
      contracts: [],
      up: {},
      down: {},
      power_downs: {},
      gov: 0,
      tick: '',
    };
  };

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

  return { user };
};

export default User;
