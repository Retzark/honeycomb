import express from 'express';
import Coin from './Coin';
import Root from './Root';

const api = express();

api.use('/root', Root);
api.use('/coin', Coin);

export default api;
