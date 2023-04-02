import { NextFunction, Request, Response } from 'express';
import { CONFIG } from '@src/config';

const authUtils = () => {
  const featuresDex = (req: Request, res: Response, next: NextFunction) => {
    if (CONFIG.features.dex) {
      next();
    } else {
      res.sendStatus(401);
    }
  };

  const featuresNft = (req: Request, res: Response, next: NextFunction) => {
    if (CONFIG.features.nft) {
      next();
    } else {
      res.sendStatus(401);
    }
  };

  const featuresPob = (req: Request, res: Response, next: NextFunction) => {
    if (CONFIG.features.pob) {
      next();
    } else {
      res.sendStatus(401);
    }
  };

  const featuresState = (req: Request, res: Response, next: NextFunction) => {
    if (CONFIG.features.state) {
      next();
    } else {
      res.sendStatus(401);
    }
  };

  return {
    featuresDex,
    featuresNft,
    featuresPob,
    featuresState,
  };
};

export default authUtils;
