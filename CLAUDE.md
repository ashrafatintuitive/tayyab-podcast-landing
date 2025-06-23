# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static landing page for "The Muslim Non-Profit Show" podcast. It's built with vanilla JavaScript, HTML, and CSS - no frameworks or build tools required.

## Development Commands

```bash
# Start development server (uses Python 3's HTTP server)
npm run dev
# or
npm start

# Alternative development server (uses npx serve)
npm run serve
# or
npm run preview
```

## Architecture

The site follows a simple static structure:

- **index.html** - Single page application entry point
- **css/styles.css** - All styling with modern CSS features (grid, flexbox, custom properties, glass morphism)
- **js/main.js** - Core application logic in `PodcastWebsite` class
- **js/episodes.js** - Episode data and management

Key architectural patterns:
- Single Page Application with smooth scrolling navigation
- Component-like structure using vanilla JS classes
- Lazy loading for performance
- Mobile-first responsive design

## Important Implementation Details

1. **Episode Management**: Episodes are managed in `js/episodes.js` with featured/grid display logic
2. **Navigation**: Floating dots navigation with smooth scrolling to sections
3. **Newsletter Form**: Currently using EveryAction integration (see recent commits)
4. **Styling**: Dark theme with glass morphism effects, uses CSS custom properties for theming
5. **No Build Process**: Direct file editing - what you write is what gets served

## Deployment

This is a static site ready for deployment to any hosting service (Netlify, Vercel, GitHub Pages, etc.). No build step required.

## Recent Changes

The codebase recently integrated an EveryAction form for newsletter subscriptions. Related commits show styling adjustments to prevent flash of unstyled content.

## Standard Operating Procedures

### Adding New Podcast Episodes

To add a new episode to the website:

1. **Edit `js/episodes.js`** - Add a new episode object to the `episodes` array with the following structure:
   ```javascript
   {
       id: [next_sequential_number],
       title: "Episode Title",
       description: "Full episode description",
       guest: "Guest Name",
       guestTitle: "Guest's Title/Organization",
       duration: "MM:SS",
       publishDate: "YYYY-MM-DD",
       youtubeId: "YouTube_Video_ID",  // Extract from YouTube URL after v=
       audioUrl: "https://audio.transistor.fm/episode-[number].mp3",
       featured: true/false,  // Set to true for the latest episode, false for others
       tags: ["tag1", "tag2", "tag3"],  // Relevant topic tags
       keyTakeaways: [
           "Key takeaway 1",
           "Key takeaway 2",
           "Key takeaway 3",
           "Key takeaway 4"
       ]
   }
   ```

2. **Update episode count** - Increment `totalEpisodes` in the `stats` object

3. **Set featured status** - Only one episode should have `featured: true` (typically the latest)

4. **Extract YouTube ID** - From a URL like `https://www.youtube.com/watch?v=7hQml6-4SUM`, the ID is `7hQml6-4SUM`

5. **No build required** - Changes take effect immediately upon saving

## IMPORTANT: Sound Notification

After finishing responding to my request or running a command, run this command to notify me by sound:

```bash
afplay /System/Library/Sounds/Funk.aiff
```