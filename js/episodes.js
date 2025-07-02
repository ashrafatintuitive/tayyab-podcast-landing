// Episode data for The Muslim Non-Profit Show
// Generated from CRM on 2025-07-02 14:56:31

const episodes = [
    {
        "id": 1,
        "title": "Why Muslims Are Leaving the Masjid and How Dr. Jihad Turk Brought Them Back | Episode 5",
        "description": "What happens when a masjid is built\u2014but no one comes? In this inspiring and thought-provoking episode of The Muslim Nonprofit Show with Tayyab Yunus, Dr. Jihad Turk shares his personal journey: from a disconnected Muslim teen in Arizona, to becoming a bridge-builder who helps create inclusive Muslim communities. Through his work with institutions like the Islamic Center of Southern California and Bayan Claremont, he reveals practical strategies for engaging disaffected Muslims and building thriving, welcoming communities.",
        "guest": "Dr. Jihad Turk",
        "guestTitle": "Islamic Scholar & Community Leader",
        "duration": "38:00",
        "publishDate": "2025-07-02",
        "youtubeId": "TKeJAruI9Nc",
        "audioUrl": "https://audio.transistor.fm/episode-5.mp3",
        "featured": true,
        "tags": [
            "masjid engagement",
            "community building",
            "youth connection",
            "islamic leadership",
            "inclusion"
        ],
        "keyTakeaways": [
            "Understanding why Muslims become disconnected from the masjid",
            "Creating inclusive environments that welcome all Muslims",
            "Bridging generational and cultural gaps in Muslim communities",
            "Practical strategies for re-engaging disaffected Muslims",
            "Building leadership that reflects community diversity"
        ]
    },
    {
        "id": 2,
        "title": "Built From the Ground Up: How Vision, Grit & Faith Created Real Change | Episode 4",
        "description": "In this powerful episode of The Muslim Non-profit Show with Tayyab Yunus, we hear from Anwar Khan, an engineer from the U.S. who returned to Bangladesh in 2004 with a simple mission: adopt a family and help however he could. What he didn't expect was that a single bathroom would turn into an entire movement. Through deeply personal stories, we explore how Anwar went from helping one refugee camp to founding Obat Helpers, now employing over 350 people across 12 schools, IT centers, clinics, and more\u2014staffed by the very people the world forgot.",
        "guest": "Anwar Khan",
        "guestTitle": "Engineer & Founder, Obat Helpers",
        "duration": "31:44",
        "publishDate": "2025-06-25",
        "youtubeId": "EJC6u0GabzY",
        "audioUrl": "https://audio.transistor.fm/episode-4.mp3",
        "featured": false,
        "tags": [
            "refugee support",
            "grassroots development",
            "bangladesh",
            "humanitarian",
            "empowerment",
            "obat helpers"
        ],
        "keyTakeaways": [
            "Visit and understand the ground reality before starting any initiative",
            "Start small - even if no one else is working on the problem",
            "Empower locals who understand the pain and have lived experience",
            "Use your time and skills if you don't have funds to contribute",
            "Trust in Allah's help and make sincere dua for guidance",
            "Build your team from those who share your passion and vision"
        ]
    },
    {
        "id": 3,
        "title": "From Rainy Prayers to a Mega Masjid: A Journey of Vision & Trust",
        "description": "In this powerful episode of The Muslim Non-profit Show with Tayyab Yunus, we sit down with Imam Tariq Rashid from the Islamic Center of Orlando, located just outside Disney World, to uncover his remarkable journey of transforming a small masjid into a 23,000 sq ft community hub\u2014completely debt-free. He shares heartfelt stories of early struggles, opposition, the value of outreach to non-Muslim neighbors, and the critical mindset needed to grow a masjid successfully.",
        "guest": "Imam Tariq Rashid",
        "guestTitle": "Imam, Islamic Center of Orlando",
        "duration": "31:30",
        "publishDate": "2025-06-18",
        "youtubeId": "7hQml6-4SUM",
        "audioUrl": "https://audio.transistor.fm/episode-3.mp3",
        "featured": false,
        "tags": [
            "masjid development",
            "community outreach",
            "fundraising",
            "interfaith relations",
            "leadership"
        ],
        "keyTakeaways": [
            "Transforming a small masjid into a 23,000 sq ft community hub debt-free",
            "The importance of outreach to non-Muslim neighbors before permits",
            "Fundraising challenges and trusting Allah for miraculous provisions",
            "Board dynamics, imam leadership, and wearing multiple hats",
            "Building community trust through genuine service"
        ]
    },
    {
        "id": 4,
        "title": "What It Really Takes to Build an Islamic School",
        "description": "Sister Magda Elkadi Saleh, a three-time founder of successful Islamic schools in Tampa, Florida, shares deep insights into what it really takes to build, sustain, and scale Islamic educational institutions. With over 32 years of experience, she discusses community trust, sustainable models, and the mindset needed to serve diverse Muslim families.",
        "guest": "Sister Magda Elkadi Saleh",
        "guestTitle": "Three-time Islamic School Founder, Tampa, FL",
        "duration": "23:00",
        "publishDate": "2025-06-15",
        "youtubeId": "7k5b8YxXqcs",
        "audioUrl": "https://audio.transistor.fm/episode-2.mp3",
        "featured": false,
        "tags": [
            "Islamic education",
            "school founding",
            "community building",
            "educational leadership",
            "sustainability"
        ],
        "keyTakeaways": [
            "Why she started three different Islamic schools and their unique models",
            "Building community trust and sustainable tuition strategies",
            "Staffing challenges and building a committed team",
            "Long-term commitment and mission-market fit for Islamic institutions"
        ]
    },
    {
        "id": 5,
        "title": "From Corporate to Cause: Launching The Muslim Non-Profit Show",
        "description": "How do you launch and lead a successful Muslim non-profit? In this very first episode, Dr. Tayyab Yunus shares the inspiring 'why' behind the show, his personal journey from corporate success to faith-driven service, and how Muslim-led organizations can change the world.",
        "guest": "Dr. Tayyab Yunus",
        "guestTitle": "Host & Founder, The Muslim Non-Profit Show",
        "duration": "07:20",
        "publishDate": "2025-06-08",
        "youtubeId": "2lWqsTKbD7A",
        "audioUrl": "https://audio.transistor.fm/episode-1.mp3",
        "featured": false,
        "tags": [
            "launch",
            "mission",
            "personal journey",
            "non-profit challenges",
            "changemakers"
        ],
        "keyTakeaways": [
            "The mission behind The Muslim Non-Profit Show",
            "Common challenges in the non-profit space",
            "Tayyab's journey from corporate to faith-driven service",
            "Empowering the next generation of Muslim changemakers"
        ]
    }
];

// Episode management utilities
const EpisodeManager = {
    getFeaturedEpisode() {
        return episodes.find(ep => ep.featured) || episodes[0];
    },
    
    getAllEpisodes() {
        return episodes.sort((a, b) => 
            new Date(b.publishDate) - new Date(a.publishDate)
        );
    },
    
    getYouTubeEmbedUrl(youtubeId) {
        return `https://www.youtube.com/embed/${youtubeId}`;
    },
    
    getYouTubeThumbnailUrl(youtubeId, quality = 'maxresdefault') {
        return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
    },
    
    getYouTubeWatchUrl(youtubeId) {
        return `https://www.youtube.com/watch?v=${youtubeId}`;
    }
};

// Statistics data
const stats = {
    totalEpisodes: episodes.length,
    totalDownloads: "85K+",
    avgListenTime: "32min",
    subscriberCount: "1.2K+"
};