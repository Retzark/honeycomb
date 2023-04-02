import { Request, Response } from 'express';
import { CONFIG, VERSION } from '@src/config';
import { RAM } from '@src/utils';
import { store } from '..';

const Queue = () => {
  const getQueue = (_req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      store.get(['queue'], (_err, obj) => {
        const queue = obj;
        res.send(
          JSON.stringify(
            {
              queue,
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

  return { getQueue };
};

export default Queue;
