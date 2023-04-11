import { Request, Response } from 'express';
import { CONFIG, VERSION } from '@src/config';
import { RAM } from '@src/utils';
import { NftService } from '@src/services';

const Nft = () => {
  const { getUsers } = NftService();

  const getNftUsers = async (req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      const user = req.params.user;
      const results: any = await getUsers(user);

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

  return { getNftUsers };
};

export default Nft;
