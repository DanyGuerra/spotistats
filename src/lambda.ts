import { Handler, Context, Callback } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import { createNestServer } from './main';

let cachedServer: Handler;

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  if (!cachedServer) {
    const { app } = await createNestServer();
    await app.init();
    cachedServer = serverlessExpress({
      app: app.getHttpAdapter().getInstance(),
    });
  }
  return cachedServer(event, context, callback);
};
