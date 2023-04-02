import { Request, Response } from 'express';
import { CONFIG, VERSION } from '@src/config';
import { PathService } from '@src/services';
import { RAM } from '@src/utils';

const Markets = () => {
  const { getPathObj } = PathService();

  const getMarkets = async (_req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      const markets = getPathObj(['markets']);
      const stats = getPathObj(['stats']);

      Promise.all([markets, stats])
        .then((v) => {
          res.send(
            JSON.stringify(
              {
                markets: v[0],
                stats: v[1],
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

  return { getMarkets, getMirrors };
};

export default Markets;
