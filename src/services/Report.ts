import { CONFIG } from '@src/config';
import { store } from '..';
import { IpfsService } from '.';

const Report = () => {
  const { ipfsPeerConnect } = IpfsService();

  const getReport = async (json: any, from: any, active: any, pc: any) => {
    store.get(['markets', 'node', from], function (e, a) {
      if (!e) {
        var b = a;
        if (from == b.self && active) {
          b.report = json;
          delete b.report.timestamp;
          var ops = [{ type: 'put', path: ['markets', 'node', from], data: b }];
          if (json.ipfs_id && CONFIG.ipfshost == 'ipfs')
            ipfsPeerConnect(json.ipfs_id);
          if (process.env.npm_lifecycle_event == 'test') pc[2] = ops;
          store.batch(ops, pc);
        } else {
          pc[0](pc[2]);
        }
      } else {
        pc[0](pc[2]);
        console.log(e);
      }
    });
  };

  return { getReport };
};

export default Report;
