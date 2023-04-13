import express from 'express';
import { NftController } from '@src/controller';
import { authUtils } from '@src/utils';

const NftAPI = express();
const { featuresNft } = authUtils();
const { getNftUsers, getItems, getSets, getSet } = NftController();

NftAPI.get('/nfts/:user', featuresNft, getNftUsers);
NftAPI.get('/nfts/:set/:item', featuresNft, getItems);
NftAPI.get('/sets', featuresNft, getSets);
NftAPI.get('/set/:set', featuresNft, getSet);

export default NftAPI;
