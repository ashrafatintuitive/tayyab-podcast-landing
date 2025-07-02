<?php
/**
 * Simple content fix - no complex dependencies
 * Run at: https://themuslimnonprofitshow.com/podcast-crm/simple-fix.php?key=simple123
 */

// Security check
$secret_key = 'simple123';
if (!isset($_GET['key']) || $_GET['key'] !== $secret_key) {
    http_response_code(403);
    die('Access denied. Use ?key=' . $secret_key);
}

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Simple Content Fix</h2><pre>";

try {
    $dataDir = __DIR__ . '/data';
    $websiteDir = __DIR__ . '/../js';
    
    echo "Updating content files...\n\n";
    
    // Update hero content
    $heroContent = [
        "badge" => "NEW EPISODES WEEKLY",
        "title" => "The Muslim Non-Profit Show", 
        "byline" => "with Tayyab Yunus",
        "description" => "Breaking the 95% failure rate in Muslim non-profits through powerful stories and actionable insights. Weekly conversations with changemakers who've scaled their impact.",
        "listen_text" => "Listen Now",
        "watch_text" => "Watch on YouTube"
    ];
    file_put_contents($dataDir . '/hero_content.json', json_encode($heroContent, JSON_PRETTY_PRINT));
    echo "✓ Updated hero content\n";
    
    // Update stats content
    $statsContent = [
        "episodes" => "5",
        "episodes_label" => "Episodes",
        "downloads" => "85K+", 
        "downloads_label" => "Downloads",
        "rating" => "4.9",
        "rating_label" => "Rating",
        "countries" => "12",
        "countries_label" => "Countries"
    ];
    file_put_contents($dataDir . '/stats_content.json', json_encode($statsContent, JSON_PRETTY_PRINT));
    echo "✓ Updated stats content\n";
    
    // Update mission content
    $missionContent = [
        "title" => "Our Mission",
        "content" => "We believe in the power of Muslim-led organizations to create lasting change. Through in-depth conversations with successful founders and leaders, we uncover the strategies, mindsets, and faith-driven approaches that turn vision into impact.\\n\\nEvery episode delivers actionable insights you can apply to your own organization, whether you're just starting out or scaling for greater impact."
    ];
    file_put_contents($dataDir . '/mission_content.json', json_encode($missionContent, JSON_PRETTY_PRINT));
    echo "✓ Updated mission content\n";
    
    // Now manually create website-data.js
    $websiteData = [
        'hero' => $heroContent,
        'stats' => $statsContent,
        'mission' => $missionContent,
        'social' => [
            "apple_podcasts" => "https://podcasts.apple.com/us/podcast/the-muslim-non-profit-show-with-tayyab-yunus/id1818343671",
            "spotify" => "https://open.spotify.com/show/0N3Iy4641bzCvN2kCvmm8W", 
            "youtube" => "https://www.youtube.com/@tayyabyunus"
        ],
        'meta' => [
            "title" => "The Muslim Non-Profit Show with Tayyab Yunus",
            "description" => "Breaking the 95% failure rate in Muslim non-profits through powerful stories and actionable insights from leaders who are changing the world."
        ]
    ];
    
    // Create website-data.js content
    $jsContent = "// Website content data for The Muslim Non-Profit Show\n";
    $jsContent .= "// Generated from CMS on " . date('Y-m-d H:i:s') . "\n\n";
    $jsContent .= "const websiteData = " . json_encode($websiteData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . ";\n\n";
    $jsContent .= "// Export for use in other scripts\n";
    $jsContent .= "if (typeof module !== 'undefined' && module.exports) {\n";
    $jsContent .= "    module.exports = { websiteData };\n";
    $jsContent .= "}\n";
    
    // Write to website-data.js
    $websiteDataPath = $websiteDir . '/website-data.js';
    $written = file_put_contents($websiteDataPath, $jsContent);
    
    if ($written) {
        echo "✓ Updated website-data.js ($written bytes)\n";
    } else {
        echo "✗ Failed to update website-data.js\n";
    }
    
    echo "\n🎉 Simple fix completed!\n";
    echo "Your website should now show proper content instead of test data.\n";
    echo "Refresh your website to see the changes.\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "</pre>";

// Auto-delete option
echo '<br><a href="?delete=1&key=' . $secret_key . '" style="background: red; color: white; padding: 10px; text-decoration: none;">Delete This File</a>';

if (isset($_GET['delete']) && $_GET['delete'] == '1') {
    unlink(__FILE__);
    echo "<script>alert('File deleted'); window.location.href='/podcast-crm/';</script>";
}
?>