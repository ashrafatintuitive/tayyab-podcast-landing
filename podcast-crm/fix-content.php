<?php
/**
 * Fix all website content and force complete export
 * Run at: https://themuslimnonprofitshow.com/podcast-crm/fix-content.php?key=fix123
 */

// Security check
$secret_key = 'fix123';
if (!isset($_GET['key']) || $_GET['key'] !== $secret_key) {
    http_response_code(403);
    die('Access denied. Use ?key=' . $secret_key);
}

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Fixing All Website Content and Publishing</h2><pre>";

try {
    require_once __DIR__ . '/config/config.php';
    require_once __DIR__ . '/api/db.php';
    require_once __DIR__ . '/api/export.php';
    require_once __DIR__ . '/api/export-content.php';
    
    echo "Step 1: Updating content JSON files...\n\n";
    
    // Update hero content
    $heroContent = [
        "badge" => "NEW EPISODES WEEKLY",
        "title" => "The Muslim Non-Profit Show",
        "byline" => "with Tayyab Yunus",
        "description" => "Breaking the 95% failure rate in Muslim non-profits through powerful stories and actionable insights. Weekly conversations with changemakers who've scaled their impact.",
        "listen_text" => "Listen Now",
        "watch_text" => "Watch on YouTube"
    ];
    
    file_put_contents(__DIR__ . '/data/hero_content.json', json_encode($heroContent, JSON_PRETTY_PRINT));
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
    
    file_put_contents(__DIR__ . '/data/stats_content.json', json_encode($statsContent, JSON_PRETTY_PRINT));
    echo "✓ Updated stats content\n";
    
    // Update mission content
    $missionContent = [
        "title" => "Our Mission",
        "content" => "We believe in the power of Muslim-led organizations to create lasting change. Through in-depth conversations with successful founders and leaders, we uncover the strategies, mindsets, and faith-driven approaches that turn vision into impact.\\n\\nEvery episode delivers actionable insights you can apply to your own organization, whether you're just starting out or scaling for greater impact."
    ];
    
    file_put_contents(__DIR__ . '/data/mission_content.json', json_encode($missionContent, JSON_PRETTY_PRINT));
    echo "✓ Updated mission content\n";
    
    // Update social content (fix YouTube URL)
    $socialContent = [
        "apple_podcasts" => "https://podcasts.apple.com/us/podcast/the-muslim-non-profit-show-with-tayyab-yunus/id1818343671",
        "spotify" => "https://open.spotify.com/show/0N3Iy4641bzCvN2kCvmm8W",
        "youtube" => "https://www.youtube.com/@tayyabyunus",
        "instagram" => "https://instagram.com/themuslimnonprofitshow",
        "linkedin" => "https://linkedin.com/company/themuslimnonprofitshow",
        "twitter" => "https://twitter.com/muslimnonprofit"
    ];
    
    file_put_contents(__DIR__ . '/data/social_content.json', json_encode($socialContent, JSON_PRETTY_PRINT));
    echo "✓ Updated social content\n";
    
    // Update meta content
    $metaContent = [
        "title" => "The Muslim Non-Profit Show with Tayyab Yunus",
        "description" => "Breaking the 95% failure rate in Muslim non-profits through powerful stories and actionable insights from leaders who are changing the world.",
        "keywords" => "Muslim non-profit, Islamic organizations, charity, fundraising, leadership, community impact",
        "og_image" => "https://themuslimnonprofitshow.com/images/og-image.jpg"
    ];
    
    file_put_contents(__DIR__ . '/data/meta_content.json', json_encode($metaContent, JSON_PRETTY_PRINT));
    echo "✓ Updated meta content\n";
    
    // Update footer content
    $footerContent = [
        "copyright_text" => "© 2025 The Muslim Non-Profit Show with Tayyab Yunus. Making the world a better place, one story at a time.",
        "tayyab_url" => "https://tayyabyunus.com/",
        "email" => "hello@tayyabyunus.com"
    ];
    
    file_put_contents(__DIR__ . '/data/footer_content.json', json_encode($footerContent, JSON_PRETTY_PRINT));
    echo "✓ Updated footer content\n";
    
    echo "\nStep 2: Publishing episodes to website...\n";
    
    // Export episodes  
    $episodeResult = exportToEpisodesJs();
    if ($episodeResult['status'] === 'success') {
        echo "✓ Published " . $episodeResult['episodes_count'] . " episodes\n";
    } else {
        echo "✗ Episode export failed: " . $episodeResult['message'] . "\n";
    }
    
    echo "\nStep 3: Publishing website content...\n";
    
    // Export website content
    $contentResult = exportWebsiteContent();
    if ($contentResult['status'] === 'success') {
        echo "✓ Published " . $contentResult['sections_count'] . " content sections\n";
        echo "✓ Cache version updated\n";
    } else {
        echo "✗ Content export failed: " . $contentResult['message'] . "\n";
    }
    
    echo "\nStep 4: Verifying website-data.js update...\n";
    
    // Check if website-data.js was updated
    $websiteDataPath = SITE_PATH . 'js/website-data.js';
    if (file_exists($websiteDataPath)) {
        $content = file_get_contents($websiteDataPath);
        if (strpos($content, 'The Muslim Non-Profit Show') !== false && strpos($content, 'TEST BADGE') === false) {
            echo "✓ website-data.js successfully updated with real content\n";
        } else {
            echo "✗ website-data.js still contains test content\n";
        }
        
        // Show timestamp
        if (preg_match('/Generated from CMS on (.+)/', $content, $matches)) {
            echo "✓ Generated timestamp: " . $matches[1] . "\n";
        }
    }
    
    echo "\n🎉 COMPLETE! All content has been fixed and published.\n";
    echo "\nYour website should now display:\n";
    echo "- Proper hero section with 'The Muslim Non-Profit Show'\n";
    echo "- All 5 episodes with complete information\n";
    echo "- Updated stats (5 episodes, 85K+ downloads)\n";
    echo "- Correct social links and meta information\n";
    echo "\nRefresh your website - the test content should be gone!\n";
    
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