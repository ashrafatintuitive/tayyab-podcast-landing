<?php
/**
 * Initialize CRM database with the latest 5 episodes
 * Run this script at: https://themuslimnonprofitshow.com/podcast-crm/init-episodes.php
 */

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    require_once __DIR__ . '/config/config.php';
    require_once __DIR__ . '/api/db.php';
} catch (Exception $e) {
    die('Config/DB Error: ' . $e->getMessage());
}

// Security check
$secret_key = 'init123';
if (!isset($_GET['key']) || $_GET['key'] !== $secret_key) {
    http_response_code(403);
    die('Access denied. Use ?key=' . $secret_key);
}

// Get database connection
$db = getDB();

// Episodes data matching what's in episodes.js
$episodes_data = [
    [
        'title' => 'Why Muslims Are Leaving the Masjid and How Dr. Jihad Turk Brought Them Back | Episode 5',
        'description' => 'What happens when a masjid is built—but no one comes? In this inspiring and thought-provoking episode of The Muslim Nonprofit Show with Tayyab Yunus, Dr. Jihad Turk shares his personal journey: from a disconnected Muslim teen in Arizona, to becoming a bridge-builder who helps create inclusive Muslim communities. Through his work with institutions like the Islamic Center of Southern California and Bayan Claremont, he reveals practical strategies for engaging disaffected Muslims and building thriving, welcoming communities.',
        'guest' => 'Dr. Jihad Turk',
        'guest_title' => 'Islamic Scholar & Community Leader',
        'duration' => '38:00',
        'publish_date' => '2025-07-02',
        'youtube_id' => 'TKeJAruI9Nc',
        'audio_url' => 'https://audio.transistor.fm/episode-5.mp3',
        'featured' => 1,
        'tags' => 'masjid engagement,community building,youth connection,islamic leadership,inclusion',
        'key_takeaways' => json_encode([
            'Understanding why Muslims become disconnected from the masjid',
            'Creating inclusive environments that welcome all Muslims',
            'Bridging generational and cultural gaps in Muslim communities',
            'Practical strategies for re-engaging disaffected Muslims',
            'Building leadership that reflects community diversity'
        ])
    ],
    [
        'title' => 'Built From the Ground Up: How Vision, Grit & Faith Created Real Change | Episode 4',
        'description' => 'In this powerful episode of The Muslim Non-profit Show with Tayyab Yunus, we hear from Anwar Khan, an engineer from the U.S. who returned to Bangladesh in 2004 with a simple mission: adopt a family and help however he could. What he didn't expect was that a single bathroom would turn into an entire movement. Through deeply personal stories, we explore how Anwar went from helping one refugee camp to founding Obat Helpers, now employing over 350 people across 12 schools, IT centers, clinics, and more—staffed by the very people the world forgot.',
        'guest' => 'Anwar Khan',
        'guest_title' => 'Engineer & Founder, Obat Helpers',
        'duration' => '31:44',
        'publish_date' => '2025-06-25',
        'youtube_id' => 'EJC6u0GabzY',
        'audio_url' => 'https://audio.transistor.fm/episode-4.mp3',
        'featured' => 0,
        'tags' => 'refugee support,grassroots development,bangladesh,humanitarian,empowerment,obat helpers',
        'key_takeaways' => json_encode([
            'Visit and understand the ground reality before starting any initiative',
            'Start small - even if no one else is working on the problem',
            'Empower locals who understand the pain and have lived experience',
            'Use your time and skills if you don\'t have funds to contribute',
            'Trust in Allah\'s help and make sincere dua for guidance',
            'Build your team from those who share your passion and vision'
        ])
    ],
    [
        'title' => 'From Rainy Prayers to a Mega Masjid: A Journey of Vision & Trust',
        'description' => 'In this powerful episode of The Muslim Non-profit Show with Tayyab Yunus, we sit down with Imam Tariq Rashid from the Islamic Center of Orlando, located just outside Disney World, to uncover his remarkable journey of transforming a small masjid into a 23,000 sq ft community hub—completely debt-free. He shares heartfelt stories of early struggles, opposition, the value of outreach to non-Muslim neighbors, and the critical mindset needed to grow a masjid successfully.',
        'guest' => 'Imam Tariq Rashid',
        'guest_title' => 'Imam, Islamic Center of Orlando',
        'duration' => '31:30',
        'publish_date' => '2025-06-18',
        'youtube_id' => '7hQml6-4SUM',
        'audio_url' => 'https://audio.transistor.fm/episode-3.mp3',
        'featured' => 0,
        'tags' => 'masjid development,community outreach,fundraising,interfaith relations,leadership',
        'key_takeaways' => json_encode([
            'Transforming a small masjid into a 23,000 sq ft community hub debt-free',
            'The importance of outreach to non-Muslim neighbors before permits',
            'Fundraising challenges and trusting Allah for miraculous provisions',
            'Board dynamics, imam leadership, and wearing multiple hats',
            'Building community trust through genuine service'
        ])
    ],
    [
        'title' => 'What It Really Takes to Build an Islamic School',
        'description' => 'Sister Magda Elkadi Saleh, a three-time founder of successful Islamic schools in Tampa, Florida, shares deep insights into what it really takes to build, sustain, and scale Islamic educational institutions. With over 32 years of experience, she discusses community trust, sustainable models, and the mindset needed to serve diverse Muslim families.',
        'guest' => 'Sister Magda Elkadi Saleh',
        'guest_title' => 'Three-time Islamic School Founder, Tampa, FL',
        'duration' => '23:00',
        'publish_date' => '2025-06-15',
        'youtube_id' => '7k5b8YxXqcs',
        'audio_url' => 'https://audio.transistor.fm/episode-2.mp3',
        'featured' => 0,
        'tags' => 'Islamic education,school founding,community building,educational leadership,sustainability',
        'key_takeaways' => json_encode([
            'Why she started three different Islamic schools and their unique models',
            'Building community trust and sustainable tuition strategies',
            'Staffing challenges and building a committed team',
            'Long-term commitment and mission-market fit for Islamic institutions'
        ])
    ],
    [
        'title' => 'From Corporate to Cause: Launching The Muslim Non-Profit Show',
        'description' => 'How do you launch and lead a successful Muslim non-profit? In this very first episode, Dr. Tayyab Yunus shares the inspiring \'why\' behind the show, his personal journey from corporate success to faith-driven service, and how Muslim-led organizations can change the world.',
        'guest' => 'Dr. Tayyab Yunus',
        'guest_title' => 'Host & Founder, The Muslim Non-Profit Show',
        'duration' => '07:20',
        'publish_date' => '2025-06-08',
        'youtube_id' => '2lWqsTKbD7A',
        'audio_url' => 'https://audio.transistor.fm/episode-1.mp3',
        'featured' => 0,
        'tags' => 'launch,mission,personal journey,non-profit challenges,changemakers',
        'key_takeaways' => json_encode([
            'The mission behind The Muslim Non-Profit Show',
            'Common challenges in the non-profit space',
            'Tayyab\'s journey from corporate to faith-driven service',
            'Empowering the next generation of Muslim changemakers'
        ])
    ]
];

echo "<h2>Initializing CRM Database with Episodes</h2>";
echo "<pre>";

try {
    // Start transaction
    $db->beginTransaction();
    
    // Clear existing episodes (optional - comment out if you want to keep existing)
    $db->exec("DELETE FROM episodes");
    echo "Cleared existing episodes\n";
    
    // Insert episodes
    $stmt = $db->prepare("INSERT INTO episodes 
        (title, description, guest, guest_title, duration, publish_date, youtube_id, audio_url, featured, tags, key_takeaways, status, source) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', 'manual')");
    
    foreach ($episodes_data as $index => $episode) {
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
            $episode['key_takeaways']
        ]);
        echo "Added episode: " . substr($episode['title'], 0, 50) . "...\n";
    }
    
    // Commit transaction
    $db->commit();
    
    // Verify count
    $count = $db->query("SELECT COUNT(*) FROM episodes")->fetchColumn();
    echo "\nTotal episodes in database: $count\n";
    
    echo "\n✅ Database initialized successfully!\n";
    echo "\nNext steps:\n";
    echo "1. Go to https://themuslimnonprofitshow.com/podcast-crm/admin/\n";
    echo "2. Login and verify the episodes are showing\n";
    echo "3. Click 'Export All' to update the website\n";
    echo "4. Delete this file for security\n";
    
} catch (Exception $e) {
    $db->rollBack();
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "</pre>";

// Provide link to delete this file
echo '<br><br><a href="?delete=1&key=' . $secret_key . '" style="background: red; color: white; padding: 10px; text-decoration: none;">Delete This File</a>';

// Handle deletion
if (isset($_GET['delete']) && $_GET['delete'] == '1') {
    unlink(__FILE__);
    echo "<script>alert('File deleted successfully'); window.location.href='/podcast-crm/';</script>";
}
?>