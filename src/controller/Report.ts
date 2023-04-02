import { Request, Response } from 'express';
import { CONFIG, VERSION } from '@src/config';
import { RAM } from '@src/utils';
import { store } from '..';

const Report = () => {
  const getReport = (req: Request, res: Response) => {
    try {
      let un = req.params.un;

      res.setHeader('Content-Type', 'application/json');

      store.get(['markets', 'node', un, 'report'], (_err, obj) => {
        const report = obj;
        res.send(
          JSON.stringify(
            {
              [un]: report,
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

  return { getReport };
};

export default Report;
