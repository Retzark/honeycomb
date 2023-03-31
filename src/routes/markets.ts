import express from 'express';
import { MarketsController } from '@src/controller';

const MarketsAPI = express();
const { getMirrors } = MarketsController();

MarketsAPI.get('/mirrors', getMirrors);

export default MarketsAPI;
