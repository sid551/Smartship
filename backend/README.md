# SmartShip News API Backend

A Node.js Express API that provides shipping news data for the SmartShip application.

## Features

- Fetches shipping news from GNews API
- CORS enabled for frontend integration
- Health check endpoint
- Error handling and logging

## Endpoints

- `GET /` - API information and status
- `GET /health` - Health check
- `GET /api/news` - Fetch shipping news

## Environment Variables

- `GNEWS_API_KEY` - Your GNews API key (required)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (production/development)

## Local Development

```bash
npm install
npm start
```

## Deployment

This API is configured for deployment on Render.com using the included `render.yaml` configuration.
