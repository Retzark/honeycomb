import express from 'express';
import { CoinController } from '@src/controller';

const CoinAPI = express();
const { getCoin, getDetails } = CoinController();

CoinAPI.get('/check-coin', getCoin);
CoinAPI.get('/details', getDetails);

export default CoinAPI;
