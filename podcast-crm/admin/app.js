// Podcast CRM Admin JavaScript
const API_URL = '../api/index.php';
let episodes = [];
let editingId = null;

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
        container.innerHTML = '<div class="loading">No episodes found</div>';
        return;
    }
    
    container.innerHTML = episodesToShow.map(episode => `
        <div class="episode-card">
            <span class="status ${episode.status}">${episode.status.toUpperCase()}</span>
            <h3>${episode.title}</h3>
            <div class="meta">
                ${episode.guest ? `<span>👤 ${episode.guest}</span>` : ''}
                ${episode.publish_date ? `<span>📅 ${episode.publish_date}</span>` : ''}
                ${episode.duration ? `<span>⏱️ ${episode.duration}</span>` : ''}
            </div>
            <p class="description">${episode.description || 'No description'}</p>
            <div class="actions">
                <button class="btn btn-primary" onclick="editEpisode(${episode.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteEpisode(${episode.id})">Delete</button>
            </div>
        </div>
    `).join('');
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
function showSection(section) {
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

// Save episode
async function saveEpisode(event) {
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

// Sync sources
async function syncSources() {
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

// Export episodes (now includes sync)
async function exportEpisodes() {
    const button = event.target;
    button.disabled = true;
    button.textContent = 'Syncing & Exporting...';
    
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
            throw new Error(result.export?.message || result.message || 'Export failed');
        }
    } catch (error) {
        showNotification('Error syncing and exporting episodes', 'error');
    } finally {
        button.disabled = false;
        button.textContent = 'Sync & Export';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
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
function showContentTab(tabName) {
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

// Save content
async function saveContent(event, section) {
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
        } else {
            throw new Error('Save failed');
        }
    } catch (error) {
        showNotification(`Error saving ${section} content`, 'error');
    }
}

// Export all content (episodes and website content)
async function exportAll() {
    const button = event.target;
    button.disabled = true;
    button.textContent = 'Exporting...';
    
    try {
        // First sync episodes
        const syncResponse = await fetch(`${API_URL}/sync`, {method: 'POST'});
        const syncResult = await syncResponse.json();
        
        // Then export everything
        const exportResponse = await fetch(`${API_URL}/export-all`, {method: 'POST'});
        const exportResult = await exportResponse.json();
        
        if (exportResult.success) {
            let message = 'All content exported successfully!';
            
            if (syncResult.rss && syncResult.rss.items_added > 0) {
                message += ` Found ${syncResult.rss.items_added} new episodes.`;
            }
            
            showNotification(message, 'success');
            loadEpisodes();
            loadStats();
        } else {
            throw new Error('Export failed');
        }
    } catch (error) {
        showNotification('Error exporting content', 'error');
    } finally {
        button.disabled = false;
        button.textContent = 'Export All';
    }
}

// Initialize website content when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadEpisodes();
    loadWebsiteContent();
});