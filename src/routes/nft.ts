import express from 'express';
import { NftController } from '@src/controller';
import { authUtils } from '@src/utils';

const NftAPI = express();
const { featuresNft } = authUtils();
const { getNftUsers, getItems, getSets, getSet, getAuctions } = NftController();

NftAPI.get('/nfts/:user', featuresNft, getNftUsers);
NftAPI.get('/nfts/:set/:item', featuresNft, getItems);
NftAPI.get('/sets', featuresNft, getSets);
NftAPI.get('/set/:set', featuresNft, getSet);
NftAPI.get('/auctions', featuresNft, getAuctions);
NftAPI.get('/auctions/:set', featuresNft, getAuctions);

export default NftAPI;
