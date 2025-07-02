// The Muslim Nonprofit Show - Modern Dark Theme Website

class PodcastWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.initializeNavigation();
        this.initializeIntersectionObserver();
        this.initializeForms();
        this.updateCurrentYear();
        this.initializeResponsiveLayout();
        this.initializeEpisodePlayer();
        this.initializeHeroMouseEffect();
        this.populateWebsiteContent();
    }

    // Initialize responsive layout adjustments
    initializeResponsiveLayout() {
        this.updateLayoutForScreenSize();
        window.addEventListener('resize', () => {
            this.updateLayoutForScreenSize();
        });
    }
    
    // Update layout based on screen size
    updateLayoutForScreenSize() {
        const heroGrid = document.querySelector('.hero-grid');
        const socialLinks = document.querySelector('.social-links');
        const newsletterForm = document.querySelector('.newsletter-form');
        const buttonContainers = document.querySelectorAll('.hero-actions, .youtube-section .fade-in:last-child > div');
        
        if (window.innerWidth >= 1024 && heroGrid) {
            heroGrid.style.gridTemplateColumns = '1fr 1fr';
            heroGrid.style.gap = '4rem';
            const heroContent = heroGrid.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.textAlign = 'left';
                heroContent.style.alignItems = 'flex-start';
            }
        } else if (heroGrid) {
            heroGrid.style.gridTemplateColumns = '1fr';
            heroGrid.style.gap = '3rem';
            const heroContent = heroGrid.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.textAlign = 'center';
                heroContent.style.alignItems = 'center';
            }
        }
        
        if (window.innerWidth >= 640) {
            if (socialLinks) socialLinks.style.flexDirection = 'row';
            if (newsletterForm) newsletterForm.style.flexDirection = 'row';
            buttonContainers.forEach(container => {
                if (container) container.style.flexDirection = 'row';
            });
        } else {
            if (socialLinks) socialLinks.style.flexDirection = 'column';
            if (newsletterForm) newsletterForm.style.flexDirection = 'column';
            buttonContainers.forEach(container => {
                if (container) container.style.flexDirection = 'column';
            });
        }
    }

    // Initialize navigation
    initializeNavigation() {
        this.initializeMobileMenu();
        this.initializeSmoothScroll();
        this.initializeActiveNavigation();
    }

    // Initialize mobile menu (updated for floating nav)
    initializeMobileMenu() {
        const toggle = document.getElementById('mobileNavToggle');
        const navContainer = document.querySelector('.floating-nav-container');
        
        if (!toggle || !navContainer) return;

        // Mobile navigation is handled by CSS responsive design
        // No special mobile menu needed for floating nav
    }

    // Initialize smooth scroll
    initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // No offset needed for floating nav since it doesn't cover content
                    const targetPosition = targetElement.offsetTop;
                    
                    // Use requestAnimationFrame for smoother, more controlled scrolling
                    const startPosition = window.pageYOffset;
                    const distance = targetPosition - startPosition;
                    const duration = 500; // 500ms for smooth scroll
                    let start = null;
                    
                    const animation = (currentTime) => {
                        if (!start) start = currentTime;
                        const timeElapsed = currentTime - start;
                        const progress = Math.min(timeElapsed / duration, 1);
                        
                        // Easing function for smooth animation
                        const easeInOutQuad = progress < 0.5
                            ? 2 * progress * progress
                            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                        
                        window.scrollTo(0, startPosition + distance * easeInOutQuad);
                        
                        if (timeElapsed < duration) {
                            requestAnimationFrame(animation);
                        }
                    };
                    
                    requestAnimationFrame(animation);
                }
            });
        });
    }

    // Initialize active navigation
    initializeActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navDots = document.querySelectorAll('.nav-dot');

        const observerOptions = {
            rootMargin: '-20% 0px -20% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.id;
                    
                    // Update active nav dot
                    navDots.forEach(dot => {
                        dot.classList.remove('active');
                        if (dot.getAttribute('href') === `#${currentId}`) {
                            dot.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    // Initialize intersection observer for animations
    initializeIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    // Initialize forms
    initializeForms() {
        this.initializeNewsletterForm();
    }

    // Initialize newsletter form
    initializeNewsletterForm() {
        const form = document.getElementById('newsletterForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewsletterSubmission(form);
        });
    }

    // Handle newsletter submission
    async handleNewsletterSubmission(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const submitButton = form.querySelector('button[type="submit"]');
        const email = emailInput.value.trim();

        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Subscribing...';
        submitButton.disabled = true;

        try {
            // Simulate API call (replace with actual newsletter service)
            await this.simulateNewsletterSubscription(email);
            
            this.showNotification('Thank you for subscribing! Check your inbox for amazing content.', 'success');
            form.reset();
            
            // Track subscription
            this.trackEvent('newsletter_subscription', { email_domain: email.split('@')[1] });
            
        } catch (error) {
            this.showNotification('Something went wrong. Please try again.', 'error');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    // Simulate newsletter subscription
    simulateNewsletterSubscription(email) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Newsletter subscription for: ${email}`);
                resolve();
            }, 1000);
        });
    }

    // Validate email
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;

        // Add animation styles if not exist
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.25rem;
                    cursor: pointer;
                    margin-left: auto;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Update current year
    updateCurrentYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // Initialize episode player (bento grid)
    initializeEpisodePlayer() {
        if (typeof podcastData === 'undefined' || typeof EpisodeManager === 'undefined') {
            console.warn('Episode data not available');
            return;
        }

        this.episodes = EpisodeManager.getAllEpisodes();
        
        // Find featured episode or use first episode
        const featuredEpisode = EpisodeManager.getFeaturedEpisode();
        this.featuredEpisode = featuredEpisode || this.episodes[0];

        this.renderBentoGrid();
        this.renderFeaturedEpisode();
    }

    // Render bento grid episodes
    renderBentoGrid() {
        const episodeGrid = document.getElementById('episodeGrid');
        if (!episodeGrid) return;

        episodeGrid.innerHTML = '';

        // Get all episodes except the featured one
        const gridEpisodes = this.episodes.filter(ep => ep.id !== this.featuredEpisode.id);

        gridEpisodes.forEach((episode) => {
            const card = document.createElement('div');
            card.className = 'grid-episode-card';
            card.addEventListener('click', () => this.switchFeaturedEpisode(episode));

            const thumbnailUrl = EpisodeManager.getYouTubeThumbnailUrl(episode.youtubeId, 'hqdefault');
            
            card.innerHTML = `
                <div class="grid-episode-thumbnail">
                    <img src="${thumbnailUrl}" alt="${episode.title}" loading="lazy" onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(135deg, var(--bg-dark-secondary), var(--bg-dark-tertiary))';">
                    <div class="play-overlay">▶</div>
                </div>
                <div class="grid-episode-header">
                    <span class="grid-episode-number">Episode ${episode.id}</span>
                    <span class="episode-duration">${episode.duration}</span>
                </div>
                <h5 class="grid-episode-title">${episode.title}</h5>
                <div class="grid-episode-guest">${episode.guest}</div>
            `;

            episodeGrid.appendChild(card);
        });
    }

    // Render featured episode details
    renderFeaturedEpisode() {
        if (!this.featuredEpisode) return;

        // Update featured video player
        const videoPlayer = document.getElementById('featuredVideoPlayer');
        if (videoPlayer) {
            videoPlayer.src = EpisodeManager.getYouTubeEmbedUrl(this.featuredEpisode.youtubeId);
        }

        // Update featured episode details
        const featuredTitle = document.getElementById('featuredTitle');
        if (featuredTitle) featuredTitle.textContent = this.featuredEpisode.title;
        
        const featuredGuest = document.getElementById('featuredGuest');
        if (featuredGuest) featuredGuest.textContent = this.featuredEpisode.guest;
        
        const featuredEpisodeNumber = document.getElementById('featuredEpisodeNumber');
        if (featuredEpisodeNumber) featuredEpisodeNumber.textContent = this.featuredEpisode.id;
        
        const featuredDuration = document.getElementById('featuredDuration');
        if (featuredDuration) featuredDuration.textContent = this.featuredEpisode.duration;

        // Update watch full episode button
        const watchBtn = document.getElementById('watchFullEpisodeBtn');
        if (watchBtn) {
            watchBtn.href = EpisodeManager.getYouTubeWatchUrl(this.featuredEpisode.youtubeId);
        }
    }

    // Switch featured episode when grid episode is clicked
    switchFeaturedEpisode(episode) {
        this.featuredEpisode = episode;
        this.renderFeaturedEpisode();
        this.renderBentoGrid(); // Re-render grid to update which episodes show
        
        // Track episode switch
        this.trackEvent('episode_switch', {
            episode_id: episode.id,
            episode_title: episode.title
        });
    }

    // Initialize hero mouse reactive effect
    initializeHeroMouseEffect() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        let isMouseInHero = false;
        let animationFrame = null;

        const updateMousePosition = (e) => {
            if (!isMouseInHero) return;

            const rect = hero.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            // Cancel previous animation frame
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }

            // Use requestAnimationFrame for smooth updates
            animationFrame = requestAnimationFrame(() => {
                hero.style.setProperty('--mouse-x', `${x}%`);
                hero.style.setProperty('--mouse-y', `${y}%`);
            });
        };

        const handleMouseEnter = () => {
            isMouseInHero = true;
            hero.classList.add('mouse-active');
        };

        const handleMouseLeave = () => {
            isMouseInHero = false;
            hero.classList.remove('mouse-active');
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
        };

        // Add event listeners
        hero.addEventListener('mouseenter', handleMouseEnter);
        hero.addEventListener('mouseleave', handleMouseLeave);
        hero.addEventListener('mousemove', updateMousePosition);

        // Throttled resize handler to recalculate if needed
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (isMouseInHero) {
                    hero.classList.remove('mouse-active');
                    setTimeout(() => {
                        if (isMouseInHero) {
                            hero.classList.add('mouse-active');
                        }
                    }, 50);
                }
            }, 250);
        });
    }

    // Legacy method support (for any remaining references)
    switchToEpisode(episodeId) {
        const episode = this.episodes.find(ep => ep.id === episodeId);
        if (episode) {
            this.switchFeaturedEpisode(episode);
        }
    }

    // Utility: Update element content safely
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    // Analytics tracking
    trackEvent(eventName, properties = {}) {
        // Enhanced analytics tracking
        const eventData = {
            event: eventName,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            user_agent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            ...properties
        };

        console.log('Event tracked:', eventData);
        
        // Here you would integrate with your analytics service
        // Examples:
        // - Google Analytics 4
        // - Mixpanel
        // - Amplitude
        // - Custom analytics endpoint
        
        // Google Analytics 4 example:
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
    }

    // Performance monitoring
    initializePerformanceMonitoring() {
        // Monitor loading performance
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            this.trackEvent('page_load_performance', {
                load_time: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                first_paint: Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0)
            });
        });
    }

    // Keyboard navigation
    initializeKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Navigation shortcuts
            const navDots = document.querySelectorAll('.nav-dot');
            
            // Arrow key navigation through sections
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                const activeNavDot = document.querySelector('.nav-dot.active');
                if (activeNavDot) {
                    const currentIndex = Array.from(navDots).indexOf(activeNavDot);
                    let nextIndex;
                    
                    if (e.key === 'ArrowUp') {
                        nextIndex = currentIndex > 0 ? currentIndex - 1 : navDots.length - 1;
                    } else {
                        nextIndex = currentIndex < navDots.length - 1 ? currentIndex + 1 : 0;
                    }
                    
                    if (e.altKey) { // Alt + Arrow keys to actually navigate
                        e.preventDefault();
                        navDots[nextIndex].click();
                    }
                }
            }
        });
    }

    // Initialize lazy loading for images
    initializeLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Utility: Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Populate website content from CRM data
    populateWebsiteContent() {
        if (typeof websiteData === 'undefined') {
            console.log('Website data not loaded, using static content');
            return;
        }

        try {
            // Populate hero section
            if (websiteData.hero) {
                const hero = websiteData.hero;
                
                // Update hero badge if it exists
                const badge = document.querySelector('.hero-badge');
                if (badge && hero.badge) badge.textContent = hero.badge;
                
                // Update hero title
                const title = document.querySelector('.hero-title');
                if (title && hero.title) title.textContent = hero.title;
                
                // Update hero byline
                const byline = document.querySelector('.hero-byline');
                if (byline && hero.byline) byline.textContent = hero.byline;
                
                // Update hero description
                const description = document.querySelector('.hero-description');
                if (description && hero.description) description.textContent = hero.description;
                
                // Update CTA buttons
                const listenBtn = document.querySelector('.btn-listen');
                if (listenBtn && hero.listen_text) listenBtn.textContent = hero.listen_text;
                
                const watchBtn = document.querySelector('.btn-watch');
                if (watchBtn && hero.watch_text) watchBtn.textContent = hero.watch_text;
            }

            // Populate stats section
            if (websiteData.stats) {
                const stats = websiteData.stats;
                
                // Update each stat
                const statElements = {
                    episodes: document.querySelector('[data-stat="episodes"] .stat-number'),
                    downloads: document.querySelector('[data-stat="downloads"] .stat-number'),
                    rating: document.querySelector('[data-stat="rating"] .stat-number'),
                    countries: document.querySelector('[data-stat="countries"] .stat-number')
                };
                
                const statLabels = {
                    episodes: document.querySelector('[data-stat="episodes"] .stat-label'),
                    downloads: document.querySelector('[data-stat="downloads"] .stat-label'),
                    rating: document.querySelector('[data-stat="rating"] .stat-label'),
                    countries: document.querySelector('[data-stat="countries"] .stat-label')
                };

                Object.keys(statElements).forEach(key => {
                    if (statElements[key] && stats[key]) {
                        statElements[key].textContent = stats[key];
                    }
                    if (statLabels[key] && stats[key + '_label']) {
                        statLabels[key].textContent = stats[key + '_label'];
                    }
                });
            }

            // Populate mission section
            if (websiteData.mission) {
                const mission = websiteData.mission;
                
                const missionTitle = document.querySelector('.mission-title, #mission h2');
                if (missionTitle && mission.title) missionTitle.textContent = mission.title;
                
                const missionContent = document.querySelector('.mission-content, #mission p');
                if (missionContent && mission.content) {
                    // Handle line breaks properly
                    missionContent.innerHTML = mission.content.replace(/\\n/g, '<br>');
                }
            }

            // Populate social links
            if (websiteData.social) {
                const social = websiteData.social;
                
                const socialLinks = {
                    apple: document.querySelector('a[href*="apple"], a[href*="podcasts.apple.com"]'),
                    spotify: document.querySelector('a[href*="spotify"]'),
                    youtube: document.querySelector('a[href*="youtube"]'),
                    transistor: document.querySelector('a[href*="transistor"]')
                };

                if (socialLinks.apple && social.apple_podcasts) {
                    socialLinks.apple.href = social.apple_podcasts;
                }
                if (socialLinks.spotify && social.spotify) {
                    socialLinks.spotify.href = social.spotify;
                }
                if (socialLinks.youtube && social.youtube) {
                    socialLinks.youtube.href = social.youtube;
                }
                if (socialLinks.transistor && social.transistor) {
                    socialLinks.transistor.href = social.transistor;
                }
            }

            // Update meta information
            if (websiteData.meta) {
                const meta = websiteData.meta;
                
                if (meta.title) document.title = meta.title;
                
                const metaDescription = document.querySelector('meta[name="description"]');
                if (metaDescription && meta.description) {
                    metaDescription.setAttribute('content', meta.description);
                }
                
                const ogTitle = document.querySelector('meta[property="og:title"]');
                if (ogTitle && meta.title) {
                    ogTitle.setAttribute('content', meta.title);
                }
                
                const ogDescription = document.querySelector('meta[property="og:description"]');
                if (ogDescription && meta.description) {
                    ogDescription.setAttribute('content', meta.description);
                }
            }

            console.log('Website content populated from CRM data');
            
        } catch (error) {
            console.error('Error populating website content:', error);
        }
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.podcastWebsite = new PodcastWebsite();
    
    // Initialize additional features
    window.podcastWebsite.initializePerformanceMonitoring();
    window.podcastWebsite.initializeKeyboardNavigation();
    window.podcastWebsite.initializeLazyLoading();
    
    // Track page view
    window.podcastWebsite.trackEvent('page_view', {
        page: 'home',
        referrer: document.referrer
    });
    
    // Initialize animations on load
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => {
            if (isElementInViewport(el)) {
                el.classList.add('visible');
            }
        });
    }, 100);
});

// Utility function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (window.podcastWebsite) {
        window.podcastWebsite.trackEvent('page_visibility_change', {
            hidden: document.hidden
        });
    }
});

// Handle before unload for analytics
window.addEventListener('beforeunload', () => {
    if (window.podcastWebsite) {
        const timeOnPage = Date.now() - window.performance.timeOrigin;
        window.podcastWebsite.trackEvent('page_unload', {
            time_on_page: Math.round(timeOnPage / 1000)
        });
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PodcastWebsite;
}