import express from 'express';
import Coin from './coin';
import Root from './root';
import User from './user';
import Markets from './markets';

const api = express();

api.use('/root', Root);
api.use('/coin', Coin);
api.use('/user', User);
api.use('/markets', Markets);

export default api;
