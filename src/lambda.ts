import { Callback, Context, Handler } from 'aws-lambda';
import { createApp } from './main';
import serverlessExpress from '@vendia/serverless-express';

let cachedServer: Handler;

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  if (!cachedServer) {
    const expressApp = await createApp();
    cachedServer = serverlessExpress({ app: expressApp });
  }
  return cachedServer(event, context, callback);
};
