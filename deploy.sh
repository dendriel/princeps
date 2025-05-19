#!/usr/bin/env sh

git pull && npm run build && sudo systemctl restart princeps-*