import express from 'express';
import { ProtocolController } from '@src/controller';

const ProtocolAPI = express();
const { getProtocol } = ProtocolController();

ProtocolAPI.get('/get-protocol', getProtocol);

export default ProtocolAPI;
