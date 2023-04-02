import express from 'express';
import { QueueController } from '@src/controller';

const QueueAPI = express();
const { getQueue } = QueueController();

QueueAPI.get('/get-queue', getQueue);

export default QueueAPI;
