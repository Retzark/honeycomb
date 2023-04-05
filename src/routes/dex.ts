import express from 'express';
import { DexController } from '@src/controller';
import { authUtils } from '@src/utils';

const DexAPI = express();
const { featuresDex } = authUtils();
const { getDex, getTickers, getOrderBook, getPairs, getHistorical, getRecent } =
  DexController();

DexAPI.get('/get-dex', featuresDex, getDex);
DexAPI.get('/get-tickers', featuresDex, getTickers);
DexAPI.get('/get-order-book', featuresDex, getOrderBook);
DexAPI.get('/get-order-book/:ticker_id', featuresDex, getOrderBook);
DexAPI.get('/get-pairs', featuresDex, getPairs);
DexAPI.get('/get-historical', featuresDex, getHistorical);
DexAPI.get('/get-historical/:ticker_id', featuresDex, getHistorical);
DexAPI.get('/get-recent', featuresDex, getRecent);
DexAPI.get('/get-recent/:ticker_id', featuresDex, getRecent);

export default DexAPI;
