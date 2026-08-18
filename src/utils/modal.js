export function openModal(modalId) {
  const modals = document.querySelectorAll(`#${modalId}`);
  modals.forEach(modal => {
    modal.classList.add('active');
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
    modal.style.pointerEvents = 'auto';
  });
  document.body.style.overflow = 'hidden';
}

export function closeModal(modalId) {
  // Close ALL matching modals and all active overlays in DOM
  const selector = modalId ? `#${modalId}, .modal-overlay, .modal` : '.modal-overlay, .modal';
  document.querySelectorAll(selector).forEach(modal => {
    modal.classList.remove('active');
    modal.style.display = 'none';
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    modal.style.pointerEvents = 'none';
  });
  document.body.style.overflow = '';
}

export function closeAllModals() {
  document.querySelectorAll('.modal-overlay, .modal, .full-page-reader').forEach(modal => {
    modal.classList.remove('active');
    modal.style.display = 'none';
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    modal.style.pointerEvents = 'none';
  });
  document.body.style.overflow = '';
}

// Make closeModal and closeAllModals globally available on window object
window.closeModal = closeModal;
window.closeAllModals = closeAllModals;
window.openModal = openModal;

// Global Event Listeners for Backdrop Clicks, Close Buttons ('X'), and Escape Key
document.addEventListener('DOMContentLoaded', () => {
  // Listen for clicks everywhere on window
  window.addEventListener('click', (e) => {
    // 1. Check if clicked directly on close button or 'X' icon
    const isCloseBtn = e.target.closest('.modal-close-btn') || 
                       e.target.closest('#close-appointment-modal') || 
                       e.target.closest('#close-video-modal') || 
                       e.target.closest('#close-blog-modal') || 
                       e.target.closest('#close-confirm-btn') || 
                       e.target.closest('[data-close-modal]');

    if (isCloseBtn) {
      e.preventDefault();
      e.stopPropagation();
      closeAllModals();
      return;
    }

    // 2. Check if clicked outside modal-container (on backdrop area)
    const activeModal = e.target.closest('.modal-overlay.active') || e.target.closest('.modal.active') || document.querySelector('.modal-overlay.active');
    if (activeModal) {
      const isInsideContainer = e.target.closest('.modal-container');
      if (!isInsideContainer) {
        e.preventDefault();
        e.stopPropagation();
        closeAllModals();
      }
    }
  }, true);

  // 3. Keyboard ESC key press
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
});
