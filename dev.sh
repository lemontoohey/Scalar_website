#!/bin/bash
# Prevents ERR_CONNECTION_RESET by raising the open-files limit before starting Next.js
ulimit -n 10240
exec npm run dev
