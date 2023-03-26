import express from 'express';
import { UserController } from '@src/controller';

const UserAPI = express();
const { getUser } = UserController();

UserAPI.get('/@:un', getUser);

export default UserAPI;
