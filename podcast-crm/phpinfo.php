<?php
// Security check - only allow access with a secret key
$secret_key = 'debug123';  // Simple fixed key for debugging
if (!isset($_GET['key']) || $_GET['key'] !== $secret_key) {
    http_response_code(403);
    die('Access denied. Use ?key=' . $secret_key . ' (Server date: ' . date('Y-m-d H:i:s') . ')');
}

// Check specific requirements for the CRM
echo "<h2>CRM Requirements Check</h2>";
echo "<pre>";
echo "PHP Version: " . PHP_VERSION . "\n";
echo "SimpleXML: " . (extension_loaded('simplexml') ? 'Enabled' : 'DISABLED - RSS sync will fail') . "\n";
echo "SQLite3: " . (extension_loaded('sqlite3') ? 'Enabled' : 'DISABLED - Database will not work') . "\n";
echo "cURL: " . (extension_loaded('curl') ? 'Enabled' : 'Disabled - May affect API calls') . "\n";
echo "OpenSSL: " . (extension_loaded('openssl') ? 'Enabled' : 'Disabled - May affect HTTPS') . "\n";
echo "Session: " . (extension_loaded('session') ? 'Enabled' : 'DISABLED - Login will not work') . "\n";
echo "JSON: " . (extension_loaded('json') ? 'Enabled' : 'DISABLED - API will not work') . "\n";
echo "\n";
echo "allow_url_fopen: " . (ini_get('allow_url_fopen') ? 'On' : 'OFF - RSS/API calls will fail') . "\n";
echo "Session save path: " . session_save_path() . " (writable: " . (is_writable(session_save_path()) ? 'Yes' : 'No') . ")\n";
echo "</pre>";

// Test RSS feed access
echo "<h2>RSS Feed Test</h2>";
echo "<pre>";
$rss_url = 'https://feeds.transistor.fm/the-muslim-non-profit-show';
echo "Testing RSS feed: $rss_url\n";

if (ini_get('allow_url_fopen')) {
    $context = stream_context_create([
        'http' => ['timeout' => 10],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false
        ]
    ]);
    
    $headers = @get_headers($rss_url, 1, $context);
    if ($headers) {
        echo "RSS feed is accessible\n";
        echo "HTTP Status: " . $headers[0] . "\n";
        
        // Try to load it
        libxml_use_internal_errors(true);
        $rss = @simplexml_load_file($rss_url, null, LIBXML_NOCDATA, '', $context);
        if ($rss) {
            echo "RSS feed parsed successfully\n";
            echo "Channel title: " . $rss->channel->title . "\n";
            echo "Items found: " . count($rss->channel->item) . "\n";
        } else {
            echo "Failed to parse RSS feed\n";
            $errors = libxml_get_errors();
            foreach ($errors as $error) {
                echo "XML Error: " . $error->message . "\n";
            }
        }
    } else {
        echo "Cannot access RSS feed - check network/firewall settings\n";
    }
} else {
    echo "allow_url_fopen is disabled - cannot fetch RSS feed\n";
}
echo "</pre>";

// Full phpinfo for detailed debugging
echo "<h2>Full PHP Info</h2>";
phpinfo();

// Auto-delete notice
echo "<script>
setTimeout(function() {
    alert('Remember to delete this file after debugging!');
}, 5000);
</script>";
?>