#!/usr/bin/env node

/**
 * Style Config Updater for Bricks Builder
 * Reads style-config.json and generates CSS/SCSS for Bricks Builder
 */

const fs = require('fs');
const path = require('path');

class StyleUpdater {
    constructor(configPath = './style-config.json') {
        this.configPath = configPath;
        this.config = null;
        this.loadConfig();
    }

    loadConfig() {
        try {
            const configData = fs.readFileSync(this.configPath, 'utf8');
            this.config = JSON.parse(configData);
            console.log('✅ Style config loaded successfully');
        } catch (error) {
            console.error('❌ Error loading config:', error.message);
            process.exit(1);
        }
    }

    generateCSSVariables() {
        let css = '/* Auto-generated CSS Variables from style-config.json */\n';
        css += ':root {\n';

        // Colors
        this.addColorsToCSS(css, this.config.colors);

        // Typography
        if (this.config.typography.fonts) {
            Object.entries(this.config.typography.fonts).forEach(([key, font]) => {
                css += `  --font-${key}: ${font.family};\n`;
            });
        }

        // Spacing
        if (this.config.spacing.scale) {
            Object.entries(this.config.spacing.scale).forEach(([key, value]) => {
                css += `  --spacing-${key}: ${value};\n`;
            });
        }

        css += '}\n\n';
        return css;
    }

    addColorsToCSS(css, colors, prefix = '') {
        Object.entries(colors).forEach(([key, value]) => {
            if (typeof value === 'object' && value.css_var) {
                // Direct color with CSS variable
                css += `  ${value.css_var}: ${value.value};\n`;
            } else if (typeof value === 'object' && !value.css_var) {
                // Nested color object
                this.addColorsToCSS(css, value, `${prefix}${key}-`);
            }
        });
        return css;
    }

    generateUtilityClasses() {
        let css = '/* Auto-generated Utility Classes */\n\n';

        // Typography utilities
        css += '/* Typography */\n';
        Object.entries(this.config.typography.headings).forEach(([heading, props]) => {
            css += `.${heading} {\n`;
            css += `  font-size: ${props.size};\n`;
            css += `  font-weight: ${props.weight};\n`;
            css += `  line-height: ${props.line_height};\n`;
            css += '}\n\n';

            // Mobile responsive
            if (props.size_mobile) {
                css += `@media (max-width: ${this.config.breakpoints.mobile}) {\n`;
                css += `  .${heading} {\n`;
                css += `    font-size: ${props.size_mobile};\n`;
                css += '  }\n';
                css += '}\n\n';
            }
        });

        // Spacing utilities
        css += '/* Spacing Utilities */\n';
        Object.entries(this.config.spacing.scale).forEach(([key, value]) => {
            // Margin utilities
            css += `.m-${key} { margin: ${value}; }\n`;
            css += `.mt-${key} { margin-top: ${value}; }\n`;
            css += `.mb-${key} { margin-bottom: ${value}; }\n`;
            css += `.ml-${key} { margin-left: ${value}; }\n`;
            css += `.mr-${key} { margin-right: ${value}; }\n`;
            css += `.mx-${key} { margin-left: ${value}; margin-right: ${value}; }\n`;
            css += `.my-${key} { margin-top: ${value}; margin-bottom: ${value}; }\n`;

            // Padding utilities
            css += `.p-${key} { padding: ${value}; }\n`;
            css += `.pt-${key} { padding-top: ${value}; }\n`;
            css += `.pb-${key} { padding-bottom: ${value}; }\n`;
            css += `.pl-${key} { padding-left: ${value}; }\n`;
            css += `.pr-${key} { padding-right: ${value}; }\n`;
            css += `.px-${key} { padding-left: ${value}; padding-right: ${value}; }\n`;
            css += `.py-${key} { padding-top: ${value}; padding-bottom: ${value}; }\n`;
        });

        css += '\n';

        // Component utilities
        if (this.config.bricks_builder && this.config.bricks_builder.global_classes) {
            css += '/* Global Classes for Bricks Builder */\n';
            Object.entries(this.config.bricks_builder.global_classes).forEach(([className, props]) => {
                css += `.${className} {\n`;
                css += `  ${props.css}\n`;
                css += '}\n\n';
            });
        }

        return css;
    }

    generateBricksConfig() {
        const bricksConfig = {
            version: '1.0',
            theme_name: this.config.project.name,
            colors: {},
            typography: {},
            spacing: this.config.spacing.scale,
            global_classes: this.config.bricks_builder?.global_classes || {}
        };

        // Process colors for Bricks format
        this.processBricksColors(this.config.colors, bricksConfig.colors);

        // Process typography
        bricksConfig.typography = {
            fonts: this.config.typography.fonts,
            headings: this.config.typography.headings,
            body: this.config.typography.body
        };

        return bricksConfig;
    }

    processBricksColors(colors, output, prefix = '') {
        Object.entries(colors).forEach(([key, value]) => {
            if (typeof value === 'object' && value.css_var && value.value) {
                output[`${prefix}${key}`] = {
                    name: value.name,
                    value: value.value,
                    css_var: value.css_var
                };
            } else if (typeof value === 'object' && !value.css_var) {
                this.processBricksColors(value, output, `${prefix}${key}_`);
            }
        });
    }

    generateAnimationCSS() {
        let css = '/* Auto-generated Animations */\n\n';

        css += `@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInUp {
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

/* Animation Utility Classes */
.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.animate-slide-up {
  animation: slideInUp 0.6s ease-out forwards;
}

`;

        return css;
    }

    async writeFiles() {
        try {
            // Generate CSS variables
            const cssVariables = this.generateCSSVariables();
            fs.writeFileSync('./css/variables.css', cssVariables);
            console.log('✅ Generated css/variables.css');

            // Generate utility classes
            const utilityCSS = this.generateUtilityClasses();
            fs.writeFileSync('./css/utilities.css', utilityCSS);
            console.log('✅ Generated css/utilities.css');

            // Generate animations
            const animationCSS = this.generateAnimationCSS();
            fs.writeFileSync('./css/animations.css', animationCSS);
            console.log('✅ Generated css/animations.css');

            // Generate Bricks Builder config
            const bricksConfig = this.generateBricksConfig();
            fs.writeFileSync('./bricks-config.json', JSON.stringify(bricksConfig, null, 2));
            console.log('✅ Generated bricks-config.json');

            // Update main CSS file to import generated files
            this.updateMainCSS();

            console.log('🎉 All style files updated successfully!');
        } catch (error) {
            console.error('❌ Error writing files:', error.message);
        }
    }

    updateMainCSS() {
        const mainCSSPath = './css/styles.css';
        let mainCSS = fs.readFileSync(mainCSSPath, 'utf8');

        // Add imports at the top if not already present
        const imports = [
            '@import url("variables.css");',
            '@import url("utilities.css");',
            '@import url("animations.css");'
        ];

        let hasImports = false;
        imports.forEach(importLine => {
            if (!mainCSS.includes(importLine)) {
                mainCSS = importLine + '\n' + mainCSS;
                hasImports = true;
            }
        });

        if (hasImports) {
            fs.writeFileSync(mainCSSPath, mainCSS);
            console.log('✅ Updated main CSS with imports');
        }
    }

    watchForChanges() {
        console.log('👀 Watching for changes to style-config.json...');
        fs.watchFile(this.configPath, (curr, prev) => {
            console.log('📝 Config file changed, regenerating styles...');
            this.loadConfig();
            this.writeFiles();
        });
    }

    // CLI methods
    static showHelp() {
        console.log(`
Style Config Updater for Bricks Builder

Usage:
  node update-styles.js [command]

Commands:
  generate    Generate all CSS files from config (default)
  watch       Watch for config changes and auto-regenerate
  validate    Validate the config file
  help        Show this help message

Examples:
  node update-styles.js
  node update-styles.js generate
  node update-styles.js watch
        `);
    }

    validateConfig() {
        const requiredFields = ['project', 'colors', 'typography', 'spacing'];
        const errors = [];

        requiredFields.forEach(field => {
            if (!this.config[field]) {
                errors.push(`Missing required field: ${field}`);
            }
        });

        if (errors.length > 0) {
            console.error('❌ Config validation failed:');
            errors.forEach(error => console.error(`  - ${error}`));
            return false;
        }

        console.log('✅ Config validation passed');
        return true;
    }
}

// CLI Interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0] || 'generate';

    const updater = new StyleUpdater();

    switch (command) {
        case 'generate':
            if (updater.validateConfig()) {
                updater.writeFiles();
            }
            break;

        case 'watch':
            if (updater.validateConfig()) {
                updater.writeFiles();
                updater.watchForChanges();
            }
            break;

        case 'validate':
            updater.validateConfig();
            break;

        case 'help':
        case '--help':
        case '-h':
            StyleUpdater.showHelp();
            break;

        default:
            console.error(`Unknown command: ${command}`);
            StyleUpdater.showHelp();
            process.exit(1);
    }
}

module.exports = StyleUpdater;