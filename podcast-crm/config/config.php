<?php
// Configuration settings
define('DB_PATH', __DIR__ . '/../data/podcast.db');
define('SITE_PATH', __DIR__ . '/../../');
define('EPISODES_JS_PATH', SITE_PATH . 'js/episodes.js');

// RSS Feed URL (correct Libsyn feed)
define('RSS_FEED_URL', 'https://feeds.libsyn.com/580735/rss');

// YouTube API Configuration
define('YOUTUBE_API_KEY', ''); // Add your API key here
define('YOUTUBE_CHANNEL_ID', '@tayyabyunus'); // Channel handle for API calls

// Authentication - CHANGE THESE!
define('ADMIN_USERNAME', 'admin');
define('ADMIN_PASSWORD_HASH', '$2y$12$stL/4j241/f/GE7wq3/5Luete/8XVrpBJ4UNkyH3l3QpFMdyQEMgu'); // Password: admin123

// Timezone
date_default_timezone_set('America/New_York');

// Session configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_samesite', 'Strict');
// Set session save path to a writable directory
if (!is_writable(session_save_path())) {
    $temp_dir = sys_get_temp_dir();
    if (is_writable($temp_dir)) {
        ini_set('session.save_path', $temp_dir);
    }
}
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