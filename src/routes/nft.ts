import express from 'express';
import { NftController } from '@src/controller';
import { authUtils } from '@src/utils';

const NftAPI = express();
const { featuresNft } = authUtils();
const {
  getNftUsers,
  getItems,
  getSets,
  getSet,
  getAuctions,
  getMintAuctions,
  getSales,
  getMintSales,
  getMintSupply,
} = NftController();

NftAPI.get('/nfts/:user', featuresNft, getNftUsers);
NftAPI.get('/nfts/:set/:item', featuresNft, getItems);
NftAPI.get('/sets', featuresNft, getSets);
NftAPI.get('/set/:set', featuresNft, getSet);
NftAPI.get('/auctions', featuresNft, getAuctions);
NftAPI.get('/auctions/:set', featuresNft, getAuctions);
NftAPI.get('/mint_auctions', featuresNft, getMintAuctions);
NftAPI.get('/mint_auctions/:set', featuresNft, getMintAuctions);
NftAPI.get('/sales', featuresNft, getSales);
NftAPI.get('/sales/:set', featuresNft, getSales);
NftAPI.get('/mint_sales', featuresNft, getMintSales);
NftAPI.get('/mint_sales/:set', featuresNft, getMintSales);
NftAPI.get('/mint_supply', featuresNft, getMintSupply);
NftAPI.get('/mint_supply/:set', featuresNft, getMintSupply);

export default NftAPI;
