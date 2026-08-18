import { openModal, closeModal, closeAllModals } from '../utils/modal.js';
import { bookingState, generateRefCode } from '../utils/state.js';
import { generateGoogleCalendarUrl, downloadIcsFile, generateWhatsAppUrl } from '../utils/calendarHelper.js';

export function initAppointmentWizard() {
  const modalId = 'appointment-modal';
  let modal = document.getElementById(modalId);

  // Dynamically create appointment modal overlay if missing from page
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = modalId;
    modal.innerHTML = `
      <div class="modal-container">
        <button class="modal-close-btn" id="close-appointment-modal" aria-label="Kapat" onclick="window.closeAllModals()">
          <i data-lucide="x"></i>
        </button>
        <div class="modal-body" id="wizard-container"></div>
      </div>
    `;
    document.body.appendChild(modal);
  } else {
    // Ensure existing close button has inline onclick handler
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.setAttribute('onclick', 'window.closeAllModals()');
    }
  }

  let wizardContainer = document.getElementById('wizard-container');
  if (!wizardContainer) {
    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) {
      modalBody.id = 'wizard-container';
      wizardContainer = modalBody;
    }
  }

  if (!wizardContainer) return { launchWizard: () => {} };

  // Inject full wizard HTML dynamically into wizardContainer
  wizardContainer.innerHTML = `
    <!-- Top Mode Switcher: Google Live Calendar vs Quick Wizard -->
    <div class="calendar-tab-switcher">
      <button class="calendar-tab-btn active" id="tab-btn-live-calendar">
        <i data-lucide="calendar" style="width: 14px; display: inline;"></i> Google Canlı Takvim (Boş Saatlerim)
      </button>
      <button class="calendar-tab-btn" id="tab-btn-quick-wizard">
        <i data-lucide="sparkles" style="width: 14px; display: inline;"></i> Hızlı Sihirbaz Formu
      </button>
    </div>

    <!-- Live Google Calendar Appointment Schedule Widget View -->
    <div id="live-calendar-view" style="display: block;">
      <div style="text-align: center; margin-bottom: 1.2rem;">
        <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--primary-sage-dark);">Canlı Müsaitlik Takvimi</h3>
        <p style="font-size: 0.88rem; color: var(--text-muted);">Aşağıdaki takvim doğrudan Google Takvim hesabımla senkronizedir. Sadece müsait seçtiğim boş saatler görünür.</p>
      </div>

      <div class="calendar-iframe-wrapper">
        <iframe src="https://calendar.google.com/calendar/embed?src=tr.turkish%23holiday%40group.v.calendar.google.com&ctz=Europe%2FIstanbul" title="Google Takvim Canlı Müsaitlik Saatleri"></iframe>
      </div>

      <div style="background: var(--bg-cream); padding: 1rem 1.2rem; border-radius: var(--radius-md); border: 1px solid rgba(36, 77, 61, 0.12); margin-top: 1.2rem; font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.8rem;">
        <div>
          <i data-lucide="info" style="width: 16px; color: var(--primary-sage); display: inline-block; vertical-align: middle;"></i>
          <span>Google Takviminizde randevu programı bağlantınızı (Appointment Schedule URL) oluşturduktan sonra bu takvim alanında müşterileriniz sadece boş saatlerinizi görecek ve rezervasyon yapacaktır.</span>
        </div>
      </div>
    </div>

    <!-- Wizard View Container -->
    <div id="quick-wizard-view" style="display: none;">
      <!-- Wizard Steps Indicator Header -->
      <div class="wizard-steps">
        <div class="step-indicator active" id="ind-1">1</div>
        <div class="step-indicator" id="ind-2">2</div>
        <div class="step-indicator" id="ind-3">3</div>
        <div class="step-indicator" id="ind-4">4</div>
      </div>

      <!-- Step 1: Therapy Service Selection -->
      <div class="wizard-step-content" id="step-1">
        <h3 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 0.5rem; text-align: center;">Danışmanlık Hizmetini Seçin</h3>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.5rem; text-align: center;">Almak istediğiniz seans türünü belirleyin.</p>
        
        <div class="option-cards">
          <div class="option-card selected" data-service="Bireysel Terapi">
            <i data-lucide="user" style="margin-bottom: 0.5rem; color: var(--primary-sage);"></i>
            <h4 style="font-size: 1rem; font-weight: 700;">Bireysel Terapi</h4>
            <span style="font-size: 0.8rem; color: var(--text-muted);">50 Dakika</span>
          </div>
          <div class="option-card" data-service="Çift & İlişki Terapisi">
            <i data-lucide="users" style="margin-bottom: 0.5rem; color: var(--primary-sage);"></i>
            <h4 style="font-size: 1rem; font-weight: 700;">Çift & İlişki Terapisi</h4>
            <span style="font-size: 0.8rem; color: var(--text-muted);">60 Dakika</span>
          </div>
          <div class="option-card" data-service="Ergen Danışmanlığı">
            <i data-lucide="sparkles" style="margin-bottom: 0.5rem; color: var(--primary-sage);"></i>
            <h4 style="font-size: 1rem; font-weight: 700;">Ergen Danışmanlığı</h4>
            <span style="font-size: 0.8rem; color: var(--text-muted);">50 Dakika</span>
          </div>
          <div class="option-card" data-service="Online Terapi">
            <i data-lucide="video" style="margin-bottom: 0.5rem; color: var(--primary-sage);"></i>
            <h4 style="font-size: 1rem; font-weight: 700;">Online Terapi</h4>
            <span style="font-size: 0.8rem; color: var(--text-muted);">50 Dakika (Google Meet)</span>
          </div>
        </div>

        <button class="btn btn-primary" id="goto-step-2" style="width: 100%;">
          <span>Devam Et</span> <i data-lucide="arrow-right"></i>
        </button>
      </div>

      <!-- Step 2: Consultation Format (Online vs Face-to-Face) -->
      <div class="wizard-step-content" id="step-2" style="display: none;">
        <h3 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 0.5rem; text-align: center;">Danışmanlık Biçimi</h3>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.5rem; text-align: center;">Seansınızı nerede gerçekleştirmek istersiniz?</p>

        <div class="option-cards">
          <div class="option-card selected" data-mode="online">
            <i data-lucide="video" style="margin-bottom: 0.5rem; color: var(--primary-sage);"></i>
            <h4 style="font-size: 1rem; font-weight: 700;">Online Terapi</h4>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Google Meet Üzerinden</span>
          </div>
          <div class="option-card" data-mode="face-to-face">
            <i data-lucide="map-pin" style="margin-bottom: 0.5rem; color: var(--primary-sage);"></i>
            <h4 style="font-size: 1rem; font-weight: 700;">Yüz Yüze Seans</h4>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Kuzguncuk Klinik Adresi</span>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
          <button class="btn btn-secondary" id="backto-step-1" style="flex: 1;">Geri</button>
          <button class="btn btn-primary" id="goto-step-3" style="flex: 2;">Devam Et <i data-lucide="arrow-right"></i></button>
        </div>
      </div>

      <!-- Step 3: Date & Time Picker -->
      <div class="wizard-step-content" id="step-3" style="display: none;">
        <h3 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 0.5rem; text-align: center;">Tarih ve Saat Seçimi</h3>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.5rem; text-align: center;">Müsait seans saatini seçiniz.</p>

        <div class="form-group">
          <label class="form-label" for="booking-date">Tarih Seçiniz</label>
          <input type="date" id="booking-date" class="form-control">
        </div>

        <div class="form-group">
          <label class="form-label">Müsait Saat Dilimleri</label>
          <div class="time-slots">
            <div class="time-slot selected" data-time="10:00">10:00</div>
            <div class="time-slot" data-time="11:30">11:30</div>
            <div class="time-slot" data-time="14:00">14:00</div>
            <div class="time-slot" data-time="15:30">15:30</div>
            <div class="time-slot" data-time="17:00">17:00</div>
            <div class="time-slot" data-time="18:30">18:30</div>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
          <button class="btn btn-secondary" id="backto-step-2" style="flex: 1;">Geri</button>
          <button class="btn btn-primary" id="goto-step-4" style="flex: 2;">Devam Et <i data-lucide="arrow-right"></i></button>
        </div>
      </div>

      <!-- Step 4: Client Info Form -->
      <div class="wizard-step-content" id="step-4" style="display: none;">
        <h3 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 0.5rem; text-align: center;">Danışan Bilgileri</h3>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.5rem; text-align: center;">Randevu onayı ve bildirimleri için bilgilerinizi giriniz.</p>

        <div class="form-group">
          <label class="form-label" for="client-fullname">Adınız Soyadınız</label>
          <input type="text" id="client-fullname" class="form-control" placeholder="Örn: Ayşe Yılmaz" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="client-phone">Telefon Numaranız</label>
          <input type="tel" id="client-phone" class="form-control" placeholder="Örn: 0539 553 55 93" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="client-email">E-Posta Adresiniz</label>
          <input type="email" id="client-email" class="form-control" placeholder="Örn: ayse@example.com" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="client-note">Varsa Ön Notunuz (Opsiyonel)</label>
          <input type="text" id="client-note" class="form-control" placeholder="Görüşmek istediğiniz konu hakkında kısa not...">
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
          <button class="btn btn-secondary" id="backto-step-3" style="flex: 1;">Geri</button>
          <button class="btn btn-primary" id="finish-booking" style="flex: 2;">
            <i data-lucide="check"></i> Randevuyu Tamamla
          </button>
        </div>
      </div>

      <!-- Step 5: Confirmation Hub with Google Calendar & iCal Export -->
      <div class="wizard-step-content" id="step-confirm" style="display: none; text-align: center;">
        <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--primary-sage-light); color: var(--primary-sage); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 1.2rem;">
          <i data-lucide="check-circle-2"></i>
        </div>

        <h3 style="font-size: 1.6rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--primary-sage-dark);">Randevu Talebiniz Alındı!</h3>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">Takviminize ekleyerek seansı unutmayabilir ve Google Takvim üzerinden onaylayabilirsiniz.</p>

        <div id="booking-summary-box" style="background: var(--bg-cream); padding: 1.3rem; border-radius: var(--radius-md); border: 1px solid rgba(36, 77, 61, 0.15); text-align: left; margin-bottom: 1.8rem; font-size: 0.92rem; line-height: 1.6;"></div>

        <div style="display: flex; flex-direction: column; gap: 0.8rem;">
          <a id="add-google-calendar-btn" href="#" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="width: 100%; font-size: 0.92rem;">
            <i data-lucide="calendar-plus"></i>
            <span>Google Takvime Ekle & Onayla</span>
          </a>

          <button id="download-ical-btn" class="btn btn-secondary" style="width: 100%; font-size: 0.92rem;">
            <i data-lucide="download"></i>
            <span>Apple / Outlook Takvime Ekle (.ics)</span>
          </button>

          <a id="send-whatsapp-btn" href="#" target="_blank" rel="noopener noreferrer" class="btn btn-terracotta" style="width: 100%; font-size: 0.92rem;">
            <i data-lucide="message-square"></i>
            <span>WhatsApp İle Bildir</span>
          </a>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();

  // Tab Switcher Triggers
  const liveTabBtn = document.getElementById('tab-btn-live-calendar');
  const wizardTabBtn = document.getElementById('tab-btn-quick-wizard');
  const liveView = document.getElementById('live-calendar-view');
  const wizardView = document.getElementById('quick-wizard-view');

  liveTabBtn?.addEventListener('click', () => {
    liveTabBtn.classList.add('active');
    wizardTabBtn.classList.remove('active');
    if (liveView) liveView.style.display = 'block';
    if (wizardView) wizardView.style.display = 'none';
  });

  wizardTabBtn?.addEventListener('click', () => {
    wizardTabBtn.classList.add('active');
    liveTabBtn.classList.remove('active');
    if (wizardView) wizardView.style.display = 'block';
    if (liveView) liveView.style.display = 'none';
  });

  // Navigation Logic
  function showStep(stepNum) {
    document.querySelectorAll('.wizard-step-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.step-indicator').forEach((ind, idx) => {
      ind.classList.remove('active', 'completed');
      if (idx + 1 === stepNum) ind.classList.add('active');
      if (idx + 1 < stepNum) ind.classList.add('completed');
    });

    const stepEl = document.getElementById(`step-${stepNum}`);
    if (stepEl) stepEl.style.display = 'block';
  }

  function launchWizard(serviceName = null) {
    if (serviceName) bookingState.service = serviceName;
    
    // Set default tomorrow date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
      dateInput.value = tomorrow.toISOString().split('T')[0];
      bookingState.date = dateInput.value;
    }
    bookingState.time = '10:00';
    bookingState.mode = 'online';

    showStep(1);
    openModal(modalId);
  }

  // Card Option Event Listeners
  document.querySelectorAll('#step-1 .option-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#step-1 .option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      bookingState.service = card.getAttribute('data-service');
    });
  });

  document.querySelectorAll('#step-2 .option-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#step-2 .option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      bookingState.mode = card.getAttribute('data-mode');
    });
  });

  document.querySelectorAll('.time-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      bookingState.time = slot.getAttribute('data-time');
    });
  });

  // Step Navigation Buttons
  document.getElementById('goto-step-2')?.addEventListener('click', () => showStep(2));
  document.getElementById('backto-step-1')?.addEventListener('click', () => showStep(1));
  document.getElementById('goto-step-3')?.addEventListener('click', () => showStep(3));
  document.getElementById('backto-step-2')?.addEventListener('click', () => showStep(2));
  document.getElementById('goto-step-4')?.addEventListener('click', () => {
    const dateInput = document.getElementById('booking-date');
    if (dateInput) bookingState.date = dateInput.value;
    showStep(4);
  });
  document.getElementById('backto-step-3')?.addEventListener('click', () => showStep(3));

  // Finish Booking Confirmation & Google Calendar Generation
  document.getElementById('finish-booking')?.addEventListener('click', () => {
    const nameInput = document.getElementById('client-fullname');
    const phoneInput = document.getElementById('client-phone');
    const emailInput = document.getElementById('client-email');
    const noteInput = document.getElementById('client-note');

    if (!nameInput?.value || !phoneInput?.value || !emailInput?.value) {
      alert('Lütfen ad, telefon ve e-posta alanlarını doldurunuz.');
      return;
    }

    bookingState.name = nameInput.value;
    bookingState.phone = phoneInput.value;
    bookingState.email = emailInput.value;
    bookingState.note = noteInput?.value || '';
    bookingState.refCode = generateRefCode();

    // Render Booking Summary
    const summaryBox = document.getElementById('booking-summary-box');
    if (summaryBox) {
      summaryBox.innerHTML = `
        <div style="font-weight: 700; color: var(--primary-sage); font-size: 1rem; margin-bottom: 0.6rem;">Referans Kodu: ${bookingState.refCode}</div>
        <div><strong>Hizmet:</strong> ${bookingState.service}</div>
        <div><strong>Danışmanlık Türü:</strong> ${bookingState.mode === 'online' ? 'Online Terapi (Google Meet)' : 'Kuzguncuk Klinik Yüz Yüze'}</div>
        <div><strong>Tarih & Saat:</strong> ${bookingState.date} - Saat ${bookingState.time}</div>
        <div><strong>Danışan:</strong> ${bookingState.name} (${bookingState.phone})</div>
      `;
    }

    // Attach Google Calendar & iCal & WhatsApp Links
    const googleBtn = document.getElementById('add-google-calendar-btn');
    if (googleBtn) {
      googleBtn.href = generateGoogleCalendarUrl(bookingState);
    }

    const whatsappBtn = document.getElementById('send-whatsapp-btn');
    if (whatsappBtn) {
      whatsappBtn.href = generateWhatsAppUrl(bookingState);
    }

    document.getElementById('download-ical-btn')?.addEventListener('click', () => {
      downloadIcsFile(bookingState);
    });

    document.querySelectorAll('.wizard-step-content').forEach(el => el.style.display = 'none');
    const confirmEl = document.getElementById('step-confirm');
    if (confirmEl) confirmEl.style.display = 'block';
    if (window.lucide) lucide.createIcons();
  });

  // Attach global triggers to all appointment buttons
  document.querySelectorAll('.open-appointment-btn, [data-open-wizard]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const sName = btn.getAttribute('data-service-name');
      launchWizard(sName);
    });
  });

  return { launchWizard };
}
