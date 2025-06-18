// Episode data structure for The Muslim Non-Profit Show
const podcastData = {
    // Main podcast information
    info: {
        title: "The Muslim Non-Profit Show",
        host: "Tayyab Yunus",
        description: "Breaking the 95% failure rate in Muslim non-profits through powerful stories and actionable insights.",
        cover: "images/podcast-cover.jpg",
        websiteUrl: "https://themuslimnonprofitshow.com",
        rssUrl: "https://feeds.transistor.fm/the-muslim-nonprofit-show"
    },

    // Podcast directories with links
    directories: [
        {
            name: "Apple Podcasts",
            url: "https://podcasts.apple.com/us/podcast/the-muslim-non-profit-show-with-tayyab-yunus/id1818343671",
            icon: "apple",
            color: "#000000"
        },
        {
            name: "Spotify",
            url: "https://open.spotify.com/show/0N3Iy4641bzCvN2kCvmm8W",
            icon: "spotify",
            color: "#1DB954"
        },
        {
            name: "iHeartRadio",
            url: "https://www.iheart.com/podcast/263-the-muslim-non-profit-show-279134715/",
            icon: "iheart",
            color: "#C6002B"
        },
        {
            name: "Google Podcasts",
            url: "https://podcasts.google.com/feed/muslim-nonprofit-show",
            icon: "google",
            color: "#4285F4"
        },
        {
            name: "Overcast",
            url: "https://overcast.fm/itunes/muslim-nonprofit-show",
            icon: "overcast",
            color: "#FC7E0F"
        },
        {
            name: "Pocket Casts",
            url: "https://pca.st/muslim-nonprofit-show",
            icon: "pocket-casts",
            color: "#F43E37"
        },
        {
            name: "Stitcher",
            url: "https://www.stitcher.com/podcast/muslim-nonprofit-show",
            icon: "stitcher",
            color: "#0066CC"
        },
        {
            name: "Castro",
            url: "https://castro.fm/podcast/muslim-nonprofit-show",
            icon: "castro",
            color: "#00D561"
        },
        {
            name: "RSS Feed",
            url: "https://feeds.transistor.fm/the-muslim-nonprofit-show",
            icon: "rss",
            color: "#FF6600"
        }
    ],

    // Episodes data
    episodes: [
        {
            id: 1,
            title: "From Corporate to Cause: Launching The Muslim Non-Profit Show",
            description: "How do you launch and lead a successful Muslim non-profit? In this very first episode, Dr. Tayyab Yunus shares the inspiring 'why' behind the show, his personal journey from corporate success to faith-driven service, and how Muslim-led organizations can change the world.",
            guest: "Dr. Tayyab Yunus",
            guestTitle: "Host & Founder, The Muslim Non-Profit Show",
            duration: "07:20",
            publishDate: "2025-06-08",
            youtubeId: "2lWqsTKbD7A",
            audioUrl: "https://audio.transistor.fm/episode-1.mp3",
            featured: false,
            tags: ["launch", "mission", "personal journey", "non-profit challenges", "changemakers"],
            keyTakeaways: [
                "The mission behind The Muslim Non-Profit Show",
                "Common challenges in the non-profit space", 
                "Tayyab's journey from corporate to faith-driven service",
                "Empowering the next generation of Muslim changemakers"
            ]
        },
        {
            id: 2,
            title: "What It Really Takes to Build an Islamic School",
            description: "Sister Magda Elkadi Saleh, a three-time founder of successful Islamic schools in Tampa, Florida, shares deep insights into what it really takes to build, sustain, and scale Islamic educational institutions. With over 32 years of experience, she discusses community trust, sustainable models, and the mindset needed to serve diverse Muslim families.",
            guest: "Sister Magda Elkadi Saleh",
            guestTitle: "Three-time Islamic School Founder, Tampa, FL",
            duration: "23:00",
            publishDate: "2025-06-15",
            youtubeId: "7k5b8YxXqcs",
            audioUrl: "https://audio.transistor.fm/episode-2.mp3",
            featured: true,
            tags: ["Islamic education", "school founding", "community building", "educational leadership", "sustainability"],
            keyTakeaways: [
                "Why she started three different Islamic schools and their unique models",
                "Building community trust and sustainable tuition strategies",
                "Staffing challenges and building a committed team",
                "Long-term commitment and mission-market fit for Islamic institutions"
            ]
        }
    ],

    // Statistics
    stats: {
        totalEpisodes: 2,
        totalDownloads: "1.2K+",
        averageRating: 4.9,
        countries: 12
    }
};

// Helper functions for episode management
const EpisodeManager = {
    // Get featured episode
    getFeaturedEpisode() {
        return podcastData.episodes.find(episode => episode.featured) || podcastData.episodes[0];
    },

    // Get all episodes sorted by date (newest first)
    getAllEpisodes() {
        return podcastData.episodes.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
    },

    // Get recent episodes (last 3)
    getRecentEpisodes(count = 3) {
        return this.getAllEpisodes().slice(0, count);
    },

    // Get episode by ID
    getEpisodeById(id) {
        return podcastData.episodes.find(episode => episode.id === id);
    },


    // Format duration
    formatDuration(duration) {
        return duration;
    },

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    },

    // Get YouTube embed URL
    getYouTubeEmbedUrl(youtubeId) {
        return `https://www.youtube.com/embed/${youtubeId}`;
    },

    // Get YouTube watch URL
    getYouTubeWatchUrl(youtubeId) {
        return `https://www.youtube.com/watch?v=${youtubeId}`;
    },

    // Get YouTube thumbnail URL
    getYouTubeThumbnailUrl(youtubeId, quality = 'maxresdefault') {
        // Available qualities: maxresdefault, hqdefault, mqdefault, sddefault, default
        return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
    },

    // Get multiple thumbnail quality options
    getYouTubeThumbnailUrls(youtubeId) {
        return {
            maxres: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
            high: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
            medium: `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`,
            standard: `https://img.youtube.com/vi/${youtubeId}/sddefault.jpg`,
            default: `https://img.youtube.com/vi/${youtubeId}/default.jpg`
        };
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { podcastData, EpisodeManager };
}