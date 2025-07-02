#!/bin/bash
# Podcast CRM Sync Script
# Add this to crontab: 0 * * * * /path/to/podcast-crm/cron.sh

# Change to script directory
cd "$(dirname "$0")"

# Run sync
php api/sync.php >> data/sync.log 2>&1

# Keep only last 100 lines of log
tail -n 100 data/sync.log > data/sync.log.tmp && mv data/sync.log.tmp data/sync.log