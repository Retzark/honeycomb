import express from 'express';
import { DexController } from '@src/controller';
import { authUtils } from '@src/utils';

const DexAPI = express();
const { featuresDex } = authUtils();
const { getDex, getTickers } = DexController();

DexAPI.get('/get-dex', featuresDex, getDex);
DexAPI.get('/get-tickers', featuresDex, getTickers);

export default DexAPI;
