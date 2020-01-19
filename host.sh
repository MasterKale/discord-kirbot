#!/bin/sh
NODE_ENV=production node dist/bot.js | pino-papertrail \
  --host $PAPERTRAIL_HOST \
  --port $PAPERTRAIL_PORT \
  --appname node \
