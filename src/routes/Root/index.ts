import express from 'express';
import { RootController } from '@src/controller';

const RootAPI = express();
const { Start, Root } = RootController()

RootAPI.get('/start', Start);
RootAPI.get('/stats', Root);

export default RootAPI;
