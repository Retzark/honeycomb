import { Request, Response } from 'express';
import { VERSION, CONFIG } from 'src/config';
import { RAM } from '@src/utils';
import { store } from '..';

const State = () => {
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

  return { getState };
};

export default State;
