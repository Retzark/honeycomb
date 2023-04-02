import express from 'express';
import { FeedController } from '@src/controller';

const FeedAPI = express();
const { getFeed } = FeedController();

FeedAPI.get('/get-feed', getFeed);

export default FeedAPI;
