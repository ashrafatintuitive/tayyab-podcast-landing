<?php
require_once __DIR__ . '/db.php';

function exportToEpisodesJs() {
    $db = getDB();
    
    try {
        // Get all published episodes
        $stmt = $db->query("SELECT * FROM episodes WHERE status = 'published' ORDER BY publish_date DESC");
        $episodes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Transform episodes to JavaScript format
        $jsEpisodes = [];
        $episodeId = 1;
        
        foreach ($episodes as $episode) {
            $jsEpisode = [
                'id' => $episodeId++,
                'title' => $episode['title'],
                'description' => $episode['description'],
                'guest' => $episode['guest'],
                'guestTitle' => $episode['guest_title'],
                'duration' => $episode['duration'],
                'publishDate' => $episode['publish_date'],
                'youtubeId' => $episode['youtube_id'],
                'audioUrl' => $episode['audio_url'],
                'featured' => (bool) $episode['featured'],
                'tags' => !empty($episode['tags']) ? explode(',', $episode['tags']) : [],
                'keyTakeaways' => !empty($episode['key_takeaways']) ? 
                    (is_string($episode['key_takeaways']) && substr($episode['key_takeaways'], 0, 1) === '[' ? 
                        json_decode($episode['key_takeaways'], true) : 
                        explode('|', $episode['key_takeaways'])
                    ) : []
            ];
            
            // Remove null values
            $jsEpisode = array_filter($jsEpisode, function($value) {
                return $value !== null && $value !== '';
            });
            
            $jsEpisodes[] = $jsEpisode;
        }
        
        // Generate JavaScript content
        $jsContent = "// Episode data for The Muslim Non-Profit Show\n";
        $jsContent .= "// Generated from CRM on " . date('Y-m-d H:i:s') . "\n\n";
        $jsContent .= "const episodes = " . json_encode($jsEpisodes, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . ";\n\n";
        
        // Add the existing EpisodeManager code
        $jsContent .= <<<'EOD'
// Episode management utilities
const EpisodeManager = {
    getFeaturedEpisode() {
        return episodes.find(ep => ep.featured) || episodes[0];
    },
    
    getAllEpisodes() {
        return episodes.sort((a, b) => 
            new Date(b.publishDate) - new Date(a.publishDate)
        );
    },
    
    getYouTubeEmbedUrl(youtubeId) {
        return `https://www.youtube.com/embed/${youtubeId}`;
    },
    
    getYouTubeThumbnailUrl(youtubeId, quality = 'maxresdefault') {
        return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
    }
};

// Statistics data
const stats = {
    totalEpisodes: episodes.length,
    totalDownloads: "85K+",
    avgListenTime: "32min",
    subscriberCount: "1.2K+"
};
EOD;
        
        // Write to episodes.js
        $written = file_put_contents(EPISODES_JS_PATH, $jsContent);
        
        if ($written === false) {
            throw new Exception('Failed to write episodes.js file');
        }
        
        // Update cache busting version in index.html for immediate cache break
        updateCacheVersion();
        
        return [
            'status' => 'success',
            'message' => 'Exported ' . count($episodes) . ' episodes to episodes.js',
            'episodes_count' => count($episodes),
            'file_path' => EPISODES_JS_PATH,
            'cache_updated' => true
        ];
        
    } catch (Exception $e) {
        return [
            'status' => 'error',
            'message' => $e->getMessage()
        ];
    }
}

// Cache busting function to update version in index.html
function updateCacheVersion() {
    $indexPath = SITE_PATH . 'index.html';
    if (!file_exists($indexPath)) {
        return false;
    }
    
    $content = file_get_contents($indexPath);
    $timestamp = time();
    
    // Update all JS file versions with timestamp
    $content = preg_replace(
        '/(<script src="js\/[^"]+\.js)\?v=[^"]*(")/i',
        '$1?v=' . $timestamp . '$2',
        $content
    );
    
    return file_put_contents($indexPath, $content);
}