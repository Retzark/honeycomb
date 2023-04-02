import express from 'express';
import { StatusController } from '@src/controller';

const StatusAPI = express();
const { getStatus } = StatusController();

StatusAPI.get('/get-status/:txid', getStatus);

export default StatusAPI;
