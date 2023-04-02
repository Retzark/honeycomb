import { Request, Response } from 'express';
import { UserService } from '@src/services';
import { VERSION, CONFIG } from 'src/config';
import { RAM } from '@src/utils';
import { UserResponse } from 'types';
import { store } from '..';

const User = () => {
  const { user } = UserService();

  const getUser = async (req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      const response: UserResponse = user(req);

      res.send(
        JSON.stringify(
          {
            balance: response.balance,
            claim: response.claim,
            poweredUp: response.poweredUp,
            granted: response.granted,
            granting: response.granting,
            heldCollateral: response.heldCollateral,
            contracts: response.contracts,
            up: response.up,
            down: response.down,
            power_downs: response.power_downs,
            gov: response.gov,
            tick: response.tick,
            node: CONFIG.username,
            behind: RAM.behind,
            VERSION,
          },
          null,
          3
        )
      );
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const getRunners = async (_req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      store.get(['runners'], (_err, obj) => {
        const runners = obj;
        const result = [];

        for (const a in runners) {
          const node = runners[a];
          node.account = a;
          result.push(node);
        }

        res.send(
          JSON.stringify(
            {
              result,
              runners,
              latest: [{ api: 'https://token.dlux.io' }],
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

  return { getUser, getRunners };
};

export default User;
