<?php
require_once __DIR__ . '/db.php';

// Check authentication for all API endpoints
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

// Parse request
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'] ?? '', '/'));
$endpoint = $request[0] ?? '';
$id = $request[1] ?? null;

// Handle preflight requests
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Route request
switch ($endpoint) {
    case 'episodes':
        handleEpisodes($method, $id);
        break;
    case 'sync':
        handleSync($method);
        break;
    case 'export':
        handleExport($method);
        break;
    case 'stats':
        handleStats($method);
        break;
    case 'website-content':
        handleWebsiteContent($method, $id);
        break;
    case 'export-all':
        handleExportAll($method);
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
}

function handleEpisodes($method, $id) {
    $db = getDB();
    
    switch ($method) {
        case 'GET':
            if ($id) {
                // Get single episode
                $stmt = $db->prepare("SELECT * FROM episodes WHERE id = ?");
                $stmt->execute([$id]);
                $episode = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($episode) {
                    $episode['tags'] = !empty($episode['tags']) ? explode(',', $episode['tags']) : [];
                    $episode['key_takeaways'] = !empty($episode['key_takeaways']) ? explode('|', $episode['key_takeaways']) : [];
                    echo json_encode($episode);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Episode not found']);
                }
            } else {
                // Get all episodes
                $status = $_GET['status'] ?? null;
                $sql = "SELECT * FROM episodes";
                if ($status) {
                    $sql .= " WHERE status = :status";
                }
                $sql .= " ORDER BY publish_date DESC";
                
                $stmt = $db->prepare($sql);
                if ($status) {
                    $stmt->bindParam(':status', $status);
                }
                $stmt->execute();
                
                $episodes = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($episodes as &$episode) {
                    $episode['tags'] = !empty($episode['tags']) ? explode(',', $episode['tags']) : [];
                    $episode['key_takeaways'] = !empty($episode['key_takeaways']) ? explode('|', $episode['key_takeaways']) : [];
                }
                
                echo json_encode($episodes);
            }
            break;
            
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $db->prepare("INSERT INTO episodes 
                (title, description, guest, guest_title, duration, publish_date, 
                 youtube_id, audio_url, featured, tags, key_takeaways, status, source) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            
            $stmt->execute([
                $data['title'],
                $data['description'],
                $data['guest'] ?? null,
                $data['guest_title'] ?? null,
                $data['duration'] ?? null,
                $data['publish_date'] ?? null,
                $data['youtube_id'] ?? null,
                $data['audio_url'] ?? null,
                $data['featured'] ?? 0,
                is_array($data['tags'] ?? []) ? implode(',', $data['tags']) : ($data['tags'] ?? ''),
                is_array($data['key_takeaways'] ?? []) ? implode('|', $data['key_takeaways']) : ($data['key_takeaways'] ?? ''),
                $data['status'] ?? 'draft',
                $data['source'] ?? 'manual'
            ]);
            
            $id = $db->lastInsertId();
            echo json_encode(['id' => $id, 'message' => 'Episode created successfully']);
            break;
            
        case 'PUT':
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Episode ID required']);
                break;
            }
            
            $data = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $db->prepare("UPDATE episodes SET 
                title = ?, description = ?, guest = ?, guest_title = ?, 
                duration = ?, publish_date = ?, youtube_id = ?, audio_url = ?, 
                featured = ?, tags = ?, key_takeaways = ?, status = ?, 
                updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?");
            
            $stmt->execute([
                $data['title'],
                $data['description'],
                $data['guest'] ?? null,
                $data['guest_title'] ?? null,
                $data['duration'] ?? null,
                $data['publish_date'] ?? null,
                $data['youtube_id'] ?? null,
                $data['audio_url'] ?? null,
                $data['featured'] ?? 0,
                is_array($data['tags'] ?? []) ? implode(',', $data['tags']) : ($data['tags'] ?? ''),
                is_array($data['key_takeaways'] ?? []) ? implode('|', $data['key_takeaways']) : ($data['key_takeaways'] ?? ''),
                $data['status'] ?? 'draft',
                $id
            ]);
            
            echo json_encode(['message' => 'Episode updated successfully']);
            break;
            
        case 'DELETE':
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Episode ID required']);
                break;
            }
            
            $stmt = $db->prepare("DELETE FROM episodes WHERE id = ?");
            $stmt->execute([$id]);
            
            echo json_encode(['message' => 'Episode deleted successfully']);
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
}

function handleSync($method) {
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    
    // This will trigger the sync process
    require_once __DIR__ . '/sync.php';
    $result = syncAllSources();
    echo json_encode($result);
}

function handleExport($method) {
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    
    // First sync sources to get latest episodes
    require_once __DIR__ . '/sync.php';
    $syncResult = syncAllSources();
    
    // Then export to episodes.js
    require_once __DIR__ . '/export.php';
    $exportResult = exportToEpisodesJs();
    
    // Combine results
    $result = [
        'sync' => $syncResult,
        'export' => $exportResult,
        'message' => 'Synced and exported successfully'
    ];
    
    echo json_encode($result);
}

function handleStats($method) {
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    
    $db = getDB();
    
    $stats = [
        'total_episodes' => $db->query("SELECT COUNT(*) FROM episodes")->fetchColumn(),
        'published_episodes' => $db->query("SELECT COUNT(*) FROM episodes WHERE status = 'published'")->fetchColumn(),
        'draft_episodes' => $db->query("SELECT COUNT(*) FROM episodes WHERE status = 'draft'")->fetchColumn(),
        'last_sync' => $db->query("SELECT sync_date FROM sync_log ORDER BY sync_date DESC LIMIT 1")->fetchColumn()
    ];
    
    echo json_encode($stats);
}

function handleWebsiteContent($method, $section) {
    $dataDir = __DIR__ . '/../data/';
    
    switch ($method) {
        case 'GET':
            if ($section) {
                // Get specific section
                $sectionFile = $dataDir . $section . '_content.json';
                if (file_exists($sectionFile)) {
                    $content = json_decode(file_get_contents($sectionFile), true);
                    echo json_encode($content);
                } else {
                    $defaultContent = getDefaultWebsiteContent();
                    echo json_encode($defaultContent[$section] ?? []);
                }
            } else {
                // Get all content
                $allContent = [];
                $sections = ['hero', 'stats', 'mission', 'social', 'meta', 'footer'];
                
                foreach ($sections as $sec) {
                    $sectionFile = $dataDir . $sec . '_content.json';
                    if (file_exists($sectionFile)) {
                        $allContent[$sec] = json_decode(file_get_contents($sectionFile), true);
                    }
                }
                
                if (empty($allContent)) {
                    $allContent = getDefaultWebsiteContent();
                }
                
                echo json_encode($allContent);
            }
            break;
            
        case 'PUT':
            if (!$section) {
                http_response_code(400);
                echo json_encode(['error' => 'Section required']);
                break;
            }
            
            // Save section content to separate file
            $sectionFile = $dataDir . $section . '_content.json';
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (file_put_contents($sectionFile, json_encode($data, JSON_PRETTY_PRINT))) {
                echo json_encode(['message' => 'Content saved successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to save content']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
}

function handleExportAll($method) {
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    
    // Export episodes
    require_once __DIR__ . '/export.php';
    $episodesExport = exportToEpisodesJs();
    
    // Export website content
    require_once __DIR__ . '/export-content.php';
    $websiteExport = exportWebsiteContent();
    
    echo json_encode([
        'success' => true,
        'episodes' => $episodesExport,
        'website' => $websiteExport,
        'message' => 'All content exported successfully'
    ]);
}

function getDefaultWebsiteContent() {
    return [
        'hero' => [
            'badge' => 'Breaking The 95% Failure Rate',
            'title' => 'The Muslim Non-Profit Show',
            'byline' => 'With Tayyab Yunus',
            'description' => 'Every week, discover the untold stories of Muslim changemakers who defied the odds, scaled their impact, and built organizations that serve humanity while experiencing true Islam—peace.',
            'cta1' => 'Watch Episodes',
            'cta2' => 'Meet Tayyab',
            'cta3' => 'Sign Up for Updates'
        ],
        'stats' => [
            'stat1_value' => '20+',
            'stat1_label' => 'Years Experience in Social Enterprise',
            'stat2_value' => '8K',
            'stat2_label' => 'Muslim Non-Profits Stuck in Startup',
            'stat3_value' => '95%',
            'stat3_label' => 'Failure Rate We\'re Breaking',
            'stat4_value' => '∞',
            'stat4_label' => 'Impact When They Scale'
        ],
        'mission' => [
            'title' => 'A World Served by Muslims Experiences Islam',
            'paragraph1' => 'Islam means peace. And in a world desperately searching for peace, we believe the path forward is through service—serving others, serving humanity.',
            'paragraph2' => 'This show brings together the founders, funders, rising stars, and changemakers who\'ve cracked the code. They\'ll share the insights that helped them navigate the dark nights, overcome the hurdles, and scale their organizations beyond startup.',
            'paragraph3' => 'Because the mentors and teachers who share their wisdom are often what makes the difference between failure and transformational impact.'
        ],
        'social' => [
            'title' => 'Follow The Journey',
            'youtube' => 'https://www.youtube.com/@tayyabyunus',
            'instagram' => 'https://www.instagram.com/tayyabyunus/',
            'facebook' => 'https://www.facebook.com/tayyabyunus',
            'linkedin' => 'https://linkedin.com/in/tayyabyunus',
            'apple_podcasts' => 'https://podcasts.apple.com/us/podcast/the-muslim-non-profit-show-with-tayyab-yunus/id1818343671',
            'spotify' => 'https://open.spotify.com/show/0N3Iy4641bzCvN2kCvmm8W',
            'iheart' => 'https://www.iheart.com/podcast/263-the-muslim-non-profit-show-279134715/'
        ],
        'meta' => [
            'title' => 'The Muslim Non-Profit Show with Tayyab Yunus',
            'description' => 'Breaking the 95% failure rate in Muslim non-profits through powerful stories and actionable insights. Weekly conversations with changemakers who\'ve scaled their impact.',
            'keywords' => 'Muslim non-profit, social entrepreneurship, Tayyab Yunus, podcast, changemakers, impact scaling, Islamic philanthropy',
            'og_image' => 'https://themuslimnonprofitshow.com/images/og-image.jpg',
            'url' => 'https://themuslimnonprofitshow.com/'
        ],
        'footer' => [
            'title' => 'The Muslim Non-Profit Show',
            'tagline' => 'Making the world a better place, one story at a time.',
            'tayyab_url' => 'https://tayyabyunus.com/',
            'email' => 'hello@tayyabyunus.com'
        ]
    ];
}

