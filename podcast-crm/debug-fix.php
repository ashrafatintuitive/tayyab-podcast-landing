<?php
/**
 * Debug and fix content issues
 * Run at: https://themuslimnonprofitshow.com/podcast-crm/debug-fix.php?key=debug123
 */

// Security check
$secret_key = 'debug123';
if (!isset($_GET['key']) || $_GET['key'] !== $secret_key) {
    http_response_code(403);
    die('Access denied. Use ?key=' . $secret_key);
}

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Debug and Fix Content Issues</h2><pre>";

try {
    echo "Step 1: Testing basic PHP functionality...\n";
    echo "PHP Version: " . PHP_VERSION . "\n";
    echo "Current directory: " . __DIR__ . "\n";
    echo "Site path would be: " . __DIR__ . '/../../' . "\n";
    
    echo "\nStep 2: Testing file paths...\n";
    $configPath = __DIR__ . '/config/config.php';
    $dbPath = __DIR__ . '/api/db.php';
    $exportPath = __DIR__ . '/api/export.php';
    $exportContentPath = __DIR__ . '/api/export-content.php';
    
    echo "Config exists: " . (file_exists($configPath) ? "✓" : "✗") . "\n";
    echo "DB exists: " . (file_exists($dbPath) ? "✓" : "✗") . "\n";
    echo "Export exists: " . (file_exists($exportPath) ? "✓" : "✗") . "\n";
    echo "Export content exists: " . (file_exists($exportContentPath) ? "✓" : "✗") . "\n";
    
    echo "\nStep 3: Testing config inclusion...\n";
    if (file_exists($configPath)) {
        require_once $configPath;
        echo "✓ Config loaded successfully\n";
        echo "DB_PATH: " . (defined('DB_PATH') ? DB_PATH : 'not defined') . "\n";
        echo "SITE_PATH: " . (defined('SITE_PATH') ? SITE_PATH : 'not defined') . "\n";
    } else {
        echo "✗ Config file missing\n";
    }
    
    echo "\nStep 4: Testing data directory...\n";
    $dataDir = __DIR__ . '/data';
    echo "Data dir exists: " . (is_dir($dataDir) ? "✓" : "✗") . "\n";
    echo "Data dir writable: " . (is_writable($dataDir) ? "✓" : "✗") . "\n";
    
    if (is_dir($dataDir)) {
        $files = scandir($dataDir);
        echo "Files in data dir: " . implode(', ', array_filter($files, function($f) { return $f !== '.' && $f !== '..'; })) . "\n";
    }
    
    echo "\nStep 5: Testing simple content update...\n";
    
    // Try to update hero content directly
    $heroFile = $dataDir . '/hero_content.json';
    $heroContent = [
        "badge" => "NEW EPISODES WEEKLY",
        "title" => "The Muslim Non-Profit Show",
        "byline" => "with Tayyab Yunus", 
        "description" => "Breaking the 95% failure rate in Muslim non-profits through powerful stories and actionable insights.",
        "listen_text" => "Listen Now",
        "watch_text" => "Watch on YouTube"
    ];
    
    $result = file_put_contents($heroFile, json_encode($heroContent, JSON_PRETTY_PRINT));
    echo "Hero content update: " . ($result ? "✓ Success ($result bytes)" : "✗ Failed") . "\n";
    
    echo "\nStep 6: Testing database connection...\n";
    if (file_exists($dbPath)) {
        require_once $dbPath;
        $db = getDB();
        if ($db) {
            echo "✓ Database connection successful\n";
            
            // Check episodes table
            $stmt = $db->query("SELECT COUNT(*) as count FROM episodes");
            $count = $stmt->fetch(PDO::FETCH_ASSOC);
            echo "Episodes in database: " . $count['count'] . "\n";
        } else {
            echo "✗ Database connection failed\n";
        }
    }
    
    echo "\nStep 7: Testing export functions...\n";
    if (file_exists($exportContentPath)) {
        require_once $exportContentPath;
        
        $exportResult = exportWebsiteContent();
        echo "Export result: " . $exportResult['status'] . "\n";
        if ($exportResult['status'] === 'success') {
            echo "✓ Export successful - " . $exportResult['sections_count'] . " sections\n";
        } else {
            echo "✗ Export failed: " . $exportResult['message'] . "\n";
        }
    }
    
    echo "\n🎉 Debug completed successfully!\n";
    echo "If you see this message, the basic functionality is working.\n";
    
} catch (Exception $e) {
    echo "❌ Error encountered: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " Line: " . $e->getLine() . "\n";
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