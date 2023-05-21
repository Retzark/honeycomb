import { CONFIG } from '@src/config';
import { DiscordService, EdbService, PathService } from '.';
import { store } from '..';

const StateSend = () => {
  const { getPathNum } = PathService();
  const { updatePromote } = EdbService();
  const { postToDiscord } = DiscordService();

  const Send = async (json: any, from: any, active: any, pc: any) => {
    let fbalp = getPathNum(['balances', from]),
      tbp = getPathNum(['balances', json.to]); //to balance promise
    return Promise.all([fbalp, tbp])
      .then((bals: any) => {
        let fbal = bals[0];
        let tbal = bals[1];
        let ops = [];
        let send = parseInt(json.amount);

        if (
          json.to &&
          typeof json.to == 'string' &&
          send > 0 &&
          fbal >= send &&
          active &&
          json.to != from
        ) {
          //balance checks
          ops.push({
            type: 'put',
            path: ['balances', from],
            data: parseInt((fbal - send) as unknown as string),
          });
          ops.push({
            type: 'put',
            path: ['balances', json.to],
            data: parseInt(tbal + send),
          });
          let msg = `@${from}| Sent @${json.to} ${parseFloat(
            (parseInt(json.amount as unknown as string) /
              1000) as unknown as string
          ).toFixed(3)} ${CONFIG.TOKEN}`;
          if (json.to === 'null' && json.memo.split('/')[1]) {
            msg = `@${from}| Promoted @${json.memo} with ${parseFloat(
              (parseInt(json.amount as unknown as string) /
                1000) as unknown as string
            ).toFixed(3)} ${CONFIG.TOKEN}`;
            if (CONFIG.dbcs) {
              let author = json.memo.split('/')[0],
                permlink = json.memo.split('/')[1];
              if (author.split('@')[1]) {
                author = author.split('@')[1];
              }
              updatePromote(author, permlink, send);
            }
          }
          if (CONFIG.hookurl || CONFIG.status)
            postToDiscord(msg, `${json.block_num}:${json.transaction_id}`);
          ops.push({
            type: 'put',
            path: ['feed', `${json.block_num}:${json.transaction_id}`],
            data: msg,
          });
        } else {
          ops.push({
            type: 'put',
            path: ['feed', `${json.block_num}:${json.transaction_id}`],
            data: `@${from}| Invalid send operation`,
          });
        }
        if (process.env.npm_lifecycle_event == 'test') pc[2] = ops;
        store.batch(ops, pc);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const Claim = async (json: any, from: any, active: any, pc: any) => {
    let fbalp = getPathNum(['cbalances', from]);
    let tbp = getPathNum(['balances', from]);
    let splitp = getPathNum([json.gov ? 'gov' : 'pow', from]);
    let totp = getPathNum([json.gov ? 'gov' : 'pow', 't']);
    let claimp = getPathNum(['claim', from]);

    Promise.all([fbalp, tbp, splitp, totp, claimp])
      .then((bals: any) => {
        let fbal = bals[0];
        let tbal = bals[1];
        let split = bals[2];
        let tot = bals[3];
        let claims = bals[4];
        let ops = [];
        let claim = parseInt(fbal);

        if (claim > 0) {
          const half = parseInt((claim / 2) as unknown as string),
            other = claim - half,
            msg = `@${from}| Claimed ${parseFloat(
              (parseInt(claim as unknown as string) / 1000) as unknown as string
            ).toFixed(3)} ${CONFIG.TOKEN} - Half ${
              json.gov ? 'locked in gov' : 'powered up.'
            }`;
          ops.push({ type: 'del', path: ['cbalances', from] });
          ops.push({
            type: 'put',
            path: ['balances', from],
            data: parseInt(tbal + half),
          });
          ops.push({
            type: 'put',
            path: [json.gov ? 'gov' : 'pow', from],
            data: parseInt(split + other),
          });
          ops.push({
            type: 'put',
            path: [json.gov ? 'gov' : 'pow', 't'],
            data: parseInt(tot + other),
          });
          if (CONFIG.hookurl || CONFIG.status)
            postToDiscord(msg, `${json.block_num}:${json.transaction_id}`);
          ops.push({
            type: 'put',
            path: ['feed', `${json.block_num}:${json.transaction_id}`],
            data: msg,
          });
        } else {
          ops.push({
            type: 'put',
            path: ['feed', `${json.block_num}:${json.transaction_id}`],
            data: `@${from}| Invalid claim operation`,
          });
        }
        if (process.env.npm_lifecycle_event == 'test') pc[2] = ops;
        store.batch(ops, pc);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return { Send, Claim };
};

export default StateSend;
