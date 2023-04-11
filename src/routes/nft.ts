import express from 'express';
import { NftController } from '@src/controller';
import { authUtils } from '@src/utils';

const NftAPI = express();
const { featuresNft } = authUtils();
const { getNftUsers } = NftController();

NftAPI.get('/nfts/:user', featuresNft, getNftUsers);

export default NftAPI;
