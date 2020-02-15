#!/bin/bash
echo "[---pulling latest code---]"
git pull
echo "[---stopping prod bot---]"
docker-compose stop bot
echo "[---removing containers---]"
docker-compose rm -f
echo "[---building prod bot---]"
docker-compose build bot
echo "[---restarting prod bot---]"
docker-compose -f docker-compose.yml up -d --no-deps bot
