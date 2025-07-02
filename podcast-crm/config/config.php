<?php
// Configuration settings
define('DB_PATH', __DIR__ . '/../data/podcast.db');
define('SITE_PATH', __DIR__ . '/../../');
define('EPISODES_JS_PATH', SITE_PATH . 'js/episodes.js');

// RSS Feed URL (update with your actual feed)
define('RSS_FEED_URL', 'https://feeds.transistor.fm/the-muslim-non-profit-show');

// YouTube API Configuration
define('YOUTUBE_API_KEY', ''); // Add your API key here
define('YOUTUBE_CHANNEL_ID', ''); // Add your channel ID here

// Authentication - CHANGE THESE!
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD_HASH', '$2y$12$/tXEcW9jACf0eYYJ8BA1Mus/Ek6t3n/OpXMpy1FNWjP4BfCsyK7zu'); // Default: admin123

// Timezone
date_default_timezone_set('America/New_York');

// Session configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_samesite', 'Strict');
session_start();

// CORS headers for API (only if authenticated)
if (isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);