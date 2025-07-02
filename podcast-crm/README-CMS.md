# Podcast CRM - Enhanced Content Management System

This CRM now manages both podcast episodes AND all website content for The Muslim Non-Profit Show.

## Features

### Episode Management
- Create, edit, and delete podcast episodes
- Sync with RSS feed and YouTube channel
- Track episode status (published/draft)
- Export episodes to `episodes.js` for the website

### Website Content Management (NEW)
- Edit all text content on the website through a user-friendly interface
- Sections include:
  - **Hero Section**: Badge text, title, byline, description, and CTAs
  - **Statistics**: All 4 stat values and labels
  - **Mission**: Section title and all paragraphs
  - **Social Links**: All social media and podcast platform URLs
  - **SEO/Meta**: Page title, description, keywords, and OG image
  - **Footer**: Footer content and contact information

## How to Use

### Accessing the CRM
1. Navigate to `/podcast-crm/admin/`
2. Log in with your credentials
3. You'll see the main dashboard with episode stats

### Managing Episodes
1. Click "Episodes" to view all episodes
2. Click "New Episode" to add a new one
3. Use "Sync Sources" to pull latest from RSS/YouTube
4. Use "Export All" to save all changes to the website

### Managing Website Content
1. Click "Site Content" in the navigation
2. Select the content section you want to edit from the tabs
3. Make your changes in the form fields
4. Click "Save [Section] Content" to save changes
5. Click "Export All" to apply changes to the live website

### Content Export Process
When you click "Export All":
1. Episodes are synced from external sources
2. All episodes are exported to `js/episodes.js`
3. All website content is exported to `js/website-data.js`
4. The website automatically loads the new content

## Technical Details

### File Structure
```
podcast-crm/
├── admin/          # Frontend interface
├── api/            # PHP backend
├── data/           # JSON storage
│   └── website-content.json  # Stores all website content
└── README-CMS.md   # This file
```

### Data Flow
1. Content is edited in the CMS admin interface
2. Saved to JSON files in the `data/` directory
3. Exported to JavaScript files in the main website
4. Website loads content dynamically on page load

### API Endpoints
- `GET /api/website-content` - Get all content
- `PUT /api/website-content/{section}` - Update a section
- `POST /api/export-all` - Export everything

## Important Notes

- Always click "Export All" after making changes to apply them to the website
- The CMS stores content separately from the website for safety
- Website will fall back to default content if exports are missing
- All changes are immediate once exported - be careful!

## Troubleshooting

If content isn't updating on the website:
1. Make sure you clicked "Export All" after saving
2. Clear your browser cache
3. Check the browser console for JavaScript errors
4. Verify `js/website-data.js` was updated (check timestamp)

## Future Enhancements

Possible improvements:
- Image upload for hero section and OG image
- Preview changes before export
- Revision history
- Backup/restore functionality