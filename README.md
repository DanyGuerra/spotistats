<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
</p>

<h1 align="center">TopStatsAPI</h1>

<p align="center">
  <strong>TopStatsAPI</strong> is a serverless backend built with <a href="https://nestjs.com" target="_blank">NestJS</a> that provides Spotify statistics via the official <a href="https://developer.spotify.com/documentation/web-api" target="_blank">Spotify Web API</a>.  
</p>

<p align="center">
  Deployed on <strong>AWS Lambda</strong> using the <strong>Serverless Framework</strong>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@nestjs/core" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/@nestjs/core" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="License" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master" alt="Coverage" /></a>
</p>

---


## 🔗 Live Frontend

You can try the frontend application here:  
👉 [TopStats Web App](https://d2eikr7pny939u.cloudfront.net/)

## 🚀 Features

- 🎵 Integration with Spotify Web API
- 🧪 Built with NestJS modular architecture
- ☁️ Deployed to AWS Lambda using Serverless Framework
- 📈 Provides endpoints for user's top tracks, top artists, and listening stats
- 🌍 Designed to be stateless and scalable

---

## 📦 Environment Variables

Create a `.env` file in the root of the project and include the following variables:

```env
PORT=3000
NODE_ENV=development
HOST=http://localhost:3000
API_CONTEXT=/api
MONGODB_URI=mongodb+srv://<your_mongo_uri>
API_SPOTIFY_CLIENT_ID=<spotify_client_id>
API_SPOTIFY_CLIENT_SECRET=<spotify_client_secret>
HOST_ACCOUNTS_API_SPOTIFY=https://accounts.spotify.com
HOST_API_SPOTIFY=https://api.spotify.com/v1
REDIRECT_URI_CALLBACK=http://localhost:3000/callback
API_SPOTIFY_USER_SCOPE=user-top-read user-read-recently-played
HOST=api_host
HOST_FRONTEND=host_frontend
```



## 📥 Installation

```
npm install
```

## 🧪 Running the App
```
# Development
npm run start

# Watch mode (auto-restart on changes)
npm run start:dev

# Production mode
npm run start:prod
```

## ✅ Running Tests
```
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## ☁️ Deployment

```
serverless deploy
```


