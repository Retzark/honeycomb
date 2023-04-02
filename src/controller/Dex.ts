import { Request, Response } from 'express';
import { CONFIG, VERSION } from '@src/config';
import { PathService } from '@src/services';
import { RAM } from '@src/utils';
import { DexInfoArgs } from 'types';

const Dex = () => {
  const { getPathObj } = PathService();

  const getDex = async (_req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      const Pdex = getPathObj(['dex']);
      const Pstats = getPathObj(['stats']);
      const Pico = getPathObj(['balances', 'ri']);

      Promise.all([Pdex, Pstats, Pico])
        .then((v: any) => {
          const markets = v[0];
          markets.hive.sells = [];
          markets.hive.buys = [];
          markets.hbd.sells = [];
          markets.hbd.buys = [];

          const hiveTotal = (v[2] * v[1].icoPrice) / 1000;
          const rateTotal = v[1].icoPrice / 1000;
          const keyTotal = v[1].icoPrice / 1000;
          const amountTotal = (v[2] * v[1].icoPrice) / 1000;

          markets.hive.sells.push({
            amount: v[2],
            block: 0,
            expire_path: 'NA',
            fee: 0,
            from: 'ICO',
            hbd: 0,
            hive: hiveTotal,
            rate: rateTotal.toFixed(6),
            txid: 'DLUXICO',
            type: 'hive:sell',
            key: `${keyTotal.toFixed(6)}:DLUXICO`,
            hivenai: {
              amount: amountTotal,
              precision: 3,
              token: 'HIVE',
            },
            hbdnai: {
              amount: 0,
              precision: 3,
              token: 'HBD',
            },
            amountnai: {
              amount: v[2],
              precision: 3,
              token: 'DLUX',
            },
            feenai: {
              amount: 0,
              precision: 3,
              token: 'DLUX',
            },
          });
          for (const item in v[0].hive.sellOrders) {
            markets.hive.sellOrders[item].key = item;
            const order: any = {};

            for (let key in markets.hive.sellOrders[item]) {
              order[key] = markets.hive.sellOrders[item][key];
            }

            order.hivenai = {
              amount: order.hive,
              precision: 3,
              token: 'HIVE',
            };
            order.hbdnai = {
              amount: order.hbd,
              precision: 3,
              token: 'HBD',
            };
            order.amountnai = {
              amount: order.amount,
              precision: CONFIG.precision,
              token: CONFIG.TOKEN,
            };
            order.feenai = {
              amount: order.fee,
              precision: CONFIG.precision,
              token: CONFIG.TOKEN,
            };
            markets.hive.sells.push(order);
          }
          for (const item in v[0].hive.buyOrders) {
            markets.hive.buyOrders[item].key = item;
            const order: any = {};

            for (let key in markets.hive.buyOrders[item]) {
              order[key] = markets.hive.buyOrders[item][key];
            }

            order.hivenai = {
              amount: order.hive,
              precision: 3,
              token: 'HIVE',
            };
            order.hbdnai = {
              amount: order.hbd,
              precision: 3,
              token: 'HBD',
            };
            order.amountnai = {
              amount: order.amount,
              precision: CONFIG.precision,
              token: CONFIG.TOKEN,
            };
            order.feenai = {
              amount: order.fee,
              precision: CONFIG.precision,
              token: CONFIG.TOKEN,
            };
            markets.hive.buys.push(order);
          }
          for (const item in v[0].hbd.sellOrders) {
            markets.hbd.sellOrders[item].key = item;
            const order: any = {};

            for (let key in markets.hbd.sellOrders[item]) {
              order[key] = markets.hbd.sellOrders[item][key];
            }

            order.hivenai = {
              amount: order.hive,
              precision: 3,
              token: 'HIVE',
            };
            order.hbdnai = {
              amount: order.hbd,
              precision: 3,
              token: 'HBD',
            };
            order.amountnai = {
              amount: order.amount,
              precision: CONFIG.precision,
              token: CONFIG.TOKEN,
            };
            order.feenai = {
              amount: order.fee,
              precision: CONFIG.precision,
              token: CONFIG.TOKEN,
            };
            markets.hbd.sells.push(order);
          }
          for (const item in v[0].hbd.buyOrders) {
            markets.hbd.buyOrders[item].key = item;
            const order: any = {};

            for (let key in markets.hbd.buyOrders[item]) {
              order[key] = markets.hbd.buyOrders[item][key];
            }

            order.hivenai = {
              amount: order.hive,
              precision: 3,
              token: 'HIVE',
            };
            order.hbdnai = {
              amount: order.hbd,
              precision: 3,
              token: 'HBD',
            };
            order.amountnai = {
              amount: order.amount,
              precision: CONFIG.precision,
              token: CONFIG.TOKEN,
            };
            order.feenai = {
              amount: order.fee,
              precision: CONFIG.precision,
              token: CONFIG.TOKEN,
            };
            markets.hbd.buys.push(order);
          }
          delete markets.hbd.buyOrders;
          delete markets.hbd.sellOrders;
          delete markets.hive.buyOrders;
          delete markets.hbd.sellOrders;

          res.send(
            JSON.stringify(
              {
                markets,
                stats: v[1],
                node: CONFIG.username,
                behind: RAM.behind,
                VERSION,
              },
              null,
              3
            )
          );
        })
        .catch(function (err) {
          console.log(err);
        });
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const getTickers = async (_req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', 'application/json');

      const dex = getPathObj(['dex']);
      const stats = getPathObj(['stats']);

      Promise.all([dex, stats])
        .then((v: any) => {
          const info: DexInfoArgs = {
            hive: {
              low: v[0].hive.tick,
              bv: 0 as unknown as string,
              tv: 0 as unknown as string,
              high: v[0].hive.tick,
              bid: 0,
              ask: 999999999,
            },
            hbd: {
              low: v[0].hbd.tick,
              high: v[0].hbd.tick,
              bv: 0,
              tv: 0,
              bid: 0,
              ask: 999999999,
            },
          };

          for (const item in v[0].hive.his) {
            const hiveAmount = v[0].hive.his[item].amount || 0;
            const hiveRate = v[0].hive.his[item].rate || 0;
            const total = parseFloat(hiveAmount) * parseFloat(hiveRate);

            if (v[0].hive.his[item].block > v[1].lastIBlock - 28800) {
              if (v[0].hive.his[item].rate < info.hive.low) {
                info.hive.low = v[0].hive.his[item].rate;
              }
              if (v[0].hive.his[item].rate > info.hive.high) {
                info.hive.high = v[0].hive.his[item].rate;
              }
              info.hive.tv += parseFloat(hiveAmount);
              info.hive.bv += total.toFixed(3);
            }
          }

          for (const item in v[0].hbd.his) {
            const hiveAmount = v[0].hbd.his[item].amount || 0;
            const hiveRate = v[0].hbd.his[item].rate || 0;
            const total = parseFloat(hiveAmount) * parseFloat(hiveRate);

            if (v[0].hbd.his[item].block > v[1].lastIBlock - 28800) {
              if (v[0].hbd.his[item].rate < info.hbd.low) {
                info.hbd.low = v[0].hbd.his[item].rate;
              }
              if (v[0].hbd.his[item].rate > info.hbd.high) {
                info.hbd.high = v[0].hbd.his[item].rate;
              }
              info.hbd.tv += parseFloat(v[0].hbd.his[item].amount);
              info.hbd.bv += total.toFixed(3) as unknown as number;
            }
          }

          for (const item in v[0].hbd.sellOrders) {
            if (parseFloat(v[0].hbd.sellOrders[item].rate) < info.hbd.ask) {
              info.hbd.ask = v[0].hbd.sellOrders[item].rate;
            }
          }

          for (const item in v[0].hbd.buyOrders) {
            if (parseFloat(v[0].hbd.buyOrders[item].rate) > info.hbd.bid) {
              info.hbd.bid = v[0].hbd.buyOrders[item].rate;
            }
          }

          for (const item in v[0].hive.sellOrders) {
            if (parseFloat(v[0].hive.sellOrders[item].rate) < info.hive.ask) {
              info.hive.ask = v[0].hive.sellOrders[item].rate;
            }
          }

          for (const item in v[0].hive.buyOrders) {
            if (parseFloat(v[0].hive.buyOrders[item].rate) > info.hive.bid) {
              info.hive.bid = v[0].hive.buyOrders[item].rate;
            }
          }

          const baseVolume = parseFloat(info.hive.bv) / 1000;
          const baseTargetVolume = parseFloat(info.hive.tv) / 1000;
          const hbdBaseVolume =
            parseFloat(info.hbd.bv as unknown as string) / 1000;
          const hbdBaseTargetVolume =
            parseFloat(info.hbd.tv as unknown as string) / 1000;

          const hive = {
              ticker_id: `HIVE_${CONFIG.TOKEN}`,
              base_currency: 'HIVE',
              target_currency: CONFIG.TOKEN,
              last_price: v[0].hive.tick,
              base_volume: baseVolume.toFixed(3),
              target_volume: baseTargetVolume.toFixed(3),
              bid: info.hive.bid,
              ask: info.hive.ask,
              high: info.hive.high,
              low: info.hive.low,
            },
            hbd = {
              ticker_id: `HBD_${CONFIG.TOKEN}`,
              base_currency: 'HBD',
              target_currency: CONFIG.TOKEN,
              last_price: v[0].hbd.tick,
              base_volume: hbdBaseVolume.toFixed(3),
              target_volume: hbdBaseTargetVolume.toFixed(3),
              bid: info.hbd.bid,
              ask: info.hbd.ask,
              high: info.hbd.high,
              low: info.hbd.low,
            };
          res.send(JSON.stringify([hive, hbd], null, 3));
        })
        .catch(function (err) {
          console.log(err);
        });
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  return { getDex, getTickers };
};

export default Dex;
