import { CONFIG } from '@src/config';
import { Base64Utils } from '@src/utils';
import { PathService } from '.';
import { store } from '..';

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

  const getSetItems = async (setname: string, itemname: string) => {
    const setp = getPathObj(['sets', setname]);

    Promise.all([setp])
      .then((mem: any) => {
        const location = mem[0].u.indexOf(`${itemname}_`);
        let owner = '';

        if (location >= 0) {
          const loc = mem[0].u.slice(location);
          const own = loc.split(',')[0];
          const items = own.split('_');
          owner = items[items.length - 1];
        }

        store.get(['nfts', owner, `${setname}:${itemname}`], (_err, obj) => {
          if (obj.s) {
            return {
              isSuccess: true,
              item: {
                uid: itemname,
                set: setname,
                last_modified: Base64Utils.toNumber(obj.s.split(',')[0]),
                info: obj.s || '',
                type: mem[0].t,
                owner,
                lien: obj.l || 'No Lien',
              },
              set: {
                set: setname,
                link: `${mem[0].a}/${mem[0].p}`,
                fee: {
                  amount: mem[0].f,
                  precision: CONFIG.precision,
                  token: CONFIG.TOKEN,
                },
                bond: {
                  amount: mem[0].b,
                  precision: CONFIG.precision,
                  token: CONFIG.TOKEN,
                },
                permlink: mem[0].p,
                author: mem[0].a,
                script: mem[0].s,
                name_long: mem[0].nl,
                encoding: mem[0].e,
                type: mem[0].t,
                royalty: mem[0].r,
                name: mem[0].n,
                minted: mem[0].i,
                max:
                  Base64Utils.toNumber(mem[0].m) -
                  Base64Utils.toNumber(mem[0].o),
              },
            };
          } else {
            return {
              isSuccess: false,
            };
          }
        });
      })
      .catch((e) => {
        return `Something went wrong ${e}`;
      });
  };
  return { getUsers, getSetItems };
};

export default Nft;
