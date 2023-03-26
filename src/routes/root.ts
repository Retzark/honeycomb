import express from 'express';
import { RootController } from '@src/controller';

const RootAPI = express();
const { Start, getRoot } = RootController()

RootAPI.get('/start', Start);
RootAPI.get('/stats', getRoot);

export default RootAPI;
