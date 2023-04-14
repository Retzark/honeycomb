import { Request, Response } from 'express';
import { CONFIG, VERSION } from '@src/config';
import { RAM } from '@src/utils';
import { NftService } from '@src/services';

const Nft = () => {
  const { findUsers, findItems, findSets, findSet, findAuctions } =
    NftService();

  const getNftUsers = async (req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      const user = req.params.user;
      const results: any = await findUsers(user);

      res.send(
        JSON.stringify(
          {
            results: results.data,
            mint_tokens: results.mint_tokens,
            user,
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

  const getItems = async (req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      const itemname = req.params.item || ':';
      const setname = req.params.set || ':';

      const results: any = await findItems(setname, itemname);

      if (results?.isSuccess) {
        res.send(
          JSON.stringify(
            {
              item: results.item,
              set: results.set,
              node: CONFIG.username,
              behind: RAM.behind,
              VERSION,
            },
            null,
            3
          )
        );
      } else {
        res.send(
          JSON.stringify(
            {
              item: 'Not Found',
              node: CONFIG.username,
              behind: RAM.behind,
              VERSION,
            },
            null,
            3
          )
        );
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const getSets = async (_req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      const results: any = await findSets();

      if (results.length > 0) {
        res.send(
          JSON.stringify(
            {
              results,
              node: CONFIG.username,
              behind: RAM.behind,
              VERSION,
            },
            null,
            3
          )
        );
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const getSet = async (req: Request, res: Response) => {
    try {
      let setname = req.params.set;

      res.setHeader('Content-Type', 'application/json');

      const results: any = await findSet(setname);

      if (results.isSuccess) {
        res.send(
          JSON.stringify(
            {
              result: results.item,
              set: results.set,
              node: CONFIG.username,
              behind: RAM.behind,
              VERSION,
            },
            null,
            3
          )
        );
      } else {
        res.send(
          JSON.stringify(
            {
              result: 'Not Found',
              set: {},
              node: CONFIG.username,
              behind: RAM.behind,
              VERSION,
            },
            null,
            3
          )
        );
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const getAuctions = async (req: Request, res: Response) => {
    try {
      let from = req.params.set;

      res.setHeader('Content-Type', 'application/json');

      const results: any = await findAuctions(from);

      res.send(
        JSON.stringify(
          {
            results,
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

  return { getNftUsers, getItems, getSets, getSet, getAuctions };
};

export default Nft;
