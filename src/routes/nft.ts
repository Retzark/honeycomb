import express from 'express';
import { NftController } from '@src/controller';
import { authUtils } from '@src/utils';

const NftAPI = express();
const { featuresNft } = authUtils();
const { getNftUsers, getItems, getSets } = NftController();

NftAPI.get('/nfts/:user', featuresNft, getNftUsers);
NftAPI.get('/:set/:item', featuresNft, getItems);
NftAPI.get('/sets', featuresNft, getSets);

export default NftAPI;
