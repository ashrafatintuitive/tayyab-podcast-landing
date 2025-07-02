<?php
/**
 * Force export episodes from CRM database
 * Run at: https://themuslimnonprofitshow.com/podcast-crm/force-export.php?key=export123
 */

// Security check
$secret_key = 'export123';
if (!isset($_GET['key']) || $_GET['key'] !== $secret_key) {
    http_response_code(403);
    die('Access denied. Use ?key=' . $secret_key);
}

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Force Export from CRM Database</h2><pre>";

try {
    require_once __DIR__ . '/config/config.php';
    require_once __DIR__ . '/api/db.php';
    require_once __DIR__ . '/api/export.php';
    require_once __DIR__ . '/api/export-content.php';
    
    echo "Starting export process...\n\n";
    
    // Check database episodes
    $db = getDB();
    $stmt = $db->query("SELECT * FROM episodes WHERE status = 'published' ORDER BY publish_date DESC");
    $episodes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Found " . count($episodes) . " published episodes in database:\n";
    foreach ($episodes as $ep) {
        echo "- " . $ep['title'] . " (Featured: " . ($ep['featured'] ? 'Yes' : 'No') . ")\n";
    }
    echo "\n";
    
    // Export episodes
    echo "Exporting episodes to js/episodes.js...\n";
    $episodeResult = exportToEpisodesJs();
    echo "Episodes export: " . $episodeResult['status'] . "\n";
    if ($episodeResult['status'] === 'success') {
        echo "Exported " . $episodeResult['episodes_count'] . " episodes\n";
    } else {
        echo "Error: " . $episodeResult['message'] . "\n";
    }
    echo "\n";
    
    // Export website content
    echo "Exporting website content to js/website-data.js...\n";
    $contentResult = exportWebsiteContent();
    echo "Content export: " . $contentResult['status'] . "\n";
    if ($contentResult['status'] === 'success') {
        echo "Exported " . $contentResult['sections_count'] . " content sections\n";
    } else {
        echo "Error: " . $contentResult['message'] . "\n";
    }
    echo "\n";
    
    echo "✅ Export completed!\n";
    echo "Cache has been updated with new version numbers.\n";
    echo "\nCheck your website - episodes should now be visible immediately.\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}

echo "</pre>";

// Auto-delete option
echo '<br><a href="?delete=1&key=' . $secret_key . '" style="background: red; color: white; padding: 10px; text-decoration: none;">Delete This File</a>';

if (isset($_GET['delete']) && $_GET['delete'] == '1') {
    unlink(__FILE__);
    echo "<script>alert('File deleted'); window.location.href='/podcast-crm/';</script>";
}
?>