import { Request, Response } from 'express';
import { CONFIG, VERSION } from '@src/config';
import { RAM, alphabeticShift } from '@src/utils';
import { store } from '..';
import { PobService } from '@src/services';

const Pob = () => {
  const {
    findAuthorPosts,
    findPost,
    findNewPosts,
    findTrendingPosts,
    findPromotedPosts,
    findPostAuthorPermlink,
  } = PobService();

  const getBlog = async (req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      const un = req.params.un;

      let unn = alphabeticShift(un);

      store.someChildren(
        ['posts'],
        {
          gte: un,
          lte: unn,
        },
        (e: any, a: any) => {
          let obj: any = {};

          for (const p in a) {
            obj[a] = p[a];
          }

          res.send(
            JSON.stringify(
              {
                blog: obj,
                node: CONFIG.username,
                behind: RAM.behind,
                VERSION,
              },
              null,
              3
            )
          );
        }
      );
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const getAuthorPost = async (req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      const author = req.params.author;

      let amt = parseInt(req.query.a as string);
      let off = parseInt(req.query.o as string);

      if (amt < 1) {
        amt = 50;
      } else if (amt > 100) {
        amt = 100;
      }

      if (off < 0) {
        off = 0;
      }

      findAuthorPosts(author, amt, off)
        .then((r: any) => {
          res.send(
            JSON.stringify(
              {
                result: r,
                node: CONFIG.username,
                behind: RAM.behind,
                VERSION,
              },
              null,
              3
            )
          );
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const getPost = async (req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      const permlink = req.params.permlink;
      const author = req.params.author;

      const results = await findPost(author, permlink);

      res.send(
        JSON.stringify(
          {
            result: results,
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

  const getNewPosts = async (req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      const reqAmt = parseInt(req.query.a as string);
      const reqOff = parseInt(req.query.o as string);

      const amt = reqAmt < 1 ? 50 : 100;
      const off = reqOff < 0 ? 0 : reqOff;

      const results = await findNewPosts(amt, off);

      res.send(
        JSON.stringify(
          {
            result: results,
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

  const getTrendingPosts = async (req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      const reqAmt = parseInt(req.query.a as string);
      const reqOff = parseInt(req.query.o as string);

      const amt = reqAmt < 1 ? 50 : 100;
      const off = reqOff < 0 ? 0 : reqOff;

      const results = await findTrendingPosts(amt, off);

      res.send(
        JSON.stringify(
          {
            result: results,
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

  const getPromotedPosts = async (req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      const reqAmt = parseInt(req.query.a as string);
      const reqOff = parseInt(req.query.o as string);

      const amt = reqAmt < 1 ? 50 : 100;
      const off = reqOff < 0 ? 0 : reqOff;

      const results = await findPromotedPosts(amt, off);

      res.send(
        JSON.stringify(
          {
            result: results,
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

  const getPostAuthorPermlink = async (req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      const author = req.params.author;
      const permlink = req.params.permlink;

      const results = await findPostAuthorPermlink(author, permlink);

      res.send(
        JSON.stringify(
          {
            now: results?.now || '',
            arch: results?.arch || '',
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
    getBlog,
    getAuthorPost,
    getPost,
    getNewPosts,
    getTrendingPosts,
    getPromotedPosts,
    getPostAuthorPermlink,
  };
};

export default Pob;
