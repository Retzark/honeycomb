import express from 'express';
import { MarketsController } from '@src/controller';

const MarketsAPI = express();
const { getMarkets, getMirrors } = MarketsController();

MarketsAPI.get('/get-markets', getMarkets);
MarketsAPI.get('/mirrors', getMirrors);

export default MarketsAPI;
