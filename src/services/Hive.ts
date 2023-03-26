import fetch from 'node-fetch';
import { CONFIG } from '@src/config';
import { RAM, TXIDUtils } from '@src/utils';
import { AppStart } from '@src/application';

const Hive = () => {
  const fetchHive = async () => {
    const { exitApp } = AppStart()
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
          exitApp(8, 'Stream lag')
        }
        setTimeout(function () {
          fetchHive()
        }, 60000);
      }
    }
  };

  return {
    fetchHive,
  };
};

export default Hive;
