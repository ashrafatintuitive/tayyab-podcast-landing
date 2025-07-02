<?php
/**
 * Simple database initialization script
 * URL: https://themuslimnonprofitshow.com/podcast-crm/simple-init.php?key=init123
 */

// Security check
$secret_key = 'init123';
if (!isset($_GET['key']) || $_GET['key'] !== $secret_key) {
    http_response_code(403);
    die('Access denied. Use ?key=' . $secret_key);
}

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Initializing CRM Database</h2><pre>";

try {
    // Direct SQLite connection
    $db_path = __DIR__ . '/data/podcast.db';
    echo "Database path: $db_path\n";
    
    // Create data directory if it doesn't exist
    $data_dir = dirname($db_path);
    if (!is_dir($data_dir)) {
        mkdir($data_dir, 0755, true);
        echo "Created data directory\n";
    }
    
    // Connect to SQLite
    $db = new PDO('sqlite:' . $db_path);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected to database\n";
    
    // Create episodes table
    $create_table_sql = "CREATE TABLE IF NOT EXISTS episodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        guest TEXT,
        guest_title TEXT,
        duration TEXT,
        publish_date DATE,
        youtube_id TEXT,
        audio_url TEXT,
        featured INTEGER DEFAULT 0,
        tags TEXT,
        key_takeaways TEXT,
        status TEXT DEFAULT 'draft',
        source TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    $db->exec($create_table_sql);
    echo "Created episodes table\n";
    
    // Clear existing episodes
    $db->exec("DELETE FROM episodes");
    echo "Cleared existing episodes\n";
    
    // Episode data
    $episodes = [
        [
            'title' => 'Why Muslims Are Leaving the Masjid and How Dr. Jihad Turk Brought Them Back | Episode 5',
            'description' => 'What happens when a masjid is built—but no one comes? In this inspiring and thought-provoking episode of The Muslim Nonprofit Show with Tayyab Yunus, Dr. Jihad Turk shares his personal journey: from a disconnected Muslim teen in Arizona, to becoming a bridge-builder who helps create inclusive Muslim communities.',
            'guest' => 'Dr. Jihad Turk',
            'guest_title' => 'Islamic Scholar & Community Leader',
            'duration' => '38:00',
            'publish_date' => '2025-07-02',
            'youtube_id' => 'TKeJAruI9Nc',
            'audio_url' => 'https://audio.transistor.fm/episode-5.mp3',
            'featured' => 1,
            'tags' => 'masjid engagement,community building,youth connection',
            'key_takeaways' => '["Understanding why Muslims become disconnected","Creating inclusive environments","Bridging generational gaps"]',
            'status' => 'published',
            'source' => 'manual'
        ],
        [
            'title' => 'Built From the Ground Up: How Vision, Grit & Faith Created Real Change | Episode 4',
            'description' => 'In this powerful episode, we hear from Anwar Khan, an engineer who returned to Bangladesh in 2004 with a mission to help. Through deeply personal stories, we explore how he founded Obat Helpers.',
            'guest' => 'Anwar Khan',
            'guest_title' => 'Engineer & Founder, Obat Helpers',
            'duration' => '31:44',
            'publish_date' => '2025-06-25',
            'youtube_id' => 'EJC6u0GabzY',
            'audio_url' => 'https://audio.transistor.fm/episode-4.mp3',
            'featured' => 0,
            'tags' => 'refugee support,grassroots development,bangladesh',
            'key_takeaways' => '["Start small with sincere intention","Empower locals with lived experience","Trust in Allah for guidance"]',
            'status' => 'published',
            'source' => 'manual'
        ],
        [
            'title' => 'From Rainy Prayers to a Mega Masjid: A Journey of Vision & Trust',
            'description' => 'Imam Tariq Rashid shares his remarkable journey of transforming a small masjid into a 23,000 sq ft community hub—completely debt-free.',
            'guest' => 'Imam Tariq Rashid',
            'guest_title' => 'Imam, Islamic Center of Orlando',
            'duration' => '31:30',
            'publish_date' => '2025-06-18',
            'youtube_id' => '7hQml6-4SUM',
            'audio_url' => 'https://audio.transistor.fm/episode-3.mp3',
            'featured' => 0,
            'tags' => 'masjid development,community outreach,fundraising',
            'key_takeaways' => '["Community outreach before permits","Trust Allah for provisions","Building through genuine service"]',
            'status' => 'published',
            'source' => 'manual'
        ],
        [
            'title' => 'What It Really Takes to Build an Islamic School',
            'description' => 'Sister Magda Elkadi Saleh, a three-time founder of successful Islamic schools, shares deep insights into building sustainable Islamic educational institutions.',
            'guest' => 'Sister Magda Elkadi Saleh',
            'guest_title' => 'Three-time Islamic School Founder',
            'duration' => '23:00',
            'publish_date' => '2025-06-15',
            'youtube_id' => '7k5b8YxXqcs',
            'audio_url' => 'https://audio.transistor.fm/episode-2.mp3',
            'featured' => 0,
            'tags' => 'Islamic education,school founding,sustainability',
            'key_takeaways' => '["Build community trust first","Sustainable tuition strategies","Long-term commitment required"]',
            'status' => 'published',
            'source' => 'manual'
        ],
        [
            'title' => 'From Corporate to Cause: Launching The Muslim Non-Profit Show',
            'description' => 'Dr. Tayyab Yunus shares the inspiring why behind the show and his journey from corporate success to faith-driven service.',
            'guest' => 'Dr. Tayyab Yunus',
            'guest_title' => 'Host & Founder',
            'duration' => '07:20',
            'publish_date' => '2025-06-08',
            'youtube_id' => '2lWqsTKbD7A',
            'audio_url' => 'https://audio.transistor.fm/episode-1.mp3',
            'featured' => 0,
            'tags' => 'launch,mission,personal journey',
            'key_takeaways' => '["The mission behind the show","Common nonprofit challenges","Empowering Muslim changemakers"]',
            'status' => 'published',
            'source' => 'manual'
        ]
    ];
    
    // Insert episodes
    $stmt = $db->prepare("INSERT INTO episodes 
        (title, description, guest, guest_title, duration, publish_date, youtube_id, audio_url, featured, tags, key_takeaways, status, source) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    foreach ($episodes as $episode) {
        $stmt->execute([
            $episode['title'],
            $episode['description'],
            $episode['guest'],
            $episode['guest_title'],
            $episode['duration'],
            $episode['publish_date'],
            $episode['youtube_id'],
            $episode['audio_url'],
            $episode['featured'],
            $episode['tags'],
            $episode['key_takeaways'],
            $episode['status'],
            $episode['source']
        ]);
        echo "Added: " . substr($episode['title'], 0, 50) . "...\n";
    }
    
    // Verify
    $count = $db->query("SELECT COUNT(*) FROM episodes")->fetchColumn();
    echo "\n✅ Success! Added $count episodes to database\n";
    
    echo "\nNext steps:\n";
    echo "1. Go to: https://themuslimnonprofitshow.com/podcast-crm/admin/\n";
    echo "2. Login and verify episodes are showing\n";
    echo "3. Click 'Export All' to update the website\n";
    echo "4. Try 'Sync Sources' - it should work now!\n";
    
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