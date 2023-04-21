import express from 'express';
import { authUtils } from '@src/utils';
import {
  CoinController,
  DexController,
  FeedController,
  MarketsController,
  NftController,
  PobController,
  ProtocolController,
  QueueController,
  ReportController,
  RootController,
  StatusController,
  UserController,
  StateController,
} from '@src/controller';

const router = express();
const { featuresDex, featuresNft, featuresPob, featuresState } = authUtils();

const { Start, getRoot } = RootController();
const { getCoin, getDetails } = CoinController();
const { getUser, getRunners } = UserController();
const { getMarkets, getMirrors } = MarketsController();
const { getReport } = ReportController();
const { getFeed } = FeedController();
const { getQueue } = QueueController();
const { getProtocol } = ProtocolController();
const { getStatus } = StatusController();
const { getDex, getTickers, getOrderBook, getPairs, getHistorical, getRecent } =
  DexController();
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
  getPfpUser,
  getTrades,
} = NftController();
const {
  getBlog,
  getAuthorPost,
  getPost,
  getNewPosts,
  getTrendingPosts,
  getPromotedPosts,
  getPostAuthorPermlink,
  getPosts,
} = PobController();
const { getState } = StateController();

router.get('/', Start);
router.get('/stats', getRoot);
router.get('/coin', getCoin);
router.get('/@:un', getUser);
router.get('/api/mirrors', getMirrors);
router.get('/api/coin_detail', getDetails);
router.get('/report/:un', getReport); // probably not needed
router.get('/markets', getMarkets); //for finding node runner and tasks information
router.get('/feed', getFeed); //all side-chain transaction in current day
router.get('/runners', getRunners); //list of accounts that determine consensus... will also be the multi-sig accounts
router.get('/queue', getQueue);
router.get('/api/protocol', getProtocol);
router.get('/api/status/:txid', getStatus);
router.get('/dex', featuresDex, getDex);
router.get('/api/tickers', featuresDex, getTickers);
router.get('/api/orderbook', featuresDex, getOrderBook);
router.get('/api/orderbook/:ticker_id', featuresDex, getOrderBook);
router.get('/api/pairs', featuresDex, getPairs);
router.get('/api/historical', featuresDex, getHistorical);
router.get('/api/historical/:ticker_id', featuresDex, getHistorical);
router.get('/api/recent/:ticker_id', featuresDex, getRecent);
router.get('/api/nfts/:user', featuresNft, getNftUsers);
router.get('/api/nft/:set/:item', featuresNft, getItems);
router.get('/api/sets', featuresNft, getSets);
router.get('/api/set/:set', featuresNft, getSet);
router.get('/api/auctions', featuresNft, getAuctions);
router.get('/api/auctions/:set', featuresNft, getAuctions);
router.get('/api/mintauctions', featuresNft, getMintAuctions);
router.get('/api/mintauctions/:set', featuresNft, getMintAuctions);
router.get('/api/sales', featuresNft, getSales);
router.get('/api/sales/:set', featuresNft, getSales);
router.get('/api/mintsales', featuresNft, getMintSales);
router.get('/api/mintsales/:set', featuresNft, getMintSales);
router.get('/api/mintsupply', featuresNft, getMintSupply);
router.get('/api/mintsupply/:set', featuresNft, getMintSupply);
router.get('/api/pfp/:user', featuresNft, getPfpUser);
router.get('/api/trades/:kind/:user', featuresNft, getTrades);

router.get('/blog/@:un', featuresPob, getBlog);
router.get('/dapps/@:author', featuresPob, getAuthorPost);
router.get('/dapps/@:author/:permlink', featuresPob, getPost);
router.get('/new', featuresPob, getNewPosts);
router.get('/trending', featuresPob, getTrendingPosts);
router.get('/promoted', featuresPob, getPromotedPosts);
router.get('/posts/:author/:permlink', featuresPob, getPostAuthorPermlink);
router.get('/posts', featuresPob, getPosts); //votable posts

router.get('/state', featuresState, getState); //Do not recommend having a state dump in a production API
// router.get('/pending', featuresState, API.pending); // The transaction signer now can sign multiple actions per block and this is nearly always empty, still good for troubleshooting
// // Some HIVE APi is wrapped here to support a stateless frontend built on the cheap with dreamweaver
// // None of these functions are required for token functionality and should likely be removed from the community version
// router.get('/api/:api_type/:api_call', featuresState, API.hive_api);
// router.get('/hapi/:api_type/:api_call', featuresState, API.hive_api);
// router.get('/getwrap', featuresState, API.getwrap);
// router.get('/getauthorpic/:un', featuresState, API.getpic);
// router.get('/getblog/:un', featuresState, API.getblog);

export default router;
