import { CONFIG } from '@src/config';
import { DiscordService, PathService } from '.';
import { store } from '..';
import { chronAssign } from '@src/utils';

const Gov = () => {
  const { getPathNum, getPathObj } = PathService();
  const { postToDiscord } = DiscordService();

  const govDown = (json: any, from: any, active: any, pc: any) => {
    let amount = parseInt(json.amount);
    let Pgov = getPathNum(['gov', from]);
    let Pgovd = getPathObj(['govd', from]);

    Promise.all([Pgov, Pgovd])
      .then((o) => {
        let gov: any = o[0];
        let downs: any = o[1] || {};
        let ops: any = [];
        let assigns: any = [];

        if (
          typeof amount == 'number' &&
          amount >= 0 &&
          gov >= amount &&
          active
        ) {
          var odd = parseInt((amount % 4) as unknown as string),
            weekly = parseInt((amount / 4) as unknown as string);

          for (var i = 0; i < 4; i++) {
            if (i == 3) {
              weekly += odd;
            }
            assigns.push(
              chronAssign(parseInt(json.block_num + 201600 * (i + 1)), {
                block: parseInt(json.block_num + 201600 * (i + 1)),
                op: 'gov_down',
                amount: weekly,
                by: from,
              })
            );
          }

          Promise.all(assigns).then((a) => {
            const newdowns: any = {};
            for (const d in a) {
              newdowns[a[d]] = a[d];
            }
            ops.push({ type: 'put', path: ['govd', from], data: newdowns });
            for (const i in downs) {
              ops.push({ type: 'del', path: ['chrono', downs[i]] });
            }
            const msg = `@${from}| Set withdrawl of ${parseFloat(
              (amount / 1000) as unknown as string
            ).toFixed(3)} ${CONFIG.TOKEN} from Governance`;
            if (CONFIG.hookurl || CONFIG.status)
              postToDiscord(msg, `${json.block_num}:${json.transaction_id}`);
            ops.push({
              type: 'put',
              path: ['feed', `${json.block_num}:${json.transaction_id}`],
              data: msg,
            });
            if (process.env.npm_lifecycle_event == 'test') pc[2] = ops;
            store.batch(ops, pc);
          });
        } else if (typeof amount == 'number' && amount == 0 && active) {
          for (const i in downs) {
            ops.push({ type: 'del', path: ['chrono', i] });
          }
          const msg = `@${from}| Canceled Governance withdrawl`;
          ops.push({
            type: 'put',
            path: ['feed', `${json.block_num}:${json.transaction_id}`],
            data: msg,
          });
          if (CONFIG.hookurl || CONFIG.status)
            postToDiscord(msg, `${json.block_num}:${json.transaction_id}`);
          if (process.env.npm_lifecycle_event == 'test') pc[2] = ops;
          store.batch(ops, pc);
        } else {
          ops.push({
            type: 'put',
            path: ['feed', `${json.block_num}:${json.transaction_id}`],
            data: `@${from}| Invalid Governance withdrawl`,
          });
          if (process.env.npm_lifecycle_event == 'test') pc[2] = ops;
          store.batch(ops, pc);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return { govDown };
};

export default Gov;
