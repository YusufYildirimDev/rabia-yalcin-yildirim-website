/* ==========================================================================
   RABİA YALÇIN YILDIRIM - PSİKOLOJİK DANIŞMAN
   Interactive Script & Dynamic Data Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Navbar Scroll Shadow
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    });
  }

  // Smooth Scroll & Active Nav Highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  /* ==================== DATA & SERVICES RENDER ==================== */
  const servicesData = [
    {
      id: 'bireysel',
      category: 'bireysel',
      icon: 'user',
      title: 'Bireysel Psikolojik Danışmanlık',
      desc: 'Kaygı, depresyon, özsaygı eksikliği, karar verme güçlükleri ve günlük yaşam stresörlerine yönelik kişiselleştirilmiş bire bir terapi seansları.',
      tags: ['Anksiyete & Stres', 'Depresyon', 'Özsaygı', 'Kişisel Gelişim'],
      duration: '50 Dakika',
      fullDetail: 'Bireysel danışmanlık seanslarında, bireyin kendi duygusal dünyasını keşfetmesi, olumsuz düşünce kalıplarını fark etmesi ve sağlıklı baş etme mekanizmaları geliştirmesi hedeflenir. Bilişsel Davranışçı Terapi (BDT) ve Kabul ve Kararlılık Terapisi (ACT) yaklaşımlarıyla yürütülür.'
    },
    {
      id: 'cift',
      category: 'cift',
      icon: 'heart',
      title: 'Çift ve İlişki Danışmanlığı',
      desc: 'İlişkilerdeki iletişim engelleri, çatışma çözümü, güven tazeleme, evlilik öncesi rehberlik ve duygusal kopuklukları onarma seansları.',
      tags: ['İletişim Sorunları', 'Çatışma Çözümü', 'Güven & Sadakat', 'Evlilik'],
      duration: '75 Dakika',
      fullDetail: 'Çift danışmanlığında amaç taraf tutmak değil; ilişkiyi bir bütün olarak ele alıp çiftler arasında güvenli ve şeffaf bir iletişim köprüsü kurmaktır. Gottman Çift Terapisi ilkeleri ve Duygu Odaklı Terapi teknikleri kullanılır.'
    },
    {
      id: 'ergen',
      category: 'ergen',
      icon: 'smile',
      title: 'Ergen Psikolojik Danışmanlığı',
      desc: '12-18 yaş arası gençlerin sınav kaygısı, kimlik arayışı, akran ilişkileri ve aile içi iletişim süreçlerine yönelik destek seansları.',
      tags: ['Sınav Kaygısı', 'Kimlik Gelişimi', 'Aile İletişimi', 'Akran İlişkileri'],
      duration: '50 Dakika',
      fullDetail: 'Ergenlik dönemi hızlı fiziksel ve duygusal değişimlerin yaşandığı hassas bir evredir. Danışmanlık sürecinde gencin özerkliğine saygı gösterilerek aile desteğiyle dengeli bir gelişim hedeflenir.'
    },
    {
      id: 'online',
      category: 'online',
      icon: 'video',
      title: 'Online Terapi & Danışmanlık',
      desc: 'Dünyanın ve Türkiye’nin her yerinden, kendi konfor alanınızda esnek ve güvenli video görüşmelerle gerçekleştirilen seanslar.',
      tags: ['Zoom / Meet', 'Esnek Zamanlama', 'Mekan Bağımsız', 'Gizli & Güvenli'],
      duration: '50 Dakika',
      fullDetail: 'Online terapi seansları, yüz yüze terapi ile aynı bilimsel etkinlik ve gizlilik standartlarına sahiptir. Şehir dışında veya yoğun iş temposunda olan danışanlar için ideal bir seçenektir.'
    },
    {
      id: 'emdr',
      category: 'bireysel',
      icon: 'brain',
      title: 'EMDR & Travma Terapisi',
      desc: 'Geçmiş olumsuz yaşam deneyimleri, kayıp, yas, kaza veya travmatik anıların nörobiyolojik düzeyde duyarsızlaştırılması ve işlenmesi.',
      tags: ['Travma Sonrası Stres', 'Kayıp & Yas', 'EMDR Seansları', 'Duyarsızlaştırma'],
      duration: '60 Dakika',
      fullDetail: 'EMDR (Göz Hareketleriyle Duyarsızlaştırma ve Yeniden İşleme), beynin doğal iyileşme mekanizmasını harekete geçiren kanıta dayalı güçlü bir terapi yöntemidir.'
    },
    {
      id: 'stres',
      category: 'bireysel',
      icon: 'shield-alert',
      title: 'Stres Yönetimi & Tükenmişlik',
      desc: 'İş yaşamı ve akademik süreçlerdeki yoğun baskı, tükenmişlik sendromu (burnout) ve kronik stresle baş etme becerileri.',
      tags: ['Tükenmişlik', 'İş Yaşamı Dengesi', 'Mindfulness', 'Zaman Yönetimi'],
      duration: '50 Dakika',
      fullDetail: 'Yoğun tempodaki profesyoneller için geliştirdiğimiz bu program, beden-zihin farkındalığını artırarak iş-özel hayat dengesini yeniden kurmayı amaçlar.'
    }
  ];

  const servicesContainer = document.getElementById('services-container');
  
  function renderServices(filter = 'all') {
    if (!servicesContainer) return;
    servicesContainer.innerHTML = '';

    const filtered = filter === 'all' 
      ? servicesData 
      : servicesData.filter(s => s.category === filter);

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
            Randevu Al <i data-lucide="arrow-right"></i>
          </button>
        </div>
      `;
      servicesContainer.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
    attachAppointmentTriggers();
  }

  renderServices();

  // Filter Buttons Event
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderServices(btn.getAttribute('data-filter'));
    });
  });

  /* ==================== BLOG DATA & READER ==================== */
  const blogData = [
    {
      id: 'blog-1',
      title: 'Kaygı ve Anksiyete İle Baş Etmede 5 Etkili Zihin Egzersizi',
      category: 'Stres & Kaygı',
      date: '12 Temmuz 2026',
      readTime: '6 dk okuma',
      image: 'assets/blog_anxiety.jpg',
      excerpt: 'Günlük hayatın getirdiği belirsizlikler karşında yükselen anksiyeteyi yatıştırmak için uygulayabileceğiniz bilimsel temelli farkındalık teknikleri.',
      content: `
        <p>Anksiyete, tehdit veya belirsizlik karşısında bedenimizin ve zihnimizin verdiği doğal bir tepkidir. Ancak kronikleştiğinde yaşam kalitemizi ciddi oranda düşürebilir.</p>
        <h4>1. 5-4-3-2-1 Topraklama (Grounding) Tekniği</h4>
        <p>Zihniniz felaket senaryolarına sürüklendiğinde duyularınızı şimdiye getirin: Etrafınızda gördüğünüz 5 nesne, dokunabileceğiniz 4 doku, duyduğunuz 3 ses, kokladığınız 2 koku ve tadabileceğiniz 1 tat belirleyin.</p>
        <h4>2. 4-7-8 Nefes Egzersizi</h4>
        <p>4 saniye boyunca burnunuzdan nefes alın, 7 saniye nefesinizi tutun ve 8 saniye boyunca ağzınızdan yavaşça verin. Bu ritim parasempatik sinir sistemini aktifleştirir.</p>
        <h4>3. Düşünceleri Etiketleme</h4>
        <p>Gelen kaygılı düşünceleri bir mutlak gerçek olarak kabul etmek yerine 'Şu an bir felaket senaryosu düşüncesi üretiyorum' şeklinde etiketleyin.</p>
        <p>Unutmayın, kaygı bir dalga gibidir; yükselir, tepe noktasına ulaşır ve ardından kendiliğinden alçalır.</p>
      `
    },
    {
      id: 'blog-2',
      title: 'İlişkilerde Güvenli Bağlanma ve Şeffaf İletişim',
      category: 'İlişkiler',
      date: '28 Haziran 2026',
      readTime: '8 dk okuma',
      image: 'assets/blog_relationship.jpg',
      excerpt: 'Partnerinizle çatışma anlarında kırıcı olmadan ihtiyaçlarınızı ifade etmenin ve duygusal bağı güçlendirmenin yolları.',
      content: `
        <p>Sağlıklı bir ilişkinin temeli, bireylerin kendi duygusal ihtiyaçlarını fark edebilmeleri ve bunları savunmaya geçmeden ifade edebilmeleridir.</p>
        <h4>Sen Dili Yerine Ben Dili Kullanmak</h4>
        <p>'Sen her zaman beni ihmal ediyorsun' demek yerine, 'Son zamanlarda birlikte yeterince vakit geçiremediğimizde kendimi yalnız hissediyorum' ifadesi empati kapısını açar.</p>
        <h4>Şefkatli Dinleme</h4>
        <p>Partneriniz konuşurken vereceğiniz cevabı kurgulamak yerine, onun yaşadığı duyguyu anlamaya odaklanın.</p>
      `
    }
  ];

  const blogContainer = document.getElementById('blog-container');
  if (blogContainer) {
    blogData.forEach(b => {
      const card = document.createElement('div');
      card.className = 'blog-card';
      card.innerHTML = `
        <div class="blog-img-wrapper">
          <img src="${b.image}" alt="${b.title}">
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
            Makaleyi Oku <i data-lucide="book-open"></i>
          </button>
        </div>
      `;
      blogContainer.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
  }

  // Blog Reader Modal Logic
  const blogModal = document.getElementById('blog-modal');
  const blogModalContent = document.getElementById('blog-modal-content');
  const closeBlogModal = document.getElementById('close-blog-modal');

  document.querySelectorAll('.read-blog-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const blogId = btn.getAttribute('data-blog-id');
      const item = blogData.find(b => b.id === blogId);
      if (item && blogModalContent) {
        blogModalContent.innerHTML = `
          <span class="section-subtitle">${item.category}</span>
          <h2 style="font-size: 2rem; font-weight: 700; margin: 0.8rem 0 1rem;">${item.title}</h2>
          <div style="font-size: 0.85rem; color: var(--text-light); margin-bottom: 1.5rem;">
            Yayınlanma: ${item.date} • ${item.readTime} • Yazar: Psk. Dan. Rabia Yalçın Yıldırım
          </div>
          <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 320px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
          <div class="blog-article-body" style="font-size: 1.05rem; line-height: 1.8; color: var(--text-main);">
            ${item.content}
          </div>
        `;
        blogModal.classList.add('active');
        if (window.lucide) lucide.createIcons();
      }
    });
  });

  if (closeBlogModal) {
    closeBlogModal.addEventListener('click', () => {
      blogModal.classList.remove('active');
    });
  }

  /* ==================== VIDEOS DATA & PLAYER ==================== */
  const videoData = [
    {
      id: 'video-1',
      title: 'Kaygı Anında Ne Yapmalı? 3 Dakikada Rahatlama Egzersizi',
      duration: '04:15',
      image: 'assets/blog_anxiety.jpg',
      desc: 'Ani yükselen panik ve stres durumlarında fizyolojik rahatlama sağlayan nefes ve odaklanma yöntemleri.'
    },
    {
      id: 'video-2',
      title: 'İlişkilerde Duygusal Sınır Koyabilmek Neden Önemlidir?',
      duration: '06:30',
      image: 'assets/blog_relationship.jpg',
      desc: 'Hayır diyebilme cesareti, suçluluk hissetmeden kendi alanını koruma prensipleri.'
    }
  ];

  const videosContainer = document.getElementById('videos-container');
  if (videosContainer) {
    videoData.forEach(v => {
      const card = document.createElement('div');
      card.className = 'video-card';
      card.innerHTML = `
        <div class="video-thumb-wrapper open-video-modal-btn" data-video-id="${v.id}">
          <img src="${v.image}" alt="${v.title}">
          <div class="video-play-btn">
            <i data-lucide="play" style="margin-left: 3px;"></i>
          </div>
          <span class="video-duration">${v.duration}</span>
        </div>
        <div class="video-info">
          <h4 class="video-title">${v.title}</h4>
          <p class="video-desc">${v.desc}</p>
        </div>
      `;
      videosContainer.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
  }

  // Video Modal Logic
  const videoModal = document.getElementById('video-modal');
  const videoModalContent = document.getElementById('video-modal-content');
  const closeVideoModal = document.getElementById('close-video-modal');

  document.querySelectorAll('.open-video-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const videoId = btn.getAttribute('data-video-id');
      const item = videoData.find(v => v.id === videoId);
      if (item && videoModalContent) {
        videoModalContent.innerHTML = `
          <h3 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 1rem;">${item.title}</h3>
          <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: var(--radius-md); background: #000; margin-bottom: 1.5rem;">
            <div style="position: absolute; top:0; left:0; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff; background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8));">
              <i data-lucide="play-circle" style="width: 64px; height: 64px; color: var(--primary-sage); margin-bottom: 1rem;"></i>
              <p style="font-size: 1.1rem; font-weight: 600;">Video Oynatıcı Önizlemesi</p>
              <span style="font-size: 0.85rem; color: #ccc;">(Süresi: ${item.duration} - Psk. Dan. Rabia Yalçın Yıldırım)</span>
            </div>
          </div>
          <p style="font-size: 0.95rem; color: var(--text-muted);">${item.desc}</p>
        `;
        videoModal.classList.add('active');
        if (window.lucide) lucide.createIcons();
      }
    });
  });

  if (closeVideoModal) {
    closeVideoModal.addEventListener('click', () => {
      videoModal.classList.remove('active');
    });
  }

  /* ==================== APPOINTMENT WIZARD MODAL ==================== */
  const appointmentModal = document.getElementById('appointment-modal');
  const closeAppointmentModal = document.getElementById('close-appointment-modal');
  
  let bookingState = {
    service: 'Bireysel Danışmanlık',
    format: 'Online Görüşme',
    date: '',
    time: '10:00',
    fullName: '',
    phone: '',
    email: '',
    note: ''
  };

  function attachAppointmentTriggers() {
    document.querySelectorAll('.open-appointment-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preService = btn.getAttribute('data-service-name');
        if (preService) {
          bookingState.service = preService;
        }
        showWizardStep(1);
        appointmentModal.classList.add('active');
      });
    });
  }

  attachAppointmentTriggers();

  if (closeAppointmentModal) {
    closeAppointmentModal.addEventListener('click', () => {
      appointmentModal.classList.remove('active');
    });
  }

  // Wizard Step Switching
  function showWizardStep(stepNum) {
    document.querySelectorAll('.wizard-step-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.step-indicator').forEach((ind, idx) => {
      ind.classList.remove('active', 'completed');
      if (idx + 1 === stepNum) ind.classList.add('active');
      if (idx + 1 < stepNum) ind.classList.add('completed');
    });

    const stepEl = document.getElementById(`step-${stepNum}`);
    if (stepEl) stepEl.style.display = 'block';
  }

  // Option Cards Selection
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
      bookingState.format = card.getAttribute('data-format');
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
  document.getElementById('goto-step-2')?.addEventListener('click', () => showWizardStep(2));
  document.getElementById('backto-step-1')?.addEventListener('click', () => showWizardStep(1));
  document.getElementById('goto-step-3')?.addEventListener('click', () => {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateInput = document.getElementById('booking-date');
    if (dateInput && !dateInput.value) {
      dateInput.value = tomorrow.toISOString().split('T')[0];
    }
    showWizardStep(3);
  });
  document.getElementById('backto-step-2')?.addEventListener('click', () => showWizardStep(2));
  document.getElementById('goto-step-4')?.addEventListener('click', () => {
    const dateInput = document.getElementById('booking-date');
    if (dateInput) bookingState.date = dateInput.value;
    showWizardStep(4);
  });
  document.getElementById('backto-step-3')?.addEventListener('click', () => showWizardStep(3));

  // Finish Booking Button
  document.getElementById('finish-booking')?.addEventListener('click', () => {
    const nameInput = document.getElementById('client-fullname');
    const phoneInput = document.getElementById('client-phone');
    const emailInput = document.getElementById('client-email');
    const noteInput = document.getElementById('client-note');

    if (!nameInput.value || !phoneInput.value || !emailInput.value) {
      alert('Lütfen ad, telefon ve e-posta alanlarını doldurunuz.');
      return;
    }

    bookingState.fullName = nameInput.value;
    bookingState.phone = phoneInput.value;
    bookingState.email = emailInput.value;
    bookingState.note = noteInput.value || 'Yok';

    const refCode = 'RYY-' + Math.floor(10000 + Math.random() * 90000);

    const summaryBox = document.getElementById('booking-summary-box');
    if (summaryBox) {
      summaryBox.innerHTML = `
        <div style="font-weight: 700; color: var(--primary-sage); margin-bottom: 0.5rem;">Referans Kodu: ${refCode}</div>
        <div><strong>Hizmet:</strong> ${bookingState.service}</div>
        <div><strong>Format:</strong> ${bookingState.format}</div>
        <div><strong>Tarih & Saat:</strong> ${bookingState.date || 'Belirtilen Tarihte'} - ${bookingState.time}</div>
        <div><strong>Danışan:</strong> ${bookingState.fullName} (${bookingState.phone})</div>
      `;
    }

    document.querySelectorAll('.wizard-step-content').forEach(el => el.style.display = 'none');
    document.getElementById('step-confirm').style.display = 'block';
  });

  document.getElementById('close-confirm-btn')?.addEventListener('click', () => {
    appointmentModal.classList.remove('active');
  });

  /* ==================== CONTACT FORM SUBMISSION ==================== */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      alert(`Teşekkürler Sayın ${name}! Mesajınız başarıyla iletildi. En kısa sürede dönüş yapılacaktır.`);
      contactForm.reset();
    });
  }
});
