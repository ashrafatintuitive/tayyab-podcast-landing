<?php
require_once __DIR__ . '/db.php';

function exportWebsiteContent() {
    try {
        // Load all content sections
        $dataDir = __DIR__ . '/../data/';
        $contentSections = [
            'hero' => 'hero_content.json',
            'stats' => 'stats_content.json',
            'mission' => 'mission_content.json',
            'social' => 'social_content.json',
            'meta' => 'meta_content.json',
            'footer' => 'footer_content.json'
        ];
        
        $websiteData = [];
        
        foreach ($contentSections as $section => $filename) {
            $filePath = $dataDir . $filename;
            if (file_exists($filePath)) {
                $content = file_get_contents($filePath);
                $websiteData[$section] = json_decode($content, true);
            }
        }
        
        // Generate JavaScript content
        $jsContent = "// Website content data for The Muslim Non-Profit Show\n";
        $jsContent .= "// Generated from CMS on " . date('Y-m-d H:i:s') . "\n\n";
        $jsContent .= "const websiteData = " . json_encode($websiteData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . ";\n\n";
        
        // Add export statement
        $jsContent .= "// Export for use in other scripts\n";
        $jsContent .= "if (typeof module !== 'undefined' && module.exports) {\n";
        $jsContent .= "    module.exports = { websiteData };\n";
        $jsContent .= "}\n";
        
        // Write to website-data.js
        $outputPath = SITE_PATH . 'js/website-data.js';
        $written = file_put_contents($outputPath, $jsContent);
        
        if ($written === false) {
            throw new Exception('Failed to write website-data.js file');
        }
        
        return [
            'status' => 'success',
            'message' => 'Exported website content to website-data.js',
            'sections_count' => count($websiteData),
            'file_path' => $outputPath
        ];
        
    } catch (Exception $e) {
        return [
            'status' => 'error',
            'message' => $e->getMessage()
        ];
    }
}

// CLI support
if (php_sapi_name() === 'cli') {
    $result = exportWebsiteContent();
    echo json_encode($result, JSON_PRETTY_PRINT) . "\n";
}