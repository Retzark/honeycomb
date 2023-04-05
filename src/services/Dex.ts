import { RAM } from '@src/utils';
import { CONFIG, VERSION } from '@src/config';
import { OrderBookArgs } from 'types';

const Dex = () => {
  const getBook = (dep: number, promises: any[], orderbook: OrderBookArgs) => {
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

  return { getBook };
};

export default Dex;
