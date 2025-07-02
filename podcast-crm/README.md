# Podcast CRM for The Muslim Non-Profit Show

A simple PHP-based CRM system for managing podcast episodes with automatic RSS and YouTube monitoring.

## Features

- 📊 Episode management (create, edit, delete)
- 🔄 Automatic RSS feed monitoring
- 📺 YouTube channel monitoring (with API key)
- 📤 Export to episodes.js for the main site
- 🎯 Draft/Published status management
- 🏷️ Tags and key takeaways support
- 📱 Responsive admin interface

## Setup Instructions

### 1. Basic Setup

1. Upload the `podcast-crm` folder to your web server
2. Ensure PHP 7.4+ with SQLite support is installed
3. Make the `data` directory writable: `chmod 755 podcast-crm/data`

### 2. Set Up Authentication

1. Navigate to: `https://yourdomain.com/podcast-crm/setup.php`
2. Enter your desired admin password
3. Copy the generated hash
4. Edit `config/config.php` and replace `$2y$10$YourHashHere` with your hash
5. **Delete `setup.php` for security**

### 3. Configuration

Edit `config/config.php`:

```php
// Change username if desired
define('ADMIN_USERNAME', 'admin');

// Paste your generated hash here
define('ADMIN_PASSWORD_HASH', '$2y$10$your_generated_hash_here');

// RSS Feed URL (already configured)
define('RSS_FEED_URL', 'https://feeds.transistor.fm/the-muslim-non-profit-show');

// Optional: Add YouTube API credentials
define('YOUTUBE_API_KEY', 'your-api-key-here');
define('YOUTUBE_CHANNEL_ID', 'your-channel-id-here');
```

### 4. Access the Admin Panel

Navigate to: `https://yourdomain.com/podcast-crm/admin/`
You'll be redirected to login with your username/password.

### 5. First Steps

1. Click "Sync Sources" to import episodes from RSS feed
2. Edit imported episodes to add missing details
3. Change status from "draft" to "published" when ready
4. Click "Sync & Export" to sync latest episodes AND update the main website

## Automatic Sync (Cron Job)

To automatically sync episodes every hour, add this cron job:

```bash
0 * * * * php /path/to/podcast-crm/api/sync.php
```

## API Endpoints

- `GET /api/episodes` - List all episodes
- `GET /api/episodes/{id}` - Get single episode
- `POST /api/episodes` - Create episode
- `PUT /api/episodes/{id}` - Update episode
- `DELETE /api/episodes/{id}` - Delete episode
- `POST /api/sync` - Trigger sync
- `POST /api/export` - Export to episodes.js
- `GET /api/stats` - Get statistics

## Database Schema

Episodes are stored in SQLite with these fields:
- Basic info: title, description, guest, guest_title
- Media: youtube_id, audio_url, duration
- Metadata: publish_date, tags, key_takeaways
- Status: draft/published, featured flag
- Tracking: source (rss/youtube/manual), timestamps

## Security Notes

- The `.htaccess` file protects the data and config directories
- API has CORS enabled for local development
- No authentication by default (add if needed for production)

## Troubleshooting

**Database errors**: Check that `data/` directory is writable
**Sync not finding episodes**: Verify RSS feed URL is correct
**YouTube sync failing**: Check API key and quota limits

## Development

To run locally with PHP's built-in server:

```bash
cd podcast-crm
php -S localhost:8000
```

Then access: http://localhost:8000/admin/