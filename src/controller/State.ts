import { Request, Response } from 'express';
import decodeURIcomponent from 'decode-uri-component';
import { VERSION, CONFIG } from 'src/config';
import { PLASMA, RAM, nodeOpsUtils } from '@src/utils';
import { HiveService } from '@src/services';
import { store } from '..';

const State = () => {
  const { GetNodeOps } = nodeOpsUtils();
  const { fetchWrap, fetchPic, fetchBlog } = HiveService();

  const getState = async (req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      let state = {};

      store.get([], (_err, obj) => {
        (state = obj),
          res.send(
            JSON.stringify(
              {
                state,
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

  const getPending = async (_req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      const result = {
        nodeOps: GetNodeOps(),
        plasma: PLASMA,
      };

      res.send(JSON.stringify(result, null, 3));
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const getWrap = async (req: Request, res: Response) => {
    try {
      let method: string =
        (req.query.method as unknown as string) ||
        'condenser_api.get_discussions_by_blog';
      method.replace('%27', '');
      let parms = (req.query.params as unknown as string) || '';

      let iparams = parms
        ? JSON.parse(
            decodeURIcomponent(parms.replace('%27', '').replace('%2522', '%22'))
          )
        : '';

      switch (method) {
        case 'tags_api.get_discussions_by_blog':
        default:
          iparams = {
            tag: iparams[0],
          };
      }
      let params = iparams || { tag: 'robotolux' };
      res.setHeader('Content-Type', 'application/json');

      const body = {
        jsonrpc: '2.0',
        method,
        params,
        id: 1,
      };

      const results = await fetchWrap(body);

      res.send(JSON.stringify(results, null, 3));
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const getPic = async (req: Request, res: Response) => {
    try {
      const un = req.params.un || '';

      const body = {
        jsonrpc: '2.0',
        method: 'condenser_api.get_accounts',
        params: [[un]],
        id: 1,
      };

      fetchPic(body, res);
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const getStateBlog = async (req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      let un = req.params.un;
      let start: number = (req.query.s as unknown as number) || 0;

      const results = await fetchBlog({ un, start });

      res.send(JSON.stringify(results, null, 3));
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  return { getState, getPending, getWrap, getPic, getStateBlog };
};

export default State;
