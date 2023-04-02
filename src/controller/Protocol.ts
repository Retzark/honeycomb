import { Request, Response } from 'express';
import { CONFIG, VERSION } from '@src/config';
import { RAM } from '@src/utils';
import { store } from '..';

const Protocol = () => {
  const getProtocol = async (_req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      store.get(['queue'], (_err, obj) => {
        const feed = obj;

        res.send(
          JSON.stringify(
            {
              feed,
              consensus: obj,
              prefix: CONFIG.prefix,
              node: CONFIG.username,
              multisig: CONFIG.msaccount,
              jsontoken: CONFIG.jsonTokenName,
              memoKey: CONFIG.msPubMemo,
              features: CONFIG.featuresModel,
              behind: RAM.behind,
              info: '/markets will return node information and published APIs for the consensus nodes, you may check these other APIs to ensure that the information in the API is in consensus.\nThe prefix is used to address this tokens architecture built on Hive.',
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

  return { getProtocol };
};

export default Protocol;
