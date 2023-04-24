import fetch from 'node-fetch';
import { CONFIG } from '@src/config';
import { RAM, TXIDUtils } from '@src/utils';
import { AppStart } from '@src/application';
import { Response } from 'express';

const Hive = () => {
  const fetchHive = async () => {
    const { exitApp } = AppStart();
    if (RAM.lastUpdate < Date.now() - 59000) {
      const response = await fetch(CONFIG.clientURL, {
        method: 'POST',
        body: `{"jsonrpc":"2.0", "method":"database_api.get_dynamic_global_properties", "id":1}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.status === 200) {
        const data = await response.json();

        RAM.lastUpdate = Date.now();
        RAM.hiveDyn = data.result;
        RAM.head = data.result.head_block_number;
        RAM.behind =
          data.result.head_block_number - (TXIDUtils.getBlockNum() || 0);

        if (RAM.behind > 100 && TXIDUtils.streaming) {
          exitApp(8, 'Stream lag');
        }
        setTimeout(function () {
          fetchHive();
        }, 60000);
      }
    }
  };

  const fetchAccounts = async (account: string | string[]) => {};

  const fetchHiveAPI = async (data: {
    jsonrpc: string;
    method: string;
    params: any;
    id: number;
  }) => {
    const results = await fetch(CONFIG.clientURL, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    })
      .then((j) => j.json())
      .then((r) => r);

    return results;
  };

  const fetchWrap = async (data: {
    jsonrpc: string;
    method: string;
    params: any;
    id: number;
  }) => {
    const results = await fetch(CONFIG.clientURL, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    })
      .then((j) => j.json())
      .then((r) => r);

    return results;
  };

  const fetchPic = async (
    data: {
      jsonrpc: string;
      method: string;
      params: any;
      id: number;
    },
    res: Response
  ) => {
    fetch(CONFIG.clientURL, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    })
      .then((j) => j.json())
      .then((r) => {
        let image,
          i = 0;
        try {
          image = JSON.parse(r.result[0].json_metadata).profile.profile_image;
        } catch (e) {
          try {
            i = 1;
            image = JSON.parse(r.result[0].posting_json_metadata).profile
              .profile_image;
          } catch (e) {
            i = 2;
            image = 'https://a.ipfs.dlux.io/images/user-icon.svg';
          }
        }

        if (image) {
          fetch(image)
            .then((response) => {
              response.body.pipe(res);
            })
            .catch((e) => {
              if (i == 0) {
                try {
                  i = 1;
                  image = JSON.parse(r.result[0].posting_json_metadata).profile
                    .profile_image;
                } catch (e) {
                  i = 2;
                  image = 'https://a.ipfs.dlux.io/images/user-icon.svg';
                }
              } else {
                i = 2;
                image = 'https://a.ipfs.dlux.io/images/user-icon.svg';
              }
              fetch(image)
                .then((response) => {
                  response.body.pipe(res);
                })
                .catch((e) => {
                  if (i == 1) {
                    image = 'https://a.ipfs.dlux.io/images/user-icon.svg';
                    fetch(image)
                      .then((response) => {
                        response.body.pipe(res);
                      })
                      .catch((e) => {
                        res.status(404);
                        res.send(e);
                      });
                  } else {
                    res.status(404);
                    res.send(e);
                  }
                });
            });
        } else {
          res.status(404);
          res.send('Image not found');
        }
      });
  };

  const fetchBlog = async (data: { un: string; start: number }) => {
    const { un, start } = data;

    const results = await fetch(CONFIG.clientURL, {
      body: `{\"jsonrpc\":\"2.0\", \"method\":\"follow_api.get_blog_entries\", \"params\":{\"account\":\"${un}\",\"start_entry_id\":${start},\"limit\":10}, \"id\":1}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    })
      .then((j) => j.json())
      .then((r) => {
        const out: any = { items: [] };

        for (const i in r.result) {
          r.result[i].media = {
            m: 'https://a.ipfs.dlux.io/images/400X200.gif',
          };
        }

        out.id = r.id;
        out.jsonrpc = r.jsonrpc;
        out.items = r.result;

        return out;
      });

    return results;
  };

  return {
    fetchHive,
    fetchAccounts,
    fetchHiveAPI,
    fetchWrap,
    fetchPic,
    fetchBlog,
  };
};

export default Hive;
