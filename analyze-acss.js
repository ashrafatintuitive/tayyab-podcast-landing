const fs = require('fs');

// Let's try to analyze the structure step by step
const jsonFile = '/Users/nerveband/wavedepth Dropbox/Ashraf Ali/Mac (2)/Documents/GitHub/tayyab-podcast-landing/acss-old.json';

try {
    console.log("Reading file...");
    const rawData = fs.readFileSync(jsonFile, 'utf8');
    console.log(`File size: ${rawData.length} characters`);
    
    console.log("Parsing JSON...");
    const data = JSON.parse(rawData);
    
    console.log("=== ACSS Configuration Analysis ===\n");
    
    console.log("MAIN CATEGORIES:");
    const mainKeys = Object.keys(data).sort();
    mainKeys.forEach((key, index) => {
        console.log(`${index + 1:2d}. ${key}`);
    });
    
    console.log(`\nTotal main categories: ${mainKeys.length}\n`);
    
    // Analyze each category
    console.log("=== CATEGORY DETAILS ===\n");
    
    mainKeys.forEach(category => {
        const content = data[category];
        console.log(`📁 ${category}`);
        console.log(`   Type: ${Array.isArray(content) ? 'Array' : typeof content}`);
        
        if (typeof content === 'object' && content !== null) {
            if (Array.isArray(content)) {
                console.log(`   Length: ${content.length}`);
                if (content.length > 0) {
                    console.log(`   First item: ${typeof content[0]} - ${JSON.stringify(content[0]).substring(0, 100)}...`);
                }
            } else {
                const keys = Object.keys(content);
                console.log(`   Properties: ${keys.length}`);
                if (keys.length > 0) {
                    console.log(`   Sample keys: [${keys.slice(0, 5).join(', ')}]${keys.length > 5 ? ` ...and ${keys.length - 5} more` : ''}`);
                }
            }
        } else {
            console.log(`   Value: ${String(content).substring(0, 50)}${String(content).length > 50 ? '...' : ''}`);
        }
        console.log('');
    });

} catch (error) {
    console.error(`Error: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
}