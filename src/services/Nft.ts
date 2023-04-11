import { PathService } from '.';

const Nft = () => {
  const { getPathObj } = PathService();

  const getUsers = async (user: string) => {
    const userItems = getPathObj(['nfts', user]);
    const sets = getPathObj(['sets']);
    const mintItems = getPathObj(['rnfts']);

    return Promise.all([userItems, sets, mintItems])
      .then((mem: any) => {
        const data = [];
        const mint_tokens = [];

        for (const item in mem[0]) {
          const set = item.split(':')[0];
          data.push({
            uid: item.split(':')[1],
            info: mem[0][item].s,
            set,
            script: mem[1][set].s,
            type: mem[1][set].t,
            encoding: mem[1][set].e,
          });
        }

        for (const item in mem[2]) {
          if (mem[2][item][user]) {
            const set = item;
            console.log({ item });
            mint_tokens.push({
              qty: mem[2][item][user],
              set,
              script: mem[1][set].s,
              type: mem[1][set].t,
              encoding: mem[1][set].e,
            });
          }
        }

        return {
          data,
          mint_tokens,
        };
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { getUsers };
};

export default Nft;
