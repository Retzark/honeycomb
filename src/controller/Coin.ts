import { Request, Response } from 'express';
import { CONFIG, VERSION } from '@src/config';
import { store } from 'src';
import { RAM } from '@src/utils';
import { CoinService } from '@src/services';

const Coin = () => {
  const { coinCheck } = CoinService();

  const getCoin = async (_req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      store.get([], function (err, obj) {
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

  return { getCoin };
};

export default Coin;
