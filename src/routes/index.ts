import express from 'express';
import CoinAPI from './coin';
import RootAPI from './root';
import UserAPI from './user';
import MarketsAPI from './markets';
import ReportAPI from './report';
import FeedAPI from './feed';
import QueueAPI from './queue';
import ProtocolAPI from './protocol';
import StatusAPI from './status';
import DexAPI from './dex';
import NftAPI from './nft';
import PobAPI from './pob';

const api = express();

api.use('/root', RootAPI);
api.use('/coin', CoinAPI);
api.use('/user', UserAPI);
api.use('/markets', MarketsAPI);
api.use('/report', ReportAPI);
api.use('/feed', FeedAPI);
api.use('/queue', QueueAPI);
api.use('/protocol', ProtocolAPI);
api.use('/status', StatusAPI);
api.use('/dex', DexAPI);
api.use('/nft', NftAPI);
api.use('/pob', PobAPI);

export default api;
