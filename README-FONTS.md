# Font Setup for Bricks Builder - CORRECTED

## Overview

**IMPORTANT**: I initially made an error and included the wrong fonts. Your current site uses **Montserrat** and **Inter**, not Outfit and Plus Jakarta Sans.

## Correct Fonts Used

Based on your `css/styles.css` file:
- **Primary/Heading Font**: Montserrat (weights: 400, 600, 700, 800, 900)
- **Secondary/Body Font**: Inter (weights: 400, 600, 700)

## Current Google Fonts Import

Your site currently imports these fonts via:
```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Inter:wght@400;600;700&display=swap');
```

## What's Provided

1. **`fonts.css`** - Font declarations ready for local hosting
2. **Folder structure** - You'll need to create:
   ```
   fonts/
   ├── montserrat/
   │   ├── Montserrat-Regular.ttf     (400)
   │   ├── Montserrat-SemiBold.ttf    (600)
   │   ├── Montserrat-Bold.ttf        (700)
   │   ├── Montserrat-ExtraBold.ttf   (800)
   │   ├── Montserrat-Black.ttf       (900)
   │   └── Montserrat-Variable.ttf    (100-900)
   └── inter/
       ├── Inter-Regular.ttf          (400)
       ├── Inter-SemiBold.ttf         (600)
       ├── Inter-Bold.ttf             (700)
       └── Inter-Variable.ttf         (100-900)
   ```

## How to Get the Font Files

### Option 1: Download from Google Fonts
1. Go to [Google Fonts - Montserrat](https://fonts.google.com/specimen/Montserrat)
2. Select weights: 400, 600, 700, 800, 900
3. Download font family
4. Go to [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)
5. Select weights: 400, 600, 700
6. Download font family

### Option 2: Use Font Squirrel or Similar Services
- Convert the Google Fonts to local files
- Generate webfont packages with all formats (TTF, WOFF, WOFF2)

## Installation for Bricks Builder

1. **Create the folder structure** above in your WordPress uploads or theme directory
2. **Upload all font files** to their respective folders
3. **Add the CSS** from `fonts.css` to your Bricks Builder custom CSS
4. **Update paths** in the CSS to match your hosting location
5. **Replace Google Fonts import** with your local fonts

## Style Config Integration

Your `style-config.json` is now correctly set to:
```json
{
  "heading-font-family": "Montserrat",
  "text-font-family": "Inter"
}
```

This matches your current site's typography exactly.

## Apologies for the Confusion

I initially looked at the `acss-old.json` file which had different fonts (Outfit and Plus Jakarta Sans) instead of checking your actual CSS file first. The configuration has been corrected to match your current Montserrat + Inter setup.