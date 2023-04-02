import { Request, Response } from 'express';
import { CONFIG, VERSION } from '@src/config';
import { RAM, status } from '@src/utils';

const Status = () => {
  const getStatus = async (req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      const txid = req.params.txid;
      const history = (CONFIG.history as number) * 3;

      res.send(
        JSON.stringify(
          {
            txid,
            status:
              status[txid] ||
              `This TransactionID either has not yet been processed, or was missed by the system due to formatting errors. Wait 70 seconds and try again. This API only keeps these records for a maximum of ${history} seconds`,
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

  return { getStatus };
};

export default Status;
