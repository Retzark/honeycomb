import express from 'express';
import { ReportController } from '@src/controller';

const ReportAPI = express();
const { getReport } = ReportController();

ReportAPI.get('/:un', getReport);

export default ReportAPI;
