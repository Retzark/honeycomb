import { Request, Response } from 'express';
import { CONFIG, VERSION } from '@src/config';
import { RAM } from '@src/utils';
import { NftService } from '@src/services';

const Nft = () => {
  const {
    findUsers,
    findItems,
    findSets,
    findSet,
    findAuctions,
    findMintAuctions,
    findSales,
    findMintSales,
    findMintSupply,
    findPfpUser,
    findTrades,
  } = NftService();

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
      const setname = req.params.set;

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
      const from = req.params.set;

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

  const getMintAuctions = async (req: Request, res: Response) => {
    try {
      const from = req.params.set;

      res.setHeader('Content-Type', 'application/json');

      const results: any = await findMintAuctions(from);

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

  const getSales = async (req: Request, res: Response) => {
    try {
      const from = req.params.set;

      res.setHeader('Content-Type', 'application/json');

      const results: any = await findSales(from);

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

  const getMintSales = async (req: Request, res: Response) => {
    try {
      const from = req.params.set;

      res.setHeader('Content-Type', 'application/json');

      const results: any = await findMintSales(from);

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

  const getMintSupply = async (req: Request, res: Response) => {
    try {
      const from = req.params.set;

      res.setHeader('Content-Type', 'application/json');

      const results: any = await findMintSupply(from);

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

  const getPfpUser = async (req: Request, res: Response) => {
    try {
      const user = req.params.user;

      res.setHeader('Content-Type', 'application/json');

      const results: any = await findPfpUser(user);

      if (results.isSuccess) {
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
      } else {
        res.send(
          JSON.stringify(
            {
              result: results.msg,
              error: results.error,
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

  const getTrades = async (req: Request, res: Response) => {
    try {
      const user = req.params.user;
      const kind = req.params.kind;

      res.setHeader('Content-Type', 'application/json');

      const results: any = await findTrades(user, kind);

      res.send(
        JSON.stringify(
          {
            results,
            kind,
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

  return {
    getNftUsers,
    getItems,
    getSets,
    getSet,
    getAuctions,
    getMintAuctions,
    getSales,
    getMintSales,
    getMintSupply,
    getPfpUser,
    getTrades,
  };
};

export default Nft;
