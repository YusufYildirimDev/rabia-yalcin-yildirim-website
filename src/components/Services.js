import { servicesData } from '../data/services.js';

export function initServices(onAppointmentClick) {
  const container = document.getElementById('services-container') || document.getElementById('services-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  function render(filter = 'all') {
    if (!container) return;
    container.innerHTML = '';
    const filtered = filter === 'all' ? servicesData : servicesData.filter(s => s.category === filter);

    filtered.forEach(s => {
      const card = document.createElement('div');
      card.className = 'service-card';
      card.innerHTML = `
        <div class="service-icon-wrapper">
          <i data-lucide="${s.icon}"></i>
        </div>
        <h3 class="service-title">${s.title}</h3>
        <p class="service-desc">${s.desc}</p>
        <div class="service-tags">
          ${s.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <div class="service-action">
          <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;"><i data-lucide="clock" style="width: 14px; display: inline;"></i> ${s.duration}</span>
          <button class="service-link open-appointment-btn" data-service-name="${s.title}">
            Danışmanlık Seansı Alın <i data-lucide="arrow-right"></i>
          </button>
        </div>
      `;
      container.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();

    // Re-attach triggers for newly rendered cards
    container.querySelectorAll('.open-appointment-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const serviceName = btn.getAttribute('data-service-name');
        onAppointmentClick(serviceName);
      });
    });
  }

  render();

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.getAttribute('data-filter'));
    });
  });
}
