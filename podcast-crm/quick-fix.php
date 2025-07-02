<?php
// Quick fix - update website-data.js directly
$websiteDataContent = '// Website content data for The Muslim Non-Profit Show
// Generated from CMS on ' . date('Y-m-d H:i:s') . '

const websiteData = {
    "hero": {
        "badge": "NEW EPISODES WEEKLY",
        "title": "The Muslim Non-Profit Show",
        "byline": "with Tayyab Yunus",
        "description": "Breaking the 95% failure rate in Muslim non-profits through powerful stories and actionable insights. Weekly conversations with changemakers who have scaled their impact.",
        "listen_text": "Listen Now",
        "watch_text": "Watch on YouTube"
    },
    "stats": {
        "episodes": "5",
        "episodes_label": "Episodes",
        "downloads": "85K+",
        "downloads_label": "Downloads",
        "rating": "4.9",
        "rating_label": "Rating",
        "countries": "12",
        "countries_label": "Countries"
    },
    "mission": {
        "title": "Our Mission",
        "content": "We believe in the power of Muslim-led organizations to create lasting change. Through in-depth conversations with successful founders and leaders, we uncover the strategies, mindsets, and faith-driven approaches that turn vision into impact.\\n\\nEvery episode delivers actionable insights you can apply to your own organization, whether you\\'re just starting out or scaling for greater impact."
    },
    "social": {
        "apple_podcasts": "https://podcasts.apple.com/us/podcast/the-muslim-non-profit-show-with-tayyab-yunus/id1818343671",
        "spotify": "https://open.spotify.com/show/0N3Iy4641bzCvN2kCvmm8W",
        "youtube": "https://www.youtube.com/@tayyabyunus"
    },
    "meta": {
        "title": "The Muslim Non-Profit Show with Tayyab Yunus",
        "description": "Breaking the 95% failure rate in Muslim non-profits through powerful stories and actionable insights from leaders who are changing the world."
    }
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = { websiteData };
}';

$websiteDataPath = '../js/website-data.js';
$result = file_put_contents($websiteDataPath, $websiteDataContent);

if ($result) {
    echo "SUCCESS! Updated website-data.js with " . $result . " bytes.<br>";
    echo "Your website should now show proper content.<br>";
    echo "<a href='../index.html'>Check your website</a>";
} else {
    echo "FAILED to update website-data.js<br>";
    echo "Path: " . $websiteDataPath . "<br>";
    echo "Check file permissions.";
}
?>