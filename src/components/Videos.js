import { videoData } from '../data/videos.js';
import { fetchYouTubeVideos } from '../utils/youtubeFetcher.js';
import { openModal, closeModal } from '../utils/modal.js';

export function initVideos(channelTarget = 'UCH3RVGGXxGMBlH_BKCPT1bA') {
  const container = document.getElementById('videos-container') || document.getElementById('videos-grid');
  const modalContent = document.getElementById('video-modal-content') || document.getElementById('video-modal-body');

  if (!container) return;

  function renderList(list) {
    if (!container) return;
    container.innerHTML = '';

    if (!list || list.length === 0) {
      container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; font-size: 1.05rem; color: var(--text-muted);">Henüz video bulunamadı.</p>';
      return;
    }

    list.forEach(v => {
      const card = document.createElement('div');
      card.className = 'video-card';
      card.innerHTML = `
        <div class="video-thumb-wrapper open-video-modal-btn" data-video-id="${v.id}">
          <img src="${v.image}" alt="${v.title}" loading="lazy">
          <div class="video-play-btn">
            <i data-lucide="play" style="margin-left: 3px;"></i>
          </div>
          <span class="video-duration">${v.duration || 'YouTube Video'}</span>
        </div>
        <div class="video-info">
          <h4 class="video-title">${v.title}</h4>
          <p class="video-desc">${v.desc}</p>
        </div>
      `;
      container.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();

    // Rebind Modal Triggers
    container.querySelectorAll('.open-video-modal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const videoId = btn.getAttribute('data-video-id');
        const item = list.find(v => v.id === videoId);
        if (item && modalContent) {
          modalContent.innerHTML = `
            <h3 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-main);">${item.title}</h3>
            
            <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: var(--radius-md); background: #000; margin-bottom: 1.5rem; box-shadow: var(--shadow-md);">
              ${item.videoId ? `
                <iframe 
                  src="https://www.youtube-nocookie.com/embed/${item.videoId}?autoplay=1&rel=0" 
                  title="${item.title}" 
                  style="position: absolute; top:0; left:0; width:100%; height:100%; border:0;" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen>
                </iframe>
              ` : `
                <div style="position: absolute; top:0; left:0; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff; background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8));">
                  <i data-lucide="play-circle" style="width: 64px; height: 64px; color: var(--primary-sage); margin-bottom: 1rem;"></i>
                  <p style="font-size: 1.1rem; font-weight: 600;">${item.title}</p>
                </div>
              `}
            </div>

            <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6;">${item.desc}</p>
            
            ${item.link ? `
              <div style="margin-top: 1.2rem; text-align: right;">
                <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 1rem;">
                  YouTube'da İzle <i data-lucide="external-link"></i>
                </a>
              </div>
            ` : ''}
          `;

          openModal('video-modal');
          if (window.lucide) lucide.createIcons();
        }
      });
    });
  }

  // Render real YouTube videos initially
  renderList(videoData);

  // Asynchronously fetch latest YouTube channel items
  fetchYouTubeVideos(channelTarget).then(liveVideos => {
    if (liveVideos && liveVideos.length > 0) {
      renderList(liveVideos);
    }
  }).catch(err => {
    console.warn('Live YouTube update error:', err);
  });

  document.getElementById('close-video-modal')?.addEventListener('click', () => {
    if (modalContent) modalContent.innerHTML = '';
    closeModal('video-modal');
  });
}
