/**
 * Videos Component - Coming Soon Design
 * Replaces external YouTube integration with an elegant "Yakında Gelecek" showcase
 */

export function initVideos() {
  const container = document.getElementById('videos-container') || document.getElementById('videos-grid');
  if (!container) return;

  container.innerHTML = `
    <div class="coming-soon-card">
      <div class="coming-soon-icon-wrap">
        <i data-lucide="video" style="width: 40px; height: 40px;"></i>
      </div>
      <div>
        <span class="coming-soon-badge">
          <i data-lucide="sparkles" style="width: 14px; height: 14px;"></i>
          Çok Yakında
        </span>
      </div>
      <h3 class="coming-soon-title">Video Serimiz Hazırlanıyor</h3>
      <p class="coming-soon-desc">
        Ruh sağlığı, bütüncül psikoterapi yaklaşımları, duygu yönetimi ve ilişki dinamikleri üzerine hazırladığımız bilgilendirici video ve söyleşilerimiz çok yakında burada sizlerle olacak.
      </p>
      <div class="coming-soon-topics">
        <span class="coming-soon-topic-pill">#BütüncülPsikoterapi</span>
        <span class="coming-soon-topic-pill">#DuyguOdaklıTerapi</span>
        <span class="coming-soon-topic-pill">#İlişkiDinamikleri</span>
        <span class="coming-soon-topic-pill">#KaygıYönetimi</span>
        <span class="coming-soon-topic-pill">#Farkındalık</span>
      </div>
      <div class="coming-soon-actions">
        <a href="blog.html" class="btn btn-secondary">
          <i data-lucide="book-open"></i>
          <span>Makaleleri İnceleyin</span>
        </a>
        <button class="btn btn-primary open-appointment-btn">
          <i data-lucide="calendar"></i>
          <span>Danışmanlık Randevusu Al</span>
        </button>
      </div>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
}
