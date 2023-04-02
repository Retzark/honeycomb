import express from 'express';
import { UserController } from '@src/controller';

const UserAPI = express();
const { getUser, getRunners } = UserController();

UserAPI.get('/@:un', getUser);
UserAPI.get('/get-runners', getRunners);

export default UserAPI;
