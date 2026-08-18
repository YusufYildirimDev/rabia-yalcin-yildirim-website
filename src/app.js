import { initNavbar } from './components/Navbar.js';
import { initServices } from './components/Services.js';
import { initBlog } from './components/Blog.js';
import { initVideos } from './components/Videos.js';
import { initAppointmentWizard } from './components/AppointmentWizard.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Initialize Component Modules
  initNavbar();
  
  const wizard = initAppointmentWizard();
  
  initServices((serviceName) => {
    wizard.launchWizard(serviceName);
  });
  
  initBlog();
  initVideos();

  // Global Event Listener for any "Randevu Al" / "Danışmanlık Seansı Alın" buttons across all pages
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.open-appointment-btn') || e.target.closest('[data-open-wizard]');
    if (btn) {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service-name');
      wizard.launchWizard(serviceName);
    }
  });

  // Contact Form Submission Handler: Automatically redirects to WhatsApp with filled user details
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value || 'Danışan';
      const email = document.getElementById('contact-email')?.value || '';
      const phone = document.getElementById('contact-phone')?.value || '';
      const subject = document.getElementById('contact-subject')?.value || 'İletişim Formu Mesajı';
      const message = document.getElementById('contact-message')?.value || '';

      const text = `Merhaba Rabia Hanım, web sitenizdeki iletişim formundan mesaj gönderiyorum.\n\n👤 Ad Soyad: ${name}\n📧 E-Posta: ${email}\n📞 Telefon: ${phone}\n📌 Konu: ${subject}\n💬 Mesaj: ${message}`;
      const waUrl = `https://wa.me/905395535593?text=${encodeURIComponent(text)}`;

      window.open(waUrl, '_blank');
      alert(`Teşekkürler Sayın ${name}! İletişim mesajınız WhatsApp iletim ekranına aktarıldı.`);
      contactForm.reset();
    });
  }
});
