import express from 'express';
import { PobController } from '@src/controller';

const PobAPI = express();
const { getBlog, getAuthorPost } = PobController();

PobAPI.get('/blog/@:un', getBlog);
PobAPI.get('/dapps/@:author', getAuthorPost);

export default PobAPI;
