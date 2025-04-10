import { Request, Response } from 'express';
import { CONFIG, VERSION } from '@src/config';
import { store } from 'src';
import { RAM } from '@src/utils';
import { HiveService } from '@src/services';

const Root = () => {
  const { fetchHive } = HiveService();

  const Start = async () => {
    try {
      await fetchHive();
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const getRoot = async (_req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      store.get(['stats'], (err: any, obj: any) => {
        const stats = obj;
        res.send(
          JSON.stringify(
            {
              result: stats,
              head_block: RAM.head,
              behind: RAM.behind,
              node: CONFIG.username,
              VERSION,
              realtime: stats.realtime,
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

  return { Start, getRoot };
};

export default Root;
