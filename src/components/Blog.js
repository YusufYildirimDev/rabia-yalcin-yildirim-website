import { blogData } from '../data/articles.js';
import { fetchMediumPosts } from '../utils/mediumFetcher.js';
import { openModal, closeModal } from '../utils/modal.js';

export async function initBlog(mediumUsername = 'rabiayalcin006') {
  const container = document.getElementById('blog-container') || document.getElementById('blog-grid');

  if (!container) return;

  // Auto-inject full-page-reader overlay if not present on page
  let fullPageReader = document.getElementById('full-page-reader');
  if (!fullPageReader) {
    fullPageReader = document.createElement('div');
    fullPageReader.className = 'full-page-reader';
    fullPageReader.id = 'full-page-reader';
    fullPageReader.innerHTML = `
      <div class="reader-header-bar">
        <button class="btn btn-secondary reader-back-btn" id="close-full-page-reader">
          <i data-lucide="arrow-left"></i> <span>Tüm Makalelere Dön</span>
        </button>
      </div>
      <div class="reader-container">
        <div id="full-page-reader-content"></div>
      </div>
    `;
    document.body.appendChild(fullPageReader);
  }

  const readerContent = document.getElementById('full-page-reader-content');

  // Show subtle loading indicator while fetching
  container.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0;">
      <div style="font-size: 1.05rem; color: var(--text-muted); font-weight: 500;">
        <i data-lucide="loader" class="spin-icon" style="width: 20px; height: 20px; display: inline-block; vertical-align: middle; margin-right: 8px;"></i>
        Makaleler yükleniyor...
      </div>
    </div>
  `;
  if (window.lucide) lucide.createIcons();

  // Fetch articles from Medium API or local fallback
  const articles = await fetchMediumPosts(mediumUsername);

  container.innerHTML = '';

  if (articles.length === 0) {
    container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Henüz makale bulunamadı.</p>';
    return;
  }

  articles.forEach(b => {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.innerHTML = `
      <div class="blog-img-wrapper">
        <img src="${b.image}" alt="${b.title}" loading="lazy">
        <span class="blog-category-badge">${b.category}</span>
      </div>
      <div class="blog-content">
        <div class="blog-meta">
          <span><i data-lucide="calendar" style="width: 14px; display: inline;"></i> ${b.date}</span>
          <span><i data-lucide="clock" style="width: 14px; display: inline;"></i> ${b.readTime}</span>
        </div>
        <h3 class="blog-title">${b.title}</h3>
        <p class="blog-excerpt">${b.excerpt}</p>
        <button class="btn btn-secondary read-blog-btn" data-blog-id="${b.id}" style="width: 100%; font-size: 0.9rem;">
          Makaleyi Tam Sayfa Oku <i data-lucide="arrow-right"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  if (window.lucide) lucide.createIcons();

  // Full-Page Article Reader Event Handler
  container.querySelectorAll('.read-blog-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const blogId = btn.getAttribute('data-blog-id');
      const item = articles.find(b => b.id === blogId);
      if (item && fullPageReader && readerContent) {
        readerContent.innerHTML = `
          <span class="reader-category">${item.category}</span>
          <h1 class="reader-title">${item.title}</h1>

          <div class="reader-meta">
            <span><i data-lucide="calendar" style="width: 15px; display: inline;"></i> ${item.date}</span>
            <span><i data-lucide="clock" style="width: 15px; display: inline;"></i> ${item.readTime}</span>
            <span><i data-lucide="user" style="width: 15px; display: inline;"></i> Rabia Yalçın (@rabiayalcin006)</span>
          </div>

          <img src="${item.image}" alt="${item.title}" class="reader-cover-img">

          <div class="reader-body">
            ${item.content}
          </div>

          ${item.isMedium && item.link ? `
            <div class="medium-badge-bar">
              <div>
                <strong style="color: var(--primary-sage-dark); font-size: 1rem;">Bu yazı Medium'da yayınlanmıştır.</strong>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0.2rem 0 0;">Medium hesabınızda alkışlamak veya yorum yapmak isterseniz orijinal bağlantıya gidebilirsiniz.</p>
              </div>
              <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size: 0.88rem; padding: 0.6rem 1.2rem;">
                Medium'da Görüntüle <i data-lucide="external-link"></i>
              </a>
            </div>
          ` : ''}
        `;

        fullPageReader.classList.add('active');
        fullPageReader.style.display = 'block';
        fullPageReader.style.opacity = '1';
        fullPageReader.style.visibility = 'visible';
        fullPageReader.style.pointerEvents = 'auto';
        document.body.style.overflow = 'hidden';
        if (window.lucide) lucide.createIcons();
      }
    });
  });

  // Close reader button handler
  document.querySelectorAll('#close-full-page-reader, .reader-back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (fullPageReader) {
        fullPageReader.classList.remove('active');
        fullPageReader.style.display = 'none';
        fullPageReader.style.opacity = '0';
        fullPageReader.style.visibility = 'hidden';
        fullPageReader.style.pointerEvents = 'none';
      }
      document.body.style.overflow = '';
    });
  });
}
