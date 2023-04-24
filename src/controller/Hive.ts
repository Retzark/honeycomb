import { Request, Response } from 'express';
import { CONFIG, VERSION } from '@src/config';
import { store } from 'src';
import { RAM } from '@src/utils';
import { HiveService } from '@src/services';

const Hive = () => {
  const { fetchHiveAPI } = HiveService();

  const getHiveAPI = async (req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      let method =
        `${req.params.api_type}.${req.params.api_call}` ||
        'condenser_api.get_discussions_by_blog';
      let params: any = {};
      let array = false;

      for (const param in req.query) {
        if (param === '0') {
          array = true;
          break;
        }
        params[param] = req.query[param];
      }

      if (array) {
        params = [];
        for (const param in req.query) {
          params.push(req.query[param]);
        }
        params = [params];
      }

      switch (req.params.api_call) {
        case 'get_content':
          params = [params.author, params.permlink];
          break;
        case 'get_content_replies':
          params = [params.author, params.permlink];
          break;
        case 'get_dynamic_global_properties':
          params = [];
          break;
        default:
      }

      const body = {
        jsonrpc: '2.0',
        method,
        params,
        id: 1,
      };

      const results = await fetchHiveAPI(body);

      res.send(JSON.stringify(results, null, 3));
    } catch (error) {
      console.log('Error: ', error);
    }
  };
  return { getHiveAPI };
};

export default Hive;
