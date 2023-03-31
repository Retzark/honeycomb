import { Request, Response } from 'express';
import { CONFIG, VERSION } from '@src/config';
import { store } from 'src';
import { RAM } from '@src/utils';
import { CoinService, HiveService, PathService } from '@src/services';

const Coin = () => {
  const { coinCheck } = CoinService();
  const { getPathObj } = PathService();
  const { fetchHive } = HiveService();

  const getCoin = async (_req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      store.get([], (err, obj) => {
        let info = coinCheck(obj);
        res.send(
          JSON.stringify(
            {
              check: info.check,
              info: info.info,
              node: CONFIG.username,
              behind: RAM.behind,
              VERSION,
            },
            null,
            3
          )
        );
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const getDetails = async (_req: Request, res: Response) => {
    try {
      const stats = getPathObj(['stats']);
      const hiveStats = fetchHive();

      res.setHeader('Content-Type', 'application/json');

      Promise.all([stats, hiveStats])
        .then((v: any) => {
          console.log(RAM.hiveDyn);
          const tokenSupply: string = (v[0].tokenSupply /
            1000) as unknown as string;
          const TOKEN: any = CONFIG.detail;
          TOKEN.incirc = parseFloat(tokenSupply).toFixed(3);
          const HIVE = {
              name: 'HIVE',
              symbol: 'HIVE',
              icon: 'https://www.dlux.io/img/hextacular.svg',
              supply: RAM.hiveDyn.virtual_supply,
              incirc: RAM.hiveDyn.current_supply,
              wp: `https://hive.io/whitepaper.pdf`,
              ws: `https://hive.io`,
              be: `https://hiveblockexplorer.com/`,
              text: `HIVE is a DPoS blockchain with free transactions and a method to post and rate content.`,
            },
            HBD = {
              name: 'Hive Backed Dollars',
              symbol: 'HBD',
              icon: 'https://www.dlux.io/img/hbd_green.svg',
              supply: 'Dynamic, up to 10% of HIVE Cap',
              incirc: RAM.hiveDyn.current_hbd_supply,
              wp: `https://hive.io/whitepaper.pdf`,
              ws: `https://hive.io`,
              be: `https://hiveblockexplorer.com/`,
              text: `Hive-backed dollars (HBD) are a unique type of trustless stablecoin that is backed by the underlying value of the Hive blockchain itself instead of external collateral or a centralized entity. HBD are pegged to value of USD. Staking HBD pays a variable APR, currently ${parseFloat(
                (RAM.hiveDyn.hbd_interest_rate / 100) as unknown as string
              ).toFixed(2)}%.`,
            };

          res.send(
            JSON.stringify(
              {
                coins: [TOKEN, HIVE, HBD],
                node: CONFIG.username,
                behind: RAM.behind,
                VERSION,
              },
              null,
              3
            )
          );
        })
        .catch(function (err) {
          console.log(err);
        });
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  return { getCoin, getDetails };
};

export default Coin;
