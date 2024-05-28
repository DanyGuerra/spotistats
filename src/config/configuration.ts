export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  apiContext: process.env.API_CONTEXT,
  database: {
    uri: process.env.MONGODB_URI,
  },
  apiSptifyClientId: process.env.API_SPOTIFY_CLIENT_ID,
  apiSptifySecret: process.env.API_SPOTIFY_CLIENT_SECRET,
  hostAccountsApiSpotify: process.env.HOST_ACCOUNTS_API_SPOTIFY,
  hostApiSpotify: process.env.HOST_API_SPOTIFY,
  redirectUriCallback: process.env.REDIRECT_URI_CALLBACK,
  apiUserScope: process.env.API_SPORIFY_USER_SCOPE,
});
