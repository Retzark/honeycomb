import express from 'express';
import { DexController } from '@src/controller';
import { authUtils } from '@src/utils';

const DexAPI = express();
const { featuresDex } = authUtils();
const { getDex, getTickers, getOrderBook } = DexController();

DexAPI.get('/get-dex', featuresDex, getDex);
DexAPI.get('/get-tickers', featuresDex, getTickers);
DexAPI.get('/get-order-book', featuresDex, getOrderBook);

export default DexAPI;
