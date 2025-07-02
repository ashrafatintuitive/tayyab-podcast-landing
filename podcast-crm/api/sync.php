<?php
require_once __DIR__ . '/db.php';

function syncAllSources() {
    $results = [
        'rss' => syncRSSFeed(),
        'youtube' => YOUTUBE_API_KEY ? syncYouTube() : ['status' => 'skipped', 'message' => 'No API key configured']
    ];
    
    return $results;
}

function syncRSSFeed() {
    $db = getDB();
    $result = [
        'status' => 'success',
        'items_found' => 0,
        'items_added' => 0,
        'errors' => []
    ];
    
    try {
        // Fetch and parse RSS feed
        $rss = simplexml_load_file(RSS_FEED_URL);
        if (!$rss) {
            throw new Exception('Failed to load RSS feed');
        }
        
        $result['items_found'] = count($rss->channel->item);
        
        foreach ($rss->channel->item as $item) {
            // Extract episode data
            $title = (string) $item->title;
            $description = (string) $item->description;
            $pubDate = date('Y-m-d', strtotime((string) $item->pubDate));
            $audioUrl = (string) $item->enclosure['url'] ?? '';
            
            // Extract duration from itunes:duration if available
            $namespaces = $item->getNamespaces(true);
            $itunes = $item->children($namespaces['itunes'] ?? '');
            $duration = (string) ($itunes->duration ?? '');
            
            // Convert duration to MM:SS format if needed
            if ($duration && strpos($duration, ':') === false) {
                $seconds = intval($duration);
                $duration = sprintf('%d:%02d', floor($seconds / 60), $seconds % 60);
            }
            
            // Check if episode already exists
            $stmt = $db->prepare("SELECT id FROM episodes WHERE title = ? AND publish_date = ?");
            $stmt->execute([$title, $pubDate]);
            
            if (!$stmt->fetch()) {
                // Add new episode
                $stmt = $db->prepare("INSERT INTO episodes 
                    (title, description, publish_date, audio_url, duration, status, source) 
                    VALUES (?, ?, ?, ?, ?, 'draft', 'rss')");
                
                $stmt->execute([$title, $description, $pubDate, $audioUrl, $duration]);
                $result['items_added']++;
            }
        }
        
        // Log sync
        $stmt = $db->prepare("INSERT INTO sync_log (source, items_found, items_added, status) VALUES (?, ?, ?, ?)");
        $stmt->execute(['rss', $result['items_found'], $result['items_added'], 'success']);
        
    } catch (Exception $e) {
        $result['status'] = 'error';
        $result['errors'][] = $e->getMessage();
        
        // Log error
        $stmt = $db->prepare("INSERT INTO sync_log (source, status, error_message) VALUES (?, ?, ?)");
        $stmt->execute(['rss', 'error', $e->getMessage()]);
    }
    
    return $result;
}

function syncYouTube() {
    $db = getDB();
    $result = [
        'status' => 'success',
        'items_found' => 0,
        'items_added' => 0,
        'errors' => []
    ];
    
    try {
        // YouTube API endpoint
        $url = 'https://www.googleapis.com/youtube/v3/search?' . http_build_query([
            'part' => 'snippet',
            'channelId' => YOUTUBE_CHANNEL_ID,
            'maxResults' => 50,
            'order' => 'date',
            'type' => 'video',
            'key' => YOUTUBE_API_KEY
        ]);
        
        $response = file_get_contents($url);
        if (!$response) {
            throw new Exception('Failed to fetch YouTube data');
        }
        
        $data = json_decode($response, true);
        $result['items_found'] = count($data['items'] ?? []);
        
        foreach ($data['items'] ?? [] as $item) {
            $videoId = $item['id']['videoId'];
            $title = $item['snippet']['title'];
            $description = $item['snippet']['description'];
            $publishDate = date('Y-m-d', strtotime($item['snippet']['publishedAt']));
            
            // Check if episode already exists
            $stmt = $db->prepare("SELECT id FROM episodes WHERE youtube_id = ?");
            $stmt->execute([$videoId]);
            
            if (!$stmt->fetch()) {
                // Get video details for duration
                $detailsUrl = 'https://www.googleapis.com/youtube/v3/videos?' . http_build_query([
                    'part' => 'contentDetails',
                    'id' => $videoId,
                    'key' => YOUTUBE_API_KEY
                ]);
                
                $detailsResponse = file_get_contents($detailsUrl);
                $details = json_decode($detailsResponse, true);
                $duration = '';
                
                if (isset($details['items'][0]['contentDetails']['duration'])) {
                    // Parse ISO 8601 duration
                    $interval = new DateInterval($details['items'][0]['contentDetails']['duration']);
                    $duration = sprintf('%d:%02d', $interval->h * 60 + $interval->i, $interval->s);
                }
                
                // Add new episode
                $stmt = $db->prepare("INSERT INTO episodes 
                    (title, description, publish_date, youtube_id, duration, status, source) 
                    VALUES (?, ?, ?, ?, ?, 'draft', 'youtube')");
                
                $stmt->execute([$title, $description, $publishDate, $videoId, $duration]);
                $result['items_added']++;
            }
        }
        
        // Log sync
        $stmt = $db->prepare("INSERT INTO sync_log (source, items_found, items_added, status) VALUES (?, ?, ?, ?)");
        $stmt->execute(['youtube', $result['items_found'], $result['items_added'], 'success']);
        
    } catch (Exception $e) {
        $result['status'] = 'error';
        $result['errors'][] = $e->getMessage();
        
        // Log error
        $stmt = $db->prepare("INSERT INTO sync_log (source, status, error_message) VALUES (?, ?, ?)");
        $stmt->execute(['youtube', 'error', $e->getMessage()]);
    }
    
    return $result;
}

// CLI support for cron jobs
if (php_sapi_name() === 'cli') {
    $results = syncAllSources();
    echo "Sync completed:\n";
    echo json_encode($results, JSON_PRETTY_PRINT) . "\n";
}