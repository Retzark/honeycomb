import { CONFIG } from '@src/config';
const hiveClient = require('@hiveio/hive-js');

const Hive = {
  getOwners: (account: string | string[]) => {
    return new Promise((resolve, reject) => {
      hiveClient.api.setOptions({ url: CONFIG.startURL });
      hiveClient.api.getAccounts(
        [account],
        (err: any, result: { active: { account_auths: unknown } }[]) => {
          hiveClient.api.setOptions({ url: CONFIG.clientURL });
          if (err) reject(err);
          else resolve(result[0].active.account_auths);
        }
      );
    });
  },
  getAccounts: (accounts: string | string[]) => {
    return new Promise((resolve, reject) => {
      hiveClient.api.setOptions({ url: CONFIG.startURL });
      hiveClient.api.getAccounts(accounts, (err: any, result: unknown) => {
        hiveClient.api.setOptions({ url: CONFIG.clientURL });
        if (err) reject(err);
        else resolve(result);
      });
    });
  },
  getRecentReport: (account: any, walletOperationsBitmask: any) => {
    return new Promise((resolve, reject) => {
      hiveClient.api.setOptions({ url: CONFIG.startURL });
      hiveClient.api.getAccountHistory(
        account,
        -1,
        100,
        ...walletOperationsBitmask,
        (err: any, result: any[]) => {
          hiveClient.api.setOptions({ url: CONFIG.clientURL });
          if (err) reject(err);
          let ebus = result.filter(
              (tx) => tx[1].op[1].id === `${CONFIG.prefix}report`
            ),
            recents = [];
          for (let i = ebus.length - 1; i >= 0; i--) {
            if (
              JSON.parse(ebus[i][1].op[1].json).hash &&
              parseInt(JSON.parse(ebus[i][1].op[1].json).block) >
                parseInt(CONFIG.override)
            ) {
              recents.push([
                JSON.parse(ebus[i][1].op[1].json).hash,
                JSON.parse(ebus[i][1].op[1].json).block,
              ]);
            }
          }
          resolve(recents.shift());
        }
      );
    });
  },
};

export default Hive;
