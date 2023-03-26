import express from 'express';
import { CoinController } from '@src/controller';

const CoinAPI = express();
const { getCoin } = CoinController()

CoinAPI.get('/check-coin', getCoin);

export default CoinAPI;
