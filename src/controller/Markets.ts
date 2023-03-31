import { Request, Response } from 'express';
import { CONFIG, VERSION } from '@src/config';
import { RAM } from '@src/utils';
import { PathService } from '@src/services';

const Markets = () => {
  const { getPathObj } = PathService();

  const getMirrors = async (_req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      const nodes = getPathObj(['markets', 'node']);
      const queue = getPathObj(['queue']);

      Promise.all([nodes, queue])
        .then((v: any) => {
          const apis = [];
          for (const node in v[1]) {
            apis.push({ api_url: v[0][node].domain, node });
          }

          res.send(
            JSON.stringify(
              {
                apis,
                node: CONFIG.username,
                behind: RAM.behind,
                VERSION,
              },
              null,
              3
            )
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  return { getMirrors };
};

export default Markets;
