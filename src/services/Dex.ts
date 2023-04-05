import { RAM } from '@src/utils';
import { CONFIG, VERSION } from '@src/config';
import { OrderBookArgs } from 'types';

const Dex = () => {
  const getBook = async (
    dep: number,
    promises: any[],
    orderbook: OrderBookArgs
  ) => {
    let get = dep;
    if (!get) get = 50;

    const type = orderbook.ticker_id.split('_')[0].toLowerCase();

    return Promise.all(promises)
      .then((v) => {
        let count1 = 0;
        let count2 = 0;
        for (const item in v[0][type].sellOrders) {
          const sellOrder = v[0][type].sellOrders[item].amount / 1000;
          orderbook.asks.push([
            v[0][type].sellOrders[item].rate,
            parseFloat(sellOrder as unknown as string).toFixed(3),
          ]);
          count1++;
          if (count1 == get) break;
        }
        for (const item in v[0][type].buyOrders) {
          const buyOrder = v[0][type].buyOrders[item].amount / 1000;

          orderbook.bids.push([
            v[0][type].buyOrders[item].rate,
            parseFloat(buyOrder as unknown as string).toFixed(3),
          ]);
          count2++;
          if (count2 == get) break;
        }

        return JSON.stringify(
          {
            asks: orderbook.asks,
            bids: orderbook.bids,
            timestamp: orderbook.timestamp,
            ticker_id: orderbook.ticker_id,
            node: CONFIG.username,
            behind: RAM.behind,
            VERSION,
          },
          null,
          3
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getHistory = async (promises: any, pair: any, typ: any, lim: any) => {
    return Promise.all(promises)
      .then((v) => {
        let buy = [];
        let sell = [];
        let countb = 0;
        let counts = 0;

        if (v[0][pair].his)
          for (const item in v[0][pair].his) {
            const baseVol = v[0][pair].his[item].base_vol / 1000;
            const targeVol = v[0][pair].his[item].target_vol / 1000;

            const record = {
              trade_id: v[0][pair].his[item].id,
              price: v[0][pair].his[item].price,
              base_volume: parseFloat(baseVol as unknown as string).toFixed(3),
              target_volume: parseFloat(targeVol as unknown as string).toFixed(
                3
              ),
              trade_timestamp: v[0][pair].his[item].t,
              type: v[0][pair].his[item].type,
            };
            if (record.type == 'buy') {
              countb++;
              if (countb <= lim) {
                buy.push(record);
                if (counts == lim) break;
              }
            } else {
              counts++;
              if (counts <= lim) {
                sell.push(record);
                if (countb == lim) break;
              }
            }
          }
        if (typ.indexOf('buy') < 0) {
          buy = [];
        }
        if (typ.indexOf('sell') < 0) {
          sell = [];
        }

        return JSON.stringify(
          {
            sell,
            buy,
            node: CONFIG.username,
            behind: RAM.behind,
            VERSION,
          },
          null,
          3
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getRecentChart = async (promises: any, pair: any, limit: number) => {
    return Promise.all(promises)
      .then((v) => {
        const his = [];
        let count = 0;

        if (v[0][pair].his)
          for (const item in v[0][pair].his) {
            const baseVol = parseInt(v[0][pair].his[item].base_vol) / 1000;
            const targeVol = parseInt(v[0][pair].his[item].target_vol) / 1000;

            const record = {
              trade_id: v[0][pair].his[item].id,
              price: v[0][pair].his[item].price,
              base_volume: parseFloat(baseVol as unknown as string).toFixed(3),
              target_volume: parseFloat(targeVol as unknown as string).toFixed(
                3
              ),
              trade_timestamp: v[0][pair].his[item].t,
              type: v[0][pair].his[item].type,
            };
            his.push(record);
            count++;
            if (count == limit) break;
          }

        return JSON.stringify(
          {
            recent_trades: his,
            node: CONFIG.username,
            behind: RAM.behind,
            VERSION,
          },
          null,
          3
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { getBook, getHistory, getRecentChart };
};

export default Dex;
