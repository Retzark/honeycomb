import { Webhook } from 'discord-webhook-node';
import { CONFIG } from '@src/config';
import { TXIDUtils } from '@src/utils';

const Discord = () => {
  const postToDiscord = (msg: string, id: string) => {
    const hook = new Webhook(CONFIG.hookurl);

    if (CONFIG.hookurl) hook.send(msg);
    if (CONFIG.status) TXIDUtils.store(msg, id);
  };

  return { postToDiscord };
};

export default Discord;
