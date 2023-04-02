import { Request, Response } from 'express';
import { CONFIG, VERSION } from '@src/config';
import { RAM } from '@src/utils';
import { store } from '..';

const Feed = () => {
  const getFeed = (_req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      store.get(['feed'], (_err, obj) => {
        const feed = obj;

        res.send(
          JSON.stringify(
            {
              feed,
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

  return { getFeed };
};

export default Feed;
