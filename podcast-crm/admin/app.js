// Podcast CRM Admin JavaScript
const API_URL = '../api/index.php';
let episodes = [];
let editingId = null;

// Debug: Log that script is loaded
console.log('CRM Admin script loaded successfully');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadEpisodes();
});

// Load statistics
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const stats = await response.json();
        
        document.getElementById('stat-total').textContent = stats.total_episodes;
        document.getElementById('stat-published').textContent = stats.published_episodes;
        document.getElementById('stat-drafts').textContent = stats.draft_episodes;
        document.getElementById('stat-last-sync').textContent = 
            stats.last_sync ? new Date(stats.last_sync).toLocaleString() : 'Never';
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load episodes
async function loadEpisodes() {
    try {
        const response = await fetch(`${API_URL}/episodes`);
        episodes = await response.json();
        displayEpisodes(episodes);
    } catch (error) {
        showNotification('Error loading episodes', 'error');
    }
}

// Display episodes
function displayEpisodes(episodesToShow) {
    const container = document.getElementById('episodes-list');
    
    if (episodesToShow.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No episodes found</p>
                <button class="btn btn-primary" onclick="showSection('new-episode')">
                    <i data-lucide="plus"></i>
                    Create Your First Episode
                </button>
            </div>
        `;
        // Reinitialize icons for dynamic content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        return;
    }
    
    container.innerHTML = episodesToShow.map(episode => `
        <div class="episode-card ${episode.featured === 1 ? 'featured' : ''}">
            <span class="status ${episode.status}">${episode.status === 'published' ? '● Published' : '○ Draft'}</span>
            <h3>${episode.title}</h3>
            <div class="meta">
                ${episode.guest ? `<span><i data-lucide="user"></i>${episode.guest}</span>` : ''}
                ${episode.publish_date ? `<span><i data-lucide="calendar"></i>${formatDate(episode.publish_date)}</span>` : ''}
                ${episode.duration ? `<span><i data-lucide="clock"></i>${episode.duration}</span>` : ''}
            </div>
            <p class="description">${episode.description || 'No description available'}</p>
            ${episode.tags ? `
                <div style="margin: 12px 0;">
                    ${episode.tags.split(',').map(tag => 
                        `<span style="display: inline-block; background: var(--primary-light); color: var(--primary); padding: 4px 8px; border-radius: 12px; font-size: 12px; margin-right: 6px; margin-bottom: 6px;">${tag.trim()}</span>`
                    ).join('')}
                </div>
            ` : ''}
            <div class="actions">
                <button class="btn" onclick="editEpisode(${episode.id})">
                    <i data-lucide="edit-2"></i>
                    Edit
                </button>
                <button class="btn" onclick="previewEpisode(${episode.id})" style="background: var(--info); color: white;">
                    <i data-lucide="eye"></i>
                    Preview
                </button>
                <button class="btn btn-danger" onclick="confirmDelete(${episode.id}, '${episode.title.replace(/'/g, "\\'")}')">
                    <i data-lucide="trash-2"></i>
                    Delete
                </button>
            </div>
        </div>
    `).join('');
    
    // Reinitialize icons for dynamic content
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Format date helper
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Preview episode (opens in new tab)
function previewEpisode(id) {
    const episode = episodes.find(e => e.id === id);
    if (episode && episode.youtube_id) {
        window.open(`https://youtube.com/watch?v=${episode.youtube_id}`, '_blank');
    } else {
        showNotification('No YouTube video available for this episode', 'info');
    }
}

// Confirm before deleting
function confirmDelete(id, title) {
    if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
        deleteEpisode(id);
    }
}

// Filter episodes
function filterEpisodes() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    
    let filtered = episodes;
    
    if (searchTerm) {
        filtered = filtered.filter(episode => 
            episode.title.toLowerCase().includes(searchTerm) ||
            (episode.description && episode.description.toLowerCase().includes(searchTerm)) ||
            (episode.guest && episode.guest.toLowerCase().includes(searchTerm))
        );
    }
    
    if (statusFilter) {
        filtered = filtered.filter(episode => episode.status === statusFilter);
    }
    
    displayEpisodes(filtered);
}

// Show section
window.showSection = function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(`${section}-section`).classList.add('active');
    
    if (section === 'new-episode' && !editingId) {
        document.getElementById('form-title').textContent = 'New Episode';
        document.getElementById('episode-form').reset();
    }
}

// Edit episode
async function editEpisode(id) {
    try {
        const response = await fetch(`${API_URL}/episodes/${id}`);
        const episode = await response.json();
        
        editingId = id;
        document.getElementById('form-title').textContent = 'Edit Episode';
        document.getElementById('episode-id').value = id;
        
        // Fill form
        document.getElementById('title').value = episode.title || '';
        document.getElementById('description').value = episode.description || '';
        document.getElementById('guest').value = episode.guest || '';
        document.getElementById('guest_title').value = episode.guest_title || '';
        document.getElementById('publish_date').value = episode.publish_date || '';
        document.getElementById('duration').value = episode.duration || '';
        document.getElementById('youtube_id').value = episode.youtube_id || '';
        document.getElementById('audio_url').value = episode.audio_url || '';
        document.getElementById('tags').value = (episode.tags || []).join(', ');
        document.getElementById('key_takeaways').value = (episode.key_takeaways || []).join('\n');
        document.getElementById('featured').checked = episode.featured;
        document.getElementById('status').value = episode.status;
        
        showSection('new-episode');
    } catch (error) {
        showNotification('Error loading episode', 'error');
    }
}

// Save episode - Make globally accessible
window.saveEpisode = async function saveEpisode(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        guest: formData.get('guest'),
        guest_title: formData.get('guest_title'),
        publish_date: formData.get('publish_date'),
        duration: formData.get('duration'),
        youtube_id: formData.get('youtube_id'),
        audio_url: formData.get('audio_url'),
        featured: formData.get('featured') ? 1 : 0,
        status: formData.get('status'),
        tags: formData.get('tags').split(',').map(t => t.trim()).filter(t => t),
        key_takeaways: formData.get('key_takeaways').split('\n').map(t => t.trim()).filter(t => t)
    };
    
    try {
        const url = editingId ? `${API_URL}/episodes/${editingId}` : `${API_URL}/episodes`;
        const method = editingId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showNotification(editingId ? 'Episode updated successfully' : 'Episode created successfully', 'success');
            editingId = null;
            showSection('episodes');
            loadEpisodes();
            loadStats();
        } else {
            throw new Error('Save failed');
        }
    } catch (error) {
        showNotification('Error saving episode', 'error');
    }
}

// Delete episode
async function deleteEpisode(id) {
    if (!confirm('Are you sure you want to delete this episode?')) return;
    
    try {
        const response = await fetch(`${API_URL}/episodes/${id}`, {method: 'DELETE'});
        
        if (response.ok) {
            showNotification('Episode deleted successfully', 'success');
            loadEpisodes();
            loadStats();
        } else {
            throw new Error('Delete failed');
        }
    } catch (error) {
        showNotification('Error deleting episode', 'error');
    }
}

// Sync sources - Make globally accessible  
window.syncSources = async function syncSources() {
    const button = event.target;
    button.disabled = true;
    button.textContent = 'Syncing...';
    
    try {
        const response = await fetch(`${API_URL}/sync`, {method: 'POST'});
        const result = await response.json();
        
        let message = 'Sync completed. ';
        if (result.rss) {
            message += `RSS: ${result.rss.items_added} new episodes. `;
        }
        if (result.youtube && result.youtube.status !== 'skipped') {
            message += `YouTube: ${result.youtube.items_added} new episodes.`;
        }
        
        showNotification(message, 'success');
        loadEpisodes();
        loadStats();
    } catch (error) {
        showNotification('Error syncing sources', 'error');
    } finally {
        button.disabled = false;
        button.textContent = 'Sync Sources';
    }
}

// Sync and publish episodes
async function syncAndPublishEpisodes() {
    const button = event.target;
    button.disabled = true;
    button.textContent = 'Syncing & Publishing...';
    
    try {
        const response = await fetch(`${API_URL}/export`, {method: 'POST'});
        const result = await response.json();
        
        if (result.export && result.export.status === 'success') {
            let message = result.message || 'Sync and export completed successfully';
            
            // Add sync details
            if (result.sync) {
                let syncDetails = '';
                if (result.sync.rss && result.sync.rss.items_added > 0) {
                    syncDetails += ` Found ${result.sync.rss.items_added} new episodes from RSS.`;
                }
                if (result.sync.youtube && result.sync.youtube.items_added > 0) {
                    syncDetails += ` Found ${result.sync.youtube.items_added} new episodes from YouTube.`;
                }
                if (syncDetails) {
                    message += syncDetails;
                }
            }
            
            showNotification(message, 'success');
            loadEpisodes();
            loadStats();
        } else {
            throw new Error(result.export?.message || result.message || 'Publish failed');
        }
    } catch (error) {
        showNotification('Error syncing and publishing episodes', 'error');
    } finally {
        button.disabled = false;
        button.textContent = 'Sync & Publish';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    
    // Remove any existing content
    notification.innerHTML = '';
    
    // Add icon based on type
    const icon = document.createElement('span');
    icon.style.fontSize = '20px';
    icon.style.marginRight = '12px';
    
    switch(type) {
        case 'success':
            icon.textContent = '✅';
            break;
        case 'error':
            icon.textContent = '❌';
            break;
        case 'info':
            icon.textContent = 'ℹ️';
            break;
        default:
            icon.textContent = '📢';
    }
    
    notification.appendChild(icon);
    notification.appendChild(document.createTextNode(message));
    
    // Show notification with animation
    notification.className = `notification ${type}`;
    
    // Force reflow to restart animation
    notification.offsetHeight;
    
    notification.classList.add('show');
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Website Content Management Functions
let websiteContent = {};

// Load website content
async function loadWebsiteContent() {
    try {
        const response = await fetch(`${API_URL}/website-content`);
        if (response.ok) {
            websiteContent = await response.json();
            populateContentForms();
        }
    } catch (error) {
        console.error('Error loading website content:', error);
    }
}

// Populate content forms with current data
function populateContentForms() {
    // Hero content
    if (websiteContent.hero) {
        document.getElementById('hero-badge').value = websiteContent.hero.badge || '';
        document.getElementById('hero-title').value = websiteContent.hero.title || '';
        document.getElementById('hero-byline').value = websiteContent.hero.byline || '';
        document.getElementById('hero-description').value = websiteContent.hero.description || '';
        document.getElementById('hero-cta1').value = websiteContent.hero.cta1 || '';
        document.getElementById('hero-cta2').value = websiteContent.hero.cta2 || '';
        document.getElementById('hero-cta3').value = websiteContent.hero.cta3 || '';
    }
    
    // Stats content
    if (websiteContent.stats) {
        document.getElementById('stat1-value').value = websiteContent.stats.stat1_value || '';
        document.getElementById('stat1-label').value = websiteContent.stats.stat1_label || '';
        document.getElementById('stat2-value').value = websiteContent.stats.stat2_value || '';
        document.getElementById('stat2-label').value = websiteContent.stats.stat2_label || '';
        document.getElementById('stat3-value').value = websiteContent.stats.stat3_value || '';
        document.getElementById('stat3-label').value = websiteContent.stats.stat3_label || '';
        document.getElementById('stat4-value').value = websiteContent.stats.stat4_value || '';
        document.getElementById('stat4-label').value = websiteContent.stats.stat4_label || '';
    }
    
    // Mission content
    if (websiteContent.mission) {
        document.getElementById('mission-title').value = websiteContent.mission.title || '';
        document.getElementById('mission-para1').value = websiteContent.mission.paragraph1 || '';
        document.getElementById('mission-para2').value = websiteContent.mission.paragraph2 || '';
        document.getElementById('mission-para3').value = websiteContent.mission.paragraph3 || '';
    }
    
    // Social links
    if (websiteContent.social) {
        document.getElementById('social-title').value = websiteContent.social.title || '';
        document.getElementById('youtube-url').value = websiteContent.social.youtube || '';
        document.getElementById('instagram-url').value = websiteContent.social.instagram || '';
        document.getElementById('facebook-url').value = websiteContent.social.facebook || '';
        document.getElementById('linkedin-url').value = websiteContent.social.linkedin || '';
        document.getElementById('apple-podcasts-url').value = websiteContent.social.apple_podcasts || '';
        document.getElementById('spotify-url').value = websiteContent.social.spotify || '';
        document.getElementById('iheart-url').value = websiteContent.social.iheart || '';
    }
    
    // Meta content
    if (websiteContent.meta) {
        document.getElementById('site-title').value = websiteContent.meta.title || '';
        document.getElementById('site-description').value = websiteContent.meta.description || '';
        document.getElementById('site-keywords').value = websiteContent.meta.keywords || '';
        document.getElementById('og-image').value = websiteContent.meta.og_image || '';
        document.getElementById('site-url').value = websiteContent.meta.url || '';
    }
    
    // Footer content
    if (websiteContent.footer) {
        document.getElementById('footer-title').value = websiteContent.footer.title || '';
        document.getElementById('footer-tagline').value = websiteContent.footer.tagline || '';
        document.getElementById('tayyab-url').value = websiteContent.footer.tayyab_url || '';
        document.getElementById('contact-email').value = websiteContent.footer.email || '';
    }
}

// Show content tab
window.showContentTab = function showContentTab(tabName) {
    // Hide all panels
    document.querySelectorAll('.content-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.content-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected panel
    document.getElementById(`${tabName}-content`).classList.add('active');
    
    // Set active tab
    event.target.classList.add('active');
}

// Save content - Make globally accessible
window.saveContent = async function saveContent(event, section) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    try {
        const response = await fetch(`${API_URL}/website-content/${section}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showNotification(`${section.charAt(0).toUpperCase() + section.slice(1)} content saved successfully`, 'success');
            // Update local content
            websiteContent[section] = data;
            
            // Auto-publish to website
            await autoPublishContent();
        } else {
            throw new Error('Save failed');
        }
    } catch (error) {
        showNotification(`Error saving ${section} content`, 'error');
    }
}

// Auto-publish content after save
async function autoPublishContent() {
    try {
        const response = await fetch(`${API_URL}/export-all`, {method: 'POST'});
        const result = await response.json();
        
        if (result.success) {
            showNotification('Content published to website', 'success');
        }
    } catch (error) {
        console.error('Auto-publish failed:', error);
        // Don't show error to user for auto-publish
    }
}

// Publish all content (episodes and website content) - Make globally accessible
window.publishAll = async function publishAll() {
    const button = event.target;
    button.disabled = true;
    button.textContent = 'Publishing...';
    
    try {
        // First sync episodes
        const syncResponse = await fetch(`${API_URL}/sync`, {method: 'POST'});
        const syncResult = await syncResponse.json();
        
        // Then publish everything
        const publishResponse = await fetch(`${API_URL}/export-all`, {method: 'POST'});
        const publishResult = await publishResponse.json();
        
        if (publishResult.success) {
            let message = 'All content published successfully!';
            
            if (syncResult.rss && syncResult.rss.items_added > 0) {
                message += ` Found ${syncResult.rss.items_added} new episodes.`;
            }
            
            showNotification(message, 'success');
            loadEpisodes();
            loadStats();
        } else {
            throw new Error('Publish failed');
        }
    } catch (error) {
        showNotification('Error publishing content', 'error');
    } finally {
        button.disabled = false;
        button.textContent = 'Publish All';
    }
}

// Initialize website content when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadEpisodes();
    loadWebsiteContent();
});

// === CRITICAL: GLOBAL FUNCTION ASSIGNMENTS ===
// These functions MUST be globally accessible for HTML onclick handlers

// Re-declare publishAll as a simple global function
window.publishAll = async function(event) {
    const button = event.target;
    button.disabled = true;
    button.textContent = 'Publishing...';
    
    try {
        const response = await fetch(`${API_URL}/export-all`, {method: 'POST'});
        const result = await response.json();
        
        if (result.success) {
            showNotification('All content published successfully!', 'success');
            loadEpisodes();
            loadStats();
        } else {
            throw new Error('Publish failed');
        }
    } catch (error) {
        showNotification('Error publishing content', 'error');
    } finally {
        button.disabled = false;
        button.textContent = 'Publish All';
    }
};

window.syncSources = async function(event) {
    const button = event.target;
    button.disabled = true;
    button.textContent = 'Syncing...';
    
    try {
        const response = await fetch(`${API_URL}/sync`, {method: 'POST'});
        const result = await response.json();
        
        showNotification('Sync completed', 'success');
        loadEpisodes();
        loadStats();
    } catch (error) {
        showNotification('Error syncing sources', 'error');
    } finally {
        button.disabled = false;
        button.textContent = 'Sync Sources';
    }
};

// Debug: Verify functions exist
console.log('🚀 CRM Functions Ready:', {
    publishAll: typeof window.publishAll,
    syncSources: typeof window.syncSources
});