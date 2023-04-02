import express from 'express';
import Coin from './coin';
import Root from './root';
import User from './user';
import Markets from './markets';
import Report from './report';
import FeedAPI from './feed';
import QueueAPI from './queue';
import ProtocolAPI from './protocol';
import StatusAPI from './status';
import DexAPI from './dex';

const api = express();

api.use('/root', Root);
api.use('/coin', Coin);
api.use('/user', User);
api.use('/markets', Markets);
api.use('/report', Report);
api.use('/feed', FeedAPI);
api.use('/queue', QueueAPI);
api.use('/protocol', ProtocolAPI);
api.use('/status', StatusAPI);
api.use('/dex', DexAPI);

export default api;
