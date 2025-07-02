<?php
require_once __DIR__ . '/../config/config.php';

class Database {
    private static $instance = null;
    private $db;
    
    private function __construct() {
        try {
            $this->db = new PDO('sqlite:' . DB_PATH);
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->createTables();
        } catch(PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }
    
    public static function getInstance() {
        if (self::$instance == null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->db;
    }
    
    private function createTables() {
        $sql = "CREATE TABLE IF NOT EXISTS episodes (
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
        
        $this->db->exec($sql);
        
        // Create sync_log table
        $sql = "CREATE TABLE IF NOT EXISTS sync_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT NOT NULL,
            items_found INTEGER DEFAULT 0,
            items_added INTEGER DEFAULT 0,
            sync_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status TEXT,
            error_message TEXT
        )";
        
        $this->db->exec($sql);
    }
}

// Helper function to get database connection
function getDB() {
    return Database::getInstance()->getConnection();
}