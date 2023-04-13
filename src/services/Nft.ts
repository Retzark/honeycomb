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

  const findItems = async (setname: string, itemname: string) => {
    const setp = getPathObj(['sets', setname]);

    return Promise.all([setp])
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
        return {
          isSuccess: false,
          msg: `Something went wrong ${e}`,
        };
      });
  };

  const findSets = async () => {
    const sets = getPathObj(['sets']);
    const divs = getPathObj(['div']);

    return Promise.all([sets, divs])
      .then((mem: any) => {
        const result = [];
        for (const set in mem[0]) {
          result.push({
            set,
            link: `${mem[0][set].a}/${mem[0][set].p}`,
            fee: {
              amount: mem[0][set].f,
              precision: CONFIG.precision,
              token: CONFIG.TOKEN,
            },
            bond: {
              amount: mem[0][set].b,
              precision: CONFIG.precision,
              token: CONFIG.TOKEN,
            },
            permlink: mem[0][set].p,
            author: mem[0][set].a,
            script: mem[0][set].s,
            encoding: mem[0][set].e,
            type: mem[0][set].t,
            royalty: mem[0][set].r,
            royalty_allocation: mem[0][set].ra || `${mem[0][set].a}_10000`,
            name: mem[0][set].n,
            name_long: mem[0][set].nl,
            minted: mem[0][set].i,
            max: Base64Utils.toNumber(mem[0][set].j),
            max_exe_length: mem[0][set].x || 0,
            max_opt_length: mem[0][set].y || 0,
            total_div: {
              amount: mem[1][set]?.e || 0,
              precision: CONFIG.precision,
              token: CONFIG.TOKEN,
            },
            last_div: {
              amount: mem[1][set]?.l || 0,
              precision: CONFIG.precision,
              token: CONFIG.TOKEN,
            },
            period_div: mem[1][set]?.p,
          });
        }

        return result;
      })
      .catch((e) => {
        return `Something went wrong ${e}`;
      });
  };

  const findSet = async (setname: string) => {
    const setp = getPathObj(['sets', setname]);
    const divs = getPathObj(['divs']);

    return Promise.all([setp, divs])
      .then((mem: any) => {
        const result = [];
        var set: any = {
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
          encoding: mem[0].e,
          type: mem[0].t,
          royalty: mem[0].r,
          royalty_accounts: mem[0].ra || mem[0].a + '_10000',
          name: mem[0].n,
          name_long: mem[0].nl,
          minted: Base64Utils.toNumber(mem[0].i),
          max: Base64Utils.toNumber(mem[0].j),
          max_opt_length: mem[0].y || 0,
          max_exe_length: mem[0].x || 0,
          total_div: {
            amount: mem[1][set]?.e || 0,
            precision: CONFIG.precision,
            token: CONFIG.TOKEN,
          },
          last_div: {
            amount: mem[1][set]?.l || 0,
            precision: CONFIG.precision,
            token: CONFIG.TOKEN,
          },
          period_div: mem[1][set]?.p,
        };

        let uids = [];

        if (mem[0].u) uids = mem[0].u.split(',');

        for (let i = 0; i < uids.length; i++) {
          const owner = uids[i].split('_');
          for (var j = 0; j < owner.length - 1; j++) {
            result.push({
              uid: owner[j],
              set: setname,
              script: mem[0].s,
              owner: owner[owner.length - 1],
            });
          }
        }

        return {
          isSuccess: true,
          item: result,
          set: set,
        };
      })
      .catch((e) => {
        return {
          isSuccess: false,
          item: [],
          set: {},
        };
      });
  };

  return { getUsers, findItems, findSets, findSet };
};

export default Nft;
